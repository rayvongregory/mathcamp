// I think this is done... 11/8/2021 @ 4:38PM
// fuck there's something wrong... 11/10/2021 @ 6:00 AM
const addChoiceBtn = document.querySelector("#choice_add")
const discardChoiceBtn = document.querySelector("#choice_discard")
const choicesSection = document.querySelector(".question_choices")
const extraOptions_2 = document.querySelectorAll(".extra-options")[2]
const tenChoices = document.querySelector("#ten_choices")
let choices = {}

//util
const checkForTen = () => {
  i = tenChoices.querySelector("i")
  if (Object.keys(choices).length >= 10) {
    checkList(tenChoices, "check")
  } else {
    checkList(tenChoices, "uncheck")
  }
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
  setAttr(edit, "aria", "Cancel edit")
  setAttr(addChoiceBtn, "aria", "Save changes")
  setAttr(discardChoiceBtn, "aria", "Discard changes")
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
  setAttr(edit, "aria", "Edit choice")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editChoice)
  let del = document.createElement("button")
  setAttr(del, "aria", "Delete choice")
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
        choices[`$cid${cid}`] = choicesTextArea.innerHTML
        choiceItem.classList.remove("editing")
        p.innerText = `Choice ID: ${cid}`
        setAttr(editBtn, "aria", "Edit choice")
        setAttr(addChoiceBtn, "aria", "Add choice")
        setAttr(discardChoiceBtn, "aria", "Discard")
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
  checkForTen()
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
    setAttr(editBtn, "aria", "Edit choice")
    let { cid: oldCid } = li.dataset
    p.innerText = `Choice ID: ${oldCid}`
    addToTextArea(target, cid, edit)
  } else if (li && li === target) {
    li.classList.remove("editing")
    setAttr(edit, "aria", "Edit choice")
    setAttr(addChoiceBtn, "aria", "Add choice to question")
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
    setAttr(addChoiceBtn, "aria", "Add choice to question")
    setAttr(discardChoiceBtn, "aria", "Discard")
    let li = choicesSection.querySelector(`[data-cid="${cid}"]`)
    li.classList.remove("editing")
    let edit = li.querySelector('[aria-label="Cancel edit"]')
    setAttr(edit, "aria", "Edit choice")
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
    setAttr(addChoiceBtn, "aria", "Add choice to question")
    setAttr(discardChoiceBtn, "aria", "Discard")
    choicesTextArea.innerHTML = "<p></p>"
  }
  item.remove()
  delete choices[`cid${cid}`]
  checkForTen()
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
