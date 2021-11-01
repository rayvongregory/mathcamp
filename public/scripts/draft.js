const draftsSection = document.querySelector("#drafts___section")
const draftsLessons = document.querySelector("#drafts___lessons")
const draftsExercises = document.querySelector("#drafts___exercises")

const editLesson = async (e) => {
  window.location.href = `/drafts/lesson/${e.target.parentElement.dataset.id}`
}

const editExercise = async (e) => {
  window.location.href = `/drafts/exercise/${e.target.parentElement.dataset.id}`
}

const deleteDraft = async (e) => {
  let target = e.target.parentElement
  target.style.display = "none"
  const { id, type } = target.dataset
  try {
    const { data } = await axios.delete(`/api/v1/${type}s/${id}`)
  } catch (err) {
    console.log(err)
  }
}

const addTo = (location, values, type) => {
  for (let value of values) {
    let item = document.createElement("li")
    let p = document.createElement("p")
    let edit = document.createElement("button")
    let trash = document.createElement("button")
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
    item.appendChild(p)
    item.appendChild(edit)
    item.appendChild(trash)
    location.appendChild(item)
  }
}

const addH3 = (string) => {
  draftsLessons.classList.add("hide")
  draftsExercises.classList.add("hide")
  let h3 = document.createElement("h3")
  h3.classList.add("h3style")
  h3.innerText = string
  draftsSection.insertAdjacentElement("beforeBegin", h3)
}

const getDrafts = async () => {
  try {
    const {
      data: { lessons, exercises },
    } = await axios.get("/api/v1/drafts")
    if (lessons.length === 0 && exercises.length > 0) {
      addH3("Exercises")
      return addTo(draftsSection, exercises, "exercise")
    }
    if (lessons.length > 0 && exercises.length === 0) {
      addH3("Lessons")
      return addTo(draftsSection, lessons, "lesson")
    }
    if (lessons.length === 0 && exercises.length === 0) {
      draftsLessons.classList.add("hide")
      draftsExercises.classList.add("hide")
      return
    }
    draftsLessons.innerHTML = "<h3 class='h3style'>Lessons</h3>"
    draftsExercises.innerHTML = "<h3 class='h3style'>Exercises</h3>"
    addTo(draftsLessons, lessons, "lesson")
    addTo(draftsExercises, exercises, "exercise")
  } catch (err) {
    console.log(err)
  }
}

getDrafts()
