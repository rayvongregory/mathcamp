const params = new URL(document.location).searchParams
const vToken = params.get("v-token")
const email = params.get("email")

window.addEventListener("load", () => {
  axios
    .patch(`/api/v1/auth/register/${email}`, {
      verificationToken: vToken,
    })
    .then((res) => {
      window.location.href = res.data.responseURL
    })
    .catch((err) => {
      window.location.href = err.response.data.responseURL
    })
})
