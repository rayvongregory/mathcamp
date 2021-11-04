//this is for the onload, addAll, discardAll, draft, and publish
const addAllBtn = document.querySelector("#add_all")
const discardAllBtn = document.querySelector("#discard_all")
const publishQuestionReqs = document.querySelectorAll(".to_publish_question li")
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

//create
const addAll = (e, obj = null) => {
  document.activeElement.blur()
  if (obj) {
    let id = obj.id.substring(3)
    let { question, choices } = obj.problem
    let { diff } = obj
    let newId
    for (let key in choices) {
      do {
        newId = String(Math.round(Math.random() * 999))
        if (newId.length !== 3) {
          newId = newId.padStart(3, "0")
        }
      } while (choices[`cid${newId}`] !== undefined)
      choices[`cid${newId}`] = choices[key]
      delete choices[key]
    }
    let q = document.createElement("li")
    let icon = document.createElement("span")
    q.classList.add("not_met")
    button.innerHTML = '<i class="fas fa-times-circle"></i>'
    let p = document.createElement("p")
    q.dataset.id = `pid${id}`
    q.dataset.diff = diff
    p.innerText = `Problem ID: ${id}`
    let prev = document.createElement("button")
    prev.setAttribute("role", "button")
    prev.setAttribute("aria-label", "Preview problem")
    prev.setAttribute("title", "Preview problem")
    prev.innerHTML = '<i class="fas fa-eye"></i>'
    prev.addEventListener("pointerup", prevProblem)
    let edit = document.createElement("button")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit problem")
    edit.setAttribute("title", "Edit problem")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editProblem)
    let del = document.createElement("button")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete problem")
    del.setAttribute("title", "Delete problem")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", delProblem)
    q.appendChild(icon)
    q.appendChild(p)
    q.appendChild(prev)
    q.appendChild(edit)
    q.appendChild(del)
    appendThisToThat(q, diff)
    return
  }

  let { refId, refDiff } = e.target.dataset
  if (!refId) {
    let satisfied = true
    for (let req of publishQuestionReqs) {
      if (req.classList.contains("not_met")) {
        satisfied = false
        break
      }
    }
    let q = document.createElement("li")
    let icon = document.createElement("span")
    if (satisfied) {
      q.classList.add("satisfied")
      icon.innerHTML = '<i class="fas fa-check-circle"></i>'
    } else {
      q.classList.add("not_met")
      icon.innerHTML = '<i class="fas fa-times-circle"></i>'
    }
    let difficulty = difficultySelect.value
    let id
    do {
      id = String(Math.round(Math.random() * 999))
      if (id.length !== 3) {
        id = id.padStart(3, "0")
      }
    } while (problems[difficulty][`pid${id}`] !== undefined)
    problems[difficulty][`pid${id}`] = {
      question: questionTextArea.innerHTML,
      choices: { ...choices },
    }
    let p = document.createElement("p")
    q.dataset.id = `pid${id}`
    q.dataset.diff = difficulty
    p.innerText = `Problem ID: ${id}`
    let prev = document.createElement("button")
    prev.setAttribute("role", "button")
    prev.setAttribute("aria-label", "Preview problem")
    prev.setAttribute("title", "Preview problem")
    prev.innerHTML = '<i class="fas fa-eye"></i>'
    prev.addEventListener("pointerup", prevProblem)
    let edit = document.createElement("button")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit problem")
    edit.setAttribute("title", "Edit problem")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editProblem)
    let del = document.createElement("button")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete problem")
    del.setAttribute("title", "Delete problem")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", delProblem)
    q.appendChild(icon)
    q.appendChild(p)
    q.appendChild(prev)
    q.appendChild(edit)
    q.appendChild(del)
    appendThisToThat(q, difficulty)
    discardAll()
    questionSection.classList.add("hide")
    questionSection.classList.add("pop-top")
    questionTextAreaDiv.classList.remove("hide")
    extraOptions_0.classList.remove("hide")
  } else {
    let newDiff = difficultySelect.value
    let qDOM = document.querySelector(`[data-id="${refId}"]`)
    let icon = qDOM.querySelector("button")
    if (newDiff !== refDiff) {
      problems[newDiff][refId] = {
        question: question,
        choices: { ...choices },
      }
      delete problems[refDiff][refId]
      let del = qDOM.querySelectorAll("button")[3]
      del.dispatchEvent(new Event("pointerup"))
      qDOM.dataset.diff = newDiff
      appendThisToThat(qDOM, newDiff)
    } else {
      problems[refDiff][refId] = {
        question: question,
        choices: { ...choices },
      }
    }

    let satisfied = true
    for (let req of publishQuestionReqs) {
      if (req.classList.contains("not_met")) {
        satisfied = false
        break
      }
    }
    if (satisfied) {
      qDOM.classList.remove("not_met")
      qDOM.classList.add("satisfied")
      icon.innerHTML = '<i class="fas fa-check-circle"></i>'
    } else {
      qDOM.classList.remove("satisfied")
      qDOM.classList.add("not_met")
      icon.innerHTML = '<i class="fas fa-times-circle"></i>'
    }

    discardAll()
    let problem = document.querySelector(`[data-id="${refId}"]`)
    if (problem.dataset.id === refId) {
      problem.classList.remove("editing")
      let p = problem.querySelector("p")
      p.innerText = `Problem ID: ${refId.substring(3)}`
    }
    addAllBtn.setAttribute("aria-label", "Add all to exercise")
    addAllBtn.setAttribute("title", "Add all to exercise")
    let p = addAllBtn.querySelector("p")
    p.innerText = "Add All"
    discardAllBtn.setAttribute("aria-label", "Discard all")
    discardAllBtn.setAttribute("title", "Discard all")
    p = discardAllBtn.querySelector("p")
    p.innerText = "Discard All"
    delete e.target.dataset.refId
    delete e.target.dataset.refDiff
    // if there is a refId, simply locate the object and update it
  }
}

