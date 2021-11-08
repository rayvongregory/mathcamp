//this is for the onload, draft, publish, and any util functions
// that apply to multiple sections
const publishQuestionReqs = document.querySelectorAll(".to_publish_question li")
const labelPs = Array.from(
  document.querySelectorAll(".label-wrapper p")
).splice(3)
let questionTextAreaDiv,
  questionTextArea,
  correctAnswerTextAreaDiv,
  correctAnswerTextArea,
  choicesTextAreaDiv,
  choicesTextArea,
  resourceId,
  i

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

//util
const hideOrShowThisTextArea = (textarea, action) => {
  switch (`${textarea} ${action}`) {
    case "questionTextArea hide":
      questionTextArea.innerHTML = "<p><br></p>"
      questionSection.classList.remove("hide")
      questionSection.classList.remove("pop-top")
      questionTextAreaDiv.classList.add("hide")
      extraOptions_0.classList.add("hide")
      break
    case "questionTextArea show":
      questionSection.classList.add("pop-top")
      questionTextAreaDiv.classList.remove("hide")
      extraOptions_0.classList.remove("hide")
      break
    case "correctAnswerTextArea hide":
      correctAnswerTextArea.innerHTML = "<p><br></p>"
      correctAnswerSection.classList.remove("hide")
      correctAnswerSection.classList.remove("pop-top")
      correctAnswerTextAreaDiv.classList.add("hide")
      extraOptions_1.classList.add("hide")
      break
    case "correctAnswerTextArea show":
      correctAnswerSection.classList.add("pop-top")
      correctAnswerTextAreaDiv.classList.remove("hide")
      extraOptions_1.classList.remove("hide")
      break
    default:
      break
  }
}

const showNotUniqueMsg = (p) => {
  p.classList.remove("hide")
  setTimeout(() => {
    p.classList.add("hide")
  }, 2000)
}

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

const setAttr = (btn, attr, val) => {
  if (attr === "aria") {
    btn.setAttribute("aria-label", val)
    btn.setAttribute("title", val)
  } else if (attr !== "aria" && val) {
    //not tested
    btn.setAttr(attr, val)
  } else if (attr && !val) {
    //not tested
    delete btn[attr]
  }
}

//create

//read

//delete

const getRole = async () => {
  try {
    const {
      data: { role },
    } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
    if (role === "admin") {
    } else {
      window.location.href = "/"
    }
  } catch (err) {
    console.log(err)
    window.location.href = "/"
  }
  window.removeEventListener("load", getRole)
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

const defineTextAreas = () => {
  questionTextAreaDiv = document.querySelectorAll('[role="application"]')[0]
  correctAnswerTextAreaDiv = document.querySelectorAll(
    '[role="application"]'
  )[1]
  choicesTextAreaDiv = document.querySelectorAll('[role="application"]')[2]
  questionTextArea = tinymce.DOM.win[0].document.body
  correctAnswerTextArea = tinymce.DOM.win[1].document.body
  choicesTextArea = tinymce.DOM.win[2].document.body
  questionTextArea.innerHTML = "<p><br></p>"
  correctAnswerTextArea.innerHTML = "<p><br></p>"
  choicesTextArea.innerHTML = "<p><br></p>"
}

const saveExercise = async (status) => {
  try {
    const { data } = await axios.post("/api/v1/exercises", {
      title: titleInput.value.trim(),
      tags: inputValues,
      problems,
      status,
    })
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

const publishExercise = (e) => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    nav.scrollIntoView({ block: "nearest", inline: "nearest" })
    return unauthorized("Create to title to save this exercise.", pTitle)
  }
  if (inputValues.length === 0) {
    nav.scrollIntoView({ block: "nearest", inline: "nearest" })
    return unauthorized(
      "Create at least one tag to publish this exercise.",
      pTag
    )
  }
  saveExercise("published")
}

const draftExercise = () => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    nav.scrollIntoView({ block: "nearest", inline: "nearest" })
    return unauthorized("Create to title to save this exercise", pTitle)
  }
  saveExercise("draft")
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

draftBtn.addEventListener("pointerup", draftExercise)
//remove styles on publishBtn when the reqs are met and then add the event listener
// remove event listener if the reqs are no longer being met
window.addEventListener("load", init)
