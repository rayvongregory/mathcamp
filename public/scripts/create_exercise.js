const difficultySelect = document.querySelector("#choose_difficulty")
const addAllBtn = document.querySelector("#add_all")
const discardAllBtn = document.querySelector("#discard_all")
const addAnsBtn = document.querySelector("#answer_add")
const addQBtn = document.querySelector("#q_add")
const discardQBtn = document.querySelector("#q_discard")
const discardAnsBtn = document.querySelector("#answer_discard")
const addChoiceBtn = document.querySelector("#choice_add")
const discardChoiceBtn = document.querySelector("#choice_discard")
const correctAnswerSection = document.querySelector(".correct_answer")
const questionChoicesSection = document.querySelector(".question_choices")
const questionBank = document.querySelector(".question_bank")
const easyQsSection = document.querySelector(".easy_qs")
const standardQsSection = document.querySelector(".standard_qs")
const hardQsSection = document.querySelector(".hard_qs")
const advancedQsSection = document.querySelector(".advanced_qs")
const noDiffQsSection = document.querySelector(".no_difficulty_qs")
const noQsYet = document.querySelector(".no_questions_yet")
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
let questionTextArea, correctAnswerTextArea, choicesTextArea, resourceId, i
let choices = {}
let questions = {
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

const addAll = () => {
  let satisfied = true
  for (let req of publishQuestionReqs) {
    if (req.classList.contains("not_met")) {
      satisfied = false
      break
    }
  }
  let question = document.createElement("li")
  let span = document.createElement("span")
  if (satisfied) {
    question.classList.add("satisfied")
    span.innerHTML = '<i class="fas fa-check-circle"></i>'
  } else {
    question.classList.add("not_met")
    span.innerHTML = '<i class="fas fa-times-circle"></i>'
  }
  let difficulty = difficultySelect.value
  let id
  do {
    id = Math.round(Math.random() * 999999)
  } while (questions[difficulty][`qid${id}`] !== undefined)
  questions[difficulty][`qid${id}`] = {
    question: questionTextArea.innerHTML,
    choices: { ...choices },
  }
  if (!noQsYet.classList.contains("hide")) {
    noQsYet.classList.add("hide")
  }
  let p = document.createElement("p")
  question.dataset.id = `qid${id}`
  question.dataset.difficulty = difficulty
  p.innerText = `Question ID: ${id}`
  let prev = document.createElement("span")
  prev.setAttribute("role", "button")
  prev.setAttribute("aria-label", "Preview question")
  prev.setAttribute("title", "Preview question")
  prev.innerHTML = '<i class="fas fa-eye"></i>'
  prev.addEventListener("pointerup", prevQ)
  let edit = document.createElement("span")
  edit.setAttribute("role", "button")
  edit.setAttribute("aria-label", "Edit question")
  edit.setAttribute("title", "Edit question")
  edit.innerHTML = '<i class="fas fa-edit">'
  edit.addEventListener("pointerup", editQ)
  let copy = document.createElement("span")
  copy.setAttribute("role", "button")
  copy.setAttribute("aria-label", "Copy question")
  copy.setAttribute("title", "Copy question")
  copy.innerHTML = '<i class="fas fa-copy">'
  copy.addEventListener("pointerup", copyQ)
  let del = document.createElement("span")
  del.setAttribute("role", "button")
  del.setAttribute("aria-label", "Delete question")
  del.setAttribute("title", "Delete question")
  del.innerHTML = '<i class="fas fa-trash">'
  del.addEventListener("pointerup", delQ)
  question.appendChild(span)
  question.appendChild(p)
  question.appendChild(prev)
  question.appendChild(edit)
  question.appendChild(copy)
  question.appendChild(del)

  switch (difficulty) {
    case "easy":
      easyQsSection.appendChild(question)
      easyQsSection.classList.remove("hide")
      break
    case "standard":
      standardQsSection.appendChild(question)
      standardQsSection.classList.remove("hide")

      break
    case "hard":
      hardQsSection.appendChild(question)
      hardQsSection.classList.remove("hide")

      break
    case "advanced":
      advancedQsSection.appendChild(question)
      advancedQsSection.classList.remove("hide")

      break
    default:
      noDiffQsSection.appendChild(question)
      noDiffQsSection.classList.remove("hide")

      break
  }
  discardAll()
  discardAns()
  deleteAns()
  deleteChoices()
  checkForTen()
  resetDifficulty()
}

const prevQ = () => {
  console.log("previewing question")
}
const editQ = (e) => {
  // get element info
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
  let q = questions[targetDiff][targetId]
  // locate info and add to DOM
  //add question
  questionTextArea.innerHTML = q.question
  questionTextArea.dispatchEvent(new KeyboardEvent("keyup"))
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
  for (let key of keys) {
    if (key.startsWith("cid")) {
      choicesTextArea.innerHTML = q.choices[key]
      addChoiceBtn.dispatchEvent(new Event("pointerup"))
    }
  }
}
const copyQ = (e) => {
  // EZ, let editQ put all info in fields, then call addAll to add it to the bank
  e.target.previousSibling.dispatchEvent(new Event("pointerup"))
  addAll()
}
const delQ = (e) => {
  let item = e.target.parentElement
  let section = item.parentElement
  let list = section.querySelectorAll("li")
  if (list.length === 1) {
    section.classList.add("hide")
  }
  let hide = true
  for (let ul of questionBank.querySelectorAll("ul")) {
    if (!ul.classList.contains("hide")) {
      hide = false
      break
    }
  }
  if (hide) {
    noQsYet.classList.remove("hide")
  }
  let qId = item.dataset.id
  let qDiff = item.dataset.difficulty
  delete questions[qDiff][qId]
  item.remove()
}

const discardAll = () => {
  i = poseQ.querySelector("i")
  questionTextArea.innerHTML = "<p><br></p>"
  poseQ.classList.replace("satisfied", "not_met")
  i.classList.replace("fa-check-circle", "fa-times-circle")
}

const addQ = () => {
  console.log("adding q")
}

const discardQ = () => {
  onsole.log("discarding q")
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
    see.innerHTML = '<i class="fas fa-eye">'
    see.addEventListener("pointerup", revealAns)
    let edit = document.createElement("span")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit answer")
    edit.setAttribute("title", "Edit answer")
    edit.innerHTML = '<i class="fas fa-edit">'
    edit.addEventListener("pointerup", editAns)
    let del = document.createElement("span")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete answer")
    del.setAttribute("title", "Delete answer")
    del.innerHTML = '<i class="fas fa-trash">'
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
    addAnsBtn.setAttribute("aria-label", "Add answer to question")
    addAnsBtn.setAttribute("title", "Add answer to question")
  }
  correctAnswerTextArea.innerHTML = "<p><br></p>"
}

