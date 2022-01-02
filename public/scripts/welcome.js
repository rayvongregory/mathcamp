const id = path.split("/")[2]
const msg = document.querySelector("#confirm > p")

window.addEventListener("load", async () => {
  if (token) {
    window.location.href = "/"
    return
  }
  localStorage.removeItem("name")
  try {
    const { data } = await axios.patch(`/api/v1/auth/register/${id}`)
    msg.textContent = data.msg
  } catch (err) {
    console.log(err)
    window.location.href = "/"
  }
})
