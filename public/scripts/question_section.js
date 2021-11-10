// I think this is done... 11/8/2021 @ 4:38PM
const extraOptions_0 = document.querySelectorAll(".extra-options")[0]
const difficultySelect = document.querySelector("#choose_difficulty")
const addQBtn = document.querySelector("#q_add")
const discardQBtn = document.querySelector("#q_discard")
const poseQItem = document.querySelector("#question")
const questionSection = document.querySelector(".question_section")
const selectDiffItem = document.querySelector("#difficulty")
let question = "<p></p>"
let qDiff = "no_choice"

//util
const setDiff = (diff) => {
  difficultySelect.value = diff
  difficultySelect.dispatchEvent(new Event("pointerup"))
}

const uniqueQ = (text) => {
  if (text.innerText.trim() === "" && !text.querySelector("img")) {
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
    if (
      ez[id].question === text.innerHTML &&
      refDiff !== "easy" &&
      refId !== id
    )
      return false
  }

  // check standard
  for (let id in s) {
    if (
      s[id].question === text.innerHTML &&
      refDiff !== "standard" &&
      refId !== id
    )
      return false
  }
  // check hard
  for (let id in h) {
    if (h[id].question === text.innerHTML && refDiff !== "hard" && refId !== id)
      return false
  }
  // check advanced
  for (let id in a) {
    if (
      a[id].question === text.innerHTML &&
      refDiff !== "advanced" &&
      refId !== id
    )
      return false
  }
  // check no_diff
  for (let id in nc) {
    if (
      nc[id].question === text.innerHTML &&
      refDiff !== "no_choice" &&
      refId !== id
    )
      return false
  }
  return true
}

const createQItem = () => {
  let questionItem = document.createElement("li")
  let p = document.createElement("p")
  p.innerText = "Question"
  let edit = document.createElement("button")
  setAttr(edit, "aria", "Edit question")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editQ)
  let del = document.createElement("button")
  setAttr(del, "aria", "Delete question")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", deleteQ)
  questionItem.appendChild(p)
  questionItem.appendChild(edit)
  questionItem.appendChild(del)
  questionSection.appendChild(questionItem)
}

const addQ = () => {
  document.activeElement.blur()
  switch (uniqueQ(questionTextArea)) {
    case false:
      showNotUniqueMsg(labelPs[0])
      break
    case true:
      removeNonsense(questionTextArea)
      question = questionTextArea.innerHTML
      checkList(poseQItem, "check")
      hideOrShowThisTextArea("questionTextArea", "hide")
      let questionItem = questionSection.querySelector("li")
      if (!questionItem) {
        createQItem()
      } else {
        let p = questionItem.querySelector("p")
        questionItem.classList.remove("editing")
        p.innerText = "Question"
      }
      break
    default:
      break
  }
}
//read

//update
const checkForDiff = (e) => {
  const { target } = e
  qDiff = difficultySelect.value // does this make more sense here? i think so
  if (target.value !== "no_choice") {
    checkList(selectDiffItem, "check")
  } else {
    checkList(selectDiffItem, "uncheck")
  }
}

const editQ = (e) => {
  document.activeElement.blur()
  let { target } = e
  let li = target.parentElement
  if (addAllBtn.dataset.refId) {
    addQBtn.dataset.refId = addAllBtn.dataset.refId
    addQBtn.dataset.refDiff = addAllBtn.dataset.refDiff
    //why copy these refs over if they're already in the other btns?
  }
  let p = li.querySelector("p")
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    p.innerText = "Question"
    if (qDiff != difficultySelect.value) {
      setDiff(qDiff)
    }
    setAttr(target, "aria", "Edit question")
    hideOrShowThisTextArea("questionTextArea", "hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Question (editing)"
    setAttr(target, "aria", "Cancel edit")
    questionTextArea.innerHTML = question
    setDiff(qDiff)
    setAttr(addQBtn, "aria", "Save question")
    setAttr(discardQBtn, "aria", "Discard changes")
    hideOrShowThisTextArea("questionTextArea", "show")
  }
}

//delete
const discardQ = (e) => {
  document.activeElement.blur()
  let { target } = e
  questionTextArea.innerHTML = "<p></p>"
  setDiff(qDiff)
  let li = questionSection.querySelector("li")
  if (li) {
    let edit = li.querySelectorAll("button")[0]
    setAttr(target, "aria", "Discard")
    setAttr(edit, "aria", "Edit question")
    setAttr(target.previousElementSibling, "aria", "Add question")
    hideOrShowThisTextArea("questionTextArea", "hide")
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = "Question"
  } else {
    question = "<p></p>"
    difficultySelect.value = "no_choice"
  }
}

const deleteQ = () => {
  document.activeElement.blur()
  let li = questionSection.querySelector("li")
  if (li) li.remove()
  question = "<p></p>"
  questionTextArea.innerHTML = "<p></p>"
  setAttr(addQBtn, "aria", "Add question")
  setAttr(discardQBtn, "aria", "Discard")
  checkList(poseQItem, "uncheck")
  hideOrShowThisTextArea("questionTextArea", "show")
  questionSection.classList.add("hide")
  qDiff = "no_choice"
  setDiff(qDiff)
}

//add listeners
addQBtn.addEventListener("pointerup", addQ)
discardQBtn.addEventListener("pointerup", discardQ)
difficultySelect.addEventListener("pointerup", checkForDiff)
difficultySelect.addEventListener("click", checkForDiff) // for moz
difficultySelect.addEventListener("keyup", checkForDiff)