const revealAns = () => {
  console.log("revealing answer")
}

const editAns = (e) => {
  correctAnswerTextArea.innerHTML = choices.answer
  addAnsBtn.setAttribute("aria-label", "Update answer")
  addAnsBtn.setAttribute("title", "Update answer")
}

const deleteAns = () => {
  let item = correctAnswerSection.querySelector("li")
  if (item) {
    item.remove()
    i = createCorrectAns.querySelector("i")
    i.classList.replace("fa-check-circle", "fa-times-circle")
    createCorrectAns.classList.replace("satisfied", "not_met")
    correctAnswerSection.classList.add("hide")
    delete choices.answer
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

const resetDifficulty = () => {
  difficultySelect.value = "no_choice"
  difficultySelect.dispatchEvent(new Event("pointerup"))
}

const addChoice = (e) => {
  let ref = e.target.dataset.ref
  if (!ref) {
    let id
    do {
      id = Math.round(Math.random() * 999999)
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
    see.innerHTML = '<i class="fas fa-eye">'
    see.addEventListener("pointerup", revealChoice)
    let edit = document.createElement("span")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit choice")
    edit.setAttribute("title", "Edit choice")
    edit.innerHTML = '<i class="fas fa-edit">'
    edit.addEventListener("pointerup", editChoice)
    let copy = document.createElement("span")
    copy.setAttribute("role", "button")
    copy.setAttribute("aria-label", "Duplicate choice")
    copy.setAttribute("title", "Duplicate choice")
    copy.innerHTML = '<i class="fas fa-copy">'
    copy.addEventListener("pointerup", copyChoice)
    let del = document.createElement("span")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete choice")
    del.setAttribute("title", "Delete choice")
    del.innerHTML = '<i class="fas fa-trash">'
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
    choices[ref] = choicesTextArea.innerHTML
    delete e.target.dataset.ref
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
  }
  choicesTextArea.innerHTML = "<p><br></p>"
}

const revealChoice = () => {
  console.log("revealing choice")
}
const editChoice = (e) => {
  let itemID = e.target.parentElement.dataset.id
  choicesTextArea.innerHTML = choices[itemID]
  addChoiceBtn.dataset.ref = itemID
  addChoiceBtn.setAttribute("aria-label", "Update choice")
  addChoiceBtn.setAttribute("title", "Update choice")
}
const copyChoice = (e) => {
  console.log("copying choice")
}
const deleteChoice = (e) => {
  let item = e.target.parentElement
  let itemID = item.dataset.id
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
}

const checkList = (e) => {
  const target = e.target
  switch (target) {
    case questionTextArea:
      i = poseQ.querySelector("i")
      let text = target.innerText.trim()
      if (text !== "") {
        poseQ.classList.replace("not_met", "satisfied")
        i.classList.replace("fa-times-circle", "fa-check-circle")
      } else {
        poseQ.classList.replace("satisfied", "not_met")
        i.classList.replace("fa-check-circle", "fa-times-circle")
      }
      break
    case difficultySelect:
      i = pickDifficulty.querySelector("i")
      if (target.value !== "no_choice") {
        pickDifficulty.classList.replace("not_met", "satisfied")
        i.classList.replace("fa-times-circle", "fa-check-circle")
      } else {
        pickDifficulty.classList.replace("satisfied", "not_met")
        i.classList.replace("fa-check-circle", "fa-times-circle")
      }
      break
    default:
      break
  }
}

const defineTextAreas = () => {
  questionTextArea = tinymce.DOM.win[0].document.body
  correctAnswerTextArea = tinymce.DOM.win[1].document.body
  choicesTextArea = tinymce.DOM.win[2].document.body
  questionTextArea.addEventListener("keyup", checkList)
  questionTextArea.addEventListener("paste", checkList)
  difficultySelect.addEventListener("pointerup", checkList)
  difficultySelect.addEventListener("keyup", checkList)

  // this doesn't account for clicking the menu, keying down to focus on an option,
  // and then clicking outside the menu
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
