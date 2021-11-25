//overlapping util functions
const publishBtn = document.getElementById("publish")
const publishReqs = document.querySelectorAll(".to_publish_reqs:not(.q) li")
const draftBtn = document.getElementById("draft")
const titleInput = document.getElementById("title")
const createTitleItem = document.getElementById("create_title")
const tagsInput = document.getElementById("tags_input")
const tags = document.getElementById("tags")
const addTagsItem = document.getElementById("add_tags")
const subjectSelect = document.getElementById("subject")
const chapterSelect = document.getElementById("chapter")
const sectionSelect = document.getElementById("section")
const chapter_sectionDiv = document.querySelector(".two-columns")
const chooseSubjectItem = document.getElementById("choose_subject")
const pickChapterSectionItem = document.getElementById("pick_chapter_section")
const feedback = document.getElementById("feedback")
const container = document.querySelector(".container")
let subject = "no_choice",
  inputValues = [],
  chapters = {
    seven: {},
    eight: {},
    alg: {},
    geo: {},
    p_s: {},
    alg2: {},
    pc: {},
    calc: {},
    calc2: {},
  },
  selected_chapter = "all"

const getChapters = async () => {
  try {
    const {
      data: { _seven, _eight, _alg, _geo, _p_s, _alg2, _pc, _calc, _calc2 },
    } = await axios.get("/api/v1/chapters")
    chapters.seven = _seven
    chapters.eight = _eight
    chapters.alg = _alg
    chapters.geo = _geo
    chapters.p_s = _p_s
    chapters.alg2 = _alg2
    chapters.pc = _pc
    chapters.calc = _calc
    chapters.calc2 = _calc2
  } catch (error) {
    console.log(error)
  }
}

const checkList = (li, action) => {
  let i = li.querySelector("i")
  switch (action) {
    case "check":
      li.classList.replace("not_met", "satisfied")
      i.classList.replace("fa-times-circle", "fa-check-circle")
      break
    case "uncheck":
      li.classList.replace("satisfied", "not_met")
      i.classList.replace("fa-check-circle", "fa-times-circle")
      break
    default:
      break
  }
}

const checkReqs = () => {
  let satisfied = true
  for (let item of publishReqs) {
    if (item.classList.contains("not_met")) {
      satisfied = false
      break
    }
  }
  if (satisfied && publishBtn.classList.contains("no-click")) {
    publishBtn.classList.remove("no-click")
    publishBtn.parentElement.classList.remove("no-click")
  } else if (!satisfied && !publishBtn.classList.contains("no-click")) {
    publishBtn.classList.add("no-click")
    publishBtn.parentElement.classList.add("no-click")
  }
}

const removeInvalidCharacters = (string) => {
  let bool = true
  while (bool) {
    let firstLetterCode = string.charCodeAt(0)
    let lastLetterCode = string.charCodeAt(string.length - 1)
    if (
      firstLetterCode < 97 ||
      firstLetterCode > 122 ||
      lastLetterCode < 97 ||
      lastLetterCode > 122
    ) {
      if (firstLetterCode < 97 || firstLetterCode > 122) {
        string = string.substring(1, string.length)
      }
      if (lastLetterCode < 97 || lastLetterCode > 122) {
        string = string.substring(0, string.length - 1)
      }
    } else {
      bool = false
    }
  }

  for (let index in string) {
    let code = string.charCodeAt(index)
    if ((code < 97 || code > 122) && code !== 45 && code !== 39) {
      string = string.replace(string[index], " ")
    }
  }
  string = string.replaceAll(" ", "")
  return string
}

const removeTag = (e) => {
  let target = e.target
  let value = target.innerText
  value = value.substring(0, value.length - 2)
  inputValues.splice(inputValues.indexOf(value), 1)
  target.remove()
  if (inputValues.length === 0) {
    tags.classList.add("hide")
    checkList(addTagsItem, "uncheck")
    checkReqs()
  }
}

const addTag = (e) => {
  let keys = [13, 32, 188]
  if (keys.includes(e.keyCode)) {
    let value = tagsInput.value.trim().toLowerCase()
    value = removeInvalidCharacters(value)
    if (value.length === 0 || inputValues.includes(value)) {
      return (tagsInput.value = "")
    }
    let tag = document.createElement("button")
    let val = document.createElement("span")
    val.innerText = value
    let close = document.createElement("span")
    close.innerText = "×"
    tag.appendChild(val)
    tag.appendChild(close)
    tag.addEventListener("click", removeTag)
    tags.appendChild(tag)
    inputValues.push(value)
    if (inputValues.length > 0 && tags.classList.contains("hide")) {
      tags.classList.remove("hide")
      checkList(addTagsItem, "check")
      checkReqs()
    }
    tagsInput.value = ""
  }
}

const giveFeedback = (msg, status) => {
  feedback.innerText = msg
  feedback.classList.add(status)
  feedback.scrollIntoView()
  setTimeout(() => {
    container.scrollLeft = 0
    feedback.classList.remove(status)
  }, 3000)
}

const addTags = (incomingTags) => {
  inputValues = incomingTags
  if (inputValues.length > 0) {
    tags.classList.remove("hide")
    checkList(addTagsItem, "check")
    checkReqs()
  }
  for (let tag of incomingTags) {
    let newTag = document.createElement("button")
    let val = document.createElement("span")
    val.innerText = tag
    let close = document.createElement("span")
    close.innerText = "×"
    newTag.appendChild(val)
    newTag.appendChild(close)
    newTag.addEventListener("click", removeTag)
    tags.appendChild(newTag)
  }
}

