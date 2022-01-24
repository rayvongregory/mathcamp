const handleLogin = () => {
  handleData()
  for (let value in formData) {
    if (!formData[value]) {
      return unauthorized("Please fill out all fields to continue.", true)
    }
  }
  response.innerText = "Logging in..."
  response.classList.add("show")
  let { email, password } = formData
  email = email.toLowerCase()
  axios
    .post("api/v1/auth/login", {
      email,
      password,
    })
    .then((res) => {
      const { displayName } = res.data
      authorized(`Welcome back, ${displayName.split(" ")[0]}.`)
      backHome()
    })
    .catch((err) => {
      const {
        status,
        data: { msg },
      } = err.response
      unauthorized(msg)
    })
}

form.forEach((field) => {
  field.addEventListener("keyup", rmvSpace)
  field.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      submit.dispatchEvent(new Event("click"))
    }
  })
})
removeHTMLInvis()
submit.addEventListener("click", handleLogin)
