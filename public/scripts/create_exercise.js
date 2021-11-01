const overlay = document.querySelector(".overlay")
const overlayCloseBtn = overlay.querySelector(".close")
let overlayHeader = overlay.querySelector("h3")
let overlayContent = overlay.querySelector(".overlay___content")
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
const extraOptions_2 = document.querySelectorAll(".extra-options")[2]
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

const closeOverlay = () => {
  overlayContent.innerHTML = ""
  overlay.classList.add("hide")
}

const addAll = (e, obj = null) => {
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
    let button = document.createElement("button")
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
    // let copy = document.createElement("button")
    // copy.setAttribute("role", "button")
    // copy.setAttribute("aria-label", "Copy problem")
    // copy.setAttribute("title", "Copy problem")
    // copy.innerHTML = '<i class="fas fa-copy"></i>'
    // copy.addEventListener("pointerup", copyProblem)
    let del = document.createElement("button")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete problem")
    del.setAttribute("title", "Delete problem")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", delProblem)
    q.appendChild(button)
    q.appendChild(p)
    q.appendChild(prev)
    q.appendChild(edit)
    // q.appendChild(copy)
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
    let button = document.createElement("button")
    if (satisfied) {
      q.classList.add("satisfied")
      button.innerHTML = '<i class="fas fa-check-circle"></i>'
    } else {
      q.classList.add("not_met")
      button.innerHTML = '<i class="fas fa-times-circle"></i>'
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
    // let copy = document.createElement("button")
    // copy.setAttribute("role", "button")
    // copy.setAttribute("aria-label", "Copy problem")
    // copy.setAttribute("title", "Copy problem")
    // copy.innerHTML = '<i class="fas fa-copy"></i>'
    // copy.addEventListener("pointerup", copyProblem)
    let del = document.createElement("button")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete problem")
    del.setAttribute("title", "Delete problem")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", delProblem)
    q.appendChild(button)
    q.appendChild(p)
    q.appendChild(prev)
    q.appendChild(edit)
    // q.appendChild(copy)
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

const prevProblem = (e) => {
  let { id, diff } = e.target.parentElement.dataset
  let problem = problems[diff][id]
  let pcs = problem.choices

  overlayHeader.innerText = `Problem ID: ${id.substring(3)}`
  let q = document.createElement("p")
  q.innerHTML = problem.question
  let options = []
  let pcKeys = Object.keys(pcs)
  if (problem.answer) {
    options.push(problem.answer)
    pcKeys.splice(pcKeys.indexOf("answer"), 1)
  }
  let rnd
  let count = 0
  while (options.length < 5 && count < 20) {
    rnd = Math.floor(Math.random() * pcKeys.length)
    let c = pcKeys[rnd]
    count++
    if (options.includes(pcs[c])) {
      continue
    }
    options.push(pcs[c])
  }
  console.log(options, count)

  for (let x of options) {
  }
  //get all choices

  //pick any 3

  let ul = document.createElement("ul")
  let l1 = document.createElement("li")
  let l2 = document.createElement("li")
  let l3 = document.createElement("li")
  let l4 = document.createElement("li")

  overlayContent.appendChild(q)

  overlay.classList.remove("hide")

  console.log("previewing question")
}

const editProblem = (e) => {
  if (questionChoicesSection.querySelector("li")) deleteChoices()
  let { target } = e
  let li = target.parentElement
  let { id: targetId } = li.dataset
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = `Problem ID: ${targetId.substring(3)}`
    addAllBtn.setAttribute("aria-label", "Add all to exercise")
    addAllBtn.setAttribute("title", "Add all to exercise")
    delete addAllBtn.dataset.refId
    delete addAllBtn.dataset.refDiff
    p = addAllBtn.querySelector("p")
    p.innerText = "Add All"
    discardAllBtn.setAttribute("aria-label", "Discard all")
    discardAllBtn.setAttribute("title", "Discard all")
    target.setAttribute("aria-label", "Edit problem")
    target.setAttribute("title", "Edit problem")
    p = discardAllBtn.querySelector("p")
    p.innerText = "Discard All"
    discardAll()
    return
  }
  let { refId } = addAllBtn.dataset
  if (refId && refId !== targetId) {
    let li = problemSet.querySelector("li.editing")
    let edit = li.querySelectorAll("button")[2]
    edit.setAttribute("aria-label", "Edit problem")
    edit.setAttribute("title", "Edit problem")
    let { id } = li.dataset
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = `Problem ID: ${id.substring(3)}`
    discardAll()
  }
  titleInput.scrollIntoView()
  //add edit styles
  li.classList.add("editing")
  let p = li.querySelector("p")
  p.innerText = `Problem ID: ${targetId.substring(3)} (editing)`
  let { diff: targetDiff } = li.dataset
  // store info refs in addAllBtn btn
  addAllBtn.dataset.refId = targetId
  addAllBtn.dataset.refDiff = targetDiff
  // change text and labels on add/delete btns
  addAllBtn.setAttribute("aria-label", "Save problem")
  addAllBtn.setAttribute("title", "Save problem")
  p = addAllBtn.querySelector("p")
  p.innerText = "Save Problem"
  discardAllBtn.setAttribute("aria-label", "Discard changes")
  discardAllBtn.setAttribute("title", "Discard changes")
  p = discardAllBtn.querySelector("p")
  p.innerText = "Discard Changes"
  target.setAttribute("aria-label", "Cancel edit")
  target.setAttribute("title", "Cancel edit")
  let q = problems[targetDiff][targetId]
  // locate info and add to DOM
  //add question
  questionTextArea.innerHTML = q.question
  if (
    q.question !== "<p><br></p>" &&
    q.question !== '<p><br data-mce-bogus="1"></p>'
  ) {
    poseQ.classList.replace("not_met", "satisfied")
    i = poseQ.querySelector("i")
    i.classList.replace("fa-times-circle", "fa-check-circle")
    addQBtn.dataset.refId = targetId
    addQBtn.dataset.refDiff = targetDiff
    addQ()
  }
  //set difficulty
  difficultySelect.value = targetDiff
  difficultySelect.dispatchEvent(new Event("pointerup"))
  //add answer
  if (q.choices.answer) {
    correctAnswerTextArea.innerHTML = q.choices.answer
    addAnsBtn.dispatchEvent(new Event("pointerup"))
  }
  //add choices
  let keys = Object.keys(q.choices)
  choices = { ...q.choices }
  for (let key of keys) {
    if (key.startsWith("cid")) {
      choicesTextArea.innerHTML = q.choices[key]
      addChoiceBtn.dataset.refId = key
      addChoiceBtn.dispatchEvent(new Event("pointerup"))
    }
  }
}

// const copyProblem = (e) => {
//   // get id of problem being copied
//   let { target } = e
//   let li = target.parentElement
//   let { id: refId, diff } = li.dataset
//   // locate that problem in the problems object
//   let id
//   let qToCopy = problems[diff][refId]
//   do {
//     id = String(Math.round(Math.random() * 999))
//     if (id.length !== 3) {
//       id = id.padStart(3, "0")
//     }
//   } while (problems[diff][`pid${id}`] !== undefined)
//   problems[diff][`pid${id}`] = {
//     question: qToCopy.question,
//     choices: { ...qToCopy.choices },
//   }
//   addAll(e, { id: `pid${id}`, diff, problem: problems[diff][`pid${id}`] })
// }

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
  let { id: qId, diff: qDiff } = item.dataset
  if (qId === addAllBtn.dataset.refId) {
    addAllBtn.setAttribute("aria-label", "Add all to exercise")
    addAllBtn.setAttribute("title", "Add all to exercise")
    let p = addAllBtn.querySelector("p")
    p.innerText = "Add all"
    discardAllBtn.setAttribute("aria-label", "Discard all")
    discardAllBtn.setAttribute("title", "Discard all")
    p = discardAllBtn.querySelector("p")
    p.innerText = "Discard All"
    delete addAllBtn.dataset.refId
    delete addAllBtn.dataset.refDiff
  }
  delete problems[qDiff][qId]
  item.remove()
}

