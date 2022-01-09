// I think this is done... 11/8/2021 @ 4:38PM
// fuck there's something wrong... 11/10/2021 @ 6:00 AM
const addChoiceBtn = document.getElementById("choice_add")
const discardChoiceBtn = document.getElementById("choice_discard")
const choicesSection = document.getElementById("question_choices")
const toolbars_2 = toolbars[2]
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
  p.innerText = `CID: ${cid} (editing)`
  cTA.innerHTML = choices[`cid${cid}`]
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
    removeEmptyDivs(cTA)
    choices[`cid${id}`] = cTA.innerHTML
  }
  let choiceItem = document.createElement("li")
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
  choiceItem.dataset.cid = id
  p.innerText = `CID: ${id}`
  let edit = document.createElement("button")
  setAria(edit, "Edit choice")
  edit.innerHTML = '<i class="fas fa-edit"></i>'
  edit.addEventListener("pointerup", editChoice)
  let del = document.createElement("button")
  setAria(del, "Delete choice")
  del.setAttribute("name", "del")
  del.innerHTML = '<i class="fas fa-trash"></i>'
  del.addEventListener("pointerup", deleteChoice)
  backBtn.addEventListener("pointerup", deleteChoice)
  confBtn.addEventListener("pointerup", deleteChoice)
  input.addEventListener("keyup", deleteChoice)
  qiFront.appendChild(p)
  qiFront.appendChild(edit)
  qiFront.appendChild(del)
  qiBack.appendChild(backBtn)
  qiBack.appendChild(input)
  qiBack.appendChild(confBtn)
  choiceItem.appendChild(qiFront)
  choiceItem.appendChild(qiBack)
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
  removeEmptyDivs(cTA)
  switch (
    uniqueChoice(cTA) ||
    (cid !== undefined && cTA.innerHTML === choices[`cid${cid}`])
  ) {
    case false:
      showNotUniqueMsg(labelPs[2])
      break
    case true:
      let choiceItem = choicesSection.querySelector(`[data-cid="${cid}"]`)
      if (choiceItem) {
        let p = choiceItem.querySelector("p")
        let editBtn = choiceItem.querySelector("button")
        removeEmptyDivs(cTA)
        choices[`cid${cid}`] = cTA.innerHTML
        choiceItem.classList.remove("editing")
        p.innerText = `CID: ${cid}`
        setAria(editBtn, "Edit choice")
        setAria(addChoiceBtn, "Add choice")
        setAria(discardChoiceBtn, "Discard")
        delete e.target.dataset.cid
        cTA.replaceChildren()
        // don't need to create a choice item, just need to update the obj using id
      } else {
        // create a choice item and its id
        createChoiceItem()
        cTA.replaceChildren()
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
  let { parentElement: target } = edit.parentElement
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
    p.innerText = `CID: ${oldCid}`
    addToTextArea(target, cid, edit)
  } else if (li && li === target) {
    li.classList.remove("editing")
    setAria(edit, "Edit choice")
    setAria(addChoiceBtn, "Add choice to question")
    let p = li.querySelector("p")
    let { cid } = li.dataset
    p.innerText = `CID: ${cid}`
    delete addChoiceBtn.dataset.cid
    discardChoice()
  }
}

//delete
const discardChoice = () => {
  document.activeElement.blur()
  cTA.replaceChildren()
  let { cid } = addChoiceBtn.dataset
  if (cid) {
    setAria(addChoiceBtn, "Add choice to question")
    setAria(discardChoiceBtn, "Discard")
    let li = choicesSection.querySelector(`[data-cid="${cid}"]`)
    li.classList.remove("editing")
    let edit = li.querySelector('[aria-label="Cancel edit"]')
    setAria(edit, "Edit choice")
    let p = li.querySelector("p")
    p.innerText = `CID: ${cid}`
    delete addChoiceBtn.dataset.cid
  }
}

const deleteChoice = (e) => {
  const { target } = e
  const { name } = target
  const { parentElement: li } = target.parentElement
  const { cid } = li.dataset
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
        deleteChoiceItem(li, cid)
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

const deleteChoiceItem = (item, cid) => {
  if (cid === addChoiceBtn.dataset.cid) {
    delete addChoiceBtn.dataset.cid
    setAria(addChoiceBtn, "Add choice to question")
    setAria(discardChoiceBtn, "Discard")
    cTA.replaceChildren()
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
  cTA.replaceChildren()
}

addChoiceBtn.addEventListener("pointerup", addChoice)
discardChoiceBtn.addEventListener("pointerup", discardChoice)
