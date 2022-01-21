const head = document.querySelector("head")
const resource = document.getElementById("resource")
const id = path.split("/")[2],
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

const getLessonInfo = async () => {
  try {
    const { data } = await axios.get(`/api/v1/lessons/id/${path.split("/")[2]}`)
    const { html, css, js, title, subject, chapter, section, role } = data
    const style = document.createElement("style")
    const script_1 = document.createElement("script")
    const script_2 = document.createElement("script")
    style.textContent =
      css +
      `<style> body {padding: 1rem;} .title {
      position: relative;
      margin-bottom: 50px;
      width: fit-content;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: var(--neutralDark);
    } .title::after {
      content: "";
      position: absolute;
      bottom: -20px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: var(--neutralMid);
    } .title h3 {
      margin-bottom: 8px;
      font-size: 28pt;
  }`
    script_1.setAttribute("src", "/mathjax/es5/tex-chtml.js")
    script_2.text = js
    head.insertAdjacentElement("afterbegin", style)
    head.insertAdjacentElement("beforeend", script_1)
    resource.innerHTML =
      `<section class="title"> <h3>${title}</h3><p>${subs[subject]} &#8226; Chapter ${chapter} &#8226; Section ${section}</p></section>` +
      html
    body.insertAdjacentElement("beforeend", script_2)
    if (role === "admin") addEditBtn(resource)
  } catch (err) {
    console.log(err)
  }
}

window.addEventListener("load", async () => {
  await getLessonInfo()
  removeHTMLInvis()
})
