const backToTop = document.getElementById("top")
const addAllBtn = document.getElementById("add_all")
const discardAllSlider = document.getElementById("discard_all_slider")
const dA1 = document.getElementById("d_a1")
const dA2 = document.getElementById("d_a2")
const dA2p = dA2.querySelector("p")
const discardBackBtn = document.getElementById("discard_btn_back")
const discardConf = document.getElementById("discard_confirm")
const discardAllBtn = document.getElementById("discard_all")
const problemSet = document.getElementById("problem_set")
const listTogglers = problemSet.querySelectorAll(".header button")
const easyProblemsSection = document.getElementById("easy_problems")
const standardProblemsSection = document.getElementById("standard_problems")
const hardProblemsSection = document.getElementById("hard_problems")
const advancedProblemsSection = document.getElementById("advanced_problems")
const noDiffProblemsSection = document.getElementById("no_difficulty_problems")
const noProblemsYet = document.getElementById("no_problems_yet")
const fiveEZ = document.getElementById("five_easy")
const fiveStnd = document.getElementById("five_standard")
const fiveHard = document.getElementById("five_hard")
const fiveAdv = document.getElementById("five_advanced")
const allMeetReqs = document.getElementById("all_meet_reqs")
const publishQuestionReqs = document.querySelector(".to_publish_reqs.q")
const overlay = document.querySelector(".overlay")
const overlayCloseBtn = overlay.querySelector(".close")
let overlayHeader = overlay.querySelector("h3")
let overlayQ = overlay.querySelector(".overlay___q")
let overlayChoices = overlay.querySelector(".choices")
let overlayBtn = overlay.querySelector("button")
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
  if (list.classList.contains("invis")) {
    list.classList.remove("invis")
  } else {
    list.classList.add("invis")
  }
}

const checkForFiveQs = (diff) => {
  let item
  switch (diff) {
    case "easy":
      item = fiveEZ
      break
    case "standard":
      item = fiveStnd
      break
    case "hard":
      item = fiveHard
      break
    case "advanced":
      item = fiveAdv
      break
    default:
      break
  }

  if (
    Object.keys(problems[diff]).length >= 5 &&
    item.classList.contains("not_met")
  ) {
    checkList(item, "check")
  } else if (
    Object.keys(problems[diff]).length < 5 &&
    item.classList.contains("satisfied")
  ) {
    checkList(item, "uncheck")
  }
  checkReqs()
}

const checkAllMeet = () => {
  let unsatisfied = problemSet.querySelector('[data-satisfied="false"]')
  let aProb = problemSet.querySelector("li")
  if (unsatisfied && allMeetReqs.classList.contains("satisfied")) {
    checkList(allMeetReqs, "uncheck")
  } else if (
    !unsatisfied &&
    aProb &&
    allMeetReqs.classList.contains("not_met")
  ) {
    checkList(allMeetReqs, "check")
  }
  checkReqs()
}

const checkQuestionReqs = () => {
  let unsatisfied = publishQuestionReqs.querySelector(".not_met")
  if (unsatisfied) {
    return false
  }
  return true
}

