const toolbars = document.querySelectorAll(".toolbar")
const toolbars_0 = toolbars[0]
const difficultySelect = document.getElementById("choose_difficulty")
const addQBtn = document.getElementById("q_add")
const discardQBtn = document.getElementById("q_discard")
const poseQItem = document.getElementById("question")
const questionSection = document.getElementById("question_section")
const selectDiffItem = document.getElementById("difficulty")
let question = ""
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
  let qiFront = document.createElement("div")
  let qiBack = document.createElement("div")
  let backBtn = document.createElement("button")
  let input = document.createElement("input")
  let confBtn = document.createElement("button")
  qiFront.setAttribute("class", "piFront")
  qiBack.setAttribute("class", "piBack")
  backBtn.setAttribute("name", "back")
  input.setAttribute("placeholder", 'Type "yes"')
  confBtn.setAttribute("name", "confirm")
  backBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'
  setAria(backBtn, "Cancel")
  confBtn.innerText = "Confirm"
  let p = document.createElement("p")
  p.innerText = "Question"
  let edit = document.createElement("button")
  setAria(edit, "Edit question")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editQ)
  let del = document.createElement("button")
  setAria(del, "Delete question")
  del.setAttribute("name", "del")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", deleteQ)
  backBtn.addEventListener("pointerup", deleteQ)
  confBtn.addEventListener("pointerup", deleteQ)
  input.addEventListener("keyup", deleteQ)
  qiFront.appendChild(p)
  qiFront.appendChild(edit)
  qiFront.appendChild(del)
  qiBack.appendChild(backBtn)
  qiBack.appendChild(input)
  qiBack.appendChild(confBtn)
  questionItem.appendChild(qiFront)
  questionItem.appendChild(qiBack)
  questionSection.appendChild(questionItem)
}

const addQ = () => {
  document.activeElement.blur()
  switch (uniqueQ(qTA)) {
    case false:
      showNotUniqueMsg(labelPs[0])
      break
    case true:
      removeEmptyDivs(qTA)
      if (qTA.childElementCount === 0) {
        qTA.innerHTML = `<div>${qTA.textContent}</div>`
      }
      question = qTA.innerHTML
      checkList(poseQItem, "check")
      checkReqs()
      hideOrShowThisTextArea("qTA", "hide")
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
  qDiff = difficultySelect.value
  if (target.value !== "no_choice") {
    checkList(selectDiffItem, "check")
  } else {
    checkList(selectDiffItem, "uncheck")
  }
  checkReqs()
}

const editQ = (e) => {
  document.activeElement.blur()
  let { target } = e
  let { parentElement: li } = target.parentElement
  if (addAllBtn.dataset.refId) {
    addQBtn.dataset.refId = addAllBtn.dataset.refId
    addQBtn.dataset.refDiff = addAllBtn.dataset.refDiff
    // why copy these refs over if they're already in the other btns?
    // good question 1/8/2022
  }
  let p = li.querySelector("p")
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    p.innerText = "Question"
    if (qDiff != difficultySelect.value) {
      setDiff(qDiff)
    }
    setAria(target, "Edit question")
    hideOrShowThisTextArea("qTA", "hide")
  } else {
    li.classList.add("editing")
    p.innerText = "Question (editing)"
    setAria(target, "Cancel edit")
    qTA.innerHTML = question
    setDiff(qDiff)
    setAria(addQBtn, "Save question")
    setAria(discardQBtn, "Discard changes")
    hideOrShowThisTextArea("qTA", "show")
  }
}

//delete
const discardQ = (e) => {
  document.activeElement.blur()
  let { target } = e
  qTA.replaceChildren()
  setDiff(qDiff)
  let li = questionSection.querySelector("li")
  if (li) {
    let edit = li.querySelectorAll("button")[0]
    setAria(target, "Discard")
    setAria(edit, "Edit question")
    setAria(target.previousElementSibling, "Add question")
    hideOrShowThisTextArea("qTA", "hide")
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = "Question"
  } else {
    question = ""
    difficultySelect.value = "no_choice"
  }
}

const deleteQ = (e) => {
  const { target } = e
  const { name } = target
  const { parentElement: li } = target.parentElement
  const back = li.lastChild
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
        deleteQItem()
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

const deleteQItem = () => {
  let li = questionSection.querySelector("li")
  if (li) li.remove()
  question = ""
  qTA.replaceChildren()
  setAria(addQBtn, "Add question")
  setAria(discardQBtn, "Discard")
  checkList(poseQItem, "uncheck")
  checkReqs()
  hideOrShowThisTextArea("qTA", "show")
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
