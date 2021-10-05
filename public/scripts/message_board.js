const addPostWrapper = document.querySelector(".add_post-wrapper")
const addPostInput = addPostWrapper.querySelector("input")
const p = document.querySelector(".message_board p")
let textArea

const getIcon = async () => {
  if (token) {
    addPostWrapper.classList.remove("hide")
    let image = addPostWrapper.querySelector("img")
    try {
      const {
        data: { avatar },
      } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
      image.src = avatar
    } catch (err) {
      console.log(err)
    }
  }
}

const reveal = (e) => {
  let value = e.target.value.trim()
  if (value) {
    textArea.classList.remove("hide")
  } else {
    textArea.classList.add("hide")
  }
}

const init = () => {
  getIcon()
  textArea = document.querySelector(".tox-tinymce")
  textArea.classList.add("hide")
  addPostInput.addEventListener("keyup", reveal)
}

window.addEventListener("load", init)
