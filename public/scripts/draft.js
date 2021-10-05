const draftsSection = document.querySelector("#drafts___section")
const draftsLessons = document.querySelector("#drafts___lessons")
const draftsPractices = document.querySelector("#drafts___practices")

const editLesson = async (e) => {
  window.location.href = `/drafts/lesson/${e.target.parentElement.dataset.id}`
}

const editPractice = async (e) => {
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
    let edit = document.createElement("span")
    let trash = document.createElement("span")
    item.dataset.id = value._id
    item.dataset.type = type
    p.innerText = value.title
    edit.innerHTML = "<i class='fas fa-edit'></i>"
    trash.innerHTML = "<i class='fas fa-trash'></i>"
    if (type === "lesson") {
      edit.addEventListener("click", editLesson)
    } else {
      edit.addEventListener("click", editPractice)
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
  draftsPractices.classList.add("hide")
  let h3 = document.createElement("h3")
  h3.classList.add("h3style")
  h3.innerText = string
  draftsSection.insertAdjacentElement("beforeBegin", h3)
}

const getDrafts = async () => {
  try {
    const {
      data: { lessons, practices },
    } = await axios.get("/api/v1/drafts")
    if (lessons.length === 0 && practices.length > 0) {
      addH3("Practices")
      return addTo(draftsSection, practices)
    }
    if (lessons.length > 0 && practices.length === 0) {
      addH3("Lessons")
      return addTo(draftsSection, lessons)
    }
    if (lessons.length === 0 && practices.length === 0) {
      draftsLessons.classList.add("hide")
      draftsPractices.classList.add("hide")
      return
    }
    draftsLessons.innerHTML = "<h3 class='h3style'>Lessons</h3>"
    draftsPractices.innerHTML = "<h3 class='h3style'>Practice</h3>"
    addTo(draftsLessons, lessons, "lesson")
    addTo(draftsPractices, practices, "practice")
  } catch (err) {
    console.log(err)
  }
}

getDrafts()
