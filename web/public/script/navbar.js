const userInformationBtnElement = document.getElementById('user-info')
if (userInformationBtnElement) {
  userInformationBtnElement.addEventListener('click', () => {
    const userInfoDropdownMenuElements = userInformationBtnElement.querySelector('.absolute')
    userInfoDropdownMenuElements.classList.toggle('hidden')
  })
}

const supportBtnElement = document.getElementById('support-btn')
supportBtnElement.addEventListener('click', () => {
  const supportDropdownMenuElements = document.querySelectorAll('.support-dropdown-menu')
  supportDropdownMenuElements.forEach((e) => {
    e.classList.toggle('hidden')
  })
})
