const questions = document.querySelectorAll('.faq-question')
questions.forEach((question) => {
  question.addEventListener('click', (e) => {
    const answer = e.target.nextElementSibling
    answer.classList.toggle('hidden')
    if (answer.style.height) {
      answer.style.height = null
    } else {
      answer.style.height = `${answer.scrollHeight}px`
    }
  })
})
