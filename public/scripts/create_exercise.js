const difficultySelect = document.querySelector("#choose_difficulty")
const addAllBtn = document.querySelector("#add_all")
const discardAllBtn = document.querySelector("#discard_all")
const addAnsBtn = document.querySelector("#answer_add")
const addQBtn = document.querySelector("#q_add")
const discardQBtn = document.querySelector("#q_discard")
const discardAnsBtn = document.querySelector("#answer_discard")
const addChoiceBtn = document.querySelector("#choice_add")
const discardChoiceBtn = document.querySelector("#choice_discard")
const questionSection = document.querySelector(".question_section")
const extraOptions_0 = document.querySelectorAll(".extra-options")[0]
const correctAnswerSection = document.querySelector(".correct_answer")
const extraOptions_1 = document.querySelectorAll(".extra-options")[1]
const questionChoicesSection = document.querySelector(".question_choices")
const problemSet = document.querySelector(".problem_set")
const easyProblemsSection = document.querySelector("#easy_problems")
const standardProblemsSection = document.querySelector("#standard_problems")
const hardProblemsSection = document.querySelector("#hard_problems")
const advancedProblemsSection = document.querySelector("#advanced_problems")
const noDiffProblemsSection = document.querySelector("#no_difficulty_problems")
const noProblemsYet = document.querySelector(".no_problems_yet")
const poseQ = document.querySelector("#question")
const pickDifficulty = document.querySelector("#difficulty")
const createCorrectAns = document.querySelector("#correct_answer")
const publishQuestionReqs = document.querySelectorAll(".to_publish_question li")
const tenChoices = document.querySelector("#ten_choices")
const thirtyEZ = document.querySelector("#thirty_easy")
const thirtyStandard = document.querySelector("#thirty_standard")
const twentyHard = document.querySelector("#twenty_hard")
const twentyAdv = document.querySelector("#twenty_advanced")
const allMeetReqs = document.querySelector("#all_meet_reqs")
let questionTextAreaDiv,
  questionTextArea,
  correctAnswerTextAreaDiv,
  correctAnswerTextArea,
  choicesTextAreaDiv,
  choicesTextArea,
  resourceId,
  i
let question = "<p><br></p>"
let choices = {}
let problems = {
  easy: {},
  standard: {},
  hard: {},
  advanced: {},
  no_choice: {},
}
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

