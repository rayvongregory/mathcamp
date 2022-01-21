const urlSearchParams = new URLSearchParams(window.location.search)
const params = Object.fromEntries(urlSearchParams.entries())
const input = document.querySelector("#search input")
const srchBtn = document.querySelector("#search button")
const resultsHeader = document.querySelector(".results-header")
const resultsBody = document.querySelector(".results-body")
let page = 1
let query = ""

const addResources = (list) => {
  for (let resource of list) {
    let type = resource.type === "exercise" ? "practice" : "learn"
    let li = document.createElement("li")
    let a = document.createElement("a")
    let div = document.createElement("div")
    li.setAttribute("data-type", type)
    a.textContent = resource.title
    a.setAttribute("href", `/${type}/${resource._id}`)
    div.textContent = resource.type
    li.appendChild(a)
    li.appendChild(div)
    resultsBody.appendChild(li)
  }
}

const changeSrchBtn = (bool) => {
  switch (bool) {
    case true:
      if (!srchBtn.classList.contains("ready")) {
        srchBtn.classList.add("ready")
      }
      break
    case false:
      if (srchBtn.classList.contains("ready")) {
        srchBtn.classList.remove("ready")
      }
      break
    default:
      break
  }
}

const setHeader = (num, q) => {
  if (num === 0) {
    resultsHeader.textContent = `There are no results for your search.`
  } else if (num > 0) {
    resultsHeader.textContent = `Showing ${num} results for "${q}"`
  } else {
    resultsHeader.textContent = q
  }
}

const getResults = async (e) => {
  let { q } = params
  if (q) q = removeInvalidCharacters2(q)
  if (q) {
    changeSrchBtn(true)
    await getData(q)
    input.value = q.replaceAll("+", " ")
    input.focus()
    input.selectionStart = input.selectionEnd = input.value.length
  }
}

const changeURL = (e) => {
  const { target } = e
  let { value: q } = target
  q = q.trim()
  if (q.length != 0) {
    q = q.replaceAll(" ", "+")
    history.replaceState(history.state, "", `?q=${q}`)
    changeSrchBtn(true)
  } else {
    history.replaceState(history.state, "", "?")
    changeSrchBtn(false)
  }
}

const getData = async (q) => {
  try {
    const {
      data: { results, num },
    } = await axios.get(`/api/v1/search/${q}`)
    setHeader(num, q.replaceAll("+", " "))
    addResources(results)
  } catch (err) {
    console.log(err)
  }
  query = q
}

const handleChange = async (e) => {
  if (e.key && e.key !== "Enter") return
  let { value: q } = input
  q = removeInvalidCharacters2(q)
  if (q && query !== q) {
    resultsBody.replaceChildren()
    await getData(q)
    changeSrchBtn(true)
  }
  document.activeElement.blur()
}

window.addEventListener("load", () => {
  getResults()
  removeHTMLInvis()
})
input.addEventListener("input", changeURL)
input.addEventListener("keydown", handleChange)
srchBtn.addEventListener("click", handleChange)
