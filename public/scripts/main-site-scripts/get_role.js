const dirs = window.location.pathname.split("/")

const removeHTMLInvis = () => {
  const html = document.querySelector("html")
  html.classList.remove("invis")
  let noClass = document.querySelectorAll('[class=""]')
  noClass.forEach((el) => {
    el.removeAttribute("class")
  })
}

axios
  .get("/api/v1/users")
  .then((res) => {
    const { role, displayName } = res.data
    nameWrapH3.innerText = displayName
    nameWrapIcon.textContent = displayName[0]
    loginBtn.remove()
    registerBtn.remove()
    if (role === "admin") {
      helpBtn.setAttribute("href", "/help/admin")
    } else {
      createLessonBtn.remove()
      createExerciseBtn.remove()
      draftsBtn.remove()
    }
  })
  .catch((err) => {
    nameWrapH3.innerText = "Guest"
    accountBtn.remove()
    logoutBtn.remove()
    createLessonBtn.remove()
    createExerciseBtn.remove()
    draftsBtn.remove()
  })