const createProblemItem = (diff, id = null, satisfied = null) => {
  // id will not be null when we're fetching this data from the db and have to
  // recreate these items
  if (id === null) {
    do {
      id = String(Math.round(Math.random() * 999))
      if (id.length !== 3) {
        id = id.padStart(3, "0")
      }
    } while (problems[diff][`pid${id}`] !== undefined)
    problems[diff][`pid${id}`] = { question, choices: { ...choices } }
    usedPIDs.push(id)
  }
  let problemItem = document.createElement("li")
  let piFront = document.createElement("div")
  let piBack = document.createElement("div")
  let backBtn = document.createElement("button")
  let input = document.createElement("input")
  let confBtn = document.createElement("button")
  piFront.setAttribute("class", "piFront")
  piBack.setAttribute("class", "piBack")
  backBtn.setAttribute("name", "back")
  input.setAttribute("placeholder", 'Type "yes"')
  confBtn.setAttribute("name", "confirm")
  backBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'
  setAria(backBtn, "Cancel")
  confBtn.innerText = "Confirm"
  let icon = document.createElement("span")
  if (satisfied === null) {
    if (checkQuestionReqs()) {
      satisfied = true
    } else {
      satisfied = false
    }
    problems[diff][`pid${id}`].satisfied = satisfied
  }
  if (satisfied) {
    problemItem.classList.add("satisfied")
    icon.innerHTML = '<i class="fas fa-check-circle"></i>'
  } else {
    problemItem.classList.add("not_met")
    icon.innerHTML = '<i class="fas fa-times-circle"></i>'
  }

  let p = document.createElement("p")
  problemItem.dataset.pid = id
  problemItem.dataset.diff = diff
  problemItem.dataset.satisfied = satisfied
  p.innerText = `PID: ${id}`
  let prev = document.createElement("button")
  setAria(prev, "Preview problem")
  prev.innerHTML = '<i class="fas fa-eye"></i>'
  prev.addEventListener("pointerup", prevProblem)
  let edit = document.createElement("button")
  setAria(edit, "Edit problem")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editProblem)
  let del = document.createElement("button")
  setAria(del, "Delete problem")
  del.setAttribute("name", "del")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", delProblem)
  backBtn.addEventListener("pointerup", delProblem)
  confBtn.addEventListener("pointerup", delProblem)
  input.addEventListener("keyup", delProblem)
  piFront.appendChild(icon)
  piFront.appendChild(p)
  piFront.appendChild(prev)
  piFront.appendChild(edit)
  piFront.appendChild(del)
  piBack.appendChild(backBtn)
  piBack.appendChild(input)
  piBack.appendChild(confBtn)
  problemItem.appendChild(piFront)
  problemItem.appendChild(piBack)
  appendThisToThat(problemItem, diff)
  checkAllMeet()
}

const unhideSection = (section) => {
  if (section.classList.contains("invis")) {
    section.classList.remove("invis")
  }
  if (section.parentElement.classList.contains("invis"))
    section.parentElement.classList.remove("invis")
}

const appendThisToThat = (el, diff) => {
  if (!noProblemsYet.classList.contains("invis")) {
    noProblemsYet.classList.add("invis")
  }
  switch (diff) {
    case "easy":
      easyProblemsSection.appendChild(el)
      unhideSection(easyProblemsSection)
      checkForFiveQs(diff)
      break
    case "standard":
      standardProblemsSection.appendChild(el)
      unhideSection(standardProblemsSection)
      checkForFiveQs(diff)
      break
    case "hard":
      hardProblemsSection.appendChild(el)
      unhideSection(hardProblemsSection)
      checkForFiveQs(diff)
      break
    case "advanced":
      advancedProblemsSection.appendChild(el)
      unhideSection(advancedProblemsSection)
      checkForFiveQs(diff)
      break
    default:
      noDiffProblemsSection.appendChild(el)
      unhideSection(noDiffProblemsSection)
      break
  }
}

const sideScroll = (vis, hidden) => {
  vis.scrollIntoView({ block: "nearest", inline: "nearest" })
  hidden.dataset.hidden = true
  delete vis.dataset.hidden
  if (vis === dA1) {
    discardConf.value = ""
  }
}

const reset__AllBtns = () => {
  let p = addAllBtn.querySelector("p")
  p.innerText = "Add All"
  p = dA1.querySelector("p")
  p.innerText = "Discard All"
  setAria(addAllBtn, "Add all to exercise")
  setAria(dA1, "Discard all")
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
  p.innerText = `PID: ${pid} (editing)`
  if (question !== "") {
    checkList(poseQItem, "check")
    hideOrShowThisTextArea("qTA", "hide")
    createQItem()
  }
  if (qDiff !== "no_choice") {
    setDiff(qDiff)
    checkList(selectDiffItem, "check")
  }
  if (choices.answer) {
    checkList(createCorrectAns, "check")
    hideOrShowThisTextArea("aTA", "hide")
    createAnsItem()
  }
  for (let choice in choices) {
    if (choice !== "answer") {
      createChoiceItem(choice.substring(3))
    }
  }
  checkForFive()
  checkReqs()
  let editBtn = problemItem.querySelectorAll("button")[1]
  addAllBtn.dataset.refId = pid
  addAllBtn.dataset.refDiff = diff
  p = addAllBtn.querySelector("p")
  p.innerText = "Save Changes"
  p = discardAllSlider.querySelector("p")
  p.innerText = "Discard changes"
  setAria(editBtn, "Cancel edit")
  setAria(addAllBtn, "Save changes")
  setAria(dA1, "Discard changes")
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
  p.innerText = `PID: ${pid}`
  let editBtn = problemItem.querySelectorAll("button")[1]
  setAria(editBtn, "Edit problem")
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
    deleteProblemItem(problemItem)
    appendThisToThat(problemItem, diff)
  }
  problems[diff][`pid${pid}`].question = question
  problems[diff][`pid${pid}`].choices = { ...choices }
  if (checkQuestionReqs()) {
    problemItem.dataset.satisfied = "true"
    if (icon.classList.contains("fa-times-circle")) {
      icon.classList.replace("fa-times-circle", "fa-check-circle")
    }
    problems[diff][`pid${pid}`].satisfied = true
  } else {
    problemItem.dataset.satisfied = "false"
    if (icon.classList.contains("fa-check-circle")) {
      icon.classList.replace("fa-check-circle", "fa-times-circle")
    }
    problems[diff][`pid${pid}`].satisfied = false
  }
  checkAllMeet()
  editCancel(problemItem)
}

