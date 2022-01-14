const scroll = document.getElementById("scroll")
const info = document.getElementById("info")
scroll.addEventListener("pointerup", () => {
  document.activeElement.blur()
  info.scrollIntoView()
})
