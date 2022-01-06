// const head = document.querySelector("head")
const resource = document.getElementById("resource")

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
  } catch (err) {
    console.log(err)
  }
}

window.addEventListener("load", getExerciseInfo)
