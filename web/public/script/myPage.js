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

const deleteAccountButtonElement = document.getElementById('delete-account-button')
deleteAccountButtonElement.addEventListener('click', () => {
  const deleteAccountCheck = confirm('Are you sure you want to leave?')
  if (deleteAccountCheck) {
    fetch('/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          alert('account is deleted')
          window.location.href = '/' // 홈페이지 URL로 변경해야 합니다.
        }
      })
      .catch((error) => {
        alert('there is an error.')
      })
  }
})
