// I think this is finished... 11/7/2021 @ 12:42AM
const extraOptions_0 = document.querySelectorAll(".extra-options")[0]
const difficultySelect = document.querySelector("#choose_difficulty")
const addQBtn = document.querySelector("#q_add")
const discardQBtn = document.querySelector("#q_discard")
const poseQItem = document.querySelector("#question")
const questionSection = document.querySelector(".question_section")
const selectDiffItem = document.querySelector("#difficulty")
let question = "<p><br></p>"
let qDiff = "no_choice"

//util
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

//create
// const addQ_OLD = () => {
//   document.activeElement.blur()
//   if (!uniqueQ(questionTextArea.innerHTML)) {
//     labelPs[0].classList.remove("hide")
//     setTimeout(() => {
//       labelPs[0].classList.add("hide")
//     }, 2000)
//     //why delete it? wouldn't that make the util fcn not work properly the next time?
//     // delete addQBtn.dataset.refId
//     // delete addQBtn.dataset.refDiff
//     return
//   }
//   question = questionTextArea.innerHTML
//   let questionItem = questionSection.querySelector("li")
//   if (!questionItem) {
//     createQItem()
//     i = poseQItem.querySelector("i")
//     questionSection.classList.remove("pop-top")
//   } else {
//     question = questionTextArea.innerHTML
//     questionItem.classList.remove("editing")
//     let p = questionItem.querySelector("p")
//     p.innerText = "Question"
//     questionSection.classList.remove("pop-top")
//     addQBtn.setAttribute("aria-label", "Add question")
//     addQBtn.setAttribute("title", "Add question")
//   }
//   let questionIT = questionTextArea.innerText.trim()
//   if (
//     question !== "<p><br></p>" &&
//     question !== '<p><br data-mce-bogus="1"></p>' &&
//     questionIT !== "" &&
//     questionIT !== "\n"
//   ) {
//     i.classList.replace("fa-times-circle", "fa-check-circle")
//     poseQItem.classList.replace("not_met", "satisfied")
//   }
//   questionSection.classList.remove("hide")
//   questionTextAreaDiv.classList.add("hide")
//   extraOptions_0.classList.add("hide")
//   delete addQBtn.dataset.refId
//   delete addQBtn.dataset.refDiff
// }

const addQ = () => {
  document.activeElement.blur()
  switch (uniqueQ(questionTextArea.innerHTML)) {
    case false:
      showNotUniqueMsg(labelPs[0])
      break
    case true:
      question = questionTextArea.innerHTML
      qDiff = difficultySelect.value
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
      difficultySelect.value = qDiff
      difficultySelect.dispatchEvent(new Event("pointerup"))
    }
    setAttr(target, "aria", "Edit question")
    hideOrShowThisTextArea("questionTextArea", "hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Question (editing)"
    setAttr(target, "aria", "Cancel edit")
    questionTextArea.innerHTML = question
    difficultySelect.value = qDiff
    difficultySelect.dispatchEvent(new Event("pointerup"))
    setAttr(addQBtn, "aria", "Save question")
    setAttr(discardQBtn, "aria", "Discard changes")
    hideOrShowThisTextArea("questionTextArea", "show")
  }
}

//delete
const discardQ = (e) => {
  document.activeElement.blur()
  console.log(question)
  let { target } = e
  questionTextArea.innerHTML = "<p><br></p>"
  difficultySelect.value = qDiff
  difficultySelect.dispatchEvent(new Event("click"))
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
    question = "<p><br></p>"
    difficultySelect.value = "no_choice"
  }
}

const deleteQ = () => {
  document.activeElement.blur()
  let li = questionSection.querySelector("li")
  if (li) li.remove()
  question = "<p><br></p>"
  questionTextArea.innerHTML = "<p><br></p>"
  setAttr(addQBtn, "aria", "Add question")
  setAttr(discardQBtn, "aria", "Discard")
  checkList(poseQItem, "uncheck")
  hideOrShowThisTextArea("questionTextArea", "show")
  questionSection.classList.add("hide")
  qDiff = "no_choice"
  difficultySelect.value = qDiff
  difficultySelect.dispatchEvent(new Event("pointerup"))
}

//add listeners
addQBtn.addEventListener("pointerup", addQ)
discardQBtn.addEventListener("pointerup", discardQ)
difficultySelect.addEventListener("pointerup", checkForDiff)
difficultySelect.addEventListener("click", checkForDiff) // for moz
difficultySelect.addEventListener("keyup", checkForDiff)