const selectThis = (e) => {
  let _class = ""
  if (overlayBtn.classList.contains("not_met")) {
    _class = "selected_n"
  } else {
    _class = "selected_s"
  }
  document.activeElement.blur()

  let { target } = e
  if (target.classList.contains(_class)) {
    target.classList.remove(_class)
  } else {
    let selected = overlayChoices.querySelector(`button.${_class}`)
    if (selected) {
      selected.classList.remove(_class)
    }
    target.classList.add(_class)
  }
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
  let count = 5
  if (cs.answer) {
    pickedCs.push(cs.answer)
    keys.splice(keys.indexOf("answer"), 1)
    count = 4
  }
  keys = shuffle(keys)
  while (count > 0) {
    pickedCs.push(cs[keys.shift()])
    count--
  }
  return shuffle(pickedCs)
}

const addToGrid = (cs) => {
  let ltrs = ["A", "B", "C", "D", "E"]
  cs.forEach((c) => {
    // c = c.substring(3, c.length - 4)
    let btn = document.createElement("button")
    btn.setAttribute("class", "choice")
    btn.addEventListener("pointerup", selectThis)
    let p = document.createElement("p")
    let input = document.createElement("input")
    let span = document.createElement("span")
    span.innerText = ltrs.shift()
    input.setAttribute("type", "checkbox")
    p.innerHTML = c
    btn.appendChild(input)
    btn.appendChild(span)
    btn.appendChild(p)
    overlayChoices.appendChild(btn)
  })
}

//create
const addAllProblems = () => {
  const { easy, standard, hard, advanced, no_choice } = problems
  for (let p in easy) {
    createProblemItem("easy", p.substring(3), easy[p].satisfied)
  }
  checkForFiveQs("easy")
  for (let p in standard) {
    createProblemItem("standard", p.substring(3), standard[p].satisfied)
  }
  checkForFiveQs("standard")
  for (let p in hard) {
    createProblemItem("hard", p.substring(3), hard[p].satisfied)
  }
  checkForFiveQs("hard")
  for (let p in advanced) {
    createProblemItem("advanced", p.substring(3), advanced[p].satisfied)
  }
  checkForFiveQs("advanced")
  for (let p in no_choice) {
    createProblemItem("no_choice", p.substring(3), no_choice[p].satisfied)
  }
  checkAllMeet()
}

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
    // we're in the middle of updating a problem that is being edited
  } else {
    createProblemItem(qDiff)
    sideScroll(dA1, dA2)
    discardAll()
    // we're not updating anything and need to create/append a new dom element
  }
  allowSave(true)
}

//read
const prevProblem = (e) => {
  // this looks gross, write more helper functions
  const { target } = e
  const problemItem = target.parentElement.parentElement
  const { pid, diff, satisfied } = problemItem.dataset
  let p = `PID: ${pid}`
  let q = problems[diff][`pid${pid}`].question
  let cs = { ...problems[diff][`pid${pid}`].choices }

  overlayHeader.innerText = p
  if (satisfied === "true") {
    if (overlayHeader.classList.contains("not_met")) {
      overlayHeader.classList.replace("not_met", "satisfied")
      overlayBtn.classList.replace("not_met", "satisfied")
    }
  } else {
    if (overlayHeader.classList.contains("satisfied")) {
      overlayHeader.classList.replace("satisfied", "not_met")
      overlayBtn.classList.replace("satisfied", "not_met")
    }
  }
  if (!q) {
    q = "[no question]"
  }
  overlayQ.innerHTML = q
  let pickedCs = pick5(cs)
  addToGrid(pickedCs)
  overlay.classList.remove("invis")
  overlayBtn.classList.remove("hide")
}

