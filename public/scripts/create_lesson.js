let textAreaText, wordCountDiv, p, resourceId
let enoughWordsItem = document.getElementById("at_least_500")
const editor = document.querySelector(".editor")
const outer = document.querySelector(".outer")
const codeWrapper = document.querySelector(".code-wrapper")
const htmlEditor = document.getElementById("html")
const htmlSnippets = document.getElementById("htmlsnippets")
// const addSnip = document.getElementById("add_snip")
// const htmlInp = addSnip.previousElementSibling
const cssEditor = document.getElementById("css")
const cssSnippets = document.getElementById("csssnippets")
const jsEditor = document.getElementById("js")
const jsSnippets = document.getElementById("jssnippets")
// const preview = document.getElementById("preview")
const tabs = document.querySelector(".tabs")
const htmlBtn = document.getElementById("edit-html")
const cssBtn = document.getElementById("edit-css")
const jsBtn = document.getElementById("edit-js")
const updateBtn = document.getElementById("update-code")
const addSnipBtns = document.querySelectorAll("button[data-text]")
const flexContainerSnippet = document.getElementById("flex-container")
const dragbar = document.getElementById("dragbar")
const shield = document.getElementById("shield")
let dragging = false

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

// const changeTextAreaSize = () => {
//   if (!textArea) {
//     textArea = document.querySelector("[role='application']")
//   }
//   textArea.classList.toggle("tox-tinymce-resize")
// }

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
  // currentDoc.text =
  //   tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
  //     "body"
  //   ).innerHTML
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
  // textAreaText =
  //   tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
  //     "body"
  //   ).innerHTML
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
    } = await axios.get(`/api/v1/lessons/id/${id}`)
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
const dragStart = (e) => {
  dragging = true
  shield.style.display = "block"
}

const drag = (e) => {
  if (!dragging) {
    return
  }
  const { left, width } = outer.getBoundingClientRect()
  let newLeft = e.pageX - left

  if (newLeft < 75) {
    newLeft = 75
  } else if (newLeft + 50 > width) {
    newLeft = width - 50
  }
  dragbar.style.left = `${(newLeft / width) * 100 - 0.5}%`
  codeWrapper.style.width = `${(newLeft / width) * 100}%`
  let iframe = outer.querySelector("iframe")
  iframe.style.width = `${100 - (newLeft / width) * 100}%`
}

const dragEnd = (e) => {
  if (dragging) {
    dragging = false
    shield.setAttribute("style", "")
  }
}

const init = () => {
  htmlCode = CodeMirror(htmlEditor, {
    mode: "xml",
    lineNumbers: true,
    indentWithTabs: true,
    tabSize: 4,
  })
  cssCode = CodeMirror(cssEditor, {
    mode: "css",
    lineNumbers: true,
    indentWithTabs: true,
    tabSize: 4,
  })
  jsCode = CodeMirror(jsEditor, {
    mode: "javascript",
    lineNumbers: true,
    indentWithTabs: true,
    tabSize: 4,
  })
  updateBtn.addEventListener("pointerup", () => {
    document.activeElement.blur()
    let iframe = outer.querySelector("iframe")
    let width = iframe.style.width
    iframe.remove()
    iframe = document.createElement("iframe")
    iframe.setAttribute("style", `width: ${width};`)
    iframe.setAttribute("id", "preview")
    outer.insertAdjacentElement("beforeend", iframe)
    let h =
      '<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"' +
      'id="MathJax-script"></script>'
    h += htmlCode.getValue()
    let c = `<style> ${cssCode.getValue()} </style>`
    let j = "<scr" + "ipt>" + jsCode.getValue() + "</scr" + "ipt>"
    let p = iframe.contentDocument
    p.open()
    p.write(h + c + j)
    p.close()
  })
  cssEditor.classList.add("hide")
  // content.textContent = "\(x = {-b \pm \sqrt{b^2-4ac} \over 2a}\)"

  getRole()
  getChapters()
  // changeTextAreaSize()
  wordCountDiv = document.querySelector(".tox-statusbar__wordcount")
  // addWordCountP()
  // observeWordCount()
  if (path.split("/")[3]) {
    resourceId = path.split("/")[3]
    setTimeout(() => {
      getInfo(resourceId)
    }, 500)
  } else {
    // tinymce.activeEditor.iframeElement.contentWindow.document.querySelector(
    //   "body"
    // ).innerHTML = ""
  }
}

const removeSelected = () => {
  let selected = tabs.querySelector("button.selected")
  if (selected) {
    selected.classList.remove("selected")
  } else {
    return
  }
  selected = editor.querySelector(".code:not(.hide)")
  selected.classList.add("hide")
  selected = document.querySelector(".snippets_container:not(.hide)")
  selected.classList.add("hide")
}

htmlBtn.addEventListener("pointerup", () => {
  removeSelected()
  htmlBtn.classList.add("selected")
  htmlEditor.classList.remove("hide")
  htmlSnippets.classList.remove("hide")
})

cssBtn.addEventListener("pointerup", () => {
  removeSelected()
  cssBtn.classList.add("selected")
  cssEditor.classList.remove("hide")
  cssSnippets.classList.remove("hide")
})

jsBtn.addEventListener("pointerup", () => {
  removeSelected()
  jsBtn.classList.add("selected")
  jsEditor.classList.remove("hide")
  jsSnippets.classList.remove("hide")
})

addSnipBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const { target } = e
    const {
      dataset: { snipName, lang },
    } = target
    const { data } = await axios.get(`/api/v1/snippets/${lang}/${snipName}`)
    navigator.clipboard.writeText(data.data)
    target.setAttribute("data-text", "Copied!")
    setTimeout(() => {
      target.setAttribute("data-text", "Click to copy")
      document.activeElement.blur()
    }, 1000)
  })
})

window.addEventListener("load", init)
dragbar.addEventListener("pointerdown", dragStart)
window.addEventListener("pointermove", drag)
window.addEventListener("pointerup", dragEnd)
window.addEventListener("beforeunload", compareText)
draftBtn.addEventListener("pointerup", draftText)
publishBtn.addEventListener("pointerup", publishText)
