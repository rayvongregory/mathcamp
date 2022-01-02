// I think this is done... 11/8/2021 @ 4:38PM
//cache
const toolbars_1 = toolbars[1]
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
  switch (uniqueChoice(aTA) || aTA.innerHTML === choices.answer) {
    case false:
      showNotUniqueMsg(labelPs[1])
      break
    case true:
      removeEmptyDivs(aTA)
      choices.answer = aTA.innerHTML
      checkList(createCorrectAns, "check")
      checkReqs()
      hideOrShowThisTextArea("aTA", "hide")
      let correctAnswerItem = correctAnswerSection.querySelector("li")
      if (!correctAnswerItem) {
        createAnsItem()
        checkForFive()
      } else {
        let p = correctAnswerItem.querySelector("p")
        let btn = correctAnswerItem.querySelector("button")
        correctAnswerItem.classList.remove("editing")
        setAria(btn, "Edit answer")
        p.innerText = "Answer"
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
  let li = target.parentElement
  let p = li.querySelector("p")
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    p.innerText = "Answer"
    setAria(target, "Edit answer")
    hideOrShowThisTextArea("aTA", "hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Answer (editing)"
    aTA.innerHTML = choices.answer
    setAria(target, "Cancel edit")
    setAria(addAnsBtn, "Save answer")
    setAria(discardAnsBtn, "Discard changes")
    hideOrShowThisTextArea("aTA", "show")
  }
}

//delete
const discardAns = (e) => {
  document.activeElement.blur()
  let { target } = e
  aTA.replaceChildren()
  let correctAnswerItem = correctAnswerSection.querySelector("li")
  if (correctAnswerItem) {
    let edit = correctAnswerItem.querySelector("button")
    setAria(edit, "Edit answer")
    setAria(target, "Discard")
    setAria(target.previousElementSibling, "Add answer to question")
    hideOrShowThisTextArea("aTA", "hide")
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
  checkReqs()
  hideOrShowThisTextArea("aTA", "show")
  aTA.replaceChildren()
  correctAnswerSection.classList.add("hide")
  setAria(addAnsBtn, "Add answer")
  setAria(discardAnsBtn, "Discard")
  checkForFive()
}

addAnsBtn.addEventListener("pointerup", addAns)
discardAnsBtn.addEventListener("pointerup", discardAns)
