let textArea, textAreaText, fullscreenBtn, wordCountDiv, p, resourceId
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
