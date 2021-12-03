const home = document.getElementById("home")
const dontHave = document.getElementById("donthave")
const scroll = document.getElementById("scroll")
let scrollElements

const handleRndSubjs = (rndsubjs) => {
  const contentHeight = 1200
  const screenWidth = window.screen.width < 1200 ? window.screen.width : 1200
  const sectionHeight = (contentHeight - 100) / 2
  const sectionWidth = screenWidth / 5
  let runningWidth = 0,
    runningHeight = 0
  // add the first subj to the list without adding its icon
  let p = document.createElement("p")
  p.innerText = `We don't teach ${rndsubjs[0].name}...`
  dontHave.appendChild(p)
  rndsubjs.shift()

  // then have a nested for-loop to determine the position of the remaining 20
  for (let i = 0; i < 2; i++) {
    //rows handle height
    for (let j = 0; j < 5; j++) {
      //columns handle width
      let i = document.createElement("i")
      let p = document.createElement("p")
      p.innerText = `or ${rndsubjs[0].name}...`
      //   let rndTop = Math.floor(Math.random() * sectionHeight + 1 + runningHeight)
      //   let rndLeft = Math.floor(
      //     ((Math.random() * sectionWidth + 1 + runningWidth) / screenWidth) * 100
      //   )
      //   let rnd = Math.floor(Math.random() * 2)
      //   if (rnd === 1) {
      //     rndSign = -1
      //   } else if (rnd === 0) {
      //     rndSign = 1
      //   }
      //   let rndRot = Math.floor(Math.random() * 30) * rndSign
      //   i.setAttribute("class", `fas ${rndsubjs[0].class}`)
      //   i.setAttribute(
      //     "style",
      //     `top: ${rndTop}px; left: ${rndLeft}%; transform: rotate(${rndRot}deg)`
      //   )
      //   home.appendChild(i)
      dontHave.appendChild(p)
      //   runningWidth += sectionWidth
      rndsubjs.shift()
    }
    runningWidth = 0
    // runningHeight = sectionHeight * (i + 1)
  }
  p = document.createElement("p")
  p.innerText = "or any of that other stuff."
  dontHave.appendChild(p)
  p = document.createElement("p")
  p.innerText =
    "So if you're here for anything unrelated to math, this ain't the place " +
    "for you. Thanks for stopping by, though!"
  dontHave.appendChild(p)
  scrollElements = dontHave.querySelectorAll("p")
  window.addEventListener("scroll", handleScrollAnimation)
  window.dispatchEvent(new Event("scroll"))
}

const getRndSubjs = async () => {
  try {
    const {
      data: { rndsubjs },
    } = await axios.get("/api/v1/rndsubj")
    // handleRndSubjs(rndsubjs)
  } catch (err) {
    console.log(err)
  }
}

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  )
}

// const elementOutofView = (el) => {
//   const elementTop = el.getBoundingClientRect().top

//   return (
//     elementTop > (window.innerHeight || document.documentElement.clientHeight)
//   )
// }

const displayScrollElement = (element) => {
  element.classList.add("scrolled")
}

// const hideScrollElement = (element) => {
//   element.classList.remove("scrolled")
// }

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el)
      // } else if (elementOutofView(el)) {
      //   hideScrollElement(el)
    }
  })
}

window.addEventListener("load", getRndSubjs)
scroll.addEventListener("pointerup", () => {
  document.activeElement.blur()
  home.scrollIntoView()
})
