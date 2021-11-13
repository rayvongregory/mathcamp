const draftsSection = document.getElementById("drafts___section")
const draftsLessons = document.getElementById("drafts___lessons")
const draftsExercises = document.getElementById("drafts___exercises")

const editLesson = async (e) => {
  window.location.href = `/drafts/lesson/${e.target.parentElement.parentElement.dataset.id}`
}

const editExercise = async (e) => {
  window.location.href = `/drafts/exercise/${e.target.parentElement.parentElement.dataset.id}`
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
      if (target.previousElementSibling.value !== "yes") {
        // be mad but kindly ask user to type "yes"
      } else {
        const { previousElementSibling } = parentElement
        const { id, type } = parentElement.parentElement.dataset
        try {
          // await axios.delete(`/api/v1/${type}s/${id}`)
          let p = previousElementSibling.querySelector("p")
          p.classList.add("not_met")
          p.innerText = "Resource has been successfully deleted."
          previousElementSibling.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          })
          parentElement.parentElement.classList.add("fade_out")
          setTimeout(() => {
            parentElement.parentElement.remove()
          }, 2000)
        } catch (err) {
          console.log(err)
        }
      }
      break
  }

  //
}

const setGrid = (lessons, exercises) => {
  if (
    (lessons.length === 0 && exercises.length !== 0) ||
    (exercises.length === 0 && lessons.length !== 0)
  ) {
    draftsSection.style.gridTemplateColumns = "unset"
  } else if (lessons.length === 0 && exercises.length === 0) {
    //hide both sections and reveal a whole other thing with a big header
    //indicating that there are no drafts to edit
    // maybe add two large btns that are links to the create lesson
    // and create exercise pages
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
  h3.classList.add("h3style")
  h3.innerText = string
  draftsSection.appendChild(h3)
}

const getDrafts = async () => {
  try {
    let {
      data: { lessons, exercises },
    } = await axios.get("/api/v1/drafts")
    exercises = []
    lessons = []

    setGrid(lessons, exercises)
    if (lessons.length === 0) {
      draftsLessons.classList.add("hide")
    } else {
      draftsLessons.innerHTML = "<h3 class='h3style'>Lessons</h3>"
      addTo(draftsLessons, lessons, "lesson")
    }
    if (exercises.length === 0) {
      draftsExercises.classList.add("hide")
    } else {
      draftsExercises.innerHTML = "<h3 class='h3style'>Exercises</h3>"
      addTo(draftsExercises, exercises, "exercise")
    }
  } catch (err) {
    console.log(err)
  }
}

if (!token) {
  window.location.href = "/"
}
getDrafts()
