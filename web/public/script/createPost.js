// let currentIndex = 0

// function handleFileUpload(event) {
//   const files = event.target.files
//   const carouselSlide = document.getElementById('carousel-slide')
//   const carouselNav = document.getElementById('carousel-nav')
//   const carouselIndicators = document.getElementById('carousel-indicators')
//   carouselSlide.innerHTML = ''
//   carouselNav.innerHTML = ''
//   carouselIndicators.innerHTML = ''

//   if (files.length === 0) {
//     carouselNav.style.display = 'none'
//     return
//   }

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i]
//     const reader = new FileReader()

//     reader.onload = function () {
//       const image = document.createElement('img')
//       image.src = reader.result
//       image.classList.add('carousel-item', 'carousel-image')
//       carouselSlide.appendChild(image)

//       const indicator = document.createElement('div')
//       indicator.classList.add('carousel-indicator')
//       if (i === currentIndex) {
//         indicator.classList.add('active')
//       }
//       indicator.setAttribute('data-index', i.toString())
//       carouselIndicators.appendChild(indicator)
//     }

//     reader.readAsDataURL(file)
//   }

//   carouselSlide.style.transform = `translateX(0)`
//   currentIndex = 0
//   carouselNav.style.display = 'flex'
// }

// function handleNavButtonClick(direction) {
//   const carouselSlide = document.getElementById('carousel-slide')
//   const carouselItems = carouselSlide.querySelectorAll('.carousel-item')
//   const carouselIndicators = document.getElementById('carousel-indicators').querySelectorAll('.carousel-indicator')

//   const slideWidth = carouselSlide.offsetWidth
//   const numItems = carouselItems.length
//   const maxIndex = numItems - 1

//   if (direction === 'prev') {
//     currentIndex = currentIndex === 0 ? maxIndex : currentIndex - 1
//   } else if (direction === 'next') {
//     currentIndex = currentIndex === maxIndex ? 0 : currentIndex + 1
//   }

//   carouselSlide.style.transform = `translateX(-${slideWidth * currentIndex}px)`

//   carouselIndicators.forEach((indicator) => {
//     const index = parseInt(indicator.getAttribute('data-index'), 10)
//     if (index === currentIndex) {
//       indicator.classList.add('active')
//     } else {
//       indicator.classList.remove('active')
//     }
//   })
// }

// function handleIndicatorClick(index) {
//   const carouselSlide = document.getElementById('carousel-slide')
//   const carouselItems = carouselSlide.querySelectorAll('.carousel-item')
//   const carouselIndicators = document.getElementById('carousel-indicators').querySelectorAll('.carousel-indicator')

//   const slideWidth = carouselSlide.offsetWidth

//   currentIndex = index

//   carouselSlide.style.transform = `translateX(-${slideWidth * currentIndex}px)`

//   carouselIndicators.forEach((indicator) => {
//     const idx = parseInt(indicator.getAttribute('data-index'), 10)
//     if (idx === currentIndex) {
//       indicator.classList.add('active')
//     } else {
//       indicator.classList.remove('active')
//     }
//   })
// }
