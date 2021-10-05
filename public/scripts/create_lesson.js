const type = window.location.pathname.split("/")[2]
const html = document.querySelector("html")
const body = document.querySelector("body")
const publishBtn = document.querySelector("#publish")
const draftBtn = document.querySelector("#draft")
let titleInput = document.querySelector("#title")
let tagsInput = document.querySelector("#tags_input")
let tags = document.querySelector("#tags")
let pTag = document.querySelector("#ptag") //!may need this later but currently not used
let pTitle = document.querySelector("#ptitle")
let textArea, textAreaText, fullscreenBtn, wordCountDiv, p, resourceId
let inputValues = []
let token = localStorage.getItem("token")
let lastSave = {
  title: "",
  text: "",
  tags: [],
}
let currentDoc = {
  title: "",
  text: "",
  tags: [],
}

const changeTextAreaSize = () => {
  if (!textArea) {
    textArea = document.querySelector("[role='application']")
  }
  textArea.classList.toggle("tox-tinymce-resize")
}

const addWordCountP = () => {
  p = document.createElement("p")
  p.innerText = "Add 500 more words to publish"
  p.classList.add("need-more")
  wordCountDiv.parentNode.insertBefore(p, wordCountDiv)
}

const observeWordCount = () => {
  const callback = (mutations) => {
    mutations.forEach((mutation) => {
      let count = Number(mutation.target.innerHTML.split(" ")[0])
      if (count >= 500) {
        p.innerText = `This ${type} has enough words to be published`
        p.classList.remove("need-more")
        p.classList.add("limit-met")
        publishBtn.classList.remove("no-click")
        publishBtn.addEventListener("click", publishText)
      } else {
        p.innerText = `Add ${500 - count} more words to publish`
        p.classList.remove("limit-met")
        p.classList.add("need-more")
        publishBtn.classList.add("no-click")
        publishBtn.removeEventListener("click", publishText)
      }
    })
  }
  const observer = new MutationObserver(callback)
  observer.observe(wordCountDiv, {
    childList: true,
  })
}

const getRole = async () => {
  try {
    const {
      data: { role },
    } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
    if (role === "admin") {
      html.style.visibility = "visible"
      body.style.backgroundColor = "var(--neutralLight)"
      fullscreenBtn = document.querySelector('[aria-label="Fullscreen"]')
      fullscreenBtn.addEventListener("pointerup", changeTextAreaSize)
      changeTextAreaSize()
      wordCountDiv = document.querySelector(".tox-statusbar__wordcount")
      addWordCountP()
      observeWordCount()
    } else {
      window.removeEventListener("beforeunload", compareText)
      window.location.href = "/"
    }
  } catch (err) {
    console.log(err)
    window.removeEventListener("beforeunload", compareText)
    window.location.href = "/"
  }
  window.removeEventListener("load", getRole)
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
  }
}

const isEqual = (obj1, obj2) => {
  for (let key in obj1) {
    if (key === "tags") {
      continue
    } else if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  if (obj1.tags.length !== obj2.tags.length) return false

  for (let index of obj1.tags) {
    if (obj1.tags[index] !== obj2.tags[index]) {
      return false
    }
  }
  return true
}

const addTag = (e) => {
  let keys = [13, 32, 188]
  if (keys.includes(e.keyCode)) {
    let value = tagsInput.value.trim().toLowerCase()
    value = removeInvalidCharacters(value)
    if (value.length === 0 || inputValues.includes(value)) {
      return (tagsInput.value = "")
    }
    let tag = document.createElement("li")
    tag.innerHTML = value
    let close = document.createElement("span")
    close.innerHTML = "×"
    tag.appendChild(close)
    tag.addEventListener("click", removeTag)
    inputValues.push(value)
    if (inputValues.length > 0) {
      tags.classList.remove("hide")
    }
    tags.appendChild(tag)
    tagsInput.value = ""
  }
}
tagsInput.addEventListener("keyup", addTag)

const compareText = (e) => {
  currentDoc.text =
    tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
      "body"
    ).innerHTML
  currentDoc.title = titleInput.value.trim()
  currentDoc.tags = inputValues.slice()
  if (!isEqual(currentDoc, lastSave)) {
    e.preventDefault()
    e.returnValue = ""
  }
}

const saveText = async (status) => {
  textAreaText =
    tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
      "body"
    ).innerHTML
  lastSave.text = textAreaText
  lastSave.tags = inputValues.slice()
  lastSave.title = titleInput.value.trim()
  currentDoc = {
    text: textAreaText,
    tags: inputValues.slice(),
    title: titleInput.value.trim(),
  }

  if (resourceId) {
    try {
      const { data } = await axios.patch(`/api/v1/${type}s/${resourceId}`, {
        title: titleInput.value.trim(),
        text: textAreaText,
        tags: inputValues,
        status,
      })
    } catch (err) {
      unauthorized(`A ${type} with this title already exists`, pTitle)
      console.log(err)
    }
  } else {
    try {
      const {
        data: { id },
      } = await axios.post(`/api/v1/${type}s`, {
        title: titleInput.value.trim(),
        text: textAreaText,
        tags: inputValues,
        status,
      })
      if (status === "draft") {
        window.location.href = `/drafts/${type}/${id}`
      } else {
        window.location.href = `/${type}s`
      }
    } catch (err) {
      unauthorized(`A ${type} with this title already exists`, pTitle)
      console.log(err)
    }
  }
}

const unauthorized = (string, element) => {
  let text = element.innerHTML
  element.innerHTML = `<p>${string}</p>`
  element.style.color = "darkred"
  setTimeout(() => {
    element.innerHTML = text
    element.style.color = ""
  }, 3000)
}

const publishText = (e) => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return unauthorized("Create to title to save this resource.", pTitle)
  }
  if (inputValues.length === 0) {
    return unauthorized(
      "Create at least one tag to publish this resource.",
      pTag
    )
  }

  saveText("published")
}

const draftText = () => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return unauthorized("Create to title to save this resource", pTitle)
  }
  saveText("draft")
}

const addTags = (incomingTags) => {
  inputValues = incomingTags
  if (inputValues.length > 0) {
    tags.classList.remove("hide")
  }
  for (let tag of incomingTags) {
    let newTag = document.createElement("li")
    newTag.innerHTML = tag
    let close = document.createElement("span")
    close.innerHTML = "×"
    newTag.appendChild(close)
    newTag.addEventListener("click", removeTag)
    tags.appendChild(newTag)
  }
}

const getInfo = async (id) => {
  try {
    const {
      data: { title, tags, text },
    } = await axios.get(`/api/v1/${type}s/${id}`)
    titleInput.value = title
    textAreaText =
      tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
        "body"
      )
    textAreaText.innerHTML = text
    lastSave = { title, tags: tags.slice(), text }
    currentDoc = { title, tags: tags.slice(), text }
    textAreaText.dispatchEvent(new KeyboardEvent("keyup"))
    addTags(tags)
  } catch (err) {
    console.error(err)
  }
}

const init = () => {
  getRole()
  const path = window.location.pathname
  if (path.split("/")[3]) {
    resourceId = path.split("/")[3]
    getInfo(resourceId)
  } else {
    tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
      "body"
    ).innerHTML = ""
  }
}

window.addEventListener("load", init)
draftBtn.addEventListener("click", draftText)
window.addEventListener("beforeunload", compareText)
