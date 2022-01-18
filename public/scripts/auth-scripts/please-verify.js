const confirm = document.getElementById("confirm")
const username = localStorage.getItem("name")

// where users are redirected when they register for an account
// and are prompted to check their email to verify

window.addEventListener("load", async () => {
  if (!username) {
    window.location.href = "/"
  } else {
    let h2 = document.createElement("h2")
    h2.innerText = `Nice to meet you, ${username}!`
    confirm.insertAdjacentElement("afterbegin", h2)
  }
})
