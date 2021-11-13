//this is for the onload, draft, publish, and any util functions
// that apply to multiple sections
const publishQuestionReqs = document.querySelectorAll(".to_publish_reqs.q li")
const publishExerciseReqs = document.querySelector(".to_publish_reqs:not(.q)")
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
      questionTextArea.innerHTML = "<p></p>"
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
      correctAnswerTextArea.innerHTML = "<p></p>"
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

const setAria = (btn, val) => {
  btn.setAttribute("aria-label", val)
  btn.setAttribute("title", val)
}

const removeNonsense = (codeBlock) => {
  let breaks = codeBlock.querySelectorAll("br")
  let ps = codeBlock.querySelectorAll("p")
  breaks.forEach((br) => {
    br.remove()
  })
  ps.forEach((p) => {
    if (p.innerText.trim() === "" && !p.querySelector("img")) {
      p.remove()
    }
  })
}

const listenForChangesToPublishExerciseList = () => {
  let satisfied
  const callback = () => {
    let unsatisfied = publishExerciseReqs.querySelector(".not_met")
    if (unsatisfied !== null) {
      satisfied = false
    } else {
      satisfied = true
    }
    if (satisfied && publishBtn.classList.contains("no-click")) {
      publishBtn.classList.remove("no-click")
      publishBtn.addEventListener("pointerup", publishExercise)
    } else if (!satisfied && !publishBtn.classList.contains("no-click")) {
      publishBtn.classList.add("no-click")
      publishBtn.removeEventListener("pointerup", publishExercise)
    }
  }
  const observer = new MutationObserver(callback)
  observer.observe(publishExerciseReqs, {
    childList: true,
    subtree: true,
    attributes: true,
  })
}

//create

//read

//delete

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
  window.removeEventListener("load", getRole)
}

const getInfo = async (id) => {
  try {
    const {
      data: { title, tags, subject, problems: p, usedPIDs: upids },
    } = await axios.get(`/api/v1/exercises/${id}`)
    titleInput.value = title
    titleInput.dispatchEvent(new KeyboardEvent("keyup"))
    addTags(tags)
    console.log(inputValues, subject)
    subjectSelect.value = subject
    subjectSelect.dispatchEvent(new Event("pointerup"))
    problems = p
    usedPIDs = upids
    addAllProblems()

    // lastSave = { title, tags: tags.slice(), text }
    // currentDoc = { title, tags: tags.slice(), text }
    // textAreaText.dispatchEvent(new KeyboardEvent("keyup"))
    // addTags(tags)
  } catch (err) {
    console.error(err)
  }
}

const defineTextAreas = () => {
  questionTextAreaDiv = document.querySelectorAll('[role="application"]')[0]
  correctAnswerTextAreaDiv = document.querySelectorAll(
    '[role="application"]'
  )[1]
  choicesTextAreaDiv = document.querySelectorAll('[role="application"]')[2]
  questionTextArea = tinymce.DOM.win[0].document.body
  correctAnswerTextArea = tinymce.DOM.win[1].document.body
  choicesTextArea = tinymce.DOM.win[2].document.body
  questionTextArea.innerHTML = "<p></p>"
  correctAnswerTextArea.innerHTML = "<p></p>"
  choicesTextArea.innerHTML = "<p></p>"
}

const saveExercise = async (status) => {
  document.activeElement.blur()
  if (resourceId) {
    try {
      const {
        data: { id },
      } = await axios.patch(`/api/v1/exercises/${resourceId}`, {
        title: titleInput.value.trim(),
        tags: inputValues,
        subject,
        problems,
        status,
        usedPIDs,
      })
      // if (status === "draft") {
      //   window.location.href = `/drafts/exercise/${id}`
      // } else {
      //   window.location.href = `/exercises`
      // }
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      const {
        data: { id },
      } = await axios.post("/api/v1/exercises", {
        title: titleInput.value.trim(),
        tags: inputValues,
        subject,
        problems,
        status,
        usedPIDs,
      })
      if (status === "draft") {
        window.location.href = `/drafts/exercise/${id}`
      } else {
        window.location.href = `/exercises`
      }
    } catch (err) {
      console.error(err)
    }
  }
}

const publishExercise = (e) => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create to title to save this resource.", "not_met")
  }
  if (inputValues.length === 0) {
    return giveFeedback("Add tags to publish this exercise.", "not_met")
  }
  if (subject.value === "no_choice") {
    return giveFeedback("Choose a subject to publish this exercise.", "not_met")
  }
  saveExercise("published")
}

const draftExercise = () => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create to title to save this resource.", "not_met")
  }
  saveExercise("draft")
}

const init = () => {
  getRole()
  defineTextAreas()
  listenForChangesToPublishExerciseList()
  if (path.split("/")[3]) {
    resourceId = path.split("/")[3]
    getInfo(resourceId)
  }
  // tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
  //   "body"
  // ).innerHTML = ""
  //   }
}

draftBtn.addEventListener("pointerup", draftExercise)
//remove styles on publishBtn when the reqs are met and then add the event listener
// remove event listener if the reqs are no longer being met
window.addEventListener("load", init)
