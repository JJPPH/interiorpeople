const uploadInput = document.getElementById('upload-input')
const previewContainer = document.getElementById('preview-container')
const previewImage = document.getElementById('preview-image')

uploadInput.addEventListener('change', (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    previewContainer.classList.remove('hidden')
    previewImage.src = e.target.result
  }

  reader.readAsDataURL(file)
})
