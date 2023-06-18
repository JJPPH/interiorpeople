const deleteAccountButtonElement = document.getElementById('delete-account-button')
deleteAccountButtonElement.addEventListener('click', () => {
  const deleteAccountCheck = confirm('정말로 탈퇴하시겠습니까?')

  if (deleteAccountCheck) {
    fetch('/my-page/delete-account', {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('계정이 삭제되었습니다.')
          window.location.href = '/' // 홈페이지 URL로 변경해야 합니다.
        } else {
          alert('계정 삭제에 실패했습니다.')
        }
      })
      .catch(() => {
        alert('잠시 후에 다시 시도해주시길 바랍니다.')
      })
  }
})
