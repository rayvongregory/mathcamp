const problemSet = document.querySelector(".problem_set")
const easyProblemsSection = document.querySelector("#easy_problems")
const standardProblemsSection = document.querySelector("#standard_problems")
const hardProblemsSection = document.querySelector("#hard_problems")
const advancedProblemsSection = document.querySelector("#advanced_problems")
const noDiffProblemsSection = document.querySelector("#no_difficulty_problems")
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
let problems = {
  easy: {},
  standard: {},
  hard: {},
  advanced: {},
  no_choice: {},
}

//create
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
//read
const prevProblem = (e) => {
  document.activeElement.blur()
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

const closeOverlay = () => {
  overlayContent.innerHTML = ""
  overlay.classList.add("hide")
}

//update
const editProblem = (e) => {
  document.activeElement.blur()
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

//delete
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

overlayCloseBtn.addEventListener("pointerup", closeOverlay)
