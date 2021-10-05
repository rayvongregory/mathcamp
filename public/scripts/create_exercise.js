const type = window.location.pathname.split("/")[2]
const html = document.querySelector("html")
const body = document.querySelector("body")
const publishBtn = document.querySelector("#publish")
const draftBtn = document.querySelector("#draft")
let titleInput = document.querySelector("#title")
let tagsInput = document.querySelector("#tags_input")
let tags = document.querySelector("#tags")
let inputValues = []
let pTag = document.querySelector("#ptag") //!may need this later but currently not used
let pTitle = document.querySelector("#ptitle")
let questionTextArea, correctAnswerTextArea, choicesTextArea, resourceId
const difficultySelect = document.querySelector("#choose_difficulty")
const questionAdd = document.querySelector("#question_add")
const questionDelete = document.querySelector("#question_delete")
const answerAdd = document.querySelector("#answer_add")
const answerDelete = document.querySelector("#answer_delete")
const choiceAdd = document.querySelector("#choice_add")
const choiceDelete = document.querySelector("#choice_delete")
const correctAnswerSection = document.querySelector(".correct_answer")
const questionChoicesSection = document.querySelector(".question_choices")
const easyQs = document.querySelector(".easy_qs")
const standardQs = document.querySelector(".standard_qs")
const hardQs = document.querySelector(".hard_qs")
const advancedQs = document.querySelector(".advanced_qs")
const poseQ = document.querySelector("#question")
const pickDifficulty = document.querySelector("#difficulty")
const createCorrectAns = document.querySelector("#correct_answer")
const tenChoices = document.querySelector("#ten_choices")
const thirtyEZ = document.querySelector("#thirty_easy")
const thirtyStandard = document.querySelector("#thirty_standard")
const twentyHard = document.querySelector("#twenty_hard")
const twentyAdv = document.querySelector("#twenty_advanced")
const allMeetReqs = document.querySelector("#all_meet_reqs")
let token = localStorage.getItem("token")

// let lastSave = {
//   title: "",
//   text: "",
//   tags: [],
// }
// let currentDoc = {
//   title: "",
//   text: "",
//   tags: [],
// }

const getRole = async () => {
  try {
    const {
      data: { role },
    } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
    if (role === "admin") {
      html.style.visibility = "visible"
      body.style.backgroundColor = "var(--neutralLight)"
    } else {
      window.location.href = "/"
    }
  } catch (err) {
    console.log(err)
    window.location.href = "/"
  }
  window.removeEventListener("load", getRole)
}

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

// const getInfo = async (id) => {
//   try {
//     const {
//       data: { title, tags, text },
//     } = await axios.get(`/api/v1/${type}s/${id}`)
//     titleInput.value = title
//     textAreaText =
//       tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
//         "body"
//       )
//     textAreaText.innerHTML = text
//     lastSave = { title, tags: tags.slice(), text }
//     currentDoc = { title, tags: tags.slice(), text }
//     textAreaText.dispatchEvent(new KeyboardEvent("keyup"))
//     addTags(tags)
//   } catch (err) {
//     console.error(err)
//   }
// }

const addQ = () => {}
const deleteQ = () => {}
const addAns = () => {}
const deleteAns = () => {}
const addChoice = () => {}
const deleteChoice = () => {}

const defineTextAreas = () => {
  questionTextArea = tinymce.DOM.win[0].document.body
  correctAnswerTextArea = tinymce.DOM.win[1].document.body
  choicesTextArea = tinymce.DOM.win[2].document.body
  questionTextArea.innerHTML = ""
  correctAnswerTextArea.innerHTML = ""
  choicesTextArea.innerHTML = ""
}

const init = () => {
  getRole()
  defineTextAreas()
  //   const path = window.location.pathname
  //   if (path.split("/")[3]) {
  //     resourceId = path.split("/")[3]
  //     getInfo(resourceId)
  //   } else {
  // tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
  //   "body"
  // ).innerHTML = ""
  //   }
}

// window.onload = init()
window.addEventListener("load", init)
questionAdd.addEventListener("pointerup", addQ)
questionDelete.addEventListener("pointerup", deleteQ)
answerAdd.addEventListener("pointerup", addAns)
answerDelete.addEventListener("pointerup", deleteAns)
choiceAdd.addEventListener("pointerup", addChoice)
choiceDelete.addEventListener("pointerup", deleteChoice)

// draftBtn.addEventListener("click", draftText)
// window.addEventListener("beforeunload", compareText)
