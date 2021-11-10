const backToTop = document.querySelector("#top")
const addAllBtn = document.querySelector("#add_all")
const discardAllSlider = document.querySelector("#discard_all_slider")
const dA1 = discardAllSlider.querySelector("#d_a1")
const dA2 = discardAllSlider.querySelector("#d_a2")
const dA2p = dA2.querySelector("p")
const discardBackBtn = discardAllSlider.querySelector("#discard_btn_back")
const discardConf = discardAllSlider.querySelector("#discard_confirm")
const discardAllBtn = document.querySelector("#discard_all")
const problemSet = document.querySelector(".problem_set")
const listTogglers = problemSet.querySelectorAll(".header button")
const easyProblemsSection = document.querySelector("#easy_problems ul")
const standardProblemsSection = document.querySelector("#standard_problems ul")
const hardProblemsSection = document.querySelector("#hard_problems ul")
const advancedProblemsSection = document.querySelector("#advanced_problems ul")
const noDiffProblemsSection = document.querySelector(
  "#no_difficulty_problems ul"
)
const noProblemsYet = document.querySelector(".no_problems_yet")
const thirtyEZ = document.querySelector("#thirty_easy")
const thirtyStandard = document.querySelector("#thirty_standard")
const twentyHard = document.querySelector("#twenty_hard")
const twentyAdv = document.querySelector("#twenty_advanced")
const allMeetReqs = document.querySelector("#all_meet_reqs")
const overlay = document.querySelector(".overlay")
const overlayCloseBtn = overlay.querySelector(".close")
let overlayHeader = overlay.querySelector("h3")
let overlayQ = overlay.querySelector(".overlay___body p")
let overlayForm = overlay.querySelector("form")
let usedPIDs = []
let problems = {
  easy: {},
  standard: {},
  hard: {},
  advanced: {},
  no_choice: {},
}

//util
const toggleList = (e) => {
  document.activeElement.blur()
  const { target } = e
  let list = target.parentElement.nextElementSibling
  if (list.classList.contains("hide")) {
    list.classList.remove("hide")
  } else {
    list.classList.add("hide")
  }
}

const checkReqs = () => {
  for (let req of publishQuestionReqs) {
    if (req.classList.contains("not_met")) {
      return false
    }
  }
  return true
}

const createProblemItem = (diff, id = null) => {
  // id will not be null when we're fetching this data from the db and have to
  // recreate these items
  if (!id) {
    do {
      id = String(Math.round(Math.random() * 999))
      if (id.length !== 3) {
        id = id.padStart(3, "0")
      }
      if (!usedPIDs.includes(id)) {
        usedPIDs.push(id)
      }
    } while (problems[diff][`pid${id}`] !== undefined)
    problems[diff][`pid${id}`] = { question, choices: { ...choices } }
    usedPIDs.push(id)
  }
  let problemItem = document.createElement("li")
  let icon = document.createElement("span")
  let satisfied
  if (checkReqs()) {
    problemItem.classList.add("satisfied")
    icon.innerHTML = '<i class="fas fa-check-circle"></i>'
    satisfied = true
  } else {
    problemItem.classList.add("not_met")
    icon.innerHTML = '<i class="fas fa-times-circle"></i>'
    satisfied = false
  }
  let p = document.createElement("p")
  problemItem.dataset.pid = id
  problemItem.dataset.diff = diff
  problemItem.dataset.satisfied = satisfied
  p.innerText = `Problem ID: ${id}`
  let prev = document.createElement("button")
  setAttr(prev, "aria", "Preview problem")
  prev.innerHTML = '<i class="fas fa-eye"></i>'
  prev.addEventListener("pointerup", prevProblem)
  let edit = document.createElement("button")
  setAttr(edit, "aria", "Edit problem")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editProblem)
  let del = document.createElement("button")
  setAttr(del, "aria", "Delete problem")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", delProblem)
  problemItem.appendChild(icon)
  problemItem.appendChild(p)
  problemItem.appendChild(prev)
  problemItem.appendChild(edit)
  problemItem.appendChild(del)
  appendThisToThat(problemItem, diff)
}

const unhideSection = (section) => {
  if (section.classList.contains("hide")) {
    section.classList.remove("hide")
  }
  if (section.parentElement.classList.contains("hide"))
    section.parentElement.classList.remove("hide")
}

const appendThisToThat = (el, diff) => {
  if (!noProblemsYet.classList.contains("hide")) {
    noProblemsYet.classList.add("hide")
  }
  switch (diff) {
    case "easy":
      easyProblemsSection.appendChild(el)
      unhideSection(easyProblemsSection)
      break
    case "standard":
      standardProblemsSection.appendChild(el)
      unhideSection(standardProblemsSection)
      break
    case "hard":
      hardProblemsSection.appendChild(el)
      unhideSection(hardProblemsSection)
      break
    case "advanced":
      advancedProblemsSection.appendChild(el)
      unhideSection(advancedProblemsSection)
      break
    default:
      noDiffProblemsSection
        .appendChild(el)
        .parentElement.classList.remove("hide")
      unhideSection(noDiffProblemsSection)
      break
  }
}