const addAll = (e) => {
  let dataset = e.target.dataset
  let refId = dataset.refId
  let refDiff = dataset.refDiff
  if (!refId) {
    let satisfied = true
    for (let req of publishQuestionReqs) {
      if (req.classList.contains("not_met")) {
        satisfied = false
        break
      }
    }
    let q = document.createElement("li")
    let span = document.createElement("span")
    if (satisfied) {
      q.classList.add("satisfied")
      span.innerHTML = '<i class="fas fa-check-circle"></i>'
    } else {
      q.classList.add("not_met")
      span.innerHTML = '<i class="fas fa-times-circle"></i>'
    }
    let difficulty = difficultySelect.value
    let id
    do {
      id = Math.round(Math.random() * 999)
    } while (problems[difficulty][`qid${id}`] !== undefined)
    problems[difficulty][`qid${id}`] = {
      question: questionTextArea.innerHTML,
      choices: { ...choices },
    }

    let p = document.createElement("p")
    q.dataset.id = `qid${id}`
    q.dataset.difficulty = difficulty
    p.innerText = `Question ID: ${id}`
    let prev = document.createElement("span")
    prev.setAttribute("role", "button")
    prev.setAttribute("aria-label", "Preview problem")
    prev.setAttribute("title", "Preview problem")
    prev.innerHTML = '<i class="fas fa-eye"></i>'
    prev.addEventListener("pointerup", prevProblem)
    let edit = document.createElement("span")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit problem")
    edit.setAttribute("title", "Edit problem")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editProblem)
    let copy = document.createElement("span")
    copy.setAttribute("role", "button")
    copy.setAttribute("aria-label", "Copy problem")
    copy.setAttribute("title", "Copy problem")
    copy.innerHTML = '<i class="fas fa-copy"></i>'
    copy.addEventListener("pointerup", copyProblem)
    let del = document.createElement("span")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete problem")
    del.setAttribute("title", "Delete problem")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", delProblem)
    q.appendChild(span)
    q.appendChild(p)
    q.appendChild(prev)
    q.appendChild(edit)
    q.appendChild(copy)
    q.appendChild(del)
    appendThisToThat(q, difficulty)
    discardAll()
    questionSection.classList.add("hide")
    questionSection.classList.add("pop-top")
    questionTextAreaDiv.classList.remove("hide")
    extraOptions_0.classList.remove("hide")
  } else {
    let newDiff = difficultySelect.value
    if (newDiff !== refDiff) {
      let qToEdit = problems[refDiff][refId]
      problems[newDiff][refId] = {
        question: qToEdit.q,
        choices: { ...qToEdit.choices },
        // this does not grab new question, just uses the one that was already there
        // this only gets the choices that were already there, does not capture new choices
      }
      delete problems[refDiff][refId]
      let qDOM = document.querySelector(`[data-id="${refId}"]`)
      let span = qDOM.querySelectorAll("span")[4]
      span.dispatchEvent(new Event("pointerup"))
      qDOM.dataset.difficulty = newDiff
      appendThisToThat(qDOM, newDiff)
    } else {
      let qToEdit = problems[refDiff][refId]
      problems[refDiff][refId] = {
        question: qToEdit.q,
        choices: { ...qToEdit.choices },
        // this does not grab new question, just uses the one that was already there
        // this only gets the choices that were already there, does not capture new choices
      }
    }
    discardAll()
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

const appendThisToThat = (el, diff) => {
  if (!noProblemsYet.classList.contains("hide")) {
    noProblemsYet.classList.add("hide")
  }
  switch (diff) {
    case "easy":
      easyProblemsSection.appendChild(el)
      easyProblemsSection.classList.remove("hide")
      break
    case "standard":
      standardProblemsSection.appendChild(el)
      standardProblemsSection.classList.remove("hide")
      break
    case "hard":
      hardProblemsSection.appendChild(el)
      hardProblemsSection.classList.remove("hide")
      break
    case "advanced":
      advancedProblemsSection.appendChild(el)
      advancedProblemsSection.classList.remove("hide")
      break
    default:
      noDiffProblemsSection.appendChild(el)
      noDiffProblemsSection.classList.remove("hide")
      break
  }
}

const prevProblem = () => {
  console.log("previewing question")
}
const editProblem = (e) => {
  deleteChoices()
  // get element info
  if (addAllBtn.dataset.action) {
    addAllBtn.dispatchEvent(new Event("pointerup"))
    delete addAllBtn.dataset.action
    return
  }
  titleInput.scrollIntoView()
  let target = e.target.parentElement
  let targetId = target.dataset.id
  let targetDiff = target.dataset.difficulty
  // store info refs in addAllBtn btn
  addAllBtn.dataset.refId = targetId
  addAllBtn.dataset.refDiff = targetDiff
  // change text and labels on add/delete btns
  addAllBtn.setAttribute("aria-label", "Update question")
  addAllBtn.setAttribute("title", "Update question")
  let p = addAllBtn.querySelector("p")
  p.innerText = "Update Question"
  discardAllBtn.setAttribute("aria-label", "Discard changes")
  discardAllBtn.setAttribute("title", "Discard changes")
  p = discardAllBtn.querySelector("p")
  p.innerText = "Discard Changes"
  console.log(problems)
  let q = problems[targetDiff][targetId]
  // locate info and add to DOM
  //add question
  // questionTextArea.innerHTML = q.question
  if (
    q.question !== "<p><br></p>" &&
    q.question !== '<p><br data-mce-bogus="1"></p>'
  ) {
    poseQ.classList.replace("not_met", "satisfied")
    i = poseQ.querySelector("i")
    i.classList.replace("fa-times-circle", "fa-check-circle")
    addQ()
  }

  //set difficulty
  difficultySelect.value = targetDiff
  difficultySelect.dispatchEvent(new Event("pointerup"))
  //add answer
  if (q.choices.answer) {
    correctAnswerTextArea.innerHTML = q.choices.answer
    addAns()
  }
  //add choices
  let keys = Object.keys(q.choices)
  console.log(q.choices)
  choices = q.choices
  for (let key of keys) {
    if (key.startsWith("cid")) {
      choicesTextArea.innerHTML = q.choices[key]
      addChoiceBtn.dataset.ref = key
      addChoiceBtn.dispatchEvent(new Event("pointerup"))

      // addChoice(new Event("pointerup"), key)
    }
  }
}
const copyProblem = (e) => {
  console.log(e.target.previousElementSibling)
  addAllBtn.dataset.action = "copying"
  // EZ, let editProblem put all info in fields, then call addAll to add it to the bank
  e.target.previousElementSibling.dispatchEvent(new Event("pointerup"))
}
const delProblem = (e) => {
  let item = e.target.parentElement
  let section = item.parentElement
  let list = section.querySelectorAll("li")
  if (list.length === 1) {
    section.classList.add("hide")
  }
  let hide = true
  for (let ul of problemSet.querySelectorAll("ul")) {
    if (!ul.classList.contains("hide")) {
      hide = false
      break
    }
  }
  if (hide) {
    noProblemsYet.classList.remove("hide")
  }
  let qId = item.dataset.id
  let qDiff = item.dataset.difficulty
  delete problems[qDiff][qId]
  item.remove()
}

const discardAll = () => {
  discardQBtn.dispatchEvent(new Event("pointerup"))
  deleteQ()
  discardAns()
  deleteChoices()
  deleteAns()
  //deleteAns already calls checkForTen
}

const addQ = () => {
  question = questionTextArea.innerHTML
  let questionItem = questionSection.querySelector("li")
  if (!questionItem) {
    questionItem = document.createElement("li")
    let p = document.createElement("p")
    p.innerText = "Question"
    let see = document.createElement("span")
    see.setAttribute("role", "button")
    see.setAttribute("aria-label", "See question")
    see.setAttribute("title", "See question")
    see.innerHTML = '<i class="fas fa-eye"></i>'
    see.addEventListener("pointerup", revealQ)
    let edit = document.createElement("span")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit question")
    edit.setAttribute("title", "Edit question")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editQ)
    let del = document.createElement("span")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete question")
    del.setAttribute("title", "Delete question")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", deleteQ)
    questionItem.appendChild(p)
    questionItem.appendChild(see)
    questionItem.appendChild(edit)
    questionItem.appendChild(del)
    questionSection.appendChild(questionItem)
    i = poseQ.querySelector("i")
    if (
      question !== "<p><br></p>" &&
      question !== '<p><br data-mce-bogus="1"></p>'
    ) {
      i.classList.replace("fa-times-circle", "fa-check-circle")
      poseQ.classList.replace("not_met", "satisfied")
    }
    questionSection.classList.remove("pop-top")
    console.log("adding q")
  } else {
    question = questionTextArea.innerHTML
    questionItem.classList.remove("editing")
    let p = questionItem.querySelector("p")
    p.innerText = "Question"
    questionSection.classList.remove("pop-top")
    addQBtn.setAttribute("aria-label", "Add question")
    addQBtn.setAttribute("title", "Add question")
    console.log("updating q")
  }
  questionSection.classList.remove("hide")
  questionTextAreaDiv.classList.add("hide")
  extraOptions_0.classList.add("hide")
}

