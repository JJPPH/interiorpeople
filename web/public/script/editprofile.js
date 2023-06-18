document.getElementById('upload-input').addEventListener('change', () => {
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    const profileImg = document.getElementById('profileImg')
    profileImg.classList.remove('rounded-full')
    profileImg.classList.remove('mt-20')
    profileImg.src = e.target.result
  }

  reader.readAsDataURL(file)
})

document.getElementById('save-button').addEventListener('click', () => {
  const fileInput = document.getElementById('upload-input')
  const file = fileInput.files[0]

  if (file) {
    const formData = new FormData()
    formData.append('profile-img', file)

    fetch('/my-page/edit-profile', {
      method: 'PATCH',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('프로필이 변경되었습니다.')
          location.reload()
        } else {
          alert('프로필 변경에 실패하였습니다.')
        }
      })
      .catch(() => {
        alert('잠시 후 다시 시도해보시길 바랍니다.')
      })
  }
})
