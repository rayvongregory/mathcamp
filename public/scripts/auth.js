const path = window.location.pathname
const html = document.querySelector("html")
const body = document.querySelector("body")
const form = document.querySelectorAll("input:not(.nav___search-input)")
const buttons = document.querySelectorAll(".flexwrap button")
const sdb = document.querySelector(".save_discard_buttons")
const delBtn = document.querySelector("#db")
const cancBtn = document.querySelector("#cancel")
const procBtn = document.querySelector("#proceed")
const backBtn = document.querySelector("#back")
const delPasswrd = document.querySelector("#delpassword")
const confBtn = document.querySelector("#confirm")
const submit = document.querySelector("#submit")
const response = document.querySelector("#response")
const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
const firstName = document.querySelector("#fname+p")
const lastName = document.querySelector("#lname+p")
const displayName = document.querySelector("#dname+p")
const accountEmail = document.querySelector("#email+p")
// const contactEmail = document.querySelector("p+#cemail")
let formData = {}
let pws

const unauthorized = (string, remove = false) => {
  if (response.classList.contains("success")) {
    response.classList.remove("success")
  }
  response.classList.add("unauthorized")
  response.innerHTML = string
  if (remove) {
    setTimeout(() => {
      response.innerHTML = ""
      response.classList.remove("unauthorized")
    }, 3000)
  }
}

const authorized = (string, remove = false) => {
  if (response.classList.contains("unauthorized")) {
    response.classList.remove("unauthorized")
  }
  response.classList.add("success")
  response.innerHTML = string
  if (remove) {
    setTimeout(() => {
      response.innerHTML = ""
      response.classList.remove("success")
    }, 3000)
  }
}

const backHome = (string = "Redirecting to home page...") => {
  setTimeout(() => {
    setTimeout(() => {
      window.location.href = "/"
    }, 1000)
    response.innerHTML = string
  }, 1000)
}

