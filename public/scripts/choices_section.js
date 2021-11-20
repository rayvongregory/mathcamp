// I think this is done... 11/8/2021 @ 4:38PM
// fuck there's something wrong... 11/10/2021 @ 6:00 AM
const addChoiceBtn = document.getElementById("choice_add")
const discardChoiceBtn = document.getElementById("choice_discard")
const choicesSection = document.getElementById("question_choices")
const extraOptions_2 = extraOptions[2]
const fiveChoices = document.getElementById("five_choices")
let choices = {}

//util
const checkForFive = () => {
  i = fiveChoices.querySelector("i")
  if (Object.keys(choices).length >= 5) {
    checkList(fiveChoices, "check")
  } else {
    checkList(fiveChoices, "uncheck")
  }
  checkReqs()
}

const uniqueChoice = (text) => {
  if (text.innerText.trim() === "" && !text.querySelector("img")) {
    return false
  }
  for (let choice in choices) {
    if (choices[choice] === text.innerHTML) {
      return false
    }
  }
  return true
}

const addToTextArea = (target, cid, edit) => {
  target.classList.add("editing")
  let p = target.querySelector("p")
  p.innerText = `Choice ID: ${cid} (editing)`
  choicesTextArea.innerHTML = choices[`cid${cid}`]
  addChoiceBtn.dataset.cid = cid
  setAria(edit, "Cancel edit")
  setAria(addChoiceBtn, "Save changes")
  setAria(discardChoiceBtn, "Discard changes")
}

const createChoiceItem = (id = null) => {
  // id is just the number
  if (!id) {
    do {
      id = String(Math.round(Math.random() * 999))
      if (id.length !== 3) {
        id = id.padStart(3, "0")
      }
    } while (choices[`cid${id}`] !== undefined)
    removeNonsense(choicesTextArea)
    choices[`cid${id}`] = choicesTextArea.innerHTML
  }
  let choiceItem = document.createElement("li")
  let p = document.createElement("p")
  choiceItem.dataset.cid = id
  p.innerText = `Choice ID: ${id}`
  let edit = document.createElement("button")
  setAria(edit, "Edit choice")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editChoice)
  let del = document.createElement("button")
  setAria(del, "Delete choice")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", deleteChoice)
  choiceItem.appendChild(p)
  choiceItem.appendChild(edit)
  choiceItem.appendChild(del)
  choicesSection.appendChild(choiceItem)
  if (choicesSection.classList.contains("hide")) {
    choicesSection.classList.remove("hide")
  }
}

//create
const addChoice = (e) => {
  document.activeElement.blur()
  // try finding a choice (or answer) with the same innerHTML. if found, don't add
  let { cid } = e.target.dataset
  removeNonsense(choicesTextArea)
  switch (
    uniqueChoice(choicesTextArea) ||
    (cid !== undefined && choicesTextArea.innerHTML === choices[`cid${cid}`])
  ) {
    case false:
      showNotUniqueMsg(labelPs[2])
      break
    case true:
      let choiceItem = choicesSection.querySelector(`[data-cid="${cid}"]`)
      if (choiceItem) {
        let p = choiceItem.querySelector("p")
        let editBtn = choiceItem.querySelector("button")
        removeNonsense(choicesTextArea)
        choices[`cid${cid}`] = choicesTextArea.innerHTML
        choiceItem.classList.remove("editing")
        p.innerText = `Choice ID: ${cid}`
        setAria(editBtn, "Edit choice")
        setAria(addChoiceBtn, "Add choice")
        setAria(discardChoiceBtn, "Discard")
        delete e.target.dataset.cid
        choicesTextArea.innerHTML = "<p></p>"
        // don't need to create a choice item, just need to update the obj using id
      } else {
        // create a choice item and its id
        createChoiceItem()
        choicesTextArea.innerHTML = "<p></p>"
      }
      break
    default:
      break
  }
  checkForFive()
}

//update
const editChoice = (e) => {
  document.activeElement.blur()
  let edit = e.target
  let target = edit.parentElement
  let { cid } = target.dataset // this is just the number
  let li = choicesSection.querySelector("li.editing")
  if (!li) {
    addToTextArea(target, cid, edit)
  } else if (li && li !== target) {
    li.classList.remove("editing")
    let p = li.querySelector("p")
    let editBtn = li.querySelector("button")
    setAria(editBtn, "Edit choice")
    let { cid: oldCid } = li.dataset
    p.innerText = `Choice ID: ${oldCid}`
    addToTextArea(target, cid, edit)
  } else if (li && li === target) {
    li.classList.remove("editing")
    setAria(edit, "Edit choice")
    setAria(addChoiceBtn, "Add choice to question")
    let p = li.querySelector("p")
    let { cid } = li.dataset
    p.innerText = `Choice ID: ${cid}`
    delete addChoiceBtn.dataset.cid
    discardChoice()
  }
}

//delete
const discardChoice = () => {
  document.activeElement.blur()
  choicesTextArea.innerHTML = "<p></p>"
  let { cid } = addChoiceBtn.dataset
  if (cid) {
    setAria(addChoiceBtn, "Add choice to question")
    setAria(discardChoiceBtn, "Discard")
    let li = choicesSection.querySelector(`[data-cid="${cid}"]`)
    li.classList.remove("editing")
    let edit = li.querySelector('[aria-label="Cancel edit"]')
    setAria(edit, "Edit choice")
    let p = li.querySelector("p")
    p.innerText = `Choice ID: ${cid}`
    delete addChoiceBtn.dataset.cid
  }
}

const deleteChoice = (e) => {
  let item = e.target.parentElement
  let { cid } = item.dataset
  if (cid === addChoiceBtn.dataset.cid) {
    delete addChoiceBtn.dataset.cid
    setAria(addChoiceBtn, "Add choice to question")
    setAria(discardChoiceBtn, "Discard")
    choicesTextArea.innerHTML = "<p></p>"
  }
  item.remove()
  delete choices[`cid${cid}`]
  checkForFive()
  if (
    Object.keys(choices).length === 0 ||
    (Object.keys(choices).length === 1 && choices.answer)
  ) {
    choicesSection.classList.add("hide")
  }
}

const deleteChoices = () => {
  let choicesList = choicesSection.querySelectorAll("li")
  for (let choice of choicesList) {
    delete choices[`cid${choice.dataset.cid}`]
    choice.remove()
  }
  if (addChoiceBtn.dataset.cid) delete addChoiceBtn.dataset.cid
  choicesSection.classList.add("hide")
  choicesTextArea.innerHTML = "<p></p>"
}

addChoiceBtn.addEventListener("pointerup", addChoice)
discardChoiceBtn.addEventListener("pointerup", discardChoice)
