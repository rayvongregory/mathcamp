const path = window.location.pathname
const html = document.querySelector("html")
const body = document.querySelector("body")
const form = document.querySelectorAll("input:not(.nav___search-input)")
const buttons = document.querySelectorAll(
  "button:not(#nav-search-btn):not(#submit-search)"
)
console.log(buttons)
const submit = document.querySelector("#submit")
const response = document.querySelector("#response")
const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
const firstName = document.querySelector("#fname+p")
const lastName = document.querySelector("#lname+p")
const displayName = document.querySelector("#dname+p")
const accountEmail = document.querySelector("#email+p")
const contactEmail = document.querySelector("#cemail+p")
let formData = {}
let fields = []

const unauthorized = (string, remove = false) => {
  response.classList.remove("success")
  response.classList.add("unauthorized")
  response.innerHTML = string
  if (remove) {
    setTimeout(() => {
      response.innerHTML = ""
    }, 3000)
  }
}

const authorized = (string) => {
  response.classList.remove("unauthorized")
  response.classList.add("success")
  response.innerHTML = string
}

const backHome = (string = "Redirecting to home page...") => {
  setTimeout(() => {
    setTimeout(() => {
      window.location.href = "/"
    }, 1000)
    response.innerHTML = string
  }, 1000)
}

const getFields = () => {
  form.forEach((field) => {
    fields.push(field)
  })
}

const togglePasswordFields = (e) => {
  const target = e.target
  const currentPassword = target.previousElementSibling.previousElementSibling
  const newPassword = target.parentElement.nextElementSibling
  const confirmPassword = newPassword.nextElementSibling
  if (newPassword.classList.contains("hide")) {
    e.target.innerHTML = "Discard changes"
    currentPassword.nextElementSibling.classList.add("hide")
    currentPassword.classList.remove("hide")
    newPassword.classList.remove("hide")
    confirmPassword.classList.remove("hide")
  } else {
    e.target.innerHTML = "Edit"
    currentPassword.nextElementSibling.classList.remove("hide")
    currentPassword.classList.add("hide")
    currentPassword.value = ""
    currentPassword.dispatchEvent(new KeyboardEvent("keyup"))
    newPassword.classList.add("hide")
    newPassword.children[1].value = ""
    newPassword.children[1].dispatchEvent(new KeyboardEvent("keyup"))
    confirmPassword.classList.add("hide")
    confirmPassword.children[1].value = ""
    confirmPassword.children[1].dispatchEvent(new KeyboardEvent("keyup"))
  }
  if (window.innerWidth >= 576) {
    e.target.style.marginLeft = "8px"
  } else {
    e.target.style.marginLeft = "0px"
  }
}

const toggleField = (e) => {
  let placeholderValue = e.target.previousElementSibling.innerHTML
  let field = e.target.previousElementSibling.previousElementSibling
  if (field.classList.contains("hide")) {
    e.target.innerHTML = "Discard changes"
    field.classList.remove("hide")
    field.placeholder = placeholderValue
    field.nextElementSibling.classList.add("hide")
    if (window.innerWidth >= 576) {
      e.target.style.marginLeft = "8px"
    } else {
      e.target.style.marginLeft = "0px"
    }
  } else {
    e.target.innerHTML = "Edit"
    field.classList.add("hide")
    field.value = ""
    field.dispatchEvent(new KeyboardEvent("keyup"))
    field.nextElementSibling.classList.remove("hide")
  }
}
const allowUpdate = () => {
  for (let field of form) {
    if (field.value.trim() !== "") {
      return submit.classList.remove("no-click")
    }
  }
  submit.classList.add("no-click")
}

const addListeners = (string = "") => {
  getFields()
  if (!string) {
    for (let input of fields) {
      input.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          submit.click()
        }
      })
    }
  } else {
    for (let button of buttons) {
      if (button.id) {
        button.addEventListener("click", togglePasswordFields)
      } else if (!button.classList.contains("no-edit")) {
        button.addEventListener("click", toggleField)
      }
    }

    for (let field of form) {
      if (field.id !== "email") {
        field.addEventListener("keyup", allowUpdate)
      }
    }
  }
}

const checkToken = () => {
  if (token) {
    if (path === "/register" || path === "/login") {
      return (window.location.href = "/")
    }
  } else {
    if (path === "/account" || path === "/delete") {
      return (window.location.href = "/")
    }
  }
  html.style.visibility = "visible"
  body.style.backgroundColor = "var(--accent)"
}

const handleData = () => {
  response.classList.remove("unauthorized")
  form.forEach((field) => {
    formData[field.id] = field.value.trim()
  })
}

const handleRegistration = async () => {
  handleData()
  for (let value in formData) {
    if (!formData[value]) {
      return unauthorized("Please fill out all the fields.")
    }
  }

  if (!formData.email.match(emailPattern)) {
    return unauthorized("Email is invalid.")
  }

  if (formData.email !== formData.cemail) {
    return unauthorized("Emails do not match.")
  }

  if (formData.password !== formData.cpassword) {
    return unauthorized("Passwords do not match.")
  }

  response.innerHTML = "Registering..."
  const name = `${formData.fname} ${formData.lname}`
  const displayName = `${formData.fname} ${formData.lname[0]}.`
  const email = formData.email
  const password = formData.password
  try {
    const { data } = await axios.post(`/api/v1/auth${path}`, {
      name,
      displayName,
      email,
      password,
    })
    authorized(data.msg)
    localStorage.setItem("token", data.accessToken)
    backHome()
  } catch (error) {
    console.error(error)
    unauthorized("There is already an account associated with this email.")
  }
}

