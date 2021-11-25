const filters = document.getElementById("filters")
const grFilters = filters.querySelectorAll(".gr")
const chapterSelectDiv = document.getElementById("chptr_select")
let selectSelected = document.querySelector(".select-selected"),
  selectItems = document.querySelector(".select-items"),
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
  selectSelected.addEventListener("click", toggleAllSelect)
  document
    .querySelector('[data-value="all"]')
    .addEventListener("click", whenClicked)
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
    let children = Array.from(selectItems.children)
    selected.classList.remove("selected")
    for (let i = 1; i < children.length; i++) {
      children[i].remove()
    }
    selected_gr = target.value
    if (selectSelected.innerText !== "All chapters") {
      selectSelected.innerText = "All chapters"
      selected_chapter = "all"
    }
    addChapters(target.value)
  }
  target.classList.add("selected")
  if (!chapterSelectDiv.classList.contains("reveal")) {
    chapterSelectDiv.classList.add("reveal")
  }
}

grFilters.forEach((gr) => {
  gr.addEventListener("click", addChapterFilter)
})

const whenClicked = (e) => {
  const { target } = e
  selectSelected.innerText = target.innerText
  selected_chapter = target.dataset.value
  selectSelected.dispatchEvent(new Event("click"))
  console.log(selected_gr, selected_chapter)
}
const addChapters = (val) => {
  let list = chapters[val]
  for (let c = 0; c < list.length; c++) {
    let chapter = document.createElement("DIV")
    chapter.innerHTML = `Chapter ${list[c].title.number}: ${list[c].title.name}`
    chapter.setAttribute("data-value", `${list[c].title.number}`)
    chapter.addEventListener("click", whenClicked)
    selectItems.appendChild(chapter)
  }
}

const toggleAllSelect = (e) => {
  const { target } = e
  e.stopPropagation()
  if (target === selectSelected) {
    selectItems.classList.toggle("hide")
    selectSelected.classList.toggle("select-arrow-active")
  } else if (!target !== selectSelected) {
    if (!selectItems.classList.contains("hide")) {
      selectItems.classList.add("hide")
      selectSelected.classList.remove("select-arrow-active")
      console.log(selected_gr, selected_chapter)
    }
  }
}

const init = () => {
  getChapters()
}

document.addEventListener("click", toggleAllSelect)
window.addEventListener("load", init)
