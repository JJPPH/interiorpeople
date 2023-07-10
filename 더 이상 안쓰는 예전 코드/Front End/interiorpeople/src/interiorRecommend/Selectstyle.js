import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './Upload.css'
import { useNavigate } from 'react-router-dom'

const Selectstyle = () => {
  const navigate = useNavigate()

  // 이미지 아이디를 저장
  const [imageId, setImageId] = useState()
  // 백엔드에서 어떤 카테고리를 보냈는지를 저장함, 이미지 좌표 정보가 저장되어 있음
  const [category, setCategory] = useState([])
  // 어떤 카테고리를 선택하였느지를 저장함
  // 카테고리의 각 이름과 선택여부(false, true)가 저장되어 있음
  const [selectedCategory, setSelectedCategory] = useState({})
  // 불러오는 이미지의 url을 저장
  const [interiorImageUrl, setInteriorImageUrl] = useState(undefined)

  // 사용자가 스타일과 컬러는 하나만 선택할 수 있도록 하고
  // 선택한 스타일과 컬러 하나씩만 저장
  const [style, setStyle] = useState(false)
  const [color, setColor] = useState(false)

  // 어떤 강도로 할지
  const [intensity, setIntensity] = useState(undefined)

  // 버튼 처리를 위해 만듦
  const [style1, setStyle1] = useState(false)
  const [style2, setStyle2] = useState(false)
  const [style3, setStyle3] = useState(false)
  const [style4, setStyle4] = useState(false)
  const [style5, setStyle5] = useState(false)

  const [color1, setColor1] = useState(false)
  const [color2, setColor2] = useState(false)
  const [color3, setColor3] = useState(false)
  const [color4, setColor4] = useState(false)
  const [color5, setColor5] = useState(false)

  // 처음 페이지를 보여줄 때
  useEffect(() => {
    // 이미지가 없으면 되돌아감
    const imageIdTemp = sessionStorage.getItem('imageId')
    setImageId(imageIdTemp)
    if (!imageIdTemp) {
      alert('이미지를 업로드해주세요.')
      window.location.replace('/interior/upload')
    } else {
      try {
        // axios.post('/api/image/pre-image', { imageId: imageIdTemp }).then((result) => {
        //   setInteriorImageUrl(result.data.s3_box_img_url)
        //   setCategory(result.data.category_in_img)
        //   // const tempCategory = result.data.category_in_img.reduce((newObj, element) => {
        //   //   newObj[element[element.length - 1]] = false
        //   //   return newObj
        //   // }, {})

        // })
        const tempCategory = ['의자', '침대']
        setSelectedCategory(tempCategory)
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  // formData라는 instance에 담아 보냄
  // 다음 버튼 누르기
  const onSubmit = async (e) => {
    e.preventDefault()
    let checkSelectCotegory = false
    if (!intensity) {
      alert('변환 강도를 설정해야 합니다.')
      return
    }
    for (const key in selectedCategory) {
      if (selectedCategory[key] === true) {
        checkSelectCotegory = true
      }
    }
    if (!checkSelectCotegory) {
      alert('변환할 카테고리를 설정해야 합니다.')
      return
    }

    if (category) {
      try {
        console.log('style', style)
        console.log('color', color)
        // await axios
        //   .post('/api/image/select-style', {
        //     selectedCategory: selectedCategory,
        //     imageId: imageId,
        //     color: color ? color : 'none',
        //     style: style ? style : 'none',
        //     intensity: intensity,
        //   })
        //   .then((res) => {})
      } catch (err) {
        //alert(err);
      }
    }
    navigate('/interior/themeupload')
  }

  // 스타일 버튼 관련
  function onChangeStyle1(element) {
    setStyle('classic')
    setStyle1(true)
    setStyle2(false)
    setStyle3(false)
    setStyle4(false)
    setStyle5(false)
    console.log(style)
  }
  function onChangeStyle2(element) {
    setStyle('natural')
    setStyle1(false)
    setStyle2(true)
    setStyle3(false)
    setStyle4(false)
    setStyle5(false)
    console.log(style)
  }
  function onChangeStyle3(element) {
    setStyle('northern_europe')
    setStyle1(false)
    setStyle2(false)
    setStyle3(true)
    setStyle4(false)
    setStyle5(false)
    console.log(style)
  }
  function onChangeStyle4(element) {
    setStyle('modern')
    setStyle1(false)
    setStyle2(false)
    setStyle3(false)
    setStyle4(true)
    setStyle5(false)
    console.log(style)
  }
  function onChangeStyle5(element) {
    setStyle('vintage')
    setStyle1(false)
    setStyle2(false)
    setStyle3(false)
    setStyle4(false)
    setStyle5(true)
    console.log(style)
  }

  // 컬러 버튼 관련
  function onChangeColor1(element) {
    setColor('black')
    setColor1(true)
    setColor2(false)
    setColor3(false)
    setColor4(false)
    setColor5(false)
  }
  function onChangeColor2(element) {
    setColor('blue')
    setColor1(false)
    setColor2(true)
    setColor3(false)
    setColor4(false)
    setColor5(false)
  }
  function onChangeColor3(element) {
    setColor('brown')
    setColor1(false)
    setColor2(false)
    setColor3(true)
    setColor4(false)
    setColor5(false)
  }
  function onChangeColor4(element) {
    setColor('gray')
    setColor1(false)
    setColor2(false)
    setColor3(false)
    setColor4(true)
    setColor5(false)
  }
  function onChangeColor5(element) {
    setColor('red')
    setColor1(false)
    setColor2(false)
    setColor3(false)
    setColor4(false)
    setColor5(true)
  }

  // 카테고리 버튼 만들기
  const butotnCategory = () => {
    const buttonOfCategory = []
    for (const key in selectedCategory) {
      buttonOfCategory.push(
        <button
          onClick={categoryButtonOnClick}
          style={{
            color: selectedCategory[key] ? 'white' : `black`,
            backgroundColor: selectedCategory[key] ? 'black' : 'white',
            fontSize: '14px',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold',
            borderColor: selectedCategory[key] ? 'black' : '#e7e7e7',
            width: '150px',
            height: '35px',
            marginRight: '10px',
            marginBottom: '10px',
            cursor: 'pointer',
          }}
          value={key}
        >
          {key}
        </button>
      )
    }

    return buttonOfCategory
  }

  // 카테고리 버튼 클릭 이벤트
  const categoryButtonOnClick = (e) => {
    const newSelectedCategory = {}
    for (const key in selectedCategory) {
      if (key === e.target.value) {
        newSelectedCategory[key] = !selectedCategory[key]
      } else {
        newSelectedCategory[key] = selectedCategory[key]
      }
    }
    setSelectedCategory(newSelectedCategory)
  }

  //변환 강도 버튼 클릭이벤트
  const intensityUttonOnClick = (e) => {
    setIntensity(e.target.value)
  }

  // 페이지 보이기
  return (
    <div style={{ width: '90%', marginLeft: '5%', marginTop: '20px' }}>
      {/* 이미지 보여주기 */}
      <div style={{ width: '90%' }}>
        <div className="image-container" style={{ position: 'relative' }}>
          {interiorImageUrl ? (
            <img
              alt=""
              style={{
                zIndex: -1,
                marginLeft: '5%',
                marginRight: '5%',
                marginTop: '20px',
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
              }}
              src={`/uploads/${interiorImageUrl}`}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* 카테고리 버튼 보여주기  */}
      <div>
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ marginBottom: '5px' }}>인식된 가구 카테고리 선택</h3>
          {butotnCategory()}
        </div>
        {/* 스타일 컬러 버튼 보여주기 */}
        <div style={{ marginTop: '10px', width: '95%' }}>
          <h3 style={{ marginBottom: '5px' }}>스타일 선택 (테마 이미지를 업로드하지 않을 경우 선택하지 않으셔도 됩니다)</h3>
          <button
            onClick={onChangeStyle1}
            style={{
              color: style1 ? 'white' : `black`,
              backgroundColor: style1 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: style1 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            고풍스러운
          </button>
          <button
            onClick={onChangeStyle2}
            style={{
              color: style2 ? 'white' : `black`,
              backgroundColor: style2 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: style2 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            컬러풀
          </button>
          <button
            onClick={onChangeStyle3}
            style={{
              color: style3 ? 'white' : `black`,
              backgroundColor: style3 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: style3 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            북유럽풍
          </button>
          <button
            onClick={onChangeStyle4}
            style={{
              color: style4 ? 'white' : `black`,
              backgroundColor: style4 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: style4 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            심플
          </button>
          <button
            onClick={onChangeStyle5}
            style={{
              color: style5 ? 'white' : `black`,
              backgroundColor: style5 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: style5 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            빈티지
          </button>
        </div>
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ marginBottom: '5px' }}>컬러 선택 (테마 이미지를 업로드하지 않을 경우 선택하지 않으셔도 됩니다)</h3>
          <button
            onClick={onChangeColor1}
            style={{
              color: color1 ? 'white' : `black`,
              backgroundColor: color1 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: color1 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            블랙
          </button>
          <button
            onClick={onChangeColor2}
            style={{
              color: color2 ? 'white' : `black`,
              backgroundColor: color2 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: color2 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            블루
          </button>
          <button
            onClick={onChangeColor3}
            style={{
              color: color3 ? 'white' : `black`,
              backgroundColor: color3 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: color3 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            브라운
          </button>
          <button
            onClick={onChangeColor4}
            style={{
              color: color4 ? 'white' : `black`,
              backgroundColor: color4 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: color4 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            그레이
          </button>
          <button
            onClick={onChangeColor5}
            style={{
              color: color5 ? 'white' : `black`,
              backgroundColor: color5 ? 'black' : 'white',
              fontSize: '14px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderColor: color5 ? 'black' : '#e7e7e7',
              width: '70px',
              height: '35px',
              marginRight: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            레드
          </button>
          <div>
            {/* 스타일 컬러 버튼 보여주기 */}
            <div style={{ marginTop: '10px', width: '95%' }}>
              <h3 style={{ marginBottom: '5px' }}>변환 강도 선택</h3>
              <button
                onClick={intensityUttonOnClick}
                style={{
                  color: intensity === 'Low' ? 'white' : `black`,
                  backgroundColor: intensity === 'Low' ? 'black' : 'white',
                  fontSize: '14px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderColor: intensity === 'Low' ? 'black' : '#e7e7e7',
                  width: '70px',
                  height: '35px',
                  marginRight: '10px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                }}
                value="Low"
              >
                약함
              </button>
              <button
                onClick={intensityUttonOnClick}
                style={{
                  color: intensity === 'Middle' ? 'white' : `black`,
                  backgroundColor: intensity === 'Middle' ? 'black' : 'white',
                  fontSize: '14px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderColor: intensity === 'Middle' ? 'black' : '#e7e7e7',
                  width: '70px',
                  height: '35px',
                  marginRight: '10px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                }}
                value="Middle"
              >
                중간
              </button>
              <button
                onClick={intensityUttonOnClick}
                style={{
                  color: intensity === 'High' ? 'white' : `black`,
                  backgroundColor: intensity === 'High' ? 'black' : 'white',
                  fontSize: '14px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderColor: intensity === 'High' ? 'black' : '#e7e7e7',
                  width: '70px',
                  height: '35px',
                  marginRight: '10px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                }}
                value="High"
              >
                강함
              </button>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        {/* 다음으로 버튼 */}
        <button
          type="submit"
          className="input-file-button"
          style={{
            background: '#203864',
            color: 'white',
            marginTop: '20px',
            width: '100%',
            height: '45px',
            borderRadius: '10px',
          }}
        >
          다음으로
        </button>
      </form>
    </div>
  )
}

export default Selectstyle
