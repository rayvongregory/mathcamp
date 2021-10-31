const type = window.location.pathname.split("/")[2]
const publishBtn = document.querySelector("#publish")
const draftBtn = document.querySelector("#draft")
let titleInput = document.querySelector("#title")
let tagsInput = document.querySelector("#tags_input")
let tags = document.querySelector("#tags")
let pTag = document.querySelector("#ptag") //!may need this later but currently not used
let pTitle = document.querySelector("#ptitle")
let inputValues = []

// let token = localStorage.getItem("token")

//put the overlapping code here, or the code that can be handled with a simple if-else
const removeInvalidCharacters = (string) => {
  //this can be an external function
  let bool = true
  while (bool) {
    let firstLetterCode = string.charCodeAt(0)
    let lastLetterCode = string.charCodeAt(string.length - 1)
    if (
      firstLetterCode < 97 ||
      firstLetterCode > 122 ||
      lastLetterCode < 97 ||
      lastLetterCode > 122
    ) {
      if (firstLetterCode < 97 || firstLetterCode > 122) {
        string = string.substring(1, string.length)
      }
      if (lastLetterCode < 97 || lastLetterCode > 122) {
        string = string.substring(0, string.length - 1)
      }
    } else {
      bool = false
    }
  }

  for (let index in string) {
    let code = string.charCodeAt(index)
    if ((code < 97 || code > 122) && code !== 45 && code !== 39) {
      string = string.replace(string[index], " ")
    }
  }
  string = string.replaceAll(" ", "")
  return string
}

const removeTag = (e) => {
  let target = e.target
  let value = target.innerText
  value = value.substring(0, value.length - 2)
  inputValues.splice(inputValues.indexOf(value), 1)
  target.remove()
  if (inputValues.length === 0) {
    tags.classList.add("hide")
  }
}

const isEqual = (obj1, obj2) => {
  //this can be an external function
  for (let key in obj1) {
    if (key === "tags") {
      continue
    } else if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  if (obj1.tags.length !== obj2.tags.length) return false

  for (let index of obj1.tags) {
    if (obj1.tags[index] !== obj2.tags[index]) {
      return false
    }
  }
  return true
}

const addTag = (e) => {
  let keys = [13, 32, 188]
  if (keys.includes(e.keyCode)) {
    let value = tagsInput.value.trim().toLowerCase()
    value = removeInvalidCharacters(value)
    if (value.length === 0 || inputValues.includes(value)) {
      return (tagsInput.value = "")
    }
    let tag = document.createElement("li")
    tag.innerHTML = value
    let close = document.createElement("span")
    close.innerHTML = "×"
    tag.appendChild(close)
    tag.addEventListener("click", removeTag)
    inputValues.push(value)
    if (inputValues.length > 0) {
      tags.classList.remove("hide")
    }
    tags.appendChild(tag)
    tagsInput.value = ""
  }
}
tagsInput.addEventListener("keyup", addTag)

const unauthorized = (string, element) => {
  let text = element.innerHTML
  element.innerHTML = `<p>${string}</p>`
  element.style.color = "darkred"
  setTimeout(() => {
    element.innerHTML = text
    element.style.color = ""
  }, 3000)
}

const addTags = (incomingTags) => {
  inputValues = incomingTags
  if (inputValues.length > 0) {
    tags.classList.remove("hide")
  }
  for (let tag of incomingTags) {
    let newTag = document.createElement("li")
    newTag.innerHTML = tag
    let close = document.createElement("span")
    close.innerHTML = "×"
    newTag.appendChild(close)
    newTag.addEventListener("click", removeTag)
    tags.appendChild(newTag)
  }
}