const titleAdded = (e) => {
  const { target } = e
  target.value = target.value.trimStart()
  if (
    target.value.length > 0 &&
    createTitleItem.classList.contains("not_met")
  ) {
    checkList(createTitleItem, "check")
    checkReqs()
  } else if (
    target.value.length === 0 &&
    createTitleItem.classList.contains("satisfied")
  ) {
    checkList(createTitleItem, "uncheck")
    checkReqs()
  }
}

const removeOptions = (select) => {
  let options = Array.from(select.querySelectorAll("option"))
  for (let i = 1; i < options.length; i++) {
    options[i].remove()
  }
}

const subjectPicked = (e) => {
  const { target } = e
  if (subject !== target.value) {
    subject = target.value
    removeOptions(chapterSelect)
    resetChapterSection()
    if (target.value !== "no_choice") {
      addChapters(target.value)
    }
  }
  if (
    target.value !== "no_choice" &&
    chooseSubjectItem.classList.contains("not_met")
  ) {
    checkList(chooseSubjectItem, "check")
    chapter_sectionDiv.classList.remove("hide")
  } else if (
    target.value === "no_choice" &&
    chooseSubjectItem.classList.contains("satisfied")
  ) {
    checkList(chooseSubjectItem, "uncheck")
    if (pickChapterSectionItem.classList.contains("satisfied")) {
      checkList(pickChapterSectionItem, "uncheck")
    }
    chapter_sectionDiv.classList.add("hide")
    resetChapterSection()
  }
  checkReqs()
}

const addChapters = (val) => {
  let list = chapters[val]
  for (let c = 0; c < list.length; c++) {
    let chapter = document.createElement("option")
    chapter.innerHTML = `Chapter ${list[c].title.number}: ${list[c].title.name}`
    chapter.setAttribute("value", `${list[c].title.number}`)
    chapterSelect.appendChild(chapter)
  }
}

const chapterPicked = (e) => {
  const { target } = e
  if (
    target.value === "no_choice" &&
    !sectionSelect.parentElement.classList.contains("hide")
  ) {
    sectionSelect.parentElement.classList.add("hide")
    selected_chapter = "no_choice"
    sectionSelect.value = "no_choice"
    removeOptions(sectionSelect)
    if (pickChapterSectionItem.classList.contains("satisfied")) {
      checkList(pickChapterSectionItem, "uncheck")
    }
    checkReqs()
  } else if (target.value !== "no_choice") {
    if (selected_chapter !== target.value) {
      selected_chapter = target.value
      removeOptions(sectionSelect)
      addSections()
    }
    if (sectionSelect.parentElement.classList.contains("hide")) {
      sectionSelect.parentElement.classList.remove("hide")
    }
  }
}

const addSections = () => {
  let sections = chapters[subject][selected_chapter - 1].sections
  for (let s in sections) {
    let option = document.createElement("option")
    option.setAttribute("value", s)
    option.innerHTML = `Section ${s}: ${sections[s]}`
    sectionSelect.appendChild(option)
  }
}

const sectionPicked = (e) => {
  const { target } = e
  if (
    target.value !== "no_choice" &&
    pickChapterSectionItem.classList.contains("not_met")
  ) {
    checkList(pickChapterSectionItem, "check")
  } else if (
    target.value === "no_choice" &&
    pickChapterSectionItem.classList.contains("satisfied")
  ) {
    checkList(pickChapterSectionItem, "uncheck")
  }
  checkReqs()
}

const resetChapterSection = () => {
  // this gets called when the subject is "no_choice"
  if (chapterSelect.value !== "no_choice") {
    chapterSelect.value = "no_choice"
    removeOptions(chapterSelect)
  }
  if (sectionSelect.value !== "no_choice") {
    sectionSelect.value = "no_choice"
    removeOptions(sectionSelect)
  }
  sectionSelect.parentElement.classList.add("hide")

  if (pickChapterSectionItem.classList.contains("satisfied")) {
    checkList(pickChapterSectionItem, "uncheck")
  }
}

const isEqual = (obj1, obj2) => {
  for (let key in obj1) {
    if (key === "tags") {
      if (obj1.tags.length !== obj2.tags.length) {
        return false
      }
    } else if (key === "usedPIDs") {
      if (obj1.usedPIDs.length !== obj2.usedPIDs.length) {
        return false
      }
    } else if (key === "problems") {
      continue
    } else if (obj1[key] !== obj2[key]) {
      return false
    }
  }
  for (let index of obj1.tags) {
    if (obj1.tags[index] !== obj2.tags[index]) {
      return false
    }
  }
  if (obj1.usedPIDs) {
    for (let index in obj1.usedPIDs) {
      if (obj1.usedPIDs[index] !== obj2.usedPIDs[index]) {
        return false
      }
    }
  }
  return true
}

const getRole = async () => {
  try {
    const {
      data: { role },
    } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
    if (role !== "admin") {
      window.location.href = "/"
    }
  } catch (err) {
    console.log(err)
    window.location.href = "/"
  }
}

if (!token) {
  window.location.href = "/"
}

titleInput.addEventListener("keyup", titleAdded)
tagsInput.addEventListener("keyup", addTag)
subjectSelect.addEventListener("click", subjectPicked)
chapterSelect.addEventListener("click", chapterPicked)
sectionSelect.addEventListener("click", sectionPicked)
