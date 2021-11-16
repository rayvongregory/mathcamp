//overlapping util functions
const publishBtn = document.getElementById("publish")
const publishReqs = document.querySelectorAll(".to_publish_reqs:not(.q) li")
const draftBtn = document.getElementById("draft")
const titleInput = document.getElementById("title")
const createTitleItem = document.getElementById("create_title")
const tagsInput = document.getElementById("tags_input")
const tags = document.getElementById("tags")
const addTagsItem = document.getElementById("add_tags")
const subjectSelect = document.getElementById("subject")
const chooseSubjectItem = document.getElementById("choose_subject")
const feedback = document.getElementById("feedback")
const container = document.querySelector(".container")
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

const checkReqs = () => {
  let satisfied = true
  for (let item of publishReqs) {
    if (item.classList.contains("not_met")) {
      satisfied = false
      break
    }
  }
  if (satisfied && publishBtn.classList.contains("no-click")) {
    publishBtn.classList.remove("no-click")
    publishBtn.parentElement.classList.remove("no-click")
  } else if (!satisfied && !publishBtn.classList.contains("no-click")) {
    publishBtn.classList.add("no-click")
    publishBtn.parentElement.classList.add("no-click")
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
    checkReqs()
  }
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
    if (inputValues.length > 0 && tags.classList.contains("hide")) {
      tags.classList.remove("hide")
      checkList(addTagsItem, "check")
      checkReqs()
    }
    tagsInput.value = ""
  }
}

const giveFeedback = (msg, status) => {
  feedback.innerText = msg
  feedback.classList.add(status)
  feedback.scrollIntoView()
  setTimeout(() => {
    container.scrollLeft = 0
    feedback.classList.remove(status)
  }, 3000)
}

const addTags = (incomingTags) => {
  inputValues = incomingTags
  if (inputValues.length > 0) {
    tags.classList.remove("hide")
    checkList(addTagsItem, "check")
    checkReqs()
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
    checkReqs()
  } else if (
    target.value.length === 0 &&
    createTitleItem.classList.contains("satisfied")
  ) {
    checkList(createTitleItem, "uncheck")
    checkReqs()
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
  checkReqs()
}

const getRole = async () => {
  try {
    const {
      data: { role },
    } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
    if (role !== "admin") {
      window.location.href = "/"
    }
  } catch (err) {
    console.log(err)
    window.location.href = "/"
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
