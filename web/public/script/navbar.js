// 유저 정보 버튼 이벤트
const userInformationBtnElement = document.getElementById('user-info')

if (userInformationBtnElement) {
  userInformationBtnElement.addEventListener('click', () => {
    const userInfoDropdownMenuElements = userInformationBtnElement.querySelector('.absolute')
    userInfoDropdownMenuElements.classList.toggle('hidden')
  })
}

// 서포트 버튼 드롭다운 메뉴 이벤트
const supportBtnElement = document.getElementById('support-btn')
const supportDropdownElement = document.getElementById('support-dropdown')

supportBtnElement.addEventListener('mouseover', () => {
  supportDropdownElement.classList.remove('hidden')
})

supportBtnElement.addEventListener('mouseout', () => {
  supportDropdownElement.classList.add('hidden')
})
