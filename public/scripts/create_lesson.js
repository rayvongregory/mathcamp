let resourceId, observer
const editor = document.querySelector(".editor")
const outer = document.querySelector(".outer")
const codeWrapper = document.querySelector(".code-wrapper")
const htmlEditor = document.getElementById("html")
const htmlSnippets = document.getElementById("htmlsnippets")
const cssEditor = document.getElementById("css")
const cssSnippets = document.getElementById("csssnippets")
const jsEditor = document.getElementById("js")
const jsSnippets = document.getElementById("jssnippets")
const tabs = document.querySelector(".tabs")
const htmlBtn = document.getElementById("edit-html")
const cssBtn = document.getElementById("edit-css")
const jsBtn = document.getElementById("edit-js")
const updateBtn = document.getElementById("update-code")
const addSnipBtns = document.querySelectorAll(
  "button[data-text]:not(#get_img_tag)"
)
const dragbar = document.getElementById("dragbar")
const shield = document.getElementById("shield")
let dragging = false

const saveText = async (status) => {
  document.activeElement.blur()
  if (!canSave && status === "draft") {
    return giveFeedback("No changes were made since the last save.", "not_met")
  }
  let currentDoc = {
    title: titleInput.value.trim(),
    subject: subjectSelect.value,
    chapter: chapterSelect.value,
    section: sectionSelect.value,
    tags: tags.slice(),
    html: htmlCode.getValue(),
    css: cssCode.getValue(),
    js: jsCode.getValue(),
  }
  if (resourceId) {
    try {
      await axios.patch(`/api/v1/lessons/id/${resourceId}`, currentDoc)
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
      } = await axios.post(`/api/v1/lessons`, currentDoc)
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
  allowSave(false)
  turnOnObserver()
}

const publishText = (e) => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create a title to save this lesson.", "not_met")
  }
  if (tags.length === 0) {
    return giveFeedback(
      "Create at least one tag to publish this lesson.",
      "not_met"
    )
  }
  if (subject === "0") {
    return giveFeedback("Choose a subject to publish this lesson.", "not_met")
  }
  if (chapter === "0") {
    return giveFeedback("Pick a chapter to publish this lesson.", "not_met")
  }
  if (section === "0") {
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
      data: { title, subject, chapter, section, tags, html, css, js },
    } = await axios.get(`/api/v1/lessons/id/${id}`)
    titleInput.value = title
    titleInput.dispatchEvent(new Event("input"))
    htmlCode.getDoc().setValue(html)
    cssCode.getDoc().setValue(css)
    jsCode.getDoc().setValue(js)
    subjectSelect.value = subject
    subjectSelect.dispatchEvent(new Event("input"))
    if (chapter !== "0") {
      chapterSelect.value = chapter
      chapterSelect.dispatchEvent(new Event("input"))
    }
    if (section !== "0") {
      sectionSelect.value = section
      sectionSelect.dispatchEvent(new Event("input"))
    }
    addTags(tags)
  } catch (err) {
    console.log(err)
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

const turnOnObserver = () => {
  observer = new MutationObserver((m) => {
    allowSave(true)
    observer.disconnect()
  })
  let config = { childList: true, subtree: true }
  document.querySelectorAll(".CodeMirror").forEach((cm) => {
    observer.observe(cm, config)
  })
}

const init = async () => {
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
  turnOnObserver()
  updateBtn.addEventListener("pointerup", () => {
    document.activeElement.blur()
    let iframe = outer.querySelector("iframe")
    let width = iframe.style.width
    iframe.remove()
    iframe = document.createElement("iframe")
    iframe.setAttribute("style", `width: ${width};`)
    iframe.setAttribute("id", "preview")
    outer.insertAdjacentElement("beforeend", iframe)
    let h = '<script src="/mathjax/es5/tex-chtml.js"' + "></script>"
    h += htmlCode.getValue()
    let c = `<style> body {padding: 1rem;} ${cssCode.getValue()} </style>`
    let j = "<scr" + "ipt>" + jsCode.getValue() + "</scr" + "ipt>"
    let p = iframe.contentDocument
    p.open()
    p.write(h + c + j)
    p.close()
  })
  getRole()
  await getChapters()
  if (path.split("/")[3]) {
    resourceId = path.split("/")[3]
    await getInfo(resourceId)
    updateBtn.dispatchEvent(new Event("pointerup"))
    allowSave(false)
    turnOnObserver()
  }
  cssEditor.classList.add("hide")
  jsEditor.classList.add("hide")
  imgInput.addEventListener("change", handleFileSelect)
}

const handleFileSelect = (e) => {
  if (getImgTagBtn.classList.contains("invis")) {
    getImgTagBtn.classList.remove("invis")
    imgPrev.classList.remove("invis")
  }
  const { target } = e
  let reader = new FileReader()
  reader.onload = (e) => {
    let src = e.target.result.toString("base64")
    imgPrev.setAttribute("src", src)
    imgPrev.setAttribute("alt", target.files[0].name)
  }
  reader.readAsDataURL(target.files[0])
}

const removeSelected = () => {
  document.activeElement.blur()
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

getImgTagBtn.addEventListener("pointerup", async (e) => {
  const { target } = e
  const img = document.createElement("img")
  img.setAttribute("src", imgPrev.getAttribute("src"))
  img.setAttribute("alt", imgPrev.getAttribute("alt"))
  navigator.clipboard.writeText(img.outerHTML)
  target.setAttribute("data-text", "Copied!")
  setTimeout(() => {
    target.setAttribute("data-text", "Click to copy")
    document.activeElement.blur()
  }, 1000)
})

let downedKeys = []

document.addEventListener("keydown", (e) => {
  if (e.key === "Control" && downedKeys.length === 0) {
    downedKeys.push("Control")
  }
  if (e.key === "s" && downedKeys.includes("Control")) {
    e.preventDefault()
    e.stopPropagation()
    updateBtn.dispatchEvent(new Event("pointerup"))
    if (canSave) {
      draftBtn.dispatchEvent(new Event("pointerup"))
    }
  }
})

document.addEventListener("keyup", (e) => {
  if (e.key === "Control") downedKeys = []
})

const unsavedChanges = (e) => {
  if (canSave) {
    e.preventDefault()
    e.returnValue = ""
  }
}

window.addEventListener("load", init)
dragbar.addEventListener("pointerdown", dragStart)
window.addEventListener("pointermove", drag)
window.addEventListener("pointerup", dragEnd)
window.addEventListener("beforeunload", unsavedChanges)
draftBtn.addEventListener("pointerup", draftText)
publishBtn.addEventListener("pointerup", publishText)
