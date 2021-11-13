// I think this is done... 11/8/2021 @ 4:38PM
//cache
const extraOptions_1 = extraOptions[1]
const addAnsBtn = document.getElementById("answer_add")
const discardAnsBtn = document.getElementById("answer_discard")
const createCorrectAns = document.getElementById("create_correct_answer")
const correctAnswerSection = document.getElementById("correct_answer_section")

//util
const createAnsItem = () => {
  let correctAnswerItem = document.createElement("li")
  let p = document.createElement("p")
  p.innerText = "Answer"
  let edit = document.createElement("button")
  setAria(edit, "Edit answer")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editAns)
  let del = document.createElement("button")
  setAria(del, "Delete answer")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", deleteAns)
  correctAnswerItem.appendChild(p)
  correctAnswerItem.appendChild(edit)
  correctAnswerItem.appendChild(del)
  correctAnswerSection.appendChild(correctAnswerItem)
}

//create
const addAns = (e) => {
  document.activeElement.blur()
  let { refId: ref } = e.target.dataset
  // not sure if i need to pass that ref, we'll see
  switch (
    uniqueChoice(correctAnswerTextArea) ||
    correctAnswerTextArea.innerHTML === choices.answer
  ) {
    case false:
      showNotUniqueMsg(labelPs[1])
      break
    case true:
      removeNonsense(correctAnswerTextArea)
      choices.answer = correctAnswerTextArea.innerHTML
      checkList(createCorrectAns, "check")
      hideOrShowThisTextArea("correctAnswerTextArea", "hide")
      let correctAnswerItem = correctAnswerSection.querySelector("li")
      if (!correctAnswerItem) {
        createAnsItem()
        checkForTen()
        // addAnsBtn.dataset.ansRef = "ans"
      } else {
        let p = correctAnswerItem.querySelector("p")
        let btn = correctAnswerItem.querySelector("button")
        correctAnswerItem.classList.remove("editing")
        setAria(btn, "Edit answer")
        p.innerText = "Answer"
        // setAria(addAnsBtn,  "Add answer to question")
      }
      break
    default:
      break
  }
}

//read

//update
const editAns = (e) => {
  document.activeElement.blur()
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
    setAria(target, "Edit answer")
    hideOrShowThisTextArea("correctAnswerTextArea", "hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Answer (editing)"
    correctAnswerTextArea.innerHTML = choices.answer
    setAria(target, "Cancel edit")
    setAria(addAnsBtn, "Save answer")
    setAria(discardAnsBtn, "Discard changes")
    hideOrShowThisTextArea("correctAnswerTextArea", "show")
  }
}

//delete
const discardAns = (e) => {
  document.activeElement.blur()
  let { target } = e
  correctAnswerTextArea.innerHTML = "<p></p>"
  let correctAnswerItem = correctAnswerSection.querySelector("li")
  if (correctAnswerItem) {
    let edit = correctAnswerItem.querySelector("button")
    setAria(edit, "Edit answer")
    setAria(target, "Discard")
    setAria(target.previousElementSibling, "Add answer to question")
    hideOrShowThisTextArea("correctAnswerTextArea", "hide")
    correctAnswerItem.classList.remove("editing")
    let p = correctAnswerItem.querySelector("p")
    p.innerText = "Answer"
  }
}

const deleteAns = () => {
  document.activeElement.blur()
  let li = correctAnswerSection.querySelector("li")
  if (li) {
    li.remove()
    delete choices.answer
  }
  checkList(createCorrectAns, "uncheck")
  hideOrShowThisTextArea("correctAnswerTextArea", "show")
  correctAnswerTextArea.innerHTML = "<p></p>"
  correctAnswerSection.classList.add("hide")
  setAria(addAnsBtn, "Add answer")
  setAria(discardAnsBtn, "Discard")
  // delete addAnsBtn.dataset.ansRef
  checkForTen()
}

addAnsBtn.addEventListener("pointerup", addAns)
discardAnsBtn.addEventListener("pointerup", discardAns)
