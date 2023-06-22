let lastPostId = null
let lastPost = null
let isLoading = false

const intersectionObserver = new IntersectionObserver(
  async (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isLoading) {
        intersectionObserver.unobserve(entry.target)
        // eslint-disable-next-line no-use-before-define
        loadPostData().catch(() => {
          alert('잠시 후에 다시 시도해 주시길 바랍니다.')
        })
      }
    })
  },
  {
    threshold: 0.1,
  }
)

const loadPostData = async () => {
  try {
    isLoading = true
    const response = await fetch(`/community/next-posts${lastPostId ? `?last-post-id=${lastPostId}` : ''}`)
    if (!response.ok) {
      throw new Error('잠시 후 다시 시도해 보시길 바랍니다.')
    }
    const responseData = await response.json()

    const { posts } = responseData
    if (!posts || posts.length === 0) {
      lastPost = null
      lastPostId = null
      return
    }

    lastPostId = posts[posts.length - 1].id

    const postContainer = document.getElementById('post-container')
    posts.forEach((postData, index) => {
      const postDiv = document.createElement('div')
      postDiv.classList.add('mb-5')
      postDiv.classList.add('w-full')
      postDiv.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-500 transform hover:scale-105 cursor-pointer">
        <div class="flex items-start">
          <img src="/${postData.PostImages[0].foldername}/${
        postData.PostImages[0].filename
      }" alt="포스트 이미지" class="w-1/3 h-full object-cover mr-4"
      download="${postData.PostImages[0].originalname}">
          <div class="w-2/3 h-full flex flex-col">
            <h2 class="text-xl font-bold mb-32">${postData.title}</h2>
            <div class="flex justify-between text-sm text-gray-500 mt-auto">
            <div class='flex flex-row'>
              <div class="w-5 h-5 rounded-full flex items-center justify-center border-2 border-black overflow-hidden">
                <img src="${
                  postData.User.authorProfileImg ? postData.User.authorProfileImg : '/userProfileImg/basic-user-image.png'
                }" alt="유저 프로필 이미지" class="${postData.User.authorProfileImg ? '' : 'rounded-full mt-2'}" />
                </div>
                <div class='ml-2'>${postData.User.authorName}</div>
                </div>
              <p>${new Date(postData.createdAt).toLocaleString()}</p>
              <p>좋아요: 좋아요 수</p>
            </div>
          </div>
        </div>
      </div>
      `

      postDiv.addEventListener('click', () => {
        window.location.href = `/community/post/${postData.id}`
      })

      postContainer.appendChild(postDiv)

      if (index === posts.length - 1) {
        lastPost = postDiv
        intersectionObserver.observe(lastPost)
        console.log(lastPostId)
        console.log(lastPost)
      }
    })

    isLoading = false
  } catch (error) {
    isLoading = false
    console.log(error)
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadPostData()
})