//read

//delete
const discardAll = () => {
  document.activeElement.blur()
  let problem = problemSet.querySelector("li.editing")
  if (problem) {
    problem.classList.remove("editing")
    let p = problem.querySelector("p")
    let id = problem.dataset.id
    p.innerText = `Problem ID: ${id.substring(3)}`
    delete addAllBtn.dataset.refId
    delete addAllBtn.dataset.refDiff
    addAllBtn.setAttribute("aria-label", "Add all to exercise")
    addAllBtn.setAttribute("title", "Add all to exercise")
    p = addAllBtn.querySelector("p")
    p.innerText = "Add All"
    discardAllBtn.setAttribute("aria-label", "Discard all")
    discardAllBtn.setAttribute("title", "Discard all")
    p = discardAllBtn.querySelector("p")
    p.innerText = "Discard All"
  }
  discardQBtn.dispatchEvent(new Event("pointerup"))
  deleteQ()
  discardChoice()
  deleteChoices()
  discardAnsBtn.dispatchEvent(new Event("pointerup"))
  deleteAns()
}

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

const checkForDiff = (e) => {
  const { target } = e
  i = pickDifficulty.querySelector("i")
  if (target.value !== "no_choice") {
    pickDifficulty.classList.replace("not_met", "satisfied")
    i.classList.replace("fa-times-circle", "fa-check-circle")
  } else {
    pickDifficulty.classList.replace("satisfied", "not_met")
    i.classList.replace("fa-check-circle", "fa-times-circle")
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
  questionTextArea.innerHTML = "<p><br></p>"
  correctAnswerTextArea.innerHTML = "<p><br></p>"
  choicesTextArea.innerHTML = "<p><br></p>"
  difficultySelect.addEventListener("pointerup", checkForDiff)
  difficultySelect.addEventListener("click", checkForDiff) // for moz
  difficultySelect.addEventListener("keyup", checkForDiff)
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
    nav.scrollIntoView()
    return unauthorized("Create to title to save this exercise.", pTitle)
  }
  if (inputValues.length === 0) {
    nav.scrollIntoView()
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
    nav.scrollIntoView()
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

addAllBtn.addEventListener("pointerup", addAll)
discardAllBtn.addEventListener("pointerup", discardAll)
draftBtn.addEventListener("pointerup", draftExercise)
//remove styles on publishBtn when the reqs are met and then add the event listener
// remove event listener if the reqs are no longer being met
window.addEventListener("load", init)
