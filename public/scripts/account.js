const sdb = document.querySelector(".save_discard_buttons")
const discardBtn = document.querySelector("#discard_all")
const editBtns = document.querySelectorAll('[aria-label="Edit"]')
const delBtn = document.querySelector("#db")
const cancBtn = document.querySelector("#cancel")
const procBtn = document.querySelector("#proceed")
const backBtn = document.querySelector("#back")
const delPasswrd = document.querySelector("#delpassword")
const confBtn = document.querySelector("#confirm")
const getAccountInfo = async () => {
  try {
    const {
      data: { fname, lname, dname, email },
    } = await axios.get(`/api/v1/users/${token.split(" ")[1]}`)
    firstName.innerHTML = fname
    lastName.innerHTML = lname
    displayName.innerHTML = dname
    accountEmail.innerHTML = email
  } catch (err) {
    console.error(err)
  }
}

const toggleField = (e) => {
  document.activeElement.blur()
  let { target } = e
  let i = target.querySelector("i")
  let p = target.previousElementSibling
  let field = p.previousElementSibling
  if (target.id === "password") {
    // this is the edit password btn
    let i = target.querySelector("i")
    if (i) {
      target.innerHTML = "<p>Discard changes</p>"
      target.removeAttribute("aria-label")
      target.removeAttribute("title")
    } else {
      target.innerHTML = '<i class="fas fa-edit"></i>'
      target.setAttribute("aria-label", "Edit")
      target.setAttribute("title", "Edit")
      seeBtns.forEach((btn) => {
        const pwd = btn.previousElementSibling
        let i = btn.querySelector("i")
        if (i.classList.contains("fa-eye-slash")) {
          i.classList.replace("fa-eye-slash", "fa-eye")
          btn.setAttribute("aria-label", "See")
          btn.setAttribute("title", "See")
          pwd.setAttribute("type", "password")
        }
        if (pwd.value) {
          pwd.value = ""
          pwd.dispatchEvent(new KeyboardEvent("keyup"))
        }
      })
    }
    p.classList.toggle("hide")
    target.parentElement.classList.toggle("fdc")
    target.classList.toggle("center-h")
    field.classList.toggle("hide")
  } else {
    //this is not the edit password btn
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
}

const allowUpdate = (e) => {
  for (let field of form) {
    if (field.value.trim() !== "") {
      sdb.classList.remove("hide")
      return
    }
  }
  sdb.classList.add("hide")
}

const handleUpdate = async () => {
  document.activeElement.blur()
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
      authorized(data.msg, true)
      localStorage.setItem("token", data.accessToken)
      token = data.accessToken
    } catch (err) {
      console.error(err)
    }
  }

  let { email } = formData
  if (email && !email.match(emailPattern)) {
    return unauthorized("Please enter a valid email address.", true)
  } else if (email && email !== accountEmail.innerHTML) {
    response.innerHTML = "Updating your email..."
    console.log(token)
    try {
      const { data } = await axios.patch(
        `/api/v1/users/${token.split(" ")[1]}`,
        { email }
      )
      console.log(email, data)
      localStorage.setItem("token", data.accessToken)
      token = data.accessToken
      authorized(data.msg, true)
      accountEmail.innerHTML = email
      console.log(accountEmail)
    } catch (err) {
      console.error(err)
      return unauthorized(
        "There is already an account associated with that email address.",
        true
      )
    }
  }
  // currentpassword, newpassword, & confirmednewpassword
  let { password, npassword, cnpassword } = formData
  if (
    !(password && npassword && cnpassword) &&
    (password || npassword || cnpassword)
  ) {
    return unauthorized("Please fill out all password fields.", true)
  }

  if (npassword !== cnpassword) {
    return unauthorized("New passwords do not match.", true)
  }

  if (password && npassword) {
    response.innerHTML = "Updating your password..."
    try {
      const { data } = await axios.patch(
        `/api/v1/users/${token.split(" ")[1]}`,
        {
          currentPassword: password,
          newPassword: npassword,
        }
      )
      authorized(data.msg, true)
    } catch (err) {
      unauthorized("Current password is incorrect. Please try again.", true)
      console.error(err)
    }
  }
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
  for (let button of editBtns) {
    let i = button.querySelector("i")
    if (i && i.classList.contains("fa-trash")) {
      button.dispatchEvent(new Event("pointerup"))
      button.dispatchEvent(new Event("click"))
    } else if (
      button.id === "password" &&
      button.classList.contains("center-h")
    ) {
      button.dispatchEvent(new Event("pointerup"))
    }
  }
}

const handleDiscardAll = () => {
  editBtns.forEach((btn) => {
    let i = btn.querySelector("i")
    if ((i && i.classList.contains("fa-trash")) || !i) {
      btn.dispatchEvent(new Event("pointerup"))
    }
  })
}

const handleDelete = async (e) => {
  const { target } = e
  switch (target) {
    case delBtn:
      procBtn.scrollIntoView({ block: "nearest", inline: "nearest" })
      break
    case cancBtn:
      delBtn.scrollIntoView({ block: "nearest", inline: "nearest" })
      break
    case procBtn:
      confBtn.scrollIntoView({ block: "nearest", inline: "nearest" })
      break
    case backBtn:
      cancBtn.scrollIntoView({ block: "nearest", inline: "nearest" })
      break
    case confBtn:
      document.activeElement.blur()
      let pwd = delPasswrd.value
      if (!pwd) {
        return unauthorized(
          "Please enter your password to complete the request.",
          true
        )
      }
      try {
        const { data } = await axios.delete(
          `/api/v1/users/${token.split(" ")[1]}`,
          { data: { pwd } }
        )
        localStorage.removeItem("token")
        setTimeout(() => {
          setTimeout(() => {
            window.location.href = "/login"
          }, 1000)
          authorized(data.msg, true)
        }, 1000)
      } catch (err) {
        console.error(err)
        unauthorized("The password you've entered is incorrect", true)
        return
      }
      break
    default:
      break
  }
}

editBtns.forEach((btn) => {
  btn.addEventListener("pointerup", toggleField)
})
form.forEach((field) => {
  field.addEventListener("keyup", allowUpdate)
  if (field.type === "email" || field.type === "password") {
    field.addEventListener("keyup", rmvSpace)
  }
})
delBtn.addEventListener("pointerup", handleDelete)
procBtn.addEventListener("pointerup", handleDelete)
cancBtn.addEventListener("pointerup", handleDelete)
backBtn.addEventListener("pointerup", handleDelete)
confBtn.addEventListener("pointerup", handleDelete)
submit.addEventListener("click", handleUpdate)
discardBtn.addEventListener("click", handleDiscardAll)
window.onload = getAccountInfo()
