const scroll = document.getElementById("scroll")
const info = document.getElementById("info")
// const dontHave = document.getElementById("donthave")
// const ul = dontHave.querySelector("ul")
// const refresh = document.getElementById("refresh")
// let scrollElements = Array.from(document.querySelectorAll(".element"))
// let rndthings
// let interval
// const handleRndThings = () => {
//   if (interval) {
//     clearInterval(interval)
//   }
//   scrollElements[0].classList.remove("hold-up")
//   rotate()
//   interval = setInterval(() => {
//     rotate()
//   }, 2000)
// }

// const rotate = () => {
//   scrollElements[0].innerText = rndthings[0].name
//   ul.appendChild(scrollElements[0])
//   scrollElements.push(scrollElements.shift())
//   rndthings.push(rndthings.shift())
// }

// const getRndThings = async () => {
//   scrollElements[0].classList.add("hold-up")
//   try {
//     const {
//       data: { rndthings: r },
//     } = await axios.get("/api/v1/rndthing")
//     rndthings = r
//     handleRndThings()
//   } catch (err) {
//     console.log(err)
//   }
// }

// const elementInView = (el, dividend = 1) => {
//   const elementTop = el.getBoundingClientRect().top

//   return (
//     elementTop <=
//     (window.innerHeight || document.documentElement.clientHeight) / dividend
//   )
// }

// // const elementOutofView = (el) => {
// //   const elementTop = el.getBoundingClientRect().top

// //   return (
// //     elementTop > (window.innerHeight || document.documentElement.clientHeight)
// //   )
// // }

// const displayScrollElement = (element) => {
//   element.classList.add("scrolled")
// }

// // const hideScrollElement = (element) => {
// //   element.classList.remove("scrolled")
// // }

// const handleScrollAnimation = () => {
//   scrollElements.forEach((el) => {
//     if (elementInView(el, 1.25)) {
//       displayScrollElement(el)
//       // } else if (elementOutofView(el)) {
//       //   hideScrollElement(el)
//     }
//   })
// }

// refresh.addEventListener("pointerup", getRndThings)
// window.addEventListener("load", getRndThings)
scroll.addEventListener("pointerup", () => {
  document.activeElement.blur()
  info.scrollIntoView()
})
