// const head = document.querySelector("head")
const resource = document.getElementById("resource")
const id = path.split("/")[2]

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

const getRole = async () => {
  let t = localStorage.getItem("token")
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
    const { data } = await axios.get(
      `/api/v1/exercises/id/${path.split("/")[2]}`
    )
    // const { html, css, js } = data
    // const style = document.createElement("style")
    // const script_1 = document.createElement("script")
    // const script_2 = document.createElement("script")
    // style.textContent = css
    // script_1.setAttribute("src", "/mathjax/es5/tex-chtml.js")
    // script_2.text = js
    // head.insertAdjacentElement("afterbegin", style)
    // head.insertAdjacentElement("beforeend", script_1)
    // resource.innerHTML = html
    // body.insertAdjacentElement("beforeend", script_2)
    await getRole()
  } catch (err) {
    console.log(err)
  }
}

window.addEventListener("load", getExerciseInfo)
