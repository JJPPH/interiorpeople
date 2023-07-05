// 포스트 수정
const editPostButton = document.getElementById('edit-post-button')
if (editPostButton) {
  editPostButton.addEventListener('click', async () => {
    const { postId } = editPostButton.dataset
    window.location.href = `/community/edit/${postId}`
  })
}

// 포스트 삭제
const deletePostButton = document.getElementById('delete-post-button')
if (deletePostButton) {
  deletePostButton.addEventListener('click', async () => {
    const { postId } = deletePostButton.dataset
    try {
      const response = await fetch(`/community/${postId}`, {
        method: 'DELETE',
      })

      const responseData = await response.json()
      if (response.ok && responseData.success) {
        alert('성공적으로 삭제되었습니다.')
        window.location.href = '/community/all-posts'
      } else {
        throw new Error(responseData.message)
      }
    } catch (error) {
      alert('잠시 후 다시 시도해 주시길 바랍니다.')
    }
  })
}

// 이미지 슬라이드
const slideContainer = document.getElementById('slideContainer')
const slide = document.getElementById('slide')
const prevButton = document.getElementById('prevButton')
const nextButton = document.getElementById('nextButton')

let currentSlideIndex = 0
const totalSlides = document.querySelectorAll('.slide-item').length
slide.style.transform = `translateX(0)`

prevButton.addEventListener('click', () => {
  const slideWidth = slideContainer.offsetWidth
  if (currentSlideIndex > 0) {
    currentSlideIndex -= 1
  }
  slide.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`
})

nextButton.addEventListener('click', () => {
  const slideWidth = slideContainer.offsetWidth
  if (currentSlideIndex < totalSlides - 1) {
    currentSlideIndex += 1
  }
  slide.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`
})

// 좋아요
const likeButton = document.getElementById('like-post-button')
likeButton.addEventListener('click', async () => {
  const { postId } = likeButton.dataset
  try {
    const response = await fetch(`/community/like/${postId}`, {
      method: 'PATCH',
    })

    const responseData = await response.json()
    if (response.ok && responseData.success) {
      if (responseData.like) {
        likeButton.innerText = '좋아요 취소'
      } else {
        likeButton.innerText = '좋아요'
      }
    } else {
      throw new Error(responseData.message)
    }
  } catch (error) {
    alert('잠시 후 다시 시도해 주시길 바랍니다.')
  }
})

// 댓글 목록 새로고침
const refreshComments = (userId, comments) => {
  const commentList = document.getElementById('comment-list')
  commentList.innerHTML = ''
  try {
    if (!comments || comments.length === 0) {
      commentList.innerHTML = '<p>댓글이 없습니다.</p>'
    } else {
      comments.forEach((comment) => {
        const li = document.createElement('li')
        li.classList.add('mb-2', 'p-3', 'rounded-md', 'border-2', 'border-gray-400')

        const commentContent = document.createElement('p')
        commentContent.classList.add('text-black', 'font-bold', 'mb-4')
        commentContent.textContent = comment.commentContent

        const underDiv = document.createElement('div')
        underDiv.classList.add('flex', 'justify-between', 'mb-2')

        const commentAuthor = document.createElement('p')
        commentAuthor.classList.add('text-sm', 'text-gray-600')
        commentAuthor.textContent = comment.User.name

        const commentCreatedAt = document.createElement('p')
        commentCreatedAt.classList.add('text-sm', 'text-gray-600')
        commentCreatedAt.textContent = `${new Date(comment.createdAt).toLocaleString()}`

        underDiv.appendChild(commentAuthor)
        underDiv.appendChild(commentCreatedAt)

        li.appendChild(commentContent)
        li.appendChild(underDiv)

        if (String(comment.commenterId) === String(userId)) {
          const deleteCommentButton = document.createElement('button')
          deleteCommentButton.classList.add('text-gray-500', 'hover:text-gray-800')
          deleteCommentButton.innerText = '삭제'
          deleteCommentButton.dataset.commentId = `${comment.id}`
          deleteCommentButton.dataset.postId = `${comment.postId}`
          deleteCommentButton.addEventListener('click', async (event) => {
            const { commentId, postId } = event.target.dataset

            try {
              const response = await fetch(`/community/comment/${postId}/${commentId}`, {
                method: 'DELETE',
              })

              const responseData = await response.json()
              if (response.ok && responseData.success) {
                refreshComments(userId, responseData.comments)
              } else {
                throw new Error(responseData.message)
              }
            } catch (error) {
              alert('잠시 후 다시 시도해 주시길 바랍니다.')
            }
          })
          li.appendChild(deleteCommentButton)
        }

        commentList.appendChild(li)
      })
    }
  } catch (error) {
    // alert(error.message)
    alert('잠시 후 다시 시도해 주시길 바랍니다.')
  }
}

// 댓글 삭제 버튼
const deleteCommentButtons = document.querySelectorAll('.delete-comment-button')
for (let i = 0; i < deleteCommentButtons.length; i += 1) {
  deleteCommentButtons[i].addEventListener('click', async (event) => {
    const { commentId, postId, userId } = event.target.dataset

    try {
      const response = await fetch(`/community/comment/${postId}/${commentId}`, {
        method: 'DELETE',
      })

      const responseData = await response.json()
      if (response.ok && responseData.success) {
        refreshComments(userId, responseData.comments)
      } else {
        throw new Error(responseData.message)
      }
    } catch (error) {
      // alert(error.message)
      alert('잠시 후 다시 시도해 주시길 바랍니다.')
    }
  })
}

// 댓글 작성
const createCommentButton = document.getElementById('create-comment-button')
createCommentButton.addEventListener('click', async () => {
  const commentTextarea = document.getElementById('comment-textarea')
  const comment = commentTextarea.value
  const { postId, userId } = createCommentButton.dataset
  if (!comment || comment.length === 0) {
    alert('댓글을 작성해 주시길 바랍니다.')
    return
  }
  try {
    const response = await fetch(`/community/comment/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, comment }),
    })

    const responseData = await response.json()
    if (response.ok && responseData.success) {
      refreshComments(userId, responseData.comments)
      commentTextarea.value = ''
    } else {
      throw new Error(responseData.message)
    }
  } catch (error) {
    // alert(error.message)
    alert('잠시 후 다시 시도해 주시길 바랍니다.')
  }
})
