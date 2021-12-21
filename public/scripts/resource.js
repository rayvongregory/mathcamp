const head = document.querySelector("head")
const resource = document.getElementById("resource")
const split = path.split("/")
const type = split[1] === "learn" ? "lessons" : "exercises"
const id = split[2]

const getResourceInfo = async () => {
  try {
    const { data } = await axios.get(`/api/v1/${type}/id/${id}`)
    if (type === "lessons") {
      const { html, css, js } = data
      const style = document.createElement("style")
      const script_1 = document.createElement("script")
      const script_2 = document.createElement("script")
      style.textContent = css
      script_1.setAttribute(
        "src",
        "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
      )
      script_1.setAttribute("id", "MathJax-script")
      script_2.text = js
      head.insertAdjacentElement("afterbegin", style)
      head.insertAdjacentElement("beforeend", script_1)
      resource.innerHTML = html
      body.insertAdjacentElement("beforeend", script_2)
    }
  } catch (err) {
    console.log(err)
  }
}

window.addEventListener("load", getResourceInfo)