const revealQ = () => {
  console.log("revealing question")
}

const editQ = (e) => {
  let target = e.target
  let li = target.parentElement
  let p = li.querySelector("p")
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    p.innerText = "Question"
    target.setAttribute("aria-label", "Cancel edit")
    target.setAttribute("title", "Cancel edit")
    questionSection.classList.remove("pop-top")
    questionTextAreaDiv.classList.add("hide")
    extraOptions_0.classList.add("hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Question (editing)"
    questionTextArea.innerHTML = question
    questionTextAreaDiv.classList.remove("hide")
    addQBtn.setAttribute("aria-label", "Update question")
    addQBtn.setAttribute("title", "Update question")
    questionSection.classList.add("pop-top")
    extraOptions_0.classList.remove("hide")
  }
}

const deleteQ = () => {
  let li = questionSection.querySelector("li")
  if (li) li.remove()
  question = "<p><br></p>"
  questionSection.classList.add("hide")
  questionTextAreaDiv.classList.remove("hide")
  extraOptions_0.classList.remove("hide")
  questionTextArea.innerHTML = "<p><br></p>"
  poseQ.classList.replace("satisfied", "not_met")
  i = poseQ.querySelector("i")
  i.classList.replace("fa-check-circle", "fa-times-circle")
  i = pickDifficulty.querySelector("i")
  i.classList.replace("fa-check-circle", "fa-times-circle")
  difficultySelect.value = "no_choice"
  difficultySelect.dispatchEvent(new Event("pointerup"))
}

const discardQ = (e) => {
  let target = e.target
  questionTextArea.innerHTML = "<p><br></p>"
  if (target.getAttribute("aria-label") === "Discard changes") {
    target.setAttribute("aria-label", "Discard")
    target.setAttribute("title", "Discard")
    target.previousElementSibling.setAttribute("aria-label", "Add question")
    target.previousElementSibling.setAttribute("title", "Add question")
    extraOptions_0.classList.add("hide")
    questionTextAreaDiv.classList.add("hide")
    questionSection.classList.remove("hide")
    questionSection.classList.remove("pop-top")
  }
}

