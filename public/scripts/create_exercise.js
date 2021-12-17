//this is for the onload, draft, publish, and any util functions
// that apply to multiple sections
const publishExerciseReqs = document.querySelector(".to_publish_reqs:not(.q)")
const labelPs = Array.from(
  document.querySelectorAll(".label-wrapper p")
).splice(3)
let questionTextAreaDiv,
  questionTextArea,
  correctAnswerTextAreaDiv,
  correctAnswerTextArea,
  choicesTextAreaDiv,
  choicesTextArea,
  resourceId,
  i

let lastSave = {
  title: "",
  subject: "no_choice",
  chapter: "no_choice",
  section: "no_choice",
  tags: [],
  problems: { easy: {}, standard: {}, hard: {}, advanced: {}, no_choice: {} },
  usedPIDs: [],
}
let currentExercise = {
  title: "",
  subject: "no_choice",
  chapter: "no_choice",
  section: "no_choice",
  tags: [],
  problems: { easy: {}, standard: {}, hard: {}, advanced: {}, no_choice: {} },
  usedPIDs: [],
}

//util
const hideOrShowThisTextArea = (textarea, action) => {
  switch (`${textarea} ${action}`) {
    case "questionTextArea hide":
      questionTextArea.innerHTML = "<p></p>"
      questionSection.classList.remove("hide")
      questionSection.classList.remove("pop-top")
      questionTextAreaDiv.classList.add("hide")
      extraOptions_0.classList.add("hide")
      break
    case "questionTextArea show":
      questionSection.classList.add("pop-top")
      questionTextAreaDiv.classList.remove("hide")
      extraOptions_0.classList.remove("hide")
      break
    case "correctAnswerTextArea hide":
      correctAnswerTextArea.innerHTML = "<p></p>"
      correctAnswerSection.classList.remove("hide")
      correctAnswerSection.classList.remove("pop-top")
      correctAnswerTextAreaDiv.classList.add("hide")
      extraOptions_1.classList.add("hide")
      break
    case "correctAnswerTextArea show":
      correctAnswerSection.classList.add("pop-top")
      correctAnswerTextAreaDiv.classList.remove("hide")
      extraOptions_1.classList.remove("hide")
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

const removeNonsense = (codeBlock) => {
  let breaks = codeBlock.querySelectorAll("br")
  let ps = codeBlock.querySelectorAll("p")
  breaks.forEach((br) => {
    br.remove()
  })
  ps.forEach((p) => {
    if (p.innerText.trim() === "" && !p.querySelector("img")) {
      p.remove()
    }
  })
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
        chapter: c,
        section: s,
        problems: p,
        usedPIDs: upids,
      },
    } = await axios.get(`/api/v1/exercises/id/${id}`)
    titleInput.value = title
    checkList(createTitleItem, "check")
    addTags(tags)
    subjectSelect.value = subject
    subjectSelect.dispatchEvent(new Event("click"))
    if (c !== "no_choice") {
      chapterSelect.value = `${c}`
      chapterSelect.dispatchEvent(new Event("click"))
    }
    if (s !== "no_choice") {
      sectionSelect.value = `${s}`
      sectionSelect.dispatchEvent(new Event("click"))
    }
    problems = p
    usedPIDs = upids
    addAllProblems()
    checkReqs()
    lastSave = {
      title,
      tags: tags.slice(),
      subject,
      chapter: c,
      section: s,
      problems: { ...p },
      usedPIDs: upids.slice(),
    }
    currentExercise = { ...lastSave }
  } catch (err) {
    console.error(err)
  }
}

const sameProblemSet = (e = null) => {
  currentExercise = {
    title: titleInput.value.trim(),
    subject,
    chapter,
    section,
    tags: inputValues,
    problems,
    usedPIDs,
  }
  if (isEqual(currentExercise, lastSave)) {
    return true
  } else {
    if (e) {
      e.preventDefault()
      e.returnValue = ""
    }
    return false
  }
}

const defineTextAreas = () => {
  questionTextAreaDiv = document.querySelectorAll('[role="application"]')[0]
  correctAnswerTextAreaDiv = document.querySelectorAll(
    '[role="application"]'
  )[1]
  choicesTextAreaDiv = document.querySelectorAll('[role="application"]')[2]
  questionTextArea = tinymce.DOM.win[0].document.body
  correctAnswerTextArea = tinymce.DOM.win[1].document.body
  choicesTextArea = tinymce.DOM.win[2].document.body
  questionTextArea.innerHTML = "<p></p>"
  correctAnswerTextArea.innerHTML = "<p></p>"
  choicesTextArea.innerHTML = "<p></p>"
}

const saveExercise = async (status) => {
  document.activeElement.blur()
  if (resourceId) {
    if (sameProblemSet()) {
      giveFeedback("No changes were made since the last save.", "not_met")
      return
    }
    try {
      await axios.patch(`/api/v1/exercises/id/${resourceId}`, {
        title: titleInput.value.trim(),
        tags: inputValues,
        subject,
        problems,
        status,
        chapter,
        section,
        usedPIDs,
      })
      giveFeedback("Save successful", "satisfied")
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
        tags: inputValues,
        subject,
        chapter,
        section,
        problems,
        status,
        usedPIDs,
      })
      if (status === "draft") {
        window.removeEventListener("beforeunload", sameProblemSet)
        window.location.href = `/drafts/exercise/${id}`
      } else {
        window.location.href = `/exercises`
      }
    } catch (err) {
      giveFeedback("An exercise with that title already exists.", "not_met")
      console.error(err)
    }
  }
}

const publishExercise = (e) => {
  let value = titleInput.value.trim()
  if (!value) {
    titleInput.value = ""
    return giveFeedback("Create a title to save this exercise.", "not_met")
  }
  if (inputValues.length === 0) {
    return giveFeedback("Add tags to publish this exercise.", "not_met")
  }
  if (subject === "no_choice") {
    return giveFeedback("Choose a subject to publish this exercise.", "not_met")
  }
  if (chapter === "no_choice") {
    return giveFeedback("Pick a chapter to publish this lesson.", "not_met")
  }
  if (section === "no_choice") {
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
  await getRole()
  await getChapters()
  defineTextAreas()
  listenForChangesToPublishExerciseList()
  if (path.split("/")[3]) {
    resourceId = path.split("/")[3]
    await getInfo(resourceId)
  }
}

window.addEventListener("load", init)
window.addEventListener("beforeunload", sameProblemSet)
draftBtn.addEventListener("pointerup", draftExercise)
publishBtn.addEventListener("pointerup", publishExercise)