const checkToken = () => {
  if (token) {
    if (path === "/register" || path === "/login") {
      return (window.location.href = "/")
    }
  } else {
    if (path === "/account") {
      return (window.location.href = "/")
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

const handleRegistration = async () => {
  handleData()
  for (let value in formData) {
    if (!formData[value]) {
      return unauthorized("Please fill out all the fields to continue.", true)
    }
  }

  if (!formData.email.match(emailPattern)) {
    return unauthorized("Email is invalid.")
  }

  // if (formData.email !== formData.cemail) {
  //   return unauthorized("Emails do not match.")
  // }

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
      return unauthorized("Please fill out all fields to continue.", true)
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

const handleAccount = async () => {
  handleData()
  // try updating names
  let name = ""
  let { fname, lname, dname } = formData
  if (!fname) {
    name += firstName.innerHTML
  } else {
    name += fname
  }
  if (!lname) {
    name += ` ${lastName.innerHTML}`
  } else {
    name += ` ${lname}`
  }
  if (name !== `${firstName.innerHTML} ${lastName.innerHTML}` || dname) {
    console.log(name, dname)
    response.innerHTML = "Updating your name(s)..."
    try {
      const { data } = await axios.patch(
        `/api/v1/users/${token.split(" ")[1]}`,
        {
          name,
          displayName: dname,
        }
      )
      if (!fname) {
      } else {
        firstName.innerHTML = fname
      }
      if (!lname) {
      } else {
        lastName.innerHTML = lname
      }
      if (dname) {
        displayName.innerHTML = dname
        nameWrapH3.innerHTML = dname
        asideLinks.style.width = `${nameWrap.offsetWidth}px`
      }
      authorized(data.msg)
      localStorage.setItem("token", data.accessToken)
    } catch (err) {
      console.error(err)
    }
  }

  let { email } = formData
  if (email && !email.match(emailPattern)) {
    return unauthorized("New email is invalid.", true)
  } else if (email && email !== accountEmail.innerHTML) {
    response.innerHTML = "Updating your email..."
    try {
      const { data } = await axios.patch(
        `/api/v1/users/${token.split(" ")[1]}`,
        { email }
      )
      localStorage.setItem("token", data.accessToken)
      authorized(data.msg)
    } catch (err) {
      console.error(err)
      return unauthorized(
        "There is already an account associated with that email address.",
        true
      )
    }
  } else {
    unauthorized("This is already your email, silly.", true)
  }

  // if (
  //   !(formData.cpassword && formData.npassword && formData.cnpassword) &&
  //   (formData.cpassword || formData.npassword || formData.cnpassword)
  // ) {
  //   return unauthorized("Please fill out all password fields.", true)
  // }

  // if (formData.npassword !== formData.cnpassword) {
  //   return unauthorized("New passwords do not match.", true)
  // }
  // let name
  // if (!formData.fname && !formData.lname) {
  //   name = ""
  // } else {
  //   if (!formData.fname) {
  //     formData.fname = firstName.innerHTML
  //   }
  //   if (!formData.lname) {
  //     formData.lname = lastName.innerHTML
  //   }
  //   name = `${formData.fname} ${formData.lname}`
  // }

  // if (formData.cpassword && formData.npassword) {
  //   response.innerHTML = "Updating your password..."
  //   try {
  //     const { data } = await axios.patch(
  //       `/api/v1/users/${token.split(" ")[1]}`,
  //       {
  //         currentPassword: formData.cpassword,
  //         newPassword: formData.npassword,
  //       }
  //     )
  //   } catch (err) {
  //     unauthorized("Current password is incorrect. Please try again.", true)
  //     console.error(err)
  //   }
  // }
  // if (!response.classList.contains("unauthorized")) {
  //   setTimeout(() => {
  //     setTimeout(() => {
  //       location.reload()
  //     }, 1000)
  //     authorized("Info updated...")
  //   }, 1000)
  // } else {
  //   response.innerHTML += " Other account information may have been updated."
  // setTimeout(() => {
  //   location.reload()
  // }, 2000)
  //! don't reload the page, that's lazy
  for (let button of buttons) {
    let i = button.querySelector("i")
    if (i.classList.contains("fa-trash")) {
      console.log(button)
      button.dispatchEvent(new Event("pointerup"))
      button.dispatchEvent(new Event("click"))
    }
  }
  //! write a fcn to hit all the trash cans
  // }
}

const handleDelete = async (e) => {
  const { target } = e
  switch (target) {
    case delBtn:
      procBtn.scrollIntoView()
      break
    case cancBtn:
      delBtn.scrollIntoView()
      break
    case procBtn:
      confBtn.scrollIntoView()
      break
    case backBtn:
      cancBtn.scrollIntoView()
    case confBtn:
      // when the deleting actually happens
      break
    default:
      break
  }

  // if (fields[0].checked) {
  //   try {
  //     await axios.delete(`/api/v1/users/${token.split(" ")[1]}`)
  //     localStorage.removeItem("token")
  //     backHome("So long :(")
  //   } catch (err) {
  //     console.log(err)
  //   }
  // } else {
  //   window.location.href = "/account"
  // }
}

const toggleField = (e) => {
  let { target } = e
  console.log(target)
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
    // for (let pw of pws) {
    //   pw.value = ""
    //   pw.dispatchEvent(new KeyboardEvent("keyup"))
    // }
    //! this is making us perform the same loop for three times... iss bad
  }
}

const allowUpdate = () => {
  for (let field of form) {
    if (field.value.trim() !== "") {
      // return sdb.classList.remove("hide")
      return
    }
  }
  // sdb.classList.add("hide")
}

const addListeners = (string = "") => {
  // fields = Array.from(form)
  if (!string) {
    for (let input of form) {
      input.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          submit.dispatchEvent(new Event("pointerup"))
        }
      })
    }
  } else {
    pws = Array.from(form).slice(4, 7)
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
    delBtn.addEventListener("pointerup", handleDelete)
    procBtn.addEventListener("pointerup", handleDelete)
    cancBtn.addEventListener("pointerup", handleDelete)
    backBtn.addEventListener("pointerup", handleDelete)
    confBtn.addEventListener("pointerup", handleDelete)

    // for (let pw of pws) {
    //   pw.addEventListener("keyup", allowUpdate)
    // }
  }
}

const getAccountInfo = async () => {
  try {
    const {
      data: { fname, lname, dname, email },
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

const particleInit = () => {
  Particles.init({
    selector: ".background",
    maxParticles: 50,
    sizeVariations: 50,
    connectParticles: true,
    color: [
      "#FF6138",
      "#EB890A",
      "#FAB355",
      "#FFFF9D",
      "#BEEB9F",
      "#79BD8F",
      "#00A388",
    ],
    // options for breakpoints
    responsive: [
      {
        breakpoint: 1200,
        options: {
          maxParticles: 50,
          sizeVariations: 40,
        },
      },
      {
        breakpoint: 992,
        options: {
          maxParticles: 50,
          sizeVariations: 30,
        },
      },
      {
        breakpoint: 768,
        options: {
          maxParticles: 40,
          sizeVariations: 30,
        },
      },
      {
        breakpoint: 576,
        options: {
          maxParticles: 40,
          sizeVariations: 20,
        },
      },
      {
        breakpoint: 320,
        options: {
          maxParticles: 30,
          sizeVariations: 20,
        },
      },
      {
        breakpoint: 320,
        options: {
          maxParticles: 30,
          sizeVariations: 10,
        },
      },
    ],
  })
}

switch (path) {
  case "/register":
    window.onload = particleInit()
    checkToken()
    addListeners()
    submit.addEventListener("click", handleRegistration)
    break
  case "/login":
    window.onload = particleInit()
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
  // case "/delete":
  //   checkToken()
  //   addListeners()
  //   submit.addEventListener("click", handleDelete)
  //   break
  default:
    break
}
