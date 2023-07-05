const imageInput = document.getElementById('image-upload')
const nextButton = document.getElementById('next-button')
const previewContainer = document.getElementById('image-preview')

imageInput.addEventListener('change', () => {
  previewContainer.innerHTML = ''

  if (imageInput.files.length > 0) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const image = document.createElement('img')
      image.src = e.target.result
      image.classList.add('w-full', 'h-auto', 'mx-auto', 'mb-3', 'object-cover', 'rounded')

      previewContainer.appendChild(image)
    }

    reader.readAsDataURL(imageInput.files[0])
    previewContainer.classList.remove('hidden')

    nextButton.disabled = false
    nextButton.classList.remove('disabled:opacity-50')
  } else {
    previewContainer.classList.add('hidden')

    nextButton.disabled = true
    nextButton.classList.add('disabled:opacity-50')
  }
})
