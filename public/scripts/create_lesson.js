let textArea, textAreaText, fullscreenBtn, wordCountDiv, p, resourceId
let enoughWordsItem = document.getElementById("at_least_500")
let lastSave = {
  title: "",
  text: "",
  subject: "no_choice",
  tags: [],
}
let currentDoc = {
  title: "",
  text: "",
  subject: "no_choice",
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
      if (count >= 500 && p.classList.contains("need-more")) {
        p.innerText = `This has enough words to be published`
        p.classList.replace("need-more", "limit-met")
        checkList(enoughWordsItem, "check")
      } else if (count < 500) {
        p.innerText = `Add ${500 - count} more words to publish`
        if (p.classList.contains("limit-met")) {
          p.classList.replace("limit-met", "need-more")
          checkList(enoughWordsItem, "uncheck")
        }
      }
    })
    checkReqs()
  }
  const observer = new MutationObserver(callback)
  observer.observe(wordCountDiv, {
    childList: true,
  })
}

const isEqual = (obj1, obj2) => {
  for (let key in obj1) {
    if (key === "tags") {
      if (obj1.tags.length !== obj2.tags.length) {
        return false
      }
      continue
    } else if (obj1[key] !== obj2[key]) {
      return false
    }
  }
  for (let index in obj1.tags) {
    if (obj1.tags[index] !== obj2.tags[index]) {
      return false
    }
  }
  return true
}
const compareText = (e = null) => {
  currentDoc.text =
    tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
      "body"
    ).innerHTML
  currentDoc.title = titleInput.value.trim()
  currentDoc.tags = inputValues.slice()
  currentDoc.subject = subject
  if (e && !isEqual(currentDoc, lastSave)) {
    e.preventDefault()
    e.returnValue = ""
  } else if (!isEqual(currentDoc, lastSave)) {
    return false
  } else {
    return true
  }
}

const saveText = async (status) => {
  if (compareText()) {
    return giveFeedback("No changes were made since the last save.", "not_met")
  }
  textAreaText =
    tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
      "body"
    ).innerHTML
  lastSave = {
    text: textAreaText,
    tags: inputValues.slice(),
    title: titleInput.value.trim(),
    subject,
  }
  currentDoc = { ...lastSave }
  if (resourceId) {
    try {
      const { data } = await axios.patch(`/api/v1/lessons/${resourceId}`, {
        title: titleInput.value.trim(),
        text: textAreaText,
        tags: inputValues,
        subject,
        status,
      })
      giveFeedback("Save successful", "satisfied")
    } catch (err) {
      unauthorized(`A lesson with this title already exists`, pTitle)
      console.log(err)
    }
  } else {
    try {
      const {
        data: { id },
      } = await axios.post(`/api/v1/lessons`, {
        title: titleInput.value.trim(),
        text: textAreaText,
        tags: inputValues,
        subject,
        status,
      })
      if (status === "draft") {
        window.location.href = `/drafts/lesson/${id}`
      } else {
        window.location.href = `/lessons`
      }
    } catch (err) {
      giveFeedback(`A lesson with this title already exists`, "not_met")
      console.log(err)
    }
  }
}

const publishText = (e) => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create a title to save this lesson.", "not_met")
  }
  if (inputValues.length === 0) {
    return giveFeedback(
      "Create at least one tag to publish this lesson.",
      "not_met"
    )
  }
  if (subject === "no_choice") {
    return giveFeedback("Choose a subject to publish this lesson.", "not_met")
  }

  saveText("published")
}

const draftText = () => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create a title to save this lesson.", "not_met")
  }
  saveText("draft")
}

const getInfo = async (id) => {
  try {
    const {
      data: { title, tags, subject, text },
    } = await axios.get(`/api/v1/lessons/${id}`)
    titleInput.value = title
    titleInput.dispatchEvent(new KeyboardEvent("keyup"))
    textAreaText =
      tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
        "body"
      )
    textAreaText.innerHTML = text
    subjectSelect.value = subject
    subjectSelect.dispatchEvent(new Event("pointerup"))
    lastSave = { title, tags: tags.slice(), text, subject }
    currentDoc = { title, tags: tags.slice(), text, subject }
    textAreaText.dispatchEvent(new KeyboardEvent("keyup"))
    addTags(tags)
  } catch (err) {
    console.error(err)
  }
}

const init = () => {
  getRole()
  fullscreenBtn = document.querySelector('[aria-label="Fullscreen"]')
  fullscreenBtn.addEventListener("pointerup", changeTextAreaSize)
  changeTextAreaSize()
  wordCountDiv = document.querySelector(".tox-statusbar__wordcount")
  addWordCountP()
  observeWordCount()
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
window.addEventListener("beforeunload", compareText)
draftBtn.addEventListener("click", draftText)
publishBtn.addEventListener("pointerup", publishText)
