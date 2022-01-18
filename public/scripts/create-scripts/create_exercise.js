//this is for the onload, draft, publish, and any util functions
// that apply to multiple sections
const publishExerciseReqs = document.querySelector(".to_publish_reqs:not(.q)")
const labelPs = document.querySelectorAll(".label-wrapper p")
const qTA = document.getElementById("q")
const aTA = document.getElementById("a")
const cTA = document.getElementById("c")
let resourceId, i

//util
const hideOrShowThisTextArea = (textarea, action) => {
  switch (`${textarea} ${action}`) {
    case "qTA hide":
      qTA.classList.add("hide")
      questionSection.classList.remove("hide", "pop-top")
      toolbars_0.classList.add("hide")
      break
    case "qTA show":
      qTA.classList.remove("hide")
      questionSection.classList.add("pop-top")
      toolbars_0.classList.remove("hide")
      break
    case "aTA hide":
      aTA.classList.add("hide")
      correctAnswerSection.classList.remove("hide", "pop-top")
      toolbars_1.classList.add("hide")
      break
    case "aTA show":
      aTA.classList.remove("hide")
      correctAnswerSection.classList.add("pop-top")
      toolbars_1.classList.remove("hide")
      break
    default:
      break
  }
}

const showNotUniqueMsg = (p) => {
  p.classList.remove("hide")
  setTimeout(() => {
    p.classList.add("hide")
  }, 2000)
}

const removeEmptyDivs = (codeBlock) => {
  let breaks = codeBlock.querySelectorAll("div > br")
  breaks.forEach((b) => {
    const { parentElement } = b
    if (parentElement.childElementCount === 1) {
      parentElement.remove()
    } else {
      b.remove()
    }
  })
}

const listenForEnterKey = () => {
  const callback = (mutations) => {
    mutations.forEach((mutation) => {
      const { target } = mutation
      if (
        target.classList.contains("img-wrapper") &&
        !target.querySelector("img")
      ) {
        target.removeAttribute("class")
      }
    })
  }
  const observer = new MutationObserver(callback)
  const config = {
    childList: true,
    subtree: true,
    attributes: true,
  }
  observer.observe(qTA, config)
  observer.observe(aTA, config)
  observer.observe(cTA, config)
}

const listenForChangesToPublishExerciseList = () => {
  let satisfied
  const callback = () => {
    let unsatisfied = publishExerciseReqs.querySelector(".not_met")
    if (unsatisfied !== null) {
      satisfied = false
    } else {
      satisfied = true
    }
    if (satisfied && publishBtn.classList.contains("no-click")) {
      publishBtn.classList.remove("no-click")
      publishBtn.addEventListener("pointerup", publishExercise)
    } else if (!satisfied && !publishBtn.classList.contains("no-click")) {
      publishBtn.classList.add("no-click")
      publishBtn.removeEventListener("pointerup", publishExercise)
    }
  }
  const observer = new MutationObserver(callback)
  observer.observe(publishExerciseReqs, {
    childList: true,
    subtree: true,
    attributes: true,
  })
}

//create

//read

//delete

