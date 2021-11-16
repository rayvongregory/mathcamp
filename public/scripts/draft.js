const draftsSection = document.getElementById("drafts___section")
const draftsLessons = document.getElementById("drafts___lessons")
const draftsExercises = document.getElementById("drafts___exercises")
const nothingHere = document.getElementById("nothing-here")
let lessons = [],
  exercises = []

const editLesson = async (e) => {
  window.location.href = `/drafts/lesson/${e.target.parentElement.parentElement.dataset.id}`
}

const editExercise = async (e) => {
  window.location.href = `/drafts/exercise/${e.target.parentElement.parentElement.dataset.id}`
}

const getDrafts = async () => {
  try {
    let {
      data: { lessons: l, exercises: e },
    } = await axios.get("/api/v1/drafts")
    lessons = l
    exercises = e
    setGrid()
    if (lessons.length === 0) {
      draftsLessons.classList.add("hide")
    } else {
      addTo(draftsLessons, lessons, "lesson")
    }
    if (exercises.length === 0) {
      draftsExercises.classList.add("hide")
    } else {
      addTo(draftsExercises, exercises, "exercise")
    }
  } catch (err) {
    console.log(err)
  }
}

const fadeList = (type) => {
  let list, section
  if (type === "lesson") {
    list = lessons
    section = draftsLessons
  } else {
    list = exercises
    section = draftsExercises
  }
  if (list.length === 1) {
    section.classList.add("fade_out")
  }
}

const setGrid = () => {
  if (
    (lessons.length === 0 && exercises.length !== 0) ||
    (exercises.length === 0 && lessons.length !== 0)
  ) {
    draftsSection.classList.add("unset-grid")
  } else if (lessons.length === 0 && exercises.length === 0) {
    nothingHere.classList.remove("hide")
  }

  if (lessons.length === 0) {
    draftsLessons.remove()
  }

  if (exercises.length === 0) {
    draftsExercises.remove()
  }
}

const addTo = (location, values, type) => {
  for (let value of values) {
    let item = document.createElement("li")
    let frontDiv = document.createElement("div")
    let backDiv = document.createElement("div")
    let p = document.createElement("p")
    let edit = document.createElement("button")
    let trash = document.createElement("button")
    let backBtn = document.createElement("button")
    let delInput = document.createElement("input")
    let delBtn = document.createElement("button")
    frontDiv.setAttribute("class", "front")
    backDiv.setAttribute("class", "back")
    edit.setAttribute("aria-label", "Edit draft")
    edit.setAttribute("title", "Edit draft")
    trash.setAttribute("aria-label", "Delete draft")
    trash.setAttribute("title", "Delete draft")
    trash.setAttribute("name", "trash")
    backBtn.innerText = "Back"
    backBtn.setAttribute("name", "back")
    delInput.setAttribute("placeholder", 'Type "yes" to confirm')
    delBtn.innerText = "Delete"
    delBtn.setAttribute("name", "delete")
    item.dataset.id = value._id
    item.dataset.type = type
    p.innerText = value.title
    edit.innerHTML = "<i class='fas fa-edit'></i>"
    trash.innerHTML = "<i class='fas fa-trash'></i>"
    if (type === "lesson") {
      edit.addEventListener("click", editLesson)
    } else {
      edit.addEventListener("click", editExercise)
    }
    trash.addEventListener("click", deleteDraft)
    backBtn.addEventListener("click", deleteDraft)
    delBtn.addEventListener("click", deleteDraft)
    frontDiv.appendChild(p)
    frontDiv.appendChild(edit)
    frontDiv.appendChild(trash)
    backDiv.appendChild(backBtn)
    backDiv.appendChild(delInput)
    backDiv.appendChild(delBtn)
    item.appendChild(frontDiv)
    item.appendChild(backDiv)
    location.appendChild(item)
  }
}

const addH3 = (string) => {
  draftsLessons.classList.add("hide")
  draftsExercises.classList.add("hide")
  let h3 = document.createElement("h3")
  h3.innerText = string
  draftsSection.appendChild(h3)
}

const deleteDraft = async (e) => {
  const { target } = e
  const { parentElement } = target
  switch (target.name) {
    case "trash":
      parentElement.nextElementSibling.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      })
      break
    case "back":
      parentElement.previousElementSibling.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      })
      break
    case "delete":
      document.activeElement.blur()
      if (target.previousElementSibling.value !== "yes") {
        target.previousElementSibling.classList.add("flash")
        setTimeout(() => {
          target.previousElementSibling.classList.remove("flash")
        }, 600)
      } else {
        const { previousElementSibling } = parentElement
        const { id, type } = parentElement.parentElement.dataset
        try {
          await axios.delete(`/api/v1/${type}s/${id}`)
          let p = previousElementSibling.querySelector("p")
          p.classList.add("not_met")
          p.innerText = "Resource has been successfully deleted."
          previousElementSibling.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          })
          parentElement.parentElement.classList.add("fade_out")
          fadeList(type)
          removeFromList(type, id)
          setTimeout(() => {
            parentElement.parentElement.remove()
            setGrid()
          }, 2000)
        } catch (err) {
          console.log(err)
        }
      }
      break
  }
}

const removeFromList = (type, id) => {
  let list
  if (type === "lesson") {
    list = lessons
  } else {
    list = exercises
  }
  for (let item in list) {
    if (list[item]._id === id) {
      list.splice(item, 1)
    }
  }
}

if (!token) {
  window.location.href = "/"
}

getDrafts()
