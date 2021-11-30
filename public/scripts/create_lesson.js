let textArea, textAreaText, fullscreenBtn, wordCountDiv, p, resourceId
let enoughWordsItem = document.getElementById("at_least_500")
let lastSave = {
  title: "",
  text: "",
  subject: "no_choice",
  chapter: "no_choice",
  section: "no_choice",
  tags: [],
}
let currentDoc = {
  title: "",
  text: "",
  subject: "no_choice",
  chapter: "no_choice",
  section: "no_choice",
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
        checkReqs()
      } else if (count < 500) {
        if (count === 499) {
          p.innerText = `Add 1 more word to publish`
        } else {
          p.innerText = `Add ${500 - count} more words to publish`
        }
        if (p.classList.contains("limit-met")) {
          p.classList.replace("limit-met", "need-more")
          checkList(enoughWordsItem, "uncheck")
          checkReqs()
        }
      }
    })
  }
  const observer = new MutationObserver(callback)
  observer.observe(wordCountDiv, {
    childList: true,
  })
}

const compareText = (e = null) => {
  currentDoc.text =
    tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
      "body"
    ).innerHTML
  currentDoc.title = titleInput.value.trim()
  currentDoc.tags = inputValues.slice()
  currentDoc.subject = subject
  currentDoc.chapter = chapter
  currentDoc.section = section
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
  document.activeElement.blur()
  if (compareText() && status === "draft") {
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
    chapter,
    section,
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
        chapter,
        section,
      })
      if (status === "draft") {
        giveFeedback("Save successful", "satisfied")
      } else {
        giveFeedback("This lesson has been published", "satisfied")
      }
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
        chapter,
        section,
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
  if (chapter === "no_choice") {
    return giveFeedback("Pick a chapter to publish this lesson.", "not_met")
  }
  if (section === "no_choice") {
    return giveFeedback("Pick a section to publish this lesson.", "not_met")
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
      data: { title, tags, subject, chapter: c, section: s, text },
    } = await axios.get(`/api/v1/lessons/${id}`)
    titleInput.value = title
    titleInput.dispatchEvent(new KeyboardEvent("keyup"))
    textAreaText =
      tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
        "body"
      )
    textAreaText.innerHTML = text
    subjectSelect.value = subject
    subjectSelect.dispatchEvent(new Event("click"))
    if (c !== "no_choice") {
      chapterSelect.value = c
      chapterSelect.dispatchEvent(new Event("click"))
    }
    console.log(typeof s, s)
    if (s !== "no_choice") {
      sectionSelect.value = s
      sectionSelect.dispatchEvent(new Event("click"))
    }
    lastSave = {
      title,
      tags: tags.slice(),
      text,
      subject,
      chapter: c,
      section: s,
    }
    currentDoc = {
      title,
      tags: tags.slice(),
      text,
      subject,
      chapter: c,
      section: s,
    }
    textAreaText.dispatchEvent(new KeyboardEvent("keyup"))
    addTags(tags)
  } catch (err) {
    console.error(err)
  }
}

const init = () => {
  getRole()
  getChapters()
  fullscreenBtn = document.querySelector('[aria-label="Fullscreen"]')
  fullscreenBtn.addEventListener("pointerup", changeTextAreaSize)
  changeTextAreaSize()
  wordCountDiv = document.querySelector(".tox-statusbar__wordcount")
  addWordCountP()
  observeWordCount()
  if (path.split("/")[3]) {
    resourceId = path.split("/")[3]
    setTimeout(() => {
      getInfo(resourceId)
    }, 500)
  } else {
    tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
      "body"
    ).innerHTML = ""
  }
}

window.addEventListener("load", init)
window.addEventListener("beforeunload", compareText)
draftBtn.addEventListener("pointerup", draftText)
publishBtn.addEventListener("pointerup", publishText)
