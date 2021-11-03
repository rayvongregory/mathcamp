const handleLogin = async () => {
  handleData()
  for (let value in formData) {
    if (!formData[value]) {
      return unauthorized("Please fill out all fields to continue.", true)
    }
  }
  response.innerHTML = "Logging in..."
  let { email, password } = formData
  email = email.toLowerCase()
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

form.forEach((field) => {
  field.addEventListener("keyup", rmvSpace)
  field.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      submit.dispatchEvent(new Event("click"))
    }
  })
})

submit.addEventListener("click", handleLogin)