const sideScroll = (vis, hidden) => {
  // lil weird in moz when dA1 isn't scrolled into view during onload
  if (vis.dataset.hidden === "true") {
    vis.scrollIntoView({ block: "nearest", inline: "nearest" })
    hidden.dataset.hidden = true
    delete vis.dataset.hidden
  }
  if (vis === dA1) {
    discardConf.value = ""
  }
}

const reset__AllBtns = () => {
  let p = addAllBtn.querySelector("p")
  p.innerText = "Add All"
  p = dA1.querySelector("p")
  p.innerText = "Discard All"
  setAttr(addAllBtn, "aria", "Add all to exercise")
  setAttr(dA1, "aria", "Discard all")
  delete addAllBtn.dataset.refId
  delete addAllBtn.dataset.refDiff
}

const editThisOne = (problemItem, diff, pid) => {
  question = problems[diff][`pid${pid}`].question
  choices = { ...problems[diff][`pid${pid}`].choices }
  qDiff = diff
  if (problemItem.classList.contains("not_met")) {
    problemItem.classList.replace("not_met", "editing")
  } else {
    problemItem.classList.replace("satisfied", "editing")
  }
  let p = problemItem.querySelector("p")
  p.innerText = `Problem ID: ${pid} (editing)`
  if (question !== "<p></p>") {
    checkList(poseQItem, "check")
    hideOrShowThisTextArea("questionTextArea", "hide")
    createQItem()
  }
  if (qDiff !== "no_choice") {
    setDiff(qDiff)
    checkList(selectDiffItem, "check")
  }
  if (choices.answer) {
    checkList(createCorrectAns, "check")
    hideOrShowThisTextArea("correctAnswerTextArea", "hide")
    createAnsItem()
  }
  for (let choice in choices) {
    if (choice !== "answer") {
      createChoiceItem(choice.substring(3))
    }
  }
  checkForTen()
  let editBtn = problemItem.querySelectorAll("button")[1]
  addAllBtn.dataset.refId = pid
  addAllBtn.dataset.refDiff = diff
  p = addAllBtn.querySelector("p")
  p.innerText = "Save Changes"
  p = discardAllSlider.querySelector("p")
  p.innerText = "Discard changes"
  setAttr(editBtn, "aria", "Cancel edit")
  setAttr(addAllBtn, "aria", "Save changes")
  setAttr(dA1, "aria", "Discard changes")
}

const editCancel = (problemItem) => {
  let { pid, satisfied } = problemItem.dataset
  switch (satisfied) {
    case "true":
      problemItem.classList.replace("editing", "satisfied")
      break
    case "false":
      problemItem.classList.replace("editing", "not_met")
      break
    default:
      break
  }
  let p = problemItem.querySelector("p")
  p.innerText = `Problem ID: ${pid}`
  let editBtn = problemItem.querySelectorAll("button")[1]
  setAttr(editBtn, "aria", "Edit problem")
  reset__AllBtns()
  discardAll()
}

const updateProblem = (pid, diff, newDiff = null) => {
  let problemItem = problemSet.querySelector(`[data-pid="${pid}"]`)
  let icon = problemItem.querySelector("i")
  if (newDiff) {
    problemToMove = { ...problems[diff][`pid${pid}`] } // copy it
    delete problems[diff][`pid${pid}`] // delete it
    problems[newDiff][`pid${pid}`] = problemToMove // move it
    diff = newDiff //update the diff
    problemItem.dataset.diff = diff //update the diff property
  }
  problems[diff][`pid${pid}`].question = question
  problems[diff][`pid${pid}`].choices = { ...choices }
  deleteProblemItem(problemItem)
  appendThisToThat(problemItem, diff)
  if (checkReqs()) {
    problemItem.dataset.satisfied = "true"
    if (icon.classList.contains("fa-times-circle")) {
      icon.classList.replace("fa-times-circle", "fa-check-circle")
    }
  } else {
    problemItem.dataset.satisfied = "false"
    if (icon.classList.contains("fa-check-circle")) {
      icon.classList.replace("fa-check-circle", "fa-times-circle")
    }
  }
  editCancel(problemItem)
}

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const pick5 = (cs) => {
  let pickedCs = []
  let keys = Object.keys(cs)
  if (keys.length <= 5) {
    pickedCs = keys.map((key) => cs[key])
    return shuffle(pickedCs)
  }

  let count = 0
  pickedCs.push(cs.answer)
  while (count < 4) {
    let rnd = Math.floor(Math.random() * (keys.length - 1))
  }

  return shuffle(pickedCs)
}

