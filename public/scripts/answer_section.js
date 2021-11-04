//cache
const extraOptions_1 = document.querySelectorAll(".extra-options")[1]
const addAnsBtn = document.querySelector("#answer_add")
const discardAnsBtn = document.querySelector("#answer_discard")
const createCorrectAns = document.querySelector("#correct_answer")
const correctAnswerSection = document.querySelector(".correct_answer")

//create
const addAns = (e) => {
  document.activeElement.blur()
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

//delete
const discardAns = (e) => {
  document.activeElement.blur()
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

const deleteAns = () => {
  document.activeElement.blur()
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

addAnsBtn.addEventListener("pointerup", addAns)
discardAnsBtn.addEventListener("pointerup", discardAns)