const discardAll = () => {
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

const uniqueQ = (text) => {
  if (text === "<p><br></p>" || text === '<p><br data-mce-bogus="1"></p>') {
    return false
  }
  let ez = problems.easy
  let s = problems.standard
  let h = problems.hard
  let a = problems.advanced
  let nc = problems.no_choice
  let { refId, refDiff } = addQBtn.dataset
  // check ez
  for (let id in ez) {
    if (ez[id].question === text && refDiff !== "easy" && refId !== id)
      return false
  }

  // check standard
  for (let id in s) {
    if (s[id].question === text && refDiff !== "standard" && refId !== id)
      return false
  }
  // check hard
  for (let id in h) {
    if (h[id].question === text && refDiff !== "hard" && refId !== id)
      return false
  }
  // check advanced
  for (let id in a) {
    if (a[id].question === text && refDiff !== "advanced" && refId !== id)
      return false
  }
  // check no_diff
  for (let id in nc) {
    if (nc[id].question === text && refDiff !== "no_choice" && refId !== id)
      return false
  }
  return true
}

const addQ = () => {
  if (!uniqueQ(questionTextArea.innerHTML)) {
    extraOptions_0.classList.add("not_met")
    let p = extraOptions_0.querySelector("p")
    p.classList.remove("hide")
    setTimeout(() => {
      extraOptions_0.classList.remove("not_met")
      p.classList.add("hide")
    }, 2000)
    delete addQBtn.dataset.refId
    delete addQBtn.dataset.refDiff
    return
  }

  question = questionTextArea.innerHTML
  let questionItem = questionSection.querySelector("li")
  if (!questionItem) {
    questionItem = document.createElement("li")
    let p = document.createElement("p")
    p.innerText = "Question"
    let edit = document.createElement("button")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit question")
    edit.setAttribute("title", "Edit question")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editQ)
    let del = document.createElement("button")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete question")
    del.setAttribute("title", "Delete question")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", deleteQ)
    questionItem.appendChild(p)
    questionItem.appendChild(edit)
    questionItem.appendChild(del)
    questionSection.appendChild(questionItem)
    i = poseQ.querySelector("i")
    questionSection.classList.remove("pop-top")
  } else {
    question = questionTextArea.innerHTML
    questionItem.classList.remove("editing")
    let p = questionItem.querySelector("p")
    p.innerText = "Question"
    questionSection.classList.remove("pop-top")
    addQBtn.setAttribute("aria-label", "Add question")
    addQBtn.setAttribute("title", "Add question")
  }
  let questionIT = questionTextArea.innerText.trim()
  if (
    question !== "<p><br></p>" &&
    question !== '<p><br data-mce-bogus="1"></p>' &&
    questionIT !== "" &&
    questionIT !== "\n"
  ) {
    i.classList.replace("fa-times-circle", "fa-check-circle")
    poseQ.classList.replace("not_met", "satisfied")
  }
  questionSection.classList.remove("hide")
  questionTextAreaDiv.classList.add("hide")
  extraOptions_0.classList.add("hide")
  delete addQBtn.dataset.refId
  delete addQBtn.dataset.refDiff
}

