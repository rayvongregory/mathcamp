const extraOptions_0 = document.querySelectorAll(".extra-options")[0]
const difficultySelect = document.querySelector("#choose_difficulty")
const addQBtn = document.querySelector("#q_add")
const discardQBtn = document.querySelector("#q_discard")
const poseQ = document.querySelector("#question")
const questionSection = document.querySelector(".question_section")
const pickDifficulty = document.querySelector("#difficulty") // rename probably
let question = "<p><br></p>"

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

//create
const addQ = () => {
  document.activeElement.blur()
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

//read

//update
const editQ = (e) => {
  document.activeElement.blur()
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

//delete
const discardQ = (e) => {
  document.activeElement.blur()
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

const deleteQ = () => {
  document.activeElement.blur()
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

//add listeners
addQBtn.addEventListener("pointerup", addQ)
discardQBtn.addEventListener("pointerup", discardQ)
