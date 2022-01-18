const _name = localStorage.getItem("name")
const h2 = document.querySelector("section h2")
h2.textContent = `Hi, ${_name}!`
