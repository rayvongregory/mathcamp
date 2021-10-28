const path = window.location.pathname
const html = document.querySelector("html")
const body = document.querySelector("body")
const form = document.querySelectorAll("input:not(.nav___search-input)")
const buttons = document.querySelectorAll(".flexwrap span")
const sdb = document.querySelector(".save_discard_buttons")
const submit = document.querySelector("#submit")
const response = document.querySelector("#response")
const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
const firstName = document.querySelector("#fname+p")
const lastName = document.querySelector("#lname+p")
const displayName = document.querySelector("#dname+p")
const accountEmail = document.querySelector("#email+p")
// const contactEmail = document.querySelector("p+#cemail")
let formData = {}
let fields, pws

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

const togglePasswordFields = (e) => {
  const { target } = e
  let i = target.querySelector("i")
  let pFields = target.previousElementSibling
  let p = pFields.previousElementSibling
  p.classList.toggle("hide")
  pFields.classList.toggle("hide")
  if (i.classList.contains("fa-edit")) {
    i.classList.replace("fa-edit", "fa-trash")
    target.setAttribute("aria-label", "Discard changes")
    target.setAttribute("title", "Discard changes")
  } else {
    i.classList.replace("fa-trash", "fa-edit")
    target.setAttribute("aria-label", "Edit")
    target.setAttribute("title", "Edit")
    for (let pw of pws) {
      pw.value = ""
      pw.dispatchEvent(new KeyboardEvent("keyup"))
    }
  }
}

const toggleField = (e) => {
  let { target } = e
  let i = target.querySelector("i")
  let p = target.previousElementSibling
  let field = p.previousElementSibling
  if (field.classList.contains("hide")) {
    i.classList.replace("fa-edit", "fa-trash")
    target.setAttribute("aria-label", "Discard changes")
    target.setAttribute("title", "Discard changes")
    field.placeholder = p.innerHTML
    field.nextElementSibling.classList.add("hide")
    field.classList.remove("hide")
  } else {
    i.classList.replace("fa-trash", "fa-edit")
    target.setAttribute("aria-label", "Edit")
    target.setAttribute("title", "Edit")
    field.classList.add("hide")
    field.value = ""
    field.dispatchEvent(new KeyboardEvent("keyup"))
    field.nextElementSibling.classList.remove("hide")
  }
}
const allowUpdate = () => {
  for (let field of fields) {
    console.log(field)
    if (field.value.trim() !== "") {
      return sdb.classList.remove("hide")
    }
  }
  sdb.classList.add("hide")
}

const addListeners = (string = "") => {
  fields = Array.from(form)
  if (!string) {
    for (let input of fields) {
      input.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          submit.dispatchEvent(new Event("pointerup"))
        }
      })
    }
  } else {
    pws = fields.slice(4, 7)
    for (let button of buttons) {
      if (button.id === "password") {
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
    // for (let pw of pws) {
    //   pw.addEventListener("keyup", allowUpdate)
    // }
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
  body.style.backgroundColor = "var(--neutralLight)"
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
  const { email, password } = formData
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
    // contactEmail.innerHTML = cemail
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

window.dispatchEvent(new Event("resize"))
