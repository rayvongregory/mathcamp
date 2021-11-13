const form = document.querySelectorAll(
  "input:not(.nav___search-input):not(#delpassword)"
)
const seeBtns = document.querySelectorAll('[aria-label="See"]')
const submit = document.getElementById("submit")
const response = document.getElementById("response")
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
let formData = {}
const unauthorized = (string, remove = false) => {
  if (response.classList.contains("success")) {
    response.classList.remove("success")
  }
  response.classList.add("unauthorized")
  response.innerText = string
  if (remove) {
    setTimeout(() => {
      response.innerText = ""
      response.classList.remove("unauthorized")
    }, 3000)
  }
}

const authorized = (string, remove = false) => {
  if (response.classList.contains("unauthorized")) {
    response.classList.remove("unauthorized")
  }
  response.classList.add("success")
  response.innerText = string
  if (remove) {
    setTimeout(() => {
      response.innerText = ""
      response.classList.remove("success")
    }, 3000)
  }
}

const backHome = (string = "Redirecting to home page...") => {
  setTimeout(() => {
    setTimeout(() => {
      window.location.href = "/"
    }, 1000)
    response.innerText = string
  }, 1000)
}

const checkToken = () => {
  if (token) {
    if (path === "/register" || path === "/login") {
      return (window.location.href = "/")
    }
  } else {
    if (path === "/account") {
      return (window.location.href = "/login")
    }
  }
}

const handleData = () => {
  if (response.classList.contains("unauthorized")) {
    response.classList.remove("unauthorized")
  }
  form.forEach((field) => {
    formData[field.id] = field.value.trim()
  })
}

const seePassword = (e) => {
  document.activeElement.blur()
  const { target } = e
  const i = target.querySelector("i")
  const pwd = target.previousElementSibling
  if (i.classList.contains("fa-eye")) {
    i.classList.replace("fa-eye", "fa-eye-slash")
    target.setAttribute("aria-label", "Unsee")
    target.setAttribute("title", "Unsee")
    pwd.setAttribute("type", "text")
  } else {
    i.classList.replace("fa-eye-slash", "fa-eye")
    target.setAttribute("aria-label", "See")
    target.setAttribute("title", "See")
    pwd.setAttribute("type", "password")
  }
}

const rmvSpace = (e) => {
  let { value: string } = e.target
  for (let index in string) {
    let code = string.charCodeAt(index)
    if (code === 32) {
      string = string.replace(string[index], " ")
    }
  }
  string = string.replaceAll(" ", "")
  e.target.value = string
}

seeBtns.forEach((btn) => {
  btn.addEventListener("pointerup", seePassword)
})

checkToken()
