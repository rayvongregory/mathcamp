const h1 = document.querySelector(".secondary h1")
const resource = document.getElementById("resource")
const split = path.split("/")
const type = split[1] === "learn" ? "lessons" : "exercises"
const id = split[2]

const getResourceInfo = async () => {
  try {
    const { data } = await axios.get(`/api/v1/${type}/id/${id}`)
    console.log(data)
    h1.innerText = data.title
    if (type === "lessons") {
      resource.innerHTML = data.text
    }
  } catch (err) {
    console.log(err)
  }
}

window.addEventListener("load", getResourceInfo)
