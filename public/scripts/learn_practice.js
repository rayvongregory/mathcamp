const filters = document.getElementById("filters")
const grFilters = filters.querySelectorAll(".gr")
const resources = document.getElementById("resources")
const firstCol = document.getElementById("first")
const secondCol = document.getElementById("second")
const thirdCol = document.getElementById("third")
const bufferCol = document.getElementById("buffer")
let height = 0,
  num_cols = 0,
  chapters = {
    seven: {},
    eight: {},
    alg: {},
    geo: {},
    p_s: {},
    alg2: {},
    pc: {},
    calc: {},
    calc2: {},
  },
  selected_gr,
  selected_chapter = "all"

const getChapters = async () => {
  try {
    const {
      data: { _seven, _eight, _alg, _geo, _p_s, _alg2, _pc, _calc, _calc2 },
    } = await axios.get("/api/v1/chapters")
    chapters.seven = _seven
    chapters.eight = _eight
    chapters.alg = _alg
    chapters.geo = _geo
    chapters.p_s = _p_s
    chapters.alg2 = _alg2
    chapters.pc = _pc
    chapters.calc = _calc
    chapters.calc2 = _calc2
  } catch (error) {
    console.log(error)
  }
}

const addChapterFilter = async (e) => {
  const { target } = e
  let selected = filters.querySelector(".gr.selected")
  if (!selected) {
    selected_gr = target.value
    addChapters(target.value)
  }
  if (selected && selected !== target) {
    selected.classList.remove("selected")
    selected_gr = target.value
    addChapters(target.value)
  }
  target.classList.add("selected")
  if (!resources.classList.contains("reveal")) {
    resources.classList.add("reveal")
  }
}

const applyChapterFilter = (e) => {
  const { target } = e
  const { value } = target.dataset
  let chapter = resources.querySelector(`[data-chapter="${value}"]`)
  if (!chapter) {
    for (let col of [firstCol, secondCol, thirdCol]) {
      if (col.classList.contains("hide")) {
        col.classList.remove("hide")
      }
      for (let c of col.querySelectorAll("[data-chapter]")) {
        if (c.classList.contains("hide")) {
          c.classList.remove("hide")
        }
      }
    }
    if (!bufferCol.classList.contains("hide")) {
      bufferCol.setAttribute("class", "hide")
    }
    num_cols = 3
  } else {
    for (let col of [firstCol, secondCol, thirdCol]) {
      if (col !== chapter.parentElement) {
        if (!col.classList.contains("hide")) {
          col.classList.add("hide")
        }
      } else {
        if (col.classList.contains("hide")) {
          col.classList.remove("hide")
        }
        for (let c of col.querySelectorAll("[data-chapter]")) {
          if (c !== chapter) {
            c.classList.add("hide")
          } else if (c === chapter && c.classList.contains("hide")) {
            c.classList.remove("hide")
          }
        }
      }
    }
    num_cols = 1
  }
  setColumns()
  selected_chapter = target.dataset.value
}

const determineColumns = () => {
  let runningHeight = 0
  const halfSize = height / 2
  const thirdSize = height / 3
  let sections = firstCol.querySelectorAll("[data-chapter]")
  for (let section of sections) {
    runningHeight += section.offsetHeight
    if (runningHeight <= halfSize) {
      section.setAttribute("data-two-col", "1")
    } else if (runningHeight > halfSize) {
      section.setAttribute("data-two-col", "2")
    }
    if (runningHeight <= thirdSize) {
      section.setAttribute("data-three-col", "1")
    } else if (runningHeight > thirdSize && runningHeight <= 2 * thirdSize) {
      section.setAttribute("data-three-col", "2")
    } else if (runningHeight > 2 * thirdSize) {
      section.setAttribute("data-three-col", "3")
    }
  }
  setColumns()
}

