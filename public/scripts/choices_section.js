const addChoiceBtn = document.querySelector("#choice_add")
const discardChoiceBtn = document.querySelector("#choice_discard")
const questionChoicesSection = document.querySelector(".question_choices")
const extraOptions_2 = document.querySelectorAll(".extra-options")[2]
const tenChoices = document.querySelector("#ten_choices")
let choices = {}

//util
const checkForTen = () => {
  i = tenChoices.querySelector("i")
  if (Object.keys(choices).length >= 10) {
    tenChoices.classList.replace("not_met", "satisfied")
    i.classList.replace("fa-times-circle", "fa-check-circle")
  } else {
    tenChoices.classList.replace("satisfied", "not_met")
    i.classList.replace("fa-check-circle", "fa-times-circle")
  }
}

const uniqueChoice = (text) => {
  let { refId } = addChoiceBtn.dataset
  if (text === "<p><br></p>" || text === '<p><br data-mce-bogus="1"></p>') {
    return false
  }
  for (let choice in choices) {
    if (choices[choice] === text && choice !== refId) {
      return false
    }
  }
  return true
}

//create
const addChoice = (e) => {
  document.activeElement.blur()
  // try finding a choice (or answer) with the same innerHTML. if found, don't add
  if (!uniqueChoice(choicesTextArea.innerHTML)) {
    extraOptions_2.classList.add("not_met")
    let p = extraOptions_2.querySelector("p")
    p.classList.remove("hide")
    setTimeout(() => {
      extraOptions_2.classList.remove("not_met")
      p.classList.add("hide")
    }, 2000)
    return
  }

  // check for dom el
  let { refId: ref } = e.target.dataset
  let li = questionChoicesSection.querySelector(`[data-id="${ref}"]`)
  if (li) {
    // if dom el exists, update choices obj
    choices[ref] = choicesTextArea.innerHTML
    li.classList.remove("editing")
    let p = li.querySelector("p")
    p.innerText = `Choice ID: ${ref.substring(3)}`
    addChoiceBtn.setAttribute("aria-label", "Add choice")
    addChoiceBtn.setAttribute("title", "Add choice")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    delete e.target.dataset.refId
    choicesTextArea.innerHTML = "<p><br></p>"

    return
  }
  let id
  // create id or use ref
  if (!ref) {
    do {
      id = String(Math.round(Math.random() * 999))
      if (id.length !== 3) {
        id = id.padStart(3, "0")
      }
    } while (choices[`cid${id}`] !== undefined)
  } else {
    id = ref.substring(3)
    delete e.target.dataset.refId
  }

  //if dom el doesn't exist, create dom el
  choices[`cid${id}`] = choicesTextArea.innerHTML
  let choiceItem = document.createElement("li")
  let p = document.createElement("p")
  choiceItem.dataset.id = `cid${id}`
  p.innerText = `Choice ID: ${id}`
  let edit = document.createElement("button")
  edit.setAttribute("role", "button")
  edit.setAttribute("aria-label", "Edit choice")
  edit.setAttribute("title", "Edit choice")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editChoice)
  let del = document.createElement("button")
  del.setAttribute("role", "button")
  del.setAttribute("aria-label", "Delete choice")
  del.setAttribute("title", "Delete choice")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", deleteChoice)
  choiceItem.appendChild(p)
  choiceItem.appendChild(edit)
  choiceItem.appendChild(del)
  questionChoicesSection.appendChild(choiceItem)
  questionChoicesSection.classList.remove("hide")
  checkForTen()
  choicesTextArea.innerHTML = "<p><br></p>"
}

//update
const editChoice = (e) => {
  document.activeElement.blur()
  let btn = e.target
  let target = btn.parentElement
  let { id: itemID } = target.dataset
  let li = questionChoicesSection.querySelector("li.editing")
  if (li && li !== target) {
    li.classList.remove("editing")
    let p = li.querySelector("p")
    let { id } = li.dataset
    p.innerText = `Choice ID: ${id.substring(3)}`
  } else if (li && li === target) {
    li.classList.remove("editing")
    li.classList.remove("editing")
    btn.setAttribute("aria-label", "Edit choice")
    btn.setAttribute("title", "Edit choice")
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
    let p = li.querySelector("p")
    let { id } = li.dataset
    p.innerText = `Choice ID: ${id.substring(3)}`
    delete addChoiceBtn.dataset.refId
    discardChoice()
    return
  }
  target.classList.add("editing")
  let p = target.querySelector("p")
  p.innerText = `Choice ID: ${itemID.substring(3)} (editing)`
  choicesTextArea.innerHTML = choices[itemID]
  addChoiceBtn.dataset.refId = itemID
  btn.setAttribute("aria-label", "Cancel edit")
  btn.setAttribute("title", "Cancel edit")
  addChoiceBtn.setAttribute("aria-label", "Save changes")
  addChoiceBtn.setAttribute("title", "Save changes")
  discardChoiceBtn.setAttribute("aria-label", "Discard changes")
  discardChoiceBtn.setAttribute("title", "Discard changes")
}

//delete
const discardChoice = () => {
  document.activeElement.blur()
  choicesTextArea.innerHTML = "<p><br></p>"
  let { refId } = addChoiceBtn.dataset
  if (refId) {
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    discardChoiceBtn.setAttribute("title", "Discard")
    let li = questionChoicesSection.querySelector(`[data-id="${refId}"]`)
    li.classList.remove("editing")
    let edit = li.querySelector('[aria-label="Cancel edit"]')
    edit.setAttribute("aria-label", "Edit choice")
    edit.setAttribute("title", "Edit choice")
    let p = li.querySelector("p")
    p.innerText = `Choice ID: ${refId.substring(3)}`
    delete addChoiceBtn.dataset.refId
  }
}

const deleteChoice = (e) => {
  let item = e.target.parentElement
  let { id: itemID } = item.dataset
  if (itemID === addChoiceBtn.dataset.refId) {
    delete addChoiceBtn.dataset.refId
    addChoiceBtn.setAttribute("aria-label", "Add choice to question")
    addChoiceBtn.setAttribute("title", "Add choice to question")
    discardChoiceBtn.setAttribute("aria-label", "Discard")
    discardChoiceBtn.setAttribute("title", "Discard")
  }
  item.remove()
  delete choices[itemID]
  checkForTen()
  if (
    Object.keys(choices).length === 0 ||
    (Object.keys(choices).length === 1 && choices.answer)
  ) {
    questionChoicesSection.classList.add("hide")
  }
}

const deleteChoices = () => {
  let choicesList = questionChoicesSection.querySelectorAll("li")
  for (let choice of choicesList) {
    delete choices[choice.dataset.id]
    choice.remove()
  }
  if (addChoiceBtn.dataset.refId) delete addChoiceBtn.dataset.refId
  questionChoicesSection.classList.add("hide")
  choicesTextArea.innerHTML = "<p><br></p>"
}

addChoiceBtn.addEventListener("pointerup", addChoice)
discardChoiceBtn.addEventListener("pointerup", discardChoice)
