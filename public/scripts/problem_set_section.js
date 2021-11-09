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
let overlayContent = overlay.querySelector(".overlay___content")
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
  let satisfied = true
  for (let req of publishQuestionReqs) {
    if (req.classList.contains("not_met")) {
      satisfied = false
      break
    }
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
  p.innerText = `Problem ID: ${id}`
  let prev = document.createElement("button")
  setAttr(prev, "aria", "Preview problem")
  prev.innerHTML = '<i class="fas fa-eye"></i>'
  //   prev.addEventListener("pointerup", prevProblem)
  let edit = document.createElement("button")
  setAttr(edit, "aria", "Edit problem")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editProblem)
  let del = document.createElement("button")
  setAttr(del, "aria", "Delete problem")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  //   del.addEventListener("pointerup", delProblem)
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
  if (question !== "<p><br></p>") {
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
  p = addAllBtn.querySelector("p")
  p.innerText = "Add All"
  p = dA1.querySelector("p")
  p.innerText = "Discard All"
  setAttr(addAllBtn, "aria", "Add all to exercise")
  setAttr(dA1, "aria", "Discard all")
  delete addAllBtn.dataset.refId
  delete addAllBtn.dataset.refDiff
  discardAll()
}

//create
const addAll = (e) => {
  //check is there's even anything to add first,
  // if all fields are empty and the difficulty is no_choice, don't add
  const { refId } = e.target.dataset //for later
  if (refId) {
    // we're in the middle of updating a problem that is being edited
  } else {
    createProblemItem(qDiff)
    sideScroll(dA1, dA2)
    discardAll()
    // we're not updating anything and need to create/append a new dom element
  }
}

//read

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
  //   discardQBtn.dispatchEvent(new Event("pointerup"))  //looks like i don't need this
  discardChoice()
  deleteChoices()
  deleteAns()
  //   discardAnsBtn.dispatchEvent(new Event("pointerup")) //or this
}

addAllBtn.addEventListener("pointerup", addAll)
discardAllSlider.addEventListener("pointerup", confirmDiscardAll)
listTogglers.forEach((toggler) =>
  toggler.addEventListener("pointerup", toggleList)
)
// overlayCloseBtn.addEventListener("pointerup", closeOverlay)
