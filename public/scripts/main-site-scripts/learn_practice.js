const gradeBtns = document.querySelector(".scroll-wrap")
const loadSpinner = document.querySelector(".load-wrapp")
const grLvls = document.querySelectorAll(".gr")
const resources = document.getElementById("resources")
const firstCol = document.getElementById("first")
const secondCol = document.getElementById("second")
const thirdCol = document.getElementById("third")
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
    gradeBtns.classList.add("reveal")
  } catch (error) {
    console.log(error)
  }
}

const selectGrade = (e) => {
  const { target } = e
  let selected = document.querySelector(".gr.selected")
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
}

const determineColumns = () => {
  let runningHeight = 0
  const halfSize = height / 2
  const thirdSize = height / 3
  let sections = firstCol.querySelectorAll("[data-chapter]")
  for (let section of sections) {
    if (runningHeight < halfSize) {
      section.setAttribute("data-two-col", "1")
    } else if (runningHeight >= halfSize) {
      section.setAttribute("data-two-col", "2")
    }
    if (runningHeight < thirdSize) {
      section.setAttribute("data-three-col", "1")
    } else if (runningHeight >= thirdSize && runningHeight < 2 * thirdSize) {
      section.setAttribute("data-three-col", "2")
    } else if (runningHeight >= 2 * thirdSize) {
      section.setAttribute("data-three-col", "3")
    }
    runningHeight += section.offsetHeight
  }
}

const fixMiddleColumn = () => {
  const { childNodes } = secondCol
  for (let child = 1; child < childNodes.length; child++) {
    if (
      Number(childNodes[child].getAttribute("data-chapter")) <
      Number(childNodes[child - 1].getAttribute("data-chapter"))
    ) {
      childNodes[child - 1].insertAdjacentElement(
        "beforebegin",
        childNodes[child]
      )
      child = 0
    }
  }
}

const setColumns = () => {
  if (!selected_gr) return
  let chapters = document.querySelectorAll("[data-chapter]")
  if (firstCol.classList.contains("invis")) {
    firstCol.classList.remove("invis")
  }
  if (
    lastWindowSize === "tiny" ||
    lastWindowSize === "small" ||
    lastWindowSize === "medium"
  ) {
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
  } else if (lastWindowSize === "big") {
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
      fixMiddleColumn()
    }
  }
}

const addChapters = async (val) => {
  for (let col of [firstCol, secondCol, thirdCol]) {
    if (col.childElementCount !== 0) {
      col.replaceChildren()
    }
  }
  if (!firstCol.classList.contains("invis")) {
    firstCol.classList.add("invis")
  }
  if (!thirdCol.classList.contains("hide")) {
    thirdCol.classList.add("hide")
  }
  if (!secondCol.classList.contains("hide")) {
    secondCol.classList.add("hide")
  }
  if (height !== 0) {
    height = 0
  }
  if (num_cols !== 0) {
    num_cols = 0
  }
  let list = chapters[val]
  for (let c = 0; c < list.length; c++) {
    let { number, name } = list[c].title
    let chapter = document.createElement("div")
    let chapterNumber = document.createElement("div")
    let stickDiv = document.createElement("div")
    let chapterInfo = document.createElement("div")
    let chapterTitle = document.createElement("div")
    let chapterLinks = document.createElement("ul")
    chapter.setAttribute("class", "chapter")
    chapter.setAttribute("data-chapter", number)
    chapterNumber.setAttribute("class", "chapter_number")
    stickDiv.setAttribute("class", "stick")
    chapterInfo.setAttribute("class", "chapter_info")
    chapterTitle.setAttribute("class", "chapter_title")
    chapterLinks.setAttribute("class", "chapter_links")
    stickDiv.textContent = number
    chapterTitle.textContent = name
    chapterNumber.appendChild(stickDiv)
    chapterInfo.appendChild(chapterNumber)
    chapterInfo.appendChild(chapterLinks)
    chapter.appendChild(chapterTitle)
    chapter.appendChild(chapterInfo)
    firstCol.appendChild(chapter) //just to put them somewhere, this col is invis
    height += chapter.offsetHeight
  }
}

//create
const addResources = (list) => {
  //adds the links
  for (let resource of list) {
    let chapterBody = document
      .querySelector(`[data-chapter="${resource.chapter}"]`)
      .querySelector(".chapter_links")
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
    const {
      data: { publishedLessons, publishedExercises },
    } = await axios.get(`/api/v1/${type}/${selected_gr}`)
    if (type === "lessons") {
      addResources(publishedLessons)
    } else {
      addResources(publishedExercises)
    }
  } catch (e) {
    console.log(e)
  }
}

const init = () => {
  getChapters()
  grLvls.forEach((gr) => {
    gr.addEventListener("click", async (e) => {
      if (resources.classList.contains("reveal")) {
        resources.classList.remove("reveal")
      }
      loadSpinner.classList.remove("invis")
      selectGrade(e)
      await getAllResources()
      determineColumns()
      setColumns()
      loadSpinner.classList.add("invis")
      if (!resources.classList.contains("reveal")) {
        resources.classList.add("reveal")
      }
    })
  })
  removeHTMLInvis()
}

window.addEventListener("load", init)
window.addEventListener("resize", setColumns)