const editQ = (e) => {
  let { target } = e
  let li = target.parentElement
  if (addAllBtn.dataset.refId) {
    addQBtn.dataset.refId = addAllBtn.dataset.refId
    addQBtn.dataset.refDiff = addAllBtn.dataset.refDiff
  }
  let p = li.querySelector("p")
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    p.innerText = "Question"
    target.setAttribute("aria-label", "Edit question")
    target.setAttribute("title", "Edit question")
    questionSection.classList.remove("pop-top")
    questionTextAreaDiv.classList.add("hide")
    extraOptions_0.classList.add("hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Question (editing)"
    target.setAttribute("aria-label", "Cancel edit")
    target.setAttribute("title", "Cancel edit")
    questionTextArea.innerHTML = question
    questionTextAreaDiv.classList.remove("hide")
    addQBtn.setAttribute("aria-label", "Save question")
    addQBtn.setAttribute("title", "Save question")
    discardQBtn.setAttribute("aria-label", "Discard changes")
    discardQBtn.setAttribute("title", "Discard changes")
    questionSection.classList.add("pop-top")
    extraOptions_0.classList.remove("hide")
  }
}

const deleteQ = () => {
  let li = questionSection.querySelector("li")
  if (li) li.remove()
  question = "<p><br></p>"
  questionTextArea.innerHTML = "<p><br></p>"
  questionSection.classList.add("hide")
  questionTextAreaDiv.classList.remove("hide")
  addQBtn.setAttribute("aria-label", "Add question")
  addQBtn.setAttribute("title", "Add question")
  discardQBtn.setAttribute("aria-label", "Discard")
  discardQBtn.setAttribute("title", "Discard")
  extraOptions_0.classList.remove("hide")
  poseQ.classList.replace("satisfied", "not_met")
  i = poseQ.querySelector("i")
  i.classList.replace("fa-check-circle", "fa-times-circle")
  i = pickDifficulty.querySelector("i")
  i.classList.replace("fa-check-circle", "fa-times-circle")
  difficultySelect.value = "no_choice"
  difficultySelect.dispatchEvent(new Event("pointerup"))
}