const getInfo = async (id) => {
  try {
    const {
      data: {
        title,
        tags,
        subject,
        chapter,
        section,
        problems: p,
        usedPIDs: upids,
      },
    } = await axios.get(`/api/v1/exercises/id/${id}`)
    titleInput.value = title
    titleInput.dispatchEvent(new Event("input"))
    addTags(tags)
    subjectSelect.value = subject
    subjectSelect.dispatchEvent(new Event("input"))
    if (chapter !== "0") {
      chapterSelect.value = `${chapter}`
      chapterSelect.dispatchEvent(new Event("input"))
    }
    if (section !== "0") {
      sectionSelect.value = `${section}`
      sectionSelect.dispatchEvent(new Event("input"))
    }
    problems = p
    usedPIDs = upids
    addAllProblems()
    checkReqs()
  } catch (err) {
    console.error(err)
  }
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

getImgTagBtn.addEventListener("pointerup", async (e) => {
  const { target } = e
  localStorage.setItem(
    "img",
    JSON.stringify({
      src: imgPrev.getAttribute("src"),
      alt: imgPrev.getAttribute("alt"),
    })
  )
  target.setAttribute("data-text", "Copied!")
  setTimeout(() => {
    target.setAttribute("data-text", "Click to copy")
    document.activeElement.blur()
  }, 1000)
})

const paste = (e) => {
  const { target } = e
  let img = localStorage.getItem("img")
  if (img) {
    e.preventDefault()
    img = JSON.parse(img)
    const { src, alt } = img
    let imgTag = document.createElement("img")
    let div = document.createElement("div")
    div.setAttribute("class", "img-wrapper")
    imgTag.setAttribute("src", src)
    imgTag.setAttribute("alt", alt)
    div.appendChild(imgTag)
    if (!target.id) {
      target.parentElement.replaceChild(div, target)
    } else {
      target.insertAdjacentElement("afterbegin", div)
    }
    localStorage.removeItem("img")
  }
}

const addMathType = () => {
  window.wrs_int_init(qTA, document.getElementById("toolbar-q"))
  window.wrs_int_init(aTA, document.getElementById("toolbar-a"))
  window.wrs_int_init(cTA, document.getElementById("toolbar-c"))
  document.getElementById("chemistryIcon").remove()
  document.getElementById("chemistryIcon").remove()
  document.getElementById("chemistryIcon").remove()
  Array.from(document.getElementsByClassName("mathtype")).forEach((btn) => {
    btn.addEventListener("click", () => {
      document.activeElement.blur()
    })
  })
}

const saveExercise = async (status) => {
  document.activeElement.blur()
  if (resourceId) {
    if (!canSave && status === "draft") {
      giveFeedback("No changes were made since the last save.", "not_met")
      return
    }
    try {
      await axios.patch(`/api/v1/exercises/id/${resourceId}`, {
        title: titleInput.value.trim(),
        tags,
        subject: subjectSelect.value,
        chapter: chapterSelect.value,
        section: sectionSelect.value,
        problems,
        usedPIDs,
        status,
      })
      if (status === "draft") {
        giveFeedback("Save successful", "satisfied")
      } else {
        giveFeedback("This exercise has been published", "satisfied")
      }
    } catch (err) {
      giveFeedback("An exercise with that title already exists.", "not_met")
      console.error(err)
    }
  } else {
    try {
      const {
        data: { id },
      } = await axios.post("/api/v1/exercises", {
        title: titleInput.value.trim(),
        tags,
        subject: subjectSelect.value,
        chapter: chapterSelect.value,
        section: sectionSelect.value,
        problems,
        usedPIDs,
      })
      if (status === "draft") {
        window.location.href = `/drafts/exercise/${id}`
      } else {
        window.location.href = `/exercises`
      }
    } catch (err) {
      giveFeedback("An exercise with that title already exists.", "not_met")
      console.error(err)
    }
  }
  allowSave(false)
}

const publishExercise = (e) => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create a title to save this exercise.", "not_met")
  }
  if (tags.length === 0) {
    return giveFeedback("Add tags to publish this exercise.", "not_met")
  }
  if (subject === "0") {
    return giveFeedback("Choose a subject to publish this exercise.", "not_met")
  }
  if (chapter === "0") {
    return giveFeedback("Pick a chapter to publish this lesson.", "not_met")
  }
  if (section === "0") {
    return giveFeedback("Pick a section to publish this lesson.", "not_met")
  }
  saveExercise("published")
}

const draftExercise = () => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create a title to save this exercise.", "not_met")
  }
  saveExercise("draft")
}

const init = async () => {
  getRole()
  await getChapters()
  addMathType()
  let tas = [qTA, aTA, cTA]
  tas.forEach((ta) => {
    ta.addEventListener("paste", paste)
  })
  listenForEnterKey()
  imgInput.addEventListener("change", handleFileSelect)
  listenForChangesToPublishExerciseList()
  if (path.split("/")[3]) {
    resourceId = path.split("/")[3]
    await getInfo(resourceId)
    allowSave(false)
  }
}

const unsavedChanges = (e) => {
  // check if there is any text in any of the textareas that haven't been saved
  // check if there are any list items under any of the textareas that don't
  // have a home

  if (canSave) {
    e.preventDefault()
    e.returnValue = ""
  }
}

window.addEventListener("load", init)
window.addEventListener("beforeunload", unsavedChanges)
draftBtn.addEventListener("pointerup", draftExercise)
publishBtn.addEventListener("pointerup", publishExercise)