const addToForm = (cs) => {
  console.log(cs)
  cs.forEach((c) => {
    c = c.substring(3, c.length - 4)
    let label = document.createElement("label")
    let input = document.createElement("input")
    let p = document.createElement("p")
    input.setAttribute("type", "radio")
    input.setAttribute("name", "option")
    p.innerHTML = c
    label.appendChild(input)
    label.appendChild(p)
    overlayForm.appendChild(label)
  })
}

//create
const addAll = (e) => {
  const { refId, refDiff } = e.target.dataset
  if (refId) {
    switch (refDiff === difficultySelect.value) {
      case true:
        updateProblem(refId, refDiff)
        break
      case false:
        updateProblem(refId, refDiff, difficultySelect.value)
        break
      default:
        break
    }
    console.log("updating a problem")
    // we're in the middle of updating a problem that is being edited
  } else {
    createProblemItem(qDiff)
    sideScroll(dA1, dA2)
    discardAll()
    // we're not updating anything and need to create/append a new dom element
  }
}

//read
const prevProblem = (e) => {
  // this looks gross, write more helper functions
  const { target } = e
  const problemItem = target.parentElement
  const { pid, diff, satisfied } = problemItem.dataset
  let p = problemItem.querySelector("p").innerText
  let q = problems[diff][`pid${pid}`].question
  let cs = { ...problems[diff][`pid${pid}`].choices }

  if (p.endsWith("(editing)")) {
    p = p.substring(0, p.length - 10)
  }
  overlayHeader.innerText = p
  if (satisfied === "true") {
    overlayHeader.classList.add("satisfied")
  } else {
    overlayHeader.classList.add("not_met")
  }
  q = q.substring(3, q.length - 4)
  if (!q) {
    q = "[No question]"
  }
  overlayQ.innerHTML = q

  let pickedCs = pick5(cs)
  addToForm(pickedCs)
  overlay.classList.remove("hide")
}

const closeOverlay = () => {
  overlayHeader.innerText = ""
  overlayQ.innerHTML = ""
  let labels = overlayForm.querySelectorAll("label")
  labels.forEach((label) => {
    label.remove()
  })
  overlay.classList.add("hide")
}

//update
const editProblem = (e) => {
  document.activeElement.blur()
  let problemItem = e.target.parentElement
  let editingItem = problemSet.querySelector("li.editing")
  const { pid, diff } = problemItem.dataset
  if (!editingItem) {
    editThisOne(problemItem, diff, pid)
  } else if (editingItem.dataset.pid === pid) {
    editCancel(problemItem)
  } else {
    editCancel(editingItem)
    editThisOne(problemItem, diff, pid)
  }
}

//delete
const confirmDiscardAll = (e) => {
  switch (e.target) {
    case dA1:
      document.activeElement.blur()
      sideScroll(dA2, dA1)
      break
    case discardBackBtn:
      sideScroll(dA1, dA2)
      break
    case discardAllBtn:
      document.activeElement.blur()
      if (discardConf.value !== "yes") {
        dA2p.classList.add("flash")
        setTimeout(() => {
          dA2p.classList.remove("flash")
        }, 600)
        return
      } else {
        let editingItem = problemSet.querySelector("li.editing")
        if (editingItem) editCancel(editingItem)
        discardAll()
        sideScroll(dA1, dA2)
      }
    default:
      break
  }
}

const discardAll = () => {
  document.activeElement.blur()
  deleteQ()
  discardChoice()
  deleteChoices()
  deleteAns()
}

const deleteProblemItem = (problemItem) => {
  let list = problemItem.parentElement
  problemItem.remove()
  otherProblemItem = list.querySelector("li")
  if (!otherProblemItem) {
    let section = list.parentElement
    section.classList.add("hide")
    if (!problemSet.querySelector("li")) {
      noProblemsYet.classList.remove("hide")
    }
  }

  // this deletes the dom element and will handle hiding/showing sections
}

const delProblem = (e) => {
  const { target } = e
  const problemItem = target.parentElement
  const { pid, diff } = problemItem.dataset
  if (problemItem.classList.contains("editing")) {
    discardAll()
    reset__AllBtns()
  }
  delete problems[diff][`pid${pid}`] // delete it
  deleteProblemItem(problemItem)
}

addAllBtn.addEventListener("pointerup", addAll)
discardAllSlider.addEventListener("pointerup", confirmDiscardAll)
listTogglers.forEach((toggler) =>
  toggler.addEventListener("pointerup", toggleList)
)
overlayCloseBtn.addEventListener("pointerup", closeOverlay)
