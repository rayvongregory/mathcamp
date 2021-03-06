const publishBtn = document.getElementById("publish")
const publishReqs = document.querySelectorAll(".to_publish_reqs:not(.q) li")
const draftBtn = document.getElementById("draft")
const titleInput = document.getElementById("title")
const createTitleItem = document.getElementById("create_title")
const tagsInput = document.getElementById("tags_input")
const tagsSection = document.getElementById("tags-section")
const addTagsItem = document.getElementById("add_tags")
const subjectSelect = document.getElementById("subject")
const chapterSelect = document.getElementById("chapter")
const sectionSelect = document.getElementById("section")
const chapter_sectionDiv = document.querySelector(".two-columns")
const chooseSubjectItem = document.getElementById("choose_subject")
const pickChapterSectionItem = document.getElementById("pick_chapter_section")
const feedback = document.getElementById("feedback")
const container = document.querySelector(".container")
const addImgBtn = document.getElementById("add_img")
const imgInput = addImgBtn.querySelector("input")
const imgPrev = document.getElementById("img_prev")
const getImgTagBtn = document.getElementById("get_img_tag")
let tags = [],
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
  canSave = false

const allowSave = (bool) => {
  if (canSave !== bool) {
    canSave = bool
  }
}

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
  tags.splice(tags.indexOf(value), 1)
  target.remove()
  allowSave(true)
  if (tags.length === 0) {
    tagsSection.classList.add("hide")
    checkList(addTagsItem, "uncheck")
    checkReqs()
  }
}

const addTag = (e) => {
  let keys = [13, 32, 188]
  if (keys.includes(e.keyCode)) {
    let value = tagsInput.value.trim().toLowerCase()
    value = removeInvalidCharacters(value)
    if (value.length === 0 || tags.includes(value)) {
      return (tagsInput.value = "")
    }
    let tag = document.createElement("button")
    let val = document.createElement("span")
    val.innerText = value
    let close = document.createElement("span")
    close.innerText = "??"
    tag.appendChild(val)
    tag.appendChild(close)
    tag.addEventListener("pointerup", removeTag)
    tagsSection.appendChild(tag)
    tags.push(value)
    if (tags.length > 0 && tagsSection.classList.contains("hide")) {
      tagsSection.classList.remove("hide")
      checkList(addTagsItem, "check")
      checkReqs()
    }
    tagsInput.value = ""
    allowSave(true)
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
  tags = incomingTags
  if (tags.length > 0) {
    tagsSection.classList.remove("hide")
    checkList(addTagsItem, "check")
    checkReqs()
  }
  for (let tag of incomingTags) {
    let newTag = document.createElement("button")
    let val = document.createElement("span")
    val.innerText = tag
    let close = document.createElement("span")
    close.innerText = "??"
    newTag.appendChild(val)
    newTag.appendChild(close)
    newTag.addEventListener("pointerup", removeTag)
    tagsSection.appendChild(newTag)
  }
}

const titleChanged = (e) => {
  allowSave(true)
  let { value } = e.target
  value = value.trimStart()
  if (value.length > 0 && createTitleItem.classList.contains("not_met")) {
    checkList(createTitleItem, "check")
    checkReqs()
  } else if (
    value.length === 0 &&
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

const subjectChanged = (e) => {
  const { value } = e.target
  const { parentElement } = sectionSelect.parentElement
  allowSave(true)
  removeOptions(chapterSelect)
  if (!parentElement.classList.contains("hide")) {
    parentElement.classList.add("hide")
  }
  if (pickChapterSectionItem.classList.contains("satisfied")) {
    checkList(pickChapterSectionItem, "uncheck")
  }
  if (value !== "no_choice") {
    addChapters(value)
    if (chooseSubjectItem.classList.contains("not_met")) {
      checkList(chooseSubjectItem, "check")
      chapter_sectionDiv.classList.remove("hide")
    }
  } else if (
    value === "no_choice" &&
    chooseSubjectItem.classList.contains("satisfied")
  ) {
    checkList(chooseSubjectItem, "uncheck")
    chapter_sectionDiv.classList.add("hide")
    if (chapterSelect.value !== "no_choice") {
      chapterSelect.value = "no_choice"
      removeOptions(chapterSelect)
    }
    if (sectionSelect.value !== "no_choice") {
      sectionSelect.value = "no_choice"
      removeOptions(sectionSelect)
    }
    if (pickChapterSectionItem.classList.contains("satisfied")) {
      checkList(pickChapterSectionItem, "uncheck")
    }
  }
  checkReqs()
}

const addChapters = (val) => {
  let list = chapters[val]
  for (let c = 0; c < list.length; c++) {
    let { number, name } = list[c].title
    let chapter = document.createElement("option")
    chapter.innerHTML = `Chapter ${number}: ${name}`
    chapter.setAttribute("value", `${number}`)
    chapterSelect.appendChild(chapter)
  }
}

const chapterChanged = (e) => {
  const { value } = e.target
  const { parentElement } = sectionSelect.parentElement
  allowSave(true)
  if (value === "0" && !parentElement.classList.contains("hide")) {
    parentElement.classList.add("hide")
    removeOptions(sectionSelect)
    sectionSelect.value = value
    if (pickChapterSectionItem.classList.contains("satisfied")) {
      checkList(pickChapterSectionItem, "uncheck")
    }
    checkReqs()
  } else if (value !== "0") {
    removeOptions(sectionSelect)
    addSections()
    if (parentElement.classList.contains("hide")) {
      parentElement.classList.remove("hide")
    }
  }
}

const addSections = () => {
  let { sections } =
    chapters[subjectSelect.value][Number(chapterSelect.value) - 1]
  for (let s in sections) {
    let option = document.createElement("option")
    option.setAttribute("value", s)
    option.innerHTML = `Section ${s}: ${sections[s]}`
    sectionSelect.appendChild(option)
  }
}

const sectionChanged = (e) => {
  const { value } = e.target
  allowSave(true)
  if (value !== "0" && pickChapterSectionItem.classList.contains("not_met")) {
    checkList(pickChapterSectionItem, "check")
  } else if (
    value === "0" &&
    pickChapterSectionItem.classList.contains("satisfied")
  ) {
    checkList(pickChapterSectionItem, "uncheck")
  }
  checkReqs()
}

const setAria = (btn, val) => {
  btn.setAttribute("aria-label", val)
  btn.setAttribute("title", val)
}

titleInput.addEventListener("input", titleChanged)
tagsInput.addEventListener("keyup", addTag)
subjectSelect.addEventListener("input", subjectChanged)
chapterSelect.addEventListener("input", chapterChanged)
sectionSelect.addEventListener("input", sectionChanged)
