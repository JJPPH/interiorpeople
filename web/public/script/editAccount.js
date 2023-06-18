const editUserNameElement = document.getElementById('edit-username-button')
editUserNameElement.addEventListener('click', () => {
  const newUsername = document.getElementById('username').value
  if (!newUsername || newUsername.length === 0) {
    return
  }

  fetch('/my-page/edit-username', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newUsername }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('이름이 변경되었습니다.')
      } else {
        alert('이름 변경에 실패했습니다.')
      }
    })
    .catch(() => {
      alert('잠시 후에 다시 시도해주시길 바랍니다.')
    })
})

const editEmailElement = document.getElementById('edit-email-button')
editEmailElement.addEventListener('click', () => {
  const newEmail = document.getElementById('email').value
  if (!newEmail || newEmail.length === 0) {
    return
  }

  fetch('/my-page/edit-email', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('이메일이 변경되었습니다.')
      } else {
        alert('이메일 변경에 실패했습니다.')
      }
    })
    .catch(() => {
      alert('잠시 후에 다시 시도해주시길 바랍니다.')
    })
})

const editPasswordElement = document.getElementById('edit-password-button')
editPasswordElement.addEventListener('click', () => {
  const currentPassword = document.getElementById('current-password').value
  const newPassword = document.getElementById('new-password').value
  const confirmPassword = document.getElementById('confirm-password').value

  if (
    !currentPassword ||
    currentPassword.length === 0 ||
    !newPassword ||
    newPassword.length === 0 ||
    !confirmPassword ||
    confirmPassword.length === 0
  ) {
    return
  }

  if (newPassword !== confirmPassword) {
    alert('비밀번호를 다시 입력해 주시길 바랍니다.')
    return
  }

  fetch('/my-page/edit-password', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('비밀번호가 변경되었습니다.')
      } else {
        alert('비밀번호 변경에 실패했습니다.')
      }
    })
    .catch(() => {
      alert('잠시 후에 다시 시도해주시길 바랍니다.')
    })
})