const discardQ = (e) => {
  let { target } = e
  questionTextArea.innerHTML = "<p><br></p>"
  let li = questionSection.querySelector("li")
  if (li) {
    let edit = li.querySelectorAll("button")[1]
    target.setAttribute("aria-label", "Discard")
    target.setAttribute("title", "Discard")
    edit.setAttribute("aria-label", "Edit question")
    edit.setAttribute("title", "Edit question")
    target.previousElementSibling.setAttribute("aria-label", "Add question")
    target.previousElementSibling.setAttribute("title", "Add question")
    extraOptions_0.classList.add("hide")
    questionTextAreaDiv.classList.add("hide")
    questionSection.classList.remove("hide")
    questionSection.classList.remove("pop-top")
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = "Question"
  }
}

const addAns = (e) => {
  let { refId: ref } = e.target.dataset
  if (!uniqueChoice(correctAnswerTextArea.innerHTML, ref)) {
    extraOptions_1.classList.add("not_met")
    let p = extraOptions_1.querySelector("p")
    p.classList.remove("hide")
    setTimeout(() => {
      extraOptions_1.classList.remove("not_met")
      p.classList.add("hide")
    }, 2000)
    return
  }
  let correctAnswerItem = correctAnswerSection.querySelector("li")
  if (!correctAnswerItem) {
    correctAnswerItem = document.createElement("li")
    choices.answer = correctAnswerTextArea.innerHTML
    let p = document.createElement("p")
    p.innerText = "Answer"
    let edit = document.createElement("button")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit answer")
    edit.setAttribute("title", "Edit answer")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editAns)
    let del = document.createElement("button")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete answer")
    del.setAttribute("title", "Delete answer")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", deleteAns)
    correctAnswerItem.appendChild(p)
    correctAnswerItem.appendChild(edit)
    correctAnswerItem.appendChild(del)
    correctAnswerSection.appendChild(correctAnswerItem)
    i = createCorrectAns.querySelector("i")
    i.classList.replace("fa-times-circle", "fa-check-circle")
    createCorrectAns.classList.replace("not_met", "satisfied")
    correctAnswerSection.classList.remove("hide")
    checkForTen()
    // addAnsBtn.dataset.ansRef = "ans"
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

const editAns = (e) => {
  let { target } = e
  // if (addAllBtn.dataset.refId) {
  //   addAnsBtn.dataset.refId = addAllBtn.dataset.refId
  //   addAnsBtn.dataset.refDiff = addAllBtn.dataset.refDiff
  // }
  let li = target.parentElement
  let p = li.querySelector("p")
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    p.innerText = "Answer"
    correctAnswerSection.classList.remove("pop-top")
    correctAnswerTextAreaDiv.classList.add("hide")
    extraOptions_1.classList.add("hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Answer (editing)"
    correctAnswerTextArea.innerHTML = choices.answer
    target.setAttribute("aria-label", "Cancel edit")
    target.setAttribute("title", "Cancel edit")
    addAnsBtn.setAttribute("aria-label", "Save answer")
    addAnsBtn.setAttribute("title", "Save answer")
    discardAnsBtn.setAttribute("aria-label", "Discard changes")
    discardAnsBtn.setAttribute("title", "Discard changes")
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
    addAnsBtn.setAttribute("aria-label", "Add answer")
    addAnsBtn.setAttribute("title", "Add answer")
    discardAnsBtn.setAttribute("aria-label", "Discard")
    discardAnsBtn.setAttribute("title", "Discard")
    // delete addAnsBtn.dataset.ansRef
  }
  checkForTen()
}

const discardAns = (e) => {
  let { target } = e
  correctAnswerTextArea.innerHTML = "<p><br></p>"
  let li = correctAnswerSection.querySelector("li")
  if (li) {
    let edit = li.querySelectorAll("button")[1]
    edit.setAttribute("aria-label", "Cancel edit")
    edit.setAttribute("title", "Cancel edit")
    target.setAttribute("aria-label", "Discard")
    target.setAttribute("title", "Discard")
    target.previousElementSibling.setAttribute("aria-label", "Add answer")
    target.previousElementSibling.setAttribute("title", "Add answer")
    extraOptions_1.classList.add("hide")
    correctAnswerTextAreaDiv.classList.add("hide")
    correctAnswerSection.classList.remove("hide")
    correctAnswerSection.classList.remove("pop-top")
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = "Answer"
  }
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

const uniqueChoice = (text) => {
  let { refId } = addChoiceBtn.dataset
  if (text === "<p><br></p>" || text === '<p><br data-mce-bogus="1"></p>') {
    return false
  }
  for (let choice in choices) {
    if (choices[choice] === text && choice !== refId) {
      return false
    }
  }
  return true
}

const addChoice = (e) => {
  // try finding a choice (or answer) with the same innerHTML. if found, don't add
  if (!uniqueChoice(choicesTextArea.innerHTML)) {
    extraOptions_2.classList.add("not_met")
    let p = extraOptions_2.querySelector("p")
    p.classList.remove("hide")
    setTimeout(() => {
      extraOptions_2.classList.remove("not_met")
      p.classList.add("hide")
    }, 2000)
    return
  }

  // check for dom el
  let { refId: ref } = e.target.dataset
  let li = questionChoicesSection.querySelector(`[data-id="${ref}"]`)
  if (li) {
    // if dom el exists, update choices obj
    choices[ref] = choicesTextArea.innerHTML
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = `Choice ID: ${ref.substring(3)}`
    addChoiceBtn.setAttribute("aria-label", "Add choice")
    addChoiceBtn.setAttribute("title", "Add choice")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    delete e.target.dataset.refId
    choicesTextArea.innerHTML = "<p><br></p>"

    return
  }
  let id
  // create id or use ref
  if (!ref) {
    do {
      id = String(Math.round(Math.random() * 999))
      if (id.length !== 3) {
        id = id.padStart(3, "0")
      }
    } while (choices[`cid${id}`] !== undefined)
  } else {
    id = ref.substring(3)
    delete e.target.dataset.refId
  }

  //if dom el doesn't exist, create dom el

  choices[`cid${id}`] = choicesTextArea.innerHTML
  let choiceItem = document.createElement("li")
  let p = document.createElement("p")
  choiceItem.dataset.id = `cid${id}`
  p.innerText = `Choice ID: ${id}`
  let edit = document.createElement("button")
  edit.setAttribute("role", "button")
  edit.setAttribute("aria-label", "Edit choice")
  edit.setAttribute("title", "Edit choice")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editChoice)
  // let copy = document.createElement("button")
  // copy.setAttribute("role", "button")
  // copy.setAttribute("aria-label", "Duplicate choice")
  // copy.setAttribute("title", "Duplicate choice")
  // copy.innerHTML = '<i class="fas fa-copy"></i>'
  // copy.addEventListener("pointerup", copyChoice)
  let del = document.createElement("button")
  del.setAttribute("role", "button")
  del.setAttribute("aria-label", "Delete choice")
  del.setAttribute("title", "Delete choice")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", deleteChoice)
  choiceItem.appendChild(p)
  choiceItem.appendChild(edit)
  // choiceItem.appendChild(copy)
  choiceItem.appendChild(del)
  questionChoicesSection.appendChild(choiceItem)
  questionChoicesSection.classList.remove("hide")
  checkForTen()
  choicesTextArea.innerHTML = "<p><br></p>"
}

const editChoice = (e) => {
  let btn = e.target
  let target = btn.parentElement
  let { id: itemID } = target.dataset
  let li = questionChoicesSection.querySelector("li.editing")
  if (li && li !== target) {
    li.classList.remove("editing")
    let p = li.querySelector("p")
    let { id } = li.dataset
    p.innerText = `Choice ID: ${id.substring(3)}`
  } else if (li && li === target) {
    li.classList.remove("editing")
    li.classList.remove("editing")
    btn.setAttribute("aria-label", "Edit choice")
    btn.setAttribute("title", "Edit choice")
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
    let p = li.querySelector("p")
    let { id } = li.dataset
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
  addChoiceBtn.setAttribute("aria-label", "Save changes")
  addChoiceBtn.setAttribute("title", "Save changes")
  discardChoiceBtn.setAttribute("aria-label", "Discard changes")
  discardChoiceBtn.setAttribute("title", "Discard changes")
}

// const copyChoice = (e) => {
//   console.log("copying choice")
// }

const deleteChoice = (e) => {
  let item = e.target.parentElement
  let { id: itemID } = item.dataset
  if (itemID === addChoiceBtn.dataset.refId) {
    delete addChoiceBtn.dataset.refId
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    discardChoiceBtn.setAttribute("title", "Discard")
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
  let { refId } = addChoiceBtn.dataset
  if (refId) {
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    discardChoiceBtn.setAttribute("title", "Discard")
    let li = questionChoicesSection.querySelector(`[data-id="${refId}"]`)
    li.classList.remove("editing")
    let edit = li.querySelector('[aria-label="Cancel edit"]')
    edit.setAttribute("aria-label", "Edit choice")
    edit.setAttribute("title", "Edit choice")
    let p = li.querySelector("p")
    p.innerText = `Choice ID: ${refId.substring(3)}`
    delete addChoiceBtn.dataset.refId
  }
}
const deleteChoices = () => {
  let choicesList = questionChoicesSection.querySelectorAll("li")
  for (let choice of choicesList) {
    delete choices[choice.dataset.id]
    choice.remove()
  }
  if (addChoiceBtn.dataset.refId) delete addChoiceBtn.dataset.refId
  questionChoicesSection.classList.add("hide")
  choicesTextArea.innerHTML = "<p><br></p>"
}

const checkList = (e) => {
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
  difficultySelect.addEventListener("pointerup", checkList)
  difficultySelect.addEventListener("click", checkList) // for moz
  difficultySelect.addEventListener("keyup", checkList)
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

window.addEventListener("load", init)
overlayCloseBtn.addEventListener("pointerup", closeOverlay)
addAllBtn.addEventListener("pointerup", addAll)
discardAllBtn.addEventListener("pointerup", discardAll)
addQBtn.addEventListener("pointerup", addQ)
discardQBtn.addEventListener("pointerup", discardQ)
addAnsBtn.addEventListener("pointerup", addAns)
discardAnsBtn.addEventListener("pointerup", discardAns)
addChoiceBtn.addEventListener("pointerup", addChoice)
discardChoiceBtn.addEventListener("pointerup", discardChoice)
draftBtn.addEventListener("pointerup", draftExercise)
//remove styles on publishBtn when the reqs are met and then add the event listener
// remove event listener if the reqs are no longer being met