const closeOverlay = () => {
  overlayHeader.innerText = ""
  overlayQ.innerHTML = ""
  let btns = overlayChoices.querySelectorAll("button")
  btns.forEach((btn) => {
    btn.remove()
  })
  overlay.classList.add("invis")
  overlayBtn.classList.add("hide")
}

//update
const editProblem = (e) => {
  document.activeElement.blur()
  const { target } = e
  let problemItem = target.parentElement.parentElement
  let editingItem = problemSet.querySelector("li.editing")
  const { pid, diff } = problemItem.dataset
  if (!editingItem) {
    editThisOne(problemItem, diff, pid)
  } else if (editingItem.dataset.pid === pid) {
    allowSave(true)
    editCancel(problemItem)
  } else {
    allowSave(true)
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
      setTimeout(() => {
        discardConf.focus()
      }, 200)
      break
    case discardBackBtn:
      sideScroll(dA1, dA2)
      break
    case discardAllBtn:
      document.activeElement.blur()
      if (discardConf.value !== "yes") {
        discardConf.classList.add("flash")
        setTimeout(() => {
          discardConf.classList.remove("flash")
          discardConf.focus()
        }, 600)
        return
      } else {
        let editingItem = problemSet.querySelector("li.editing")
        if (editingItem) editCancel(editingItem)
        discardAll()
        sideScroll(dA1, dA2)
      }
    default:
      if (e.type === "keyup" && e.code === "Enter") {
        discardAllBtn.dispatchEvent(new Event("pointerup"))
      }
      break
  }
}

const discardAll = () => {
  document.activeElement.blur()
  deleteQItem()
  discardChoice()
  deleteChoices()
  deleteAnsItem()
}

const deleteProblemItem = (problemItem) => {
  let list = problemItem.parentElement
  problemItem.remove()
  otherProblemItem = list.querySelector("li")
  if (!otherProblemItem) {
    let section = list.parentElement
    section.classList.add("invis")
    if (!problemSet.querySelector("li")) {
      noProblemsYet.classList.remove("invis")
      checkList(allMeetReqs, "uncheck")
      checkReqs()
    }
  }
}

const delProblem = (e) => {
  const { target } = e
  const { name } = target
  const { parentElement: problemItem } = target.parentElement
  const back = problemItem.lastChild
  switch (name) {
    case "del":
      const i = back.querySelector("input")
      back.classList.add("grow")
      setTimeout(() => {
        i.focus()
      }, 200)
      break
    case "back":
      back.classList.remove("grow")
      document.activeElement.blur()
      break
    case "confirm":
      const input = back.querySelector("input")
      if (input.value === "yes") {
        const { pid, diff } = problemItem.dataset
        if (problemItem.classList.contains("editing")) {
          discardAll()
          reset__AllBtns()
        }
        delete problems[diff][`pid${pid}`]
        usedPIDs.splice(usedPIDs.indexOf(pid), 1)
        deleteProblemItem(problemItem)
        if (diff !== "no_choice") {
          checkForFiveQs(diff)
        }
        checkAllMeet()
        allowSave(true)
      } else {
        input.classList.add("flash")
        setTimeout(() => {
          input.classList.remove("flash")
          input.focus()
        }, 600)
      }
      document.activeElement.blur()
      break
    default:
      if (e.type === "keyup" && e.code === "Enter")
        target.nextElementSibling.dispatchEvent(new Event("pointerup"))
      break
  }
}

addAllBtn.addEventListener("pointerup", addAll)
dA1.addEventListener("pointerup", confirmDiscardAll)
discardBackBtn.addEventListener("pointerup", confirmDiscardAll)
discardAllBtn.addEventListener("pointerup", confirmDiscardAll)
discardConf.addEventListener("keyup", confirmDiscardAll)
listTogglers.forEach((toggler) =>
  toggler.addEventListener("pointerup", toggleList)
)
overlayCloseBtn.addEventListener("pointerup", closeOverlay)
