const difficultySelect = document.querySelector("#choose_difficulty")
const questionAdd = document.querySelector("#question_add")
const questionDiscard = document.querySelector("#question_discard")
const answerAdd = document.querySelector("#answer_add")
const answerDiscard = document.querySelector("#answer_discard")
const choiceAdd = document.querySelector("#choice_add")
const choiceDiscard = document.querySelector("#choice_discard")
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
let questionTextArea, correctAnswerTextArea, choicesTextArea, resourceId, i
let choices = {}
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

const addQ = () => {}
const discardQ = () => {
  i = poseQ.querySelector("i")
  questionTextArea.innerHTML = "<p><br></p>"
  poseQ.classList.replace("satisfied", "not_met")
  i.classList.replace("fa-check-circle", "fa-times-circle")
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
    del.addEventListener("pointerup", delAns)
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
    answerAdd.setAttribute("aria-label", "Add answer to question")
    answerAdd.setAttribute("title", "Add answer to question")
  }
  correctAnswerTextArea.innerHTML = "<p><br></p>"
}

const revealAns = () => {
  console.log("revealing answer")
}

const editAns = (e) => {
  correctAnswerTextArea.innerHTML = choices.answer
  console.log("editting answer")
  answerAdd.setAttribute("aria-label", "Update answer")
  answerAdd.setAttribute("title", "Update answer")
}

const delAns = () => {
  i = createCorrectAns.querySelector("i")
  i.classList.replace("fa-check-circle", "fa-times-circle")
  createCorrectAns.classList.replace("satisfied", "not_met")
  correctAnswerSection.querySelector("li").remove()
  correctAnswerSection.classList.add("hide")
  delete choices.answer
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
  let ref = e.target.dataset.ref
  console.log(ref)
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
    choiceAdd.setAttribute("aria-label", "Add choice to question")
    choiceAdd.setAttribute("title", "Add choice to question")
  }
  console.log(choices)
  choicesTextArea.innerHTML = "<p><br></p>"
}

const revealChoice = () => {}
const editChoice = (e) => {
  let itemID = e.target.parentElement.dataset.id
  choicesTextArea.innerHTML = choices[itemID]
  choiceAdd.dataset.ref = itemID
  choiceAdd.setAttribute("aria-label", "Update choice")
  choiceAdd.setAttribute("title", "Update choice")
}
const copyChoice = () => {}
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
questionAdd.addEventListener("pointerup", addQ)
questionDiscard.addEventListener("pointerup", discardQ)
answerAdd.addEventListener("pointerup", addAns)
answerDiscard.addEventListener("pointerup", discardAns)
choiceAdd.addEventListener("pointerup", addChoice)
choiceDiscard.addEventListener("pointerup", discardChoice)

// draftBtn.addEventListener("click", draftText)
// window.addEventListener("beforeunload", compareText)
