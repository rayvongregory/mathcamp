const path = window.location.pathname
const id = path.split("/")[2]
const params = new URL(document.location).searchParams
const vToken = params.get("v-token")
const email = params.get("email")

window.addEventListener("load", () => {
  axios
    .patch(`/api/v1/auth/register/${email}`, {
      verificationToken: vToken,
    })
    .then((res) => {
      console.log(res)
      window.location.href = res.data.responseURL
    })
    .catch((err) => {
      const { name, responseURL } = err.response.data
      if (name) {
        localStorage.setItem("name", name)
      }
      window.location.href = responseURL
    })
})
