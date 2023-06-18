const editPostButtonElement = document.getElementById('edit-post-button')

if (editPostButtonElement) {
  editPostButtonElement.addEventListener('click', async () => {
    const postId = editPostButtonElement.dataset['postId']
    window.location.href = `/community/edit/${postId}`
  })
}

const deletePostButtonElement = document.getElementById('delete-post-button')

if (deletePostButtonElement) {
  deletePostButtonElement.addEventListener('click', async () => {
    const postId = deletePostButtonElement.dataset['postId']
    console.log(postId)
    try {
      // 포스트 삭제 API 호출
      const response = await fetch(`/community/${postId}`, {
        method: 'DELETE',
        // 필요한 경우 헤더 또는 인증 정보를 설정합니다.
        // headers: { 'Content-Type': 'application/json' },
        // credentials: 'include',
      })

      // ! res.send가 와서 화면은 바뀌지 않음
      if (response.ok) {
        if (response.redirected) {
          // 리다이렉션된 경우
          window.location.href = response.url // 리다이렉션된 URL로 이동합니다.
        } else {
          // 리다이렉션되지 않은 경우
          // 응답을 처리하거나 추가 작업을 수행합니다.
        }
        // 삭제 성공한 경우의 처리
        console.log('포스트 삭제 완료')
        // 필요한 경우 페이지를 새로고침하거나 리다이렉션합니다.
      } else {
        // 삭제 실패한 경우의 처리
        console.error('포스트 삭제 실패')
      }
    } catch (error) {
      // 네트워크 오류 등 예외 발생한 경우의 처리
      console.error('오류:', error.message)
    }
  })
}
