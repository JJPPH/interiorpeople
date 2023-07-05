const imageUpload = document.getElementById('imageUpload')
const imagePreview = document.getElementById('image-preview')
const slideContainer = document.getElementById('slideContainer')
const slide = document.getElementById('slide')

let currentSlideIndex = 0
let totalSlides = 0

// 이미지 업로드
imageUpload.addEventListener('change', () => {
  imagePreview.classList.remove('hidden')
  slide.innerHTML = ''

  const { files } = imageUpload
  totalSlides = files.length

  if (totalSlides === 0) {
    imagePreview.classList.add('hidden')
  }

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i]
    const reader = new FileReader()

    reader.onload = (event) => {
      const imageUrl = event.target.result
      const imageElement = document.createElement('img')
      imageElement.src = imageUrl
      imageElement.alt = 'Uploaded Image'
      imageElement.classList.add('preview-image')
      const slideItem = document.createElement('div')
      slideItem.classList.add('slide-item')
      slideItem.appendChild(imageElement)

      slide.appendChild(slideItem)
    }

    reader.readAsDataURL(file)
  }

  currentSlideIndex = 0
  slide.style.transform = `translateX(0)`
})

// 이미지 슬라이드 이전 버튼
const prevButton = document.getElementById('prevButton')
prevButton.addEventListener('click', () => {
  const slideWidth = slideContainer.offsetWidth
  if (currentSlideIndex > 0) {
    currentSlideIndex -= 1
  }
  slide.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`
})

// 이미지 슬라이드 다음 버튼
const nextButton = document.getElementById('nextButton')
nextButton.addEventListener('click', () => {
  const slideWidth = slideContainer.offsetWidth
  if (currentSlideIndex < totalSlides - 1) {
    currentSlideIndex += 1
  }
  slide.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`
})