const addAns = () => {
  let correctAnswerItem = correctAnswerSection.querySelector("li")
  if (!correctAnswerItem) {
    correctAnswerItem = document.createElement("li")
    choices.answer = correctAnswerTextArea.innerHTML
    let p = document.createElement("p")
    p.innerText = "Answer"
    let see = document.createElement("span")
    see.setAttribute("role", "button")
    see.setAttribute("aria-label", "See answer")
    see.setAttribute("title", "See answer")
    see.innerHTML = '<i class="fas fa-eye"></i>'
    see.addEventListener("pointerup", revealAns)
    let edit = document.createElement("span")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit answer")
    edit.setAttribute("title", "Edit answer")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editAns)
    let del = document.createElement("span")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete answer")
    del.setAttribute("title", "Delete answer")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", deleteAns)
    correctAnswerItem.appendChild(p)
    correctAnswerItem.appendChild(see)
    correctAnswerItem.appendChild(edit)
    correctAnswerItem.appendChild(del)
    correctAnswerSection.appendChild(correctAnswerItem)
    i = createCorrectAns.querySelector("i")
    i.classList.replace("fa-times-circle", "fa-check-circle")
    createCorrectAns.classList.replace("not_met", "satisfied")
    correctAnswerSection.classList.remove("hide")
    checkForTen()
  } else {
    choices.answer = correctAnswerTextArea.innerHTML
    correctAnswerItem.classList.remove("editing")
    let p = correctAnswerItem.querySelector("p")
    p.innerText = "Answer"
    addAnsBtn.setAttribute("aria-label", "Add answer to question")
    addAnsBtn.setAttribute("title", "Add answer to question")
  }
  correctAnswerSection.classList.remove("hide")
  correctAnswerSection.classList.remove("pop-top")
  correctAnswerTextAreaDiv.classList.add("hide")
  extraOptions_1.classList.add("hide")
  correctAnswerTextArea.innerHTML = "<p><br></p>"
}

const revealAns = () => {
  console.log("revealing answer")
}

const editAns = (e) => {
  let target = e.target
  let li = target.parentElement
  let p = li.querySelector("p")
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    p.innerText = "Answer"
    target.setAttribute("aria-label", "Cancel edit")
    target.setAttribute("title", "Cancel edit")
    correctAnswerSection.classList.remove("pop-top")
    correctAnswerTextAreaDiv.classList.add("hide")
    extraOptions_1.classList.add("hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Answer (editing)"
    correctAnswerTextArea.innerHTML = choices.answer
    addAnsBtn.setAttribute("aria-label", "Update answer")
    addAnsBtn.setAttribute("title", "Update answer")
    correctAnswerSection.classList.add("pop-top")
    correctAnswerTextAreaDiv.classList.remove("hide")
    extraOptions_1.classList.remove("hide")
  }
}

const deleteAns = () => {
  let li = correctAnswerSection.querySelector("li")
  if (li) {
    li.remove()
    delete choices.answer
    i = createCorrectAns.querySelector("i")
    i.classList.replace("fa-check-circle", "fa-times-circle")
    createCorrectAns.classList.replace("satisfied", "not_met")
    correctAnswerSection.classList.add("hide")
    correctAnswerTextAreaDiv.classList.remove("hide")
    extraOptions_1.classList.remove("hide")
  }
  checkForTen()
}

const discardAns = () => {
  correctAnswerTextArea.innerHTML = "<p><br></p>"
}

const checkForTen = () => {
  i = tenChoices.querySelector("i")
  if (Object.keys(choices).length >= 10) {
    tenChoices.classList.replace("not_met", "satisfied")
    i.classList.replace("fa-times-circle", "fa-check-circle")
  } else {
    tenChoices.classList.replace("satisfied", "not_met")
    i.classList.replace("fa-check-circle", "fa-times-circle")
  }
}

