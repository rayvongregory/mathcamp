const grid = document.querySelector(".grid")

const handleRegistration = async () => {
  handleData()
  for (let value in formData) {
    if (!formData[value]) {
      return unauthorized("Please fill out all the fields to continue.", true)
    }
  }
  let { fname, lname, email, cemail, password, cpassword } = formData
  email = email.toLowerCase()
  cemail = cemail.toLowerCase()
  if (email !== cemail) {
    return unauthorized("Emails do not match.")
  }
  if (password !== cpassword) {
    return unauthorized("Passwords do not match.")
  }
  response.innerText = "Setting up your account..."
  response.classList.add("show")
  const name = `${fname} ${lname}`
  const displayName = `${fname} ${lname[0]}.`
  await axios
    .post(`/api/v1/auth${path}`, {
      name,
      displayName,
      email,
      password,
    })
    .then((res) => {
      grid.replaceChildren()
      grid.classList.replace("register", "registered")
      let h2 = document.createElement("h2")
      let p = document.createElement("p")
      h2.innerText = `Hi, ${res.data.name}!`
      p.innerText =
        "Your account has been created. Please click the link we sent to your email to complete registration."
      grid.appendChild(h2)
      grid.appendChild(p)
    })
    .catch((err) => {
      let msg = err.response.data.errs.map((string) => `<p>${string}.</p>`)
      msg = msg.join(" ")
      unauthorized(msg)
    })
}

form.forEach((field) => {
  field.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      submit.dispatchEvent(new Event("click"))
    }
  })
  if (field.type === "email" || field.type === "password") {
    field.addEventListener("keyup", rmvSpace)
  }
})
submit.addEventListener("click", handleRegistration)
removeHTMLInvis()
