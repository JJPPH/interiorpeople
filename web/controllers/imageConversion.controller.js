const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const { v4: uuidV4 } = require('uuid')
const multer = require('multer')
const redisClient = require('../utils/redisClient')
require('dotenv').config()

const interiorImageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const imageFolderName = `${+new Date()}-${uuidV4()}`
      req.imageFolderName = imageFolderName
      const folderPath = path.join(__dirname, '..', 'uploads', 'machineLearning', `${req.user.id}`, imageFolderName)
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
      }
      cb(null, folderPath)
    },
    filename: (req, file, cb) => {
      cb(null, `original${path.extname(file.originalname)}`)
    },
  }),
})

// = 변환하고자 하는 이미지 업로드 화면 보여주기
exports.getInteriorImageUpload = (req, res) => {
  const errorMessage = req.flash('errorMessage')
  res.render('image-conversion/interior-image-upload', { pageTitle: '변환할 인테리어 이미지 업로드', errorMessage })
}

// = 변환하고자 하는 이미지 업로드 및 가구 세그멘테이션 처리
exports.postSegmentation = async (req, res, next) => {
  try {
    interiorImageUpload.single('image')(req, res, (err) => {
      if (err) {
        req.flash('errorMessage', '이미지를 업로드 해주세요.')
        res.redirect('/image-conversion')
      } else {
        const userId = req.user.id
        const { imageFolderName } = req

        // 배경 폴더 생성
        const userForegroundAndBackgroundImageFolder = path.join(
          __dirname,
          '..',
          'uploads',
          'machineLearning',
          `${userId}`,
          `${imageFolderName}`,
          'fg_bg'
        )
        if (!fs.existsSync(userForegroundAndBackgroundImageFolder)) {
          fs.mkdirSync(userForegroundAndBackgroundImageFolder, { recursive: true })
        }

        // 가구 박스를 처리한 이미지 폴더 생성
        const userBoxImageFolder = path.join(__dirname, '..', 'uploads', 'machineLearning', `${userId}`, `${imageFolderName}`, 'box')
        if (!fs.existsSync(userBoxImageFolder)) {
          fs.mkdirSync(userBoxImageFolder, { recursive: true })
        }

        // 명령어에 사용할 이미지 경로(Machine Learning 폴더 기준)
        const commandImagePath = `../web/uploads/machineLearning/${userId}/${imageFolderName}/${req.file.filename}:../web/uploads/machineLearning/${userId}/${imageFolderName}/box/box.jpg`

        // 명령어에 사용할 배경 경로
        const commandFgBgPath = `../web/uploads/machineLearning/${userId}/${imageFolderName}/fg_bg/`

        const command = [
          `../../Machine_Learning`,
          `&&`,
          `python`,
          `segmentation.py`,
          `--trained_model=weights/yolact/yolact_base_54_800000.pth`,
          `--score_threshold=0.15`,
          `--top_k=15`,
          `--top_k=15`,
          `--image=${commandImagePath}`,
          `--display_bbox=True`,
          `--display_text=True`,
          `--fg_bg="${commandFgBgPath}"`,
        ]

        const segmentation = spawn(`cd`, command, { shell: true, cwd: __dirname })

        let segmentationResult
        let segmentationSuccess = true

        segmentation.stderr.on('data', () => {
          segmentationSuccess = false
        })

        segmentation.stdout.on('data', (data) => {
          segmentationResult = data.toString()
        })

        segmentation.on('exit', async () => {
          if (segmentationSuccess) {
            // segmentation의 결과에서 가구의 위치를 추출
            const bboxLabelListIndex = segmentationResult.indexOf('bbox_label_list')
            // 가구의 위치를 추출하는데 실패하였거나 가구가 없는 경우
            if (bboxLabelListIndex === -1) {
              segmentationSuccess = false
            } else {
              const parsedSegmentationResult = segmentationResult
                .slice(bboxLabelListIndex + 19)
                .replace(/array/g, '')
                .replace(/\n/g, '')
                .replace(/ /g, '')
                .replace(/\(\[/g, '')
                .replace(/\]\)/g, '')
                .replace(/'/g, '"')

              const furnitureInfo = JSON.parse(parsedSegmentationResult).map((furniture) => ({
                value: furniture[4],
                name: furniture[4].replace(/([a-zA-Z]+)([0-9]+)/, '$1 $2'),
                location: [...furniture.slice(0, 4)],
              }))

              await redisClient.set(`imageConversion:${userId}:${imageFolderName}`, JSON.stringify(furnitureInfo))
              await redisClient.expire(`imageConversion:${userId}:${imageFolderName}`, 3600)

              res.render('image-conversion/select-furniture-and-style', {
                pageTitle: 'select furniture and style',
                message: 'segmentation이 성공했습니다.',
                success: true,
                bboxLabels: furnitureInfo,
                imageFolderName,
              })
            }
          }

          if (!segmentationSuccess) {
            req.flash('errorMessage', '해당 이미지에서 가구를 추출할 수 없습니다.다른 이미지로 시도해 주시길 바랍니다.')
            res.redirect('/image-conversion')
          }
        })
      }
    })
  } catch (error) {
    next(error)
  }
}

// = local style transfer 처리
exports.postLocalTransfer = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { furniture, style, color, intensity, imageFolderName } = req.body

    const furnitureInfoJSON = await redisClient.get(`imageConversion:${userId}:${imageFolderName}`)

    if (!furnitureInfoJSON) {
      return res.render('image-conversion/interior-image-upload', {
        pageTitle: '이미지 업로드',
        success: false,
        errorMessage: '변환에 실패하였습니다. 다른 이미지를 시도하시길 바랍니다.',
      })
    }

    const furnitureInfo = JSON.parse(furnitureInfoJSON)

    const commandFgBgPath = `../web/uploads/machineLearning/${userId}/${imageFolderName}/fg_bg/`
    const commandImageToConvertPath = `../web/uploads/machineLearning/${userId}/${imageFolderName}/original.jpg`
    let commandTargets
    if (typeof furniture === 'object' && furniture.length > 1) {
      commandTargets = furniture.join(', ')
    } else {
      commandTargets = furniture
    }

    const commandStyleImagePath = `./data/style/${style}/${color}.jpg`
    const commandResultOfTransferImagePath = `../web/uploads/machineLearning/${userId}/${imageFolderName}/stylized.jpg`

    const command = [
      `../../Machine_Learning`,
      `&&`,
      `python`,
      `local_style_transfer.py`,
      `--image_path`, // fg_bg 경로
      `"${commandFgBgPath}/"`,
      `--targets`, // 변환할 가구
      `"${commandTargets}"`,
      `--vgg_path`,
      `"./weights/style_transfer/vgg_normalised.pth"`,
      `--decoder_path`,
      `"./weights/style_transfer/decoder.pth"`,
      `--content_image`, // 변환에 사용할 이미지
      `"${commandImageToConvertPath}"`,
      `--style_image`, // 변환에 사용할 이미지
      `"${commandStyleImagePath}"`,
      `--output_style_path`,
      `"${commandFgBgPath}/stylized.jpg"`,
      `--style_intensity`, // 변환 강도
      `${intensity}`,
      `--fg_image_path`,
      `"${commandFgBgPath}/fg_result.jpg"`,
      `--bg_image_path`,
      `"${commandFgBgPath}/bg_result.jpg"`,
      `--stylized_image_path`,
      `"${commandFgBgPath}/stylized.jpg"`,
      `--output_local_style_path`, // 저장 경로
      `"${commandResultOfTransferImagePath}"`,
    ]

    let localTransferSuccess = true

    const localStyleTransfer = spawn(`cd`, command, {
      shell: true,
      cwd: __dirname,
    })

    localStyleTransfer.stderr.on('data', () => {
      localTransferSuccess = false
    })

    return localStyleTransfer.on('exit', async () => {
      const selectedFurnitureInfo = furnitureInfo.filter((item) => furniture.includes(item.value))
      if (localTransferSuccess) {
        res.render('image-conversion/local-transfer-result', {
          pageTitle: '변환된 결과',
          imageFolderName,
          style,
          furnitureInfo: selectedFurnitureInfo,
          color,
          intensity,
        })
      } else {
        req.flash('errorMessage', '스타일링에 실패하였습니다. 다른 이미지로 다시 시도해주시길 바랍니다.')
        res.redirect('/image-conversion')
      }
    })
  } catch (error) {
    return next(error)
  }
}
