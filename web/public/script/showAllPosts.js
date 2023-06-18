let lastPostId = null
let lastPost = null

const loadData = async () => {
  try {
    const response = await fetch(`/community/next-posts${lastPostId ? `?last-post-id=${lastPostId}` : ''}`)
    const responseData = await response.json()
    console.log(responseData)

    if (!responseData || responseData.length === 0) {
      lastPost = null
      lastPostId = null
      return
    }

    lastPostId = responseData[responseData.length - 1].id

    const postContainer = document.getElementById('post-container')
    responseData.forEach((postData, index) => {
      const postDiv = document.createElement('div')
      const imgSrc = `/${postData.PostImages[0].foldername}/${postData.PostImages[0].filename}`

      const likeButton = document.createElement('button')
      likeButton.className = 'bg-blue-500 text-white px-4 py-2 rounded'
      likeButton.innerText = '좋아요'

      likeButton.addEventListener('click', async () => {
        try {
          const response = await fetch(`/community/like/${postData.id}`, {
            method: 'PATCH',
          })

          if (response.ok) {
            console.log(response)
            const result = await response.json()
            console.log(result)
            console.log('PATCH 요청이 성공적으로 전송되었습니다.')
            // 요청이 성공한 경우 추가로 수행할 작업을 처리합니다.
          } else {
            console.error('PATCH 요청이 실패하였습니다.')
            // 요청이 실패한 경우 처리할 작업을 수행합니다.
          }
        } catch (error) {
          console.error('PATCH 요청 중 오류가 발생하였습니다:', error)
          // 오류가 발생한 경우 처리할 작업을 수행합니다.
        }
      })

      postDiv.className = 'bg-white p-4 shadow-md'

      const iDiv = document.createElement('div')
      iDiv.innerHTML = `
      <img src="${imgSrc}" alt="포스트 이미지" class="post-image">
      <h2 class="text-lg font-semibold">${postData.title}</h2>
      <h3>${postData.id}</h3>
      <p>${postData.content}</p>
      `

      iDiv.addEventListener('click', () => {
        window.location.href = `/community/post/${postData.id}` // 이동할 페이지의 URL을 지정합니다.
      })

      postDiv.appendChild(iDiv)

      const underDiv = document.createElement('div')
      underDiv.className = 'flex justify-between items-center mt-4'
      underDiv.innerHTML = `
      <div class="flex items-center">
          <!--<img src="{${postData.User.profileImg}}" alt="프로필 이미지 " class="w-8 h-8 rounded-full mr-2">-->
          <span>${postData.User.name}</span>
        </div>
        `
      underDiv.appendChild(likeButton)
      postDiv.appendChild(underDiv)
      postContainer.appendChild(postDiv)

      if (index === responseData.length - 1) {
        lastPost = postDiv
        io.observe(lastPost) // `lastPost`가 업데이트된 후에 `IntersectionObserver`에 등록
      }
    })
  } catch (error) {
    console.log(error.message)
  }
}

const io = new IntersectionObserver(
  async (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('현재 보이는 타켓', entry.target)
        io.unobserve(entry.target)

        loadData()
          .then(() => {
            if (lastPost) {
              io.observe(lastPost) // 새로운 `lastPost`에 대해 다시 관찰 등록
            }
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }
    })
  },
  {
    threshold: 0.5,
  }
)

window.addEventListener('DOMContentLoaded', async () => {
  await loadData()
  // if (lastPost) {
  //   io.observe(lastPost)
  // }
})
