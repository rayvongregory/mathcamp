const getRole = async () => {
  if (token) {
    try {
      const {
        data: { role },
      } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
      if (role !== "admin") {
        window.location.href = "/help"
      }
    } catch (err) {
      console.log(err)
    }
  } else {
    window.location.href = "/help"
  }
}

window.addEventListener("load", getRole)
