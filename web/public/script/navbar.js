// 유저 정보 버튼 이벤트
const userInformationButton = document.getElementById('user-info')

if (userInformationButton) {
  userInformationButton.addEventListener('click', () => {
    const userInfoDropdownMenuElements = userInformationButton.querySelector('.absolute')
    userInfoDropdownMenuElements.classList.toggle('hidden')
  })
}

// 서포트 버튼 드롭다운 메뉴 이벤트
const supportButton = document.getElementById('support-btn')
const supportDropdown = document.getElementById('support-dropdown')

supportButton.addEventListener('mouseover', () => {
  supportDropdown.classList.remove('hidden')
})

supportButton.addEventListener('mouseout', () => {
  supportDropdown.classList.add('hidden')
})