const handleLogin = async () => {
  handleData()
  for (let value in formData) {
    if (!formData[value]) {
      return unauthorized("Please fill out all fields.")
    }
  }
  response.innerHTML = "Logging in..."
  const email = formData.email
  const password = formData.password
  try {
    const { data } = await axios.post(`/api/v1/auth${path}`, {
      email,
      password,
    })
    authorized(data.msg)
    localStorage.setItem("token", data.accessToken)
    backHome()
  } catch (error) {
    console.error(error)
    unauthorized("Invalid credentials. Please try again.")
  }
}

const getAccountInfo = async () => {
  try {
    const {
      data: { fname, lname, dname, email, cemail },
    } = await axios.get(`/api/v1/users/${token.split(" ")[1]}`)
    firstName.innerHTML = fname
    lastName.innerHTML = lname
    displayName.innerHTML = dname
    accountEmail.innerHTML = email
    contactEmail.innerHTML = cemail
  } catch (err) {
    console.error(err)
  }
}

const handleAccount = async () => {
  if (submit.classList.contains("no-click")) {
    return
  }
  handleData()
  if (formData.cemail && !formData.cemail.match(emailPattern)) {
    return unauthorized("New email is invalid.", true)
  }

  if (
    !(formData.cpassword && formData.npassword && formData.cnpassword) &&
    (formData.cpassword || formData.npassword || formData.cnpassword)
  ) {
    return unauthorized("Please fill out all password fields.", true)
  }

  if (formData.npassword !== formData.cnpassword) {
    return unauthorized("New passwords do not match.", true)
  }
  let name
  if (!formData.fname && !formData.lname) {
    name = ""
  } else {
    if (!formData.fname) {
      formData.fname = firstName.innerHTML
    }
    if (!formData.lname) {
      formData.lname = lastName.innerHTML
    }
    name = `${formData.fname} ${formData.lname}`
  }
  //! try updating names
  const displayName = formData.dname
  if (name || displayName) {
    response.innerHTML = "Updating your name(s)..."
    try {
      const { data } = await axios.patch(
        `/api/v1/users/${token.split(" ")[1]}`,
        {
          name,
          displayName,
        }
      )
      localStorage.setItem("token", data.accessToken)
    } catch (err) {
      console.error(err)
    }
  }

  if (formData.cemail) {
    response.innerHTML = "Updating your contact email..."
    try {
      const { data } = await axios.patch(
        `/api/v1/users/${token.split(" ")[1]}`,
        {
          contactEmail: formData.cemail,
        }
      )
    } catch (err) {
      console.error(err)
    }
  }

  if (formData.cpassword && formData.npassword) {
    response.innerHTML = "Updating your password..."
    try {
      const { data } = await axios.patch(
        `/api/v1/users/${token.split(" ")[1]}`,
        {
          currentPassword: formData.cpassword,
          newPassword: formData.npassword,
        }
      )
    } catch (err) {
      unauthorized("Current password is incorrect. Please try again.", true)
      console.error(err)
    }
  }
  if (!response.classList.contains("unauthorized")) {
    setTimeout(() => {
      setTimeout(() => {
        location.reload()
      }, 1000)
      authorized("Info updated...")
    }, 1000)
  } else {
    response.innerHTML += " Other account information may have been updated."
    setTimeout(() => {
      location.reload()
    }, 4000)
  }
}

const handleDelete = async () => {
  if (fields[0].checked) {
    try {
      await axios.delete(`/api/v1/users/${token.split(" ")[1]}`)
      localStorage.removeItem("token")
      backHome("So long :(")
    } catch (err) {
      console.log(err)
    }
  } else {
    window.location.href = "/account"
  }
}

switch (path) {
  case "/register":
    checkToken()
    addListeners()
    submit.addEventListener("click", handleRegistration)
    break
  case "/login":
    checkToken()
    addListeners()
    submit.addEventListener("click", handleLogin)
    break
  case "/account":
    checkToken()
    addListeners("/account")
    window.onload = getAccountInfo()
    submit.addEventListener("click", handleAccount)
    break
  case "/delete":
    checkToken()
    addListeners()
    submit.addEventListener("click", handleDelete)
  default:
    break
}

const setStyles = () => {
  if (path === "/account") {
    const width = window.innerWidth
    buttons.forEach((button) => {
      if (width < 576) {
        button.style.marginLeft = "0px"
      } else {
        button.style.marginLeft = "8px"
      }
    })
    // if (width < 576) {
    //   // asideUL.classList.add("hide")
    //   menuBtn.classList.add("hide")
    // } else {
    //   // asideUL.classList.remove("hide")
    //   menuBtn.classList.remove("hide")
    // }
  }
}

window.addEventListener("resize", setStyles)
window.dispatchEvent(new Event("resize"))
