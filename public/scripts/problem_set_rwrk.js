//util
const createProblemItem = (diff, newP = true) => {
  // get icon class
  let satisfied = true
  for (let req of publishQuestionReqs) {
    if (req.classList.contains("not_met")) {
      satisfied = false
      break
    }
  }
  let q = document.createElement("li")
  let icon = document.createElement("span")
  if (satisfied) {
    q.classList.add("satisfied")
    icon.innerHTML = '<i class="fas fa-check-circle"></i>'
  } else {
    q.classList.add("not_met")
    icon.innerHTML = '<i class="fas fa-times-circle"></i>'
  }
  // generate ID && store values
  let id
  do {
    id = String(Math.round(Math.random() * 999))
    if (id.length !== 3) {
      id = id.padStart(3, "0")
    }
  } while (problems[diff][`pid${id}`] !== undefined)
  problems[diff][`pid${id}`] = {
    question: questionTextArea.innerHTML,
    choices: { ...choices },
  }
  // do some extra stuff if newP is false... I still don't know when that happens

  // create & append
  let p = document.createElement("p")
  q.dataset.id = `pid${id}`
  q.dataset.diff = diff
  p.innerText = `Problem ID: ${id}`
  let prev = document.createElement("button")
  setAttr(prev, "aria", "Preview problem")
  prev.innerHTML = '<i class="fas fa-eye"></i>'
  prev.addEventListener("pointerup", prevProblem)
  let edit = document.createElement("button")
  setAttr(edit, "aria", "Edit problem")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editProblem)
  let del = document.createElement("button")
  setAttr(del, "aria", "Delete problem")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", delProblem)
  q.appendChild(icon)
  q.appendChild(p)
  q.appendChild(prev)
  q.appendChild(edit)
  q.appendChild(del)
  appendThisToThat(q, diff)
}

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

//create
const addAll = (e, obj = null) => {
  document.activeElement.blur()
  //when do i ever pass an obj to this function??
  if (obj) {
    let id = obj.id.substring(3)
    let { question, choices } = obj.problem
    let { diff } = obj
    let newId
    for (let key in choices) {
      do {
        newId = String(Math.round(Math.random() * 999))
        if (newId.length !== 3) {
          newId = newId.padStart(3, "0")
        }
      } while (choices[`cid${newId}`] !== undefined)
      choices[`cid${newId}`] = choices[key]
      delete choices[key]
    }
    let q = document.createElement("li")
    let icon = document.createElement("span")
    q.classList.add("not_met")
    button.innerHTML = '<i class="fas fa-times-circle"></i>'
    let p = document.createElement("p")
    q.dataset.id = `pid${id}`
    q.dataset.diff = diff
    p.innerText = `Problem ID: ${id}`
    let prev = document.createElement("button")
    prev.setAttribute("role", "button")
    prev.setAttribute("aria-label", "Preview problem")
    prev.setAttribute("title", "Preview problem")
    prev.innerHTML = '<i class="fas fa-eye"></i>'
    prev.addEventListener("pointerup", prevProblem)
    let edit = document.createElement("button")
    edit.setAttribute("role", "button")
    edit.setAttribute("aria-label", "Edit problem")
    edit.setAttribute("title", "Edit problem")
    edit.innerHTML = '<i class="fas fa-edit"></i>'
    edit.addEventListener("pointerup", editProblem)
    let del = document.createElement("button")
    del.setAttribute("role", "button")
    del.setAttribute("aria-label", "Delete problem")
    del.setAttribute("title", "Delete problem")
    del.innerHTML = '<i class="fas fa-trash"></i>'
    del.addEventListener("pointerup", delProblem)
    q.appendChild(icon)
    q.appendChild(p)
    q.appendChild(prev)
    q.appendChild(edit)
    q.appendChild(del)
    appendThisToThat(q, diff)
    return
  }
  let { refId, refDiff } = e.target.dataset
  if (!refId) {
    createProblemItem(difficultySelect.value)
    discardAll()
    hideOrShowThisTextArea("questionTextArea", "show")
    questionSection.classList.add("hide")
  } else {
    let newDiff = difficultySelect.value
    let qDOM = document.querySelector(`[data-id="${refId}"]`)
    let icon = qDOM.querySelector("button")
    if (newDiff !== refDiff) {
      problems[newDiff][refId] = {
        question: question,
        choices: { ...choices },
      }
      delete problems[refDiff][refId]
      let del = qDOM.querySelectorAll("button")[2]
      del.dispatchEvent(new Event("pointerup"))
      qDOM.dataset.diff = newDiff
      appendThisToThat(qDOM, newDiff)
    } else {
      problems[refDiff][refId] = {
        question: question,
        choices: { ...choices },
      }
    }

    let satisfied = true
    for (let req of publishQuestionReqs) {
      if (req.classList.contains("not_met")) {
        satisfied = false
        break
      }
    }
    if (satisfied) {
      qDOM.classList.remove("not_met")
      qDOM.classList.add("satisfied")
      icon.innerHTML = '<i class="fas fa-check-circle"></i>'
    } else {
      qDOM.classList.remove("satisfied")
      qDOM.classList.add("not_met")
      icon.innerHTML = '<i class="fas fa-times-circle"></i>'
    }

    discardAll()
    let problem = document.querySelector(`[data-id="${refId}"]`)
    if (problem.dataset.id === refId) {
      problem.classList.remove("editing")
      let p = problem.querySelector("p")
      p.innerText = `Problem ID: ${refId.substring(3)}`
    }
    addAllBtn.setAttribute("aria-label", "Add all to exercise")
    addAllBtn.setAttribute("title", "Add all to exercise")
    let p = addAllBtn.querySelector("p")
    p.innerText = "Add All"
    discardAllBtn.setAttribute("aria-label", "Discard all")
    discardAllBtn.setAttribute("title", "Discard all")
    p = discardAllBtn.querySelector("p")
    p.innerText = "Discard All"
    delete e.target.dataset.refId
    delete e.target.dataset.refDiff
    // if there is a refId, simply locate the object and update it
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
  if (choicesSection.querySelector("li")) deleteChoices()
  let { target } = e
  let li = target.parentElement
  let { id: targetId } = li.dataset
  if (li.classList.contains("editing")) {
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = `Problem ID: ${targetId.substring(3)}`
    setAttr(addAllBtn, "aria", "Add all to exercise")
    delete addAllBtn.dataset.refId
    delete addAllBtn.dataset.refDiff
    p = addAllBtn.querySelector("p")
    p.innerText = "Add All"
    setAttr(discardAllBtn, "aria", "Discard all")
    setAttr(target, "aria", "Edit problem")
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
  nav.scrollIntoView({ block: "nearest", inline: "nearest" })
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