const addChoice = (e) => {
  let id
  let refId = e.target.dataset.refId
  if (!refId) {
    do {
      id = Math.round(Math.random() * 999)
    } while (choices[`cid${id}`] !== undefined)
    choices[`cid${id}`] = choicesTextArea.innerHTML
    let choiceItem = document.createElement("li")
    let p = document.createElement("p")
    choiceItem.dataset.id = `cid${id}`
    p.innerText = `Choice ID: ${id}`
    let see = document.createElement("span")
    see.setAttribute("role", "button")
    see.setAttribute("aria-label", "See choice")
    see.setAttribute("title", "See choice")
    see.innerHTML = '<i class="fas fa-eye"></i>'
    see.addEventListener("pointerup", revealChoice)
    let edit = document.createElement("span")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit choice")
    edit.setAttribute("title", "Edit choice")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editChoice)
    let copy = document.createElement("span")
    copy.setAttribute("role", "button")
    copy.setAttribute("aria-label", "Duplicate choice")
    copy.setAttribute("title", "Duplicate choice")
    copy.innerHTML = '<i class="fas fa-copy"></i>'
    copy.addEventListener("pointerup", copyChoice)
    let del = document.createElement("span")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete choice")
    del.setAttribute("title", "Delete choice")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", deleteChoice)
    choiceItem.appendChild(p)
    choiceItem.appendChild(see)
    choiceItem.appendChild(edit)
    choiceItem.appendChild(copy)
    choiceItem.appendChild(del)
    questionChoicesSection.appendChild(choiceItem)
    questionChoicesSection.classList.remove("hide")
    checkForTen()
  } else {
    id = refId.substring(3)
    let li = document.querySelector(`[data-id=${refId}]`)
    li.classList.remove("editing")
    questionChoicesSection.classList.remove("pop-top")
    let p = li.querySelector("p")
    p.innerText = `Choice ID: ${id}`
    choices[refId] = choicesTextArea.innerHTML
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
    delete e.target.dataset.refId
    console.log(choices)
  }

  choicesTextArea.innerHTML = "<p><br></p>"
}

const revealChoice = () => {
  console.log("revealing choice")
}
const editChoice = (e) => {
  let btn = e.target
  let target = btn.parentElement
  let itemID = target.dataset.id
  let li = questionChoicesSection.querySelector("li.editing")
  if (li && li !== target) {
    li.classList.remove("editing")
    let p = li.querySelector("p")
    let id = li.dataset.id
    p.innerText = `Choice ID: ${id.substring(3)}`
  } else if (li && li === target) {
    li.classList.remove("editing")
    li.classList.remove("editing")
    btn.setAttribute("aria-label", "Edit choice")
    btn.setAttribute("title", "Edit choice")
    addChoiceBtn.setAttribute("aria-label", "Add choice")
    addChoiceBtn.setAttribute("title", "Add choice")
    let p = li.querySelector("p")
    let id = li.dataset.id
    p.innerText = `Choice ID: ${id.substring(3)}`
    delete addChoiceBtn.dataset.refId
    discardChoice()
    return
  }
  target.classList.add("editing")
  let p = target.querySelector("p")
  p.innerText = `Choice ID: ${itemID.substring(3)} (editing)`
  choicesTextArea.innerHTML = choices[itemID]
  addChoiceBtn.dataset.refId = itemID
  btn.setAttribute("aria-label", "Cancel edit")
  btn.setAttribute("title", "Cancel edit")
  addChoiceBtn.setAttribute("aria-label", "Update choice")
  addChoiceBtn.setAttribute("title", "Update choice")
}
const copyChoice = (e) => {
  console.log("copying choice")
}
const deleteChoice = (e) => {
  let item = e.target.parentElement
  let itemID = item.dataset.id
  if (itemID === addChoiceBtn.dataset.refId) {
    delete addChoiceBtn.dataset.refId
    addChoiceBtn.setAttribute("aria-label", "Add choice")
    addChoiceBtn.setAttribute("title", "Add choice")
  }
  item.remove()
  delete choices[itemID]
  checkForTen()
  if (
    Object.keys(choices).length === 0 ||
    (Object.keys(choices).length === 1 && choices.answer)
  ) {
    questionChoicesSection.classList.add("hide")
  }
}
const discardChoice = () => {
  choicesTextArea.innerHTML = "<p><br></p>"
}
const deleteChoices = () => {
  let choicesList = questionChoicesSection.querySelectorAll("li")
  for (let choice of choicesList) {
    delete choices[choice.dataset.id]
    choice.remove()
  }
  questionChoicesSection.classList.add("hide")
  choicesTextArea.innerHTML = "<p><br></p>"
}

const checkList = (e) => {
  const target = e.target
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
  difficultySelect.addEventListener("pointerup", checkList)
  difficultySelect.addEventListener("keyup", checkList)
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

window.addEventListener("load", init)
addAllBtn.addEventListener("pointerup", addAll)
discardAllBtn.addEventListener("pointerup", discardAll)
addQBtn.addEventListener("pointerup", addQ)
discardQBtn.addEventListener("pointerup", discardQ)
addAnsBtn.addEventListener("pointerup", addAns)
discardAnsBtn.addEventListener("pointerup", discardAns)
addChoiceBtn.addEventListener("pointerup", addChoice)
discardChoiceBtn.addEventListener("pointerup", discardChoice)

// draftBtn.addEventListener("click", draftText)
// window.addEventListener("beforeunload", compareText)