const setColumns = () => {
  if (!selected_gr) return
  let chapters = document.querySelectorAll("[data-chapter]")
  if (firstCol.classList.contains("invis")) {
    firstCol.classList.remove("invis")
  }
  if (lastWindowSize === "tiny" || lastWindowSize === "small") {
    if (num_cols !== 1) {
      num_cols = 1
      if (!secondCol.classList.contains("hide")) {
        secondCol.classList.add("hide")
      }
      if (!thirdCol.classList.contains("hide")) {
        thirdCol.classList.add("hide")
      }
      for (let chapter of chapters) {
        if (chapter.parentElement !== firstCol) {
          firstCol.appendChild(chapter)
        }
      }
    }
  } else if (lastWindowSize === "medium" || lastWindowSize === "big") {
    if (num_cols !== 2) {
      num_cols = 2
      if (secondCol.classList.contains("hide")) {
        secondCol.classList.remove("hide")
      }
      if (!thirdCol.classList.contains("hide")) {
        thirdCol.classList.add("hide")
      }
      for (let chapter of chapters) {
        if (
          chapter.dataset.twoCol === "1" &&
          chapter.parentElement !== firstCol
        ) {
          firstCol.appendChild(chapter)
        } else if (
          chapter.dataset.twoCol === "2" &&
          chapter.parentElement !== secondCol
        ) {
          secondCol.appendChild(chapter)
        }
      }
    }
  } else {
    if (num_cols !== 3) {
      num_cols = 3
      if (secondCol.classList.contains("hide")) {
        secondCol.classList.remove("hide")
      }
      if (thirdCol.classList.contains("hide")) {
        thirdCol.classList.remove("hide")
      }
      for (let chapter of chapters) {
        if (
          chapter.dataset.threeCol === "1" &&
          chapter.parentElement !== firstCol
        ) {
          firstCol.appendChild(chapter)
        } else if (
          chapter.dataset.threeCol === "2" &&
          chapter.parentElement !== secondCol
        ) {
          secondCol.appendChild(chapter)
        } else if (
          chapter.dataset.threeCol === "3" &&
          chapter.parentElement !== thirdCol
        ) {
          thirdCol.appendChild(chapter)
        }
      }
    }
  }
}

const addChapters = (val) => {
  for (let col of [firstCol, secondCol, thirdCol]) {
    if (col.childElementCount !== 0) {
      col.replaceChildren()
    }
  }
  if (!firstCol.classList.contains("invis")) {
    firstCol.classList.add("invis")
  }
  if (height !== 0) {
    height = 0
  }
  if (num_cols !== 0) {
    num_cols = 0
  }
  if (!bufferCol.classList.contains("hide")) {
    bufferCol.setAttribute("class", "hide")
  }
  let list = chapters[val]
  for (let c = 0; c < list.length; c++) {
    let chapter = document.createElement("div")
    let number = list[c].title.number
    let name = list[c].title.name
    chapter.innerText = `Chapter ${number}: ${name}`
    chapter.setAttribute("data-value", `${number}`)
    chapter.addEventListener("click", applyChapterFilter)
    chapter = document.createElement("div")
    chapter.setAttribute("class", "chapter")
    chapter.setAttribute("data-chapter", number)
    let head = document.createElement("div")
    head.setAttribute("class", "chapter-head")
    head.innerText = `${number}. ${name}`
    let body = document.createElement("ul")
    body.setAttribute("class", "chapter-body")
    // body.innerText = "YO YO YO"
    chapter.appendChild(head)
    chapter.appendChild(body)
    firstCol.appendChild(chapter) //just to put them somewhere, this col is invis
    height += chapter.offsetHeight
  }
  determineColumns()
}

//create
const addResources = (list) => {
  //adds the links
  for (let resource of list) {
    let chapterBody = document
      .querySelector(`[data-chapter="${resource.chapter}"]`)
      .querySelector(".chapter-body")
    let li = document.createElement("li")
    let a = document.createElement("a")
    a.setAttribute("href", `/${path.split("/")[1]}/${resource._id}`)
    a.innerText = resource.title
    li.appendChild(a)
    chapterBody.appendChild(li)
  }
}

//read
const getAllResources = async () => {
  let type = path === "/learn" ? "lessons" : "exercises"
  try {
    const { data } = await axios.get(`/api/v1/${type}/${selected_gr}`)
    if (type === "lessons") {
      addResources(data.publishedLessons)
    } else {
      addResources(data.publishedExercises)
    }
  } catch (e) {
    console.log(e)
  }
}

const init = () => {
  getChapters()
  grFilters.forEach((gr) => {
    gr.addEventListener("click", addChapterFilter)
    gr.addEventListener("click", getAllResources)
  })
}

window.addEventListener("load", init)
window.addEventListener("resize", setColumns)
