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
  console.log(formData)
  if (!email.match(emailPattern) || !cemail.match(emailPattern)) {
    return unauthorized("Email is invalid.")
  }

  if (email !== cemail) {
    return unauthorized("Emails do not match.")
  }

  if (password !== cpassword) {
    return unauthorized("Passwords do not match.")
  }

  response.innerHTML = "Registering..."
  const name = `${fname} ${lname}`
  const displayName = `${fname} ${lname[0]}.`
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