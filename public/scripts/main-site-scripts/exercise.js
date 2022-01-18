const titleH3 = document.querySelector(".title h3")
const titleP = document.querySelector(".title p")
const resource = document.getElementById("resource")
const ezBtn = document.getElementById("ez")
const ezProblem = document.getElementById("ez-problem")
const ezSubmit = document.getElementById("ez-submit")
const stanBtn = document.getElementById("stan")
const stanProblem = document.getElementById("stan-problem")
const stanSubmit = document.getElementById("stan-submit")
const hardBtn = document.getElementById("hard")
const hardProblem = document.getElementById("hard-problem")
const hardSubmit = document.getElementById("hard-submit")
const advBtn = document.getElementById("adv")
const advProblem = document.getElementById("adv-problem")
const advSubmit = document.getElementById("adv-submit")
const difficultyBtns = [ezBtn, stanBtn, hardBtn, advBtn]
const submitBtns = [ezSubmit, stanSubmit, hardSubmit, advSubmit]
const id = path.split("/")[2]
let ez = {
    ans: "",
    qs: [],
  },
  stan = {
    ans: "",
    qs: [],
  },
  hard = {
    ans: "",
    qs: [],
  },
  adv = {
    ans: "",
    qs: [],
  },
  subs = {
    seven: "Grade 7",
    eight: "Grade 8",
    alg: "Algebra",
    geo: "Geometry",
    p_s: "Probability & Statistics",
    alg2: "Algebra 2",
    pc: "Precalculus",
    calc: "Calculus",
    calc2: "Calculus 2",
  }

const addEditBtn = () => {
  const fixedDiv = document.createElement("div")
  const editBtn = document.createElement("a")
  fixedDiv.setAttribute("id", "fixed")
  editBtn.setAttribute("id", "edit-btn")
  editBtn.setAttribute("href", `/drafts/exercise/${id}`)
  editBtn.innerHTML = '<i class="fas fa-edit"></i>'
  fixedDiv.appendChild(editBtn)
  resource.appendChild(fixedDiv)
}

const selectDifficulty = (e) => {
  const { target } = e
  const { id } = target
  const selected = document.querySelector(".difficulty.selected")
  selected.classList.remove("selected")
  target.classList.add("selected")
  document.getElementById(`${selected.id}-problem`).classList.add("hide")
  document.getElementById(`${id}-problem`).classList.remove("hide")
}

const selectItem = (e) => {
  const { target } = e
  const { parentElement: problem } = target.parentElement.parentElement
  const submit = problem.querySelector("ol + button")
  const selected = problem.querySelector("button.selected:not([id])")
  if (selected && selected !== submit) selected.classList.remove("selected")
  if (!submit.classList.contains("selected")) submit.classList.add("selected")
  target.classList.add("selected")
}

const shuffle = (list) => {
  list.forEach((q) => {
    let currentIndex = q.length,
      randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[q[currentIndex], q[randomIndex]] = [q[randomIndex], q[currentIndex]]
    }
  })
  return list
}

const createFirstQuestions = () => {
  let diffs = ["ez", "stan", "hard", "adv"]
  diffs.forEach((diff) => {
    createNewQuestion(diff)
  })
}

const createNewQuestion = (diff) => {
  Function(
    '"use strict"; let ' +
      diff +
      "Q = " +
      diff +
      ".qs[0][1] \n" +
      diff +
      'Problem.querySelector("p").innerHTML = ' +
      diff +
      "Q.question \n" +
      "let " +
      diff +
      "Choices = pick4(" +
      diff +
      "Q.choices) \n" +
      diff +
      ".ans = createChoiceItems(" +
      diff +
      "Choices, " +
      diff +
      "Problem) \n " +
      diff +
      ".qs.push(" +
      diff +
      ".qs.shift())"
  )()
}

const createChoiceItems = (list, section) => {
  let answer
  let listItems = Array.from(section.querySelectorAll("li"))
  for (let i = 0; i < listItems.length; i++) {
    let div = listItems[i].querySelector("div")
    div.innerHTML = list[i][1]
    if (list[i][0] === "answer") {
      let btn = listItems[i].querySelector("button")
      answer = btn.textContent
    }
  }
  return answer
}

const pick4 = (list) => {
  let picked4 = []
  picked4.push(["answer", list.answer])
  let mangledList = { ...list }
  delete mangledList.answer
  let keys = Object.entries(mangledList)
  mangledList = shuffle([keys])
  mangledList = mangledList.flat()
  for (let i = 0; i < 3; i++) {
    let key = mangledList[i][0]
    picked4.push([key, list[key]])
  }
  picked4 = shuffle([picked4])
  return picked4.flat()
}

const answerQ = (e) => {
  const { target } = e
  let { id: difficulty } = target
  let {
    previousElementSibling: choices,
    nextElementSibling: { firstElementChild: feedback },
  } = target
  difficulty = difficulty.split("-")[0]
  let selected = choices.querySelector("button.selected")
  if (
    Function(
      "'use strict'; return(" +
        difficulty +
        ".ans === '" +
        selected.textContent +
        "')"
    )()
  ) {
    feedback.textContent = "ayyyy"
  } else {
    feedback.textContent = "not quite..."
  }
  feedback.classList.add("reveal")
  setTimeout(() => {
    feedback.classList.remove("reveal")
  }, 500)
  createNewQuestion(difficulty)
  selected.classList.remove("selected")
  target.classList.remove("selected")
}

const getRole = async () => {
  let t = localStorage.getItem("token")
  if (!t) return
  try {
    const {
      data: { role },
    } = await axios.get(`/api/v1/token/${t.split(" ")[1]}`)
    if (role === "admin") {
      addEditBtn()
    }
  } catch (err) {
    console.log(err)
  }
}

const getExerciseInfo = async () => {
  try {
    const {
      data: { title, subject, chapter, section, problems },
    } = await axios.get(`/api/v1/exercises/id/${path.split("/")[2]}`)
    titleH3.textContent = title
    titleP.innerHTML = `${subs[subject]} &#8226; Chapter ${chapter} &#8226; Section ${section}`
    let { easy, standard, hard: h, advanced } = problems
    ez.qs = Object.entries(easy)
    stan.qs = Object.entries(standard)
    hard.qs = Object.entries(h)
    adv.qs = Object.entries(advanced)
    shuffle([ez.qs, stan.qs, hard.qs, adv.qs])
    createFirstQuestions()
    await getRole()
  } catch (err) {
    console.log(err)
  }
}

window.addEventListener("load", getExerciseInfo)
difficultyBtns.forEach((btn) => {
  btn.addEventListener("pointerup", selectDifficulty)
})
document.querySelectorAll(".choices button").forEach((btn) => {
  btn.addEventListener("pointerup", selectItem)
})
submitBtns.forEach((btn) => {
  btn.addEventListener("pointerup", answerQ)
})
