//overlapping util functions
const publishBtn = document.getElementById("publish")
const draftBtn = document.getElementById("draft")
const titleInput = document.getElementById("title")
const createTitleItem = document.getElementById("create_title")
const tagsInput = document.getElementById("tags_input")
const tags = document.getElementById("tags")
const addTagsItem = document.getElementById("add_tags")
const subjectSelect = document.getElementById("subject")
const chooseSubjectItem = document.getElementById("choose_subject")
const feedback = document.getElementById("feedback")
let subject = "no_choice"
let inputValues = []

const checkList = (li, action) => {
  let i = li.querySelector("i")
  switch (action) {
    case "check":
      li.classList.replace("not_met", "satisfied")
      i.classList.replace("fa-times-circle", "fa-check-circle")
      break
    case "uncheck":
      li.classList.replace("satisfied", "not_met")
      i.classList.replace("fa-check-circle", "fa-times-circle")
      break
    default:
      break
  }
}

const removeInvalidCharacters = (string) => {
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
    checkList(addTagsItem, "uncheck")
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

  if (obj1.tags.length !== obj2.tags.length) {
    return false
  }

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
    let tag = document.createElement("button")
    let val = document.createElement("span")
    val.innerText = value
    let close = document.createElement("span")
    close.innerText = "×"
    tag.appendChild(val)
    tag.appendChild(close)
    tag.addEventListener("click", removeTag)
    tags.appendChild(tag)
    inputValues.push(value)
    console.log("here?")
    if (inputValues.length > 0 && tags.classList.contains("hide")) {
      tags.classList.remove("hide")
      checkList(addTagsItem, "check")
    }
    tagsInput.value = ""
  }
}

const giveFeedback = (msg, status) => {
  feedback.innerText = msg
  feedback.classList.add(status)
  feedback.classList.remove("hide")
  setTimeout(() => {
    feedback.innerText = ""
    feedback.classList.remove(status)
    feedback.classList.add("hide")
  }, 3000)
}

const addTags = (incomingTags) => {
  inputValues = incomingTags
  if (inputValues.length > 0) {
    tags.classList.remove("hide")
    checkList(addTagsItem, "check")
  }
  for (let tag of incomingTags) {
    let newTag = document.createElement("button")
    let val = document.createElement("span")
    val.innerText = tag
    let close = document.createElement("span")
    close.innerText = "×"
    newTag.appendChild(val)
    newTag.appendChild(close)
    newTag.addEventListener("click", removeTag)
    tags.appendChild(newTag)
  }
}

const titleAdded = (e) => {
  const { target } = e
  target.value = target.value.trimStart()
  if (
    target.value.length > 0 &&
    createTitleItem.classList.contains("not_met")
  ) {
    checkList(createTitleItem, "check")
  } else if (
    target.value.length === 0 &&
    createTitleItem.classList.contains("satisfied")
  ) {
    checkList(createTitleItem, "uncheck")
  }
}

const subjectPicked = (e) => {
  const { target } = e
  subject = subjectSelect.value
  if (target.value !== "no_choice") {
    checkList(chooseSubjectItem, "check")
  } else {
    checkList(chooseSubjectItem, "uncheck")
  }
}

if (!token) {
  window.location.href = "/"
}

titleInput.addEventListener("keyup", titleAdded)
tagsInput.addEventListener("keyup", addTag)
subjectSelect.addEventListener("pointerup", subjectPicked)
subjectSelect.addEventListener("click", subjectPicked)
subjectSelect.addEventListener("keyup", subjectPicked)
