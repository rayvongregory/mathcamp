const path = window.location.pathname
const html = document.querySelector("html")
const body = html.querySelector("body")
const nav = body.querySelector("nav")
const buttons = document.querySelector(".buttons")
const navSearch = document.getElementById("nav-search-btn")
const navSearchContainer = document.querySelector(".nav___search-container")
const aside = body.querySelector("aside")
const asideLinks = document.getElementById("links")
const stickyDiv = document.getElementById("sticky-div")
const menuBtn = document.querySelector(".menu-btn")
const menuBtnBurgirLines = menuBtn.querySelectorAll("*")
const menuBtnBurgirB = menuBtnBurgirLines[0]
const menuBtnBurgir = menuBtnBurgirLines[1]
const menuBtnBurgirA = menuBtnBurgirLines[2]
const nameWrap = document.getElementById("name-wrapper")
const nameWrapI = nameWrap.querySelector("i")
const nameWrapH3 = nameWrap.querySelector("h3")
const avatar = nameWrap.querySelector("img")
const loginBtn = asideLinks.querySelector("[href='/login']")
const registerBtn = asideLinks.querySelector("[href='/register']")
const accountBtn = asideLinks.querySelector("[href='/account']")
const createLessonBtn = asideLinks.querySelector("[href='/create/lesson']")
const createExerciseBtn = asideLinks.querySelector("[href='/create/exercise']")
const draftsBtn = asideLinks.querySelector("[href='/drafts']")
const logoutBtn = document.getElementById("logout")
let root = document.documentElement.style
let role = "user"
let menuOpen = false
let token = localStorage.getItem("token")
let justLoaded = true
let breakpoints = { tiny: 320, small: 576, medium: 768, big: 992, large: 1200 }
let lastWindowSize = 1,
  currentWindowSize = 1,
  speed = 0,
  particleMod = 0

logoutBtn.addEventListener("pointerup", async () => {
  try {
    const { data } = await axios.patch("/api/v1/auth/logout", {
      token,
    })
    localStorage.removeItem("token")
    window.location.href = "/login"
  } catch (err) {
    console.error(err)
  }
})

const getDisplayName = async () => {
  if (token) {
    try {
      const { data } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
      nameWrapH3.innerText = data.displayName
      avatar.classList.remove("hide")
      avatar.src = data.avatar
      role = data.role
      loginBtn.classList.add("hide")
      registerBtn.classList.add("hide")
      accountBtn.classList.remove("hide")
      logoutBtn.classList.remove("hide")
      if (role === "admin") {
        createLessonBtn.classList.remove("hide")
        createExerciseBtn.classList.remove("hide")
        draftsBtn.classList.remove("hide")
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem("token")
      location.reload()
    }
  } else {
    nameWrapH3.innerText = "Guest"
  }
  html.classList.remove("invis")
  let noClass = document.querySelectorAll('[class=""]')
  noClass.forEach((el) => {
    el.removeAttribute("class")
  })
}

nameWrap.addEventListener("pointerup", () => {
  if (lastWindowSize === "large") {
    if (asideLinks.classList.contains("slide-down")) {
      asideLinks.classList.toggle("slide-down")
      setTimeout(() => {
        asideLinks.classList.toggle("hide")
      }, 300)
    } else {
      asideLinks.classList.toggle("hide")
      setTimeout(() => {
        asideLinks.classList.toggle("slide-down")
      }, 0)
    }
    nameWrapI.classList.toggle("rotate")
  }
})

menuBtn.addEventListener("pointerup", () => {
  if (
    lastWindowSize !== "large" &&
    aside.style.height !== `${body.scrollHeight}px`
  ) {
    aside.style.height = `${body.scrollHeight}px`
  }
  if (lastWindowSize === "tiny" || lastWindowSize === "small") {
    if (!menuOpen) {
      aside.classList.toggle("slide")
      menuBtn.classList.add("open")
      menuBtn.classList.replace("abs", "fixed")
      setTimeout(() => {
        menuBtn.classList.replace("fixed", "sticky")
      }, 300)
      menuOpen = true
    } else {
      menuBtn.classList.remove("open")
      menuBtn.style.pointerEvents = "none"
      setTimeout(() => {
        aside.classList.toggle("slide")
        menuBtnBurgir.style.backgroundColor = "transparent"
        menuBtnBurgirB.style.backgroundColor = "transparent"
        menuBtnBurgirA.style.backgroundColor = "transparent"
        menuBtn.classList.replace("sticky", "fixed")
      }, 300)
      setTimeout(() => {
        menuBtn.classList.replace("fixed", "abs")
        menuBtnBurgir.style.backgroundColor = ""
        menuBtnBurgirB.style.backgroundColor = ""
        menuBtnBurgirA.style.backgroundColor = ""
        menuBtn.style.pointerEvents = ""
      }, 600)
      menuOpen = false
    }
  } else if (lastWindowSize === "medium" || lastWindowSize === "big") {
    if (!menuOpen) {
      menuBtn.classList.add("open")
      menuBtn.classList.replace("abs", "fixed")
      aside.classList.toggle("slide")
      setTimeout(() => {
        menuBtn.classList.replace("fixed", "sticky")
      }, 102)
      menuOpen = true
    } else {
      let top
      menuBtn.classList.remove("open")
      menuBtn.classList.add("no-transitions")
      menuBtn.style.pointerEvents = "none"
      setTimeout(() => {
        aside.classList.toggle("slide")
      }, 200)
      setTimeout(() => {
        menuBtnBurgir.classList.add("no-transitions")
        menuBtnBurgirB.classList.add("no-transitions")
        menuBtnBurgirA.classList.add("no-transitions")
      }, 300)
      setTimeout(() => {
        menuBtn.classList.replace("sticky", "abs")
        top = menuBtn.getBoundingClientRect().top
        menuBtn.classList.replace("abs", "fixed")
      }, 500)
      setTimeout(() => {
        menuBtn.classList.replace("fixed", "abs")
        menuBtn.style.top = `${top * -1 + 14}px`
        menuBtnBurgir.classList.remove("no-transitions")
        menuBtnBurgirB.classList.remove("no-transitions")
        menuBtnBurgirA.classList.remove("no-transitions")
      }, 645)
      setTimeout(() => {
        menuBtn.classList.remove("no-transitions")
        menuBtn.style.top = ""
        menuBtn.style.pointerEvents = ""
      }, 745)
      menuOpen = false
    }
  }
})

navSearch.addEventListener("pointerup", () => {
  document.activeElement.blur()
  if (lastWindowSize === "medium") {
    navSearchContainer.classList.toggle("hide")
    if (navSearch.innerHTML === '<i class="fas fa-times"></i>') {
      navSearch.innerHTML = '<i class="fas fa-search"></i>'
    } else {
      navSearch.innerHTML = '<i class="fas fa-times"></i>'
    }
  } else if (lastWindowSize === "small") {
    if (navSearchContainer.classList.contains("no-transitions")) {
      navSearchContainer.classList.remove("no-transitions")
    }
    if (navSearch.innerHTML === '<i class="fas fa-times"></i>Search') {
      navSearch.innerHTML = '<i class="fas fa-search"></i>Search'
      navSearchContainer.style.bottom = "15px"
    } else {
      navSearch.innerHTML = '<i class="fas fa-times"></i>Search'
      navSearchContainer.style.bottom = ""
    }
  }
})

const getWindowSize = (last) => {
  let width = window.innerWidth
  for (let size in breakpoints) {
    if (width < breakpoints[size]) {
      currentWindowSize = size
      if (last) {
        last = size
      }
      return
    }
  }
  currentWindowSize = "large"
  if (last) {
    last = "large"
  }
}

const checkWindowSize = () => {
  if (justLoaded) {
    getWindowSize(lastWindowSize)
    justLoaded = false
  } else {
    getWindowSize()
    if (currentWindowSize === lastWindowSize) {
      return
    }
  }
  switch (currentWindowSize) {
    case "tiny":
      navSearch.innerHTML = '<i class="fas fa-search"></i>'
      navSearchContainer.classList.add("no-transitions")
      if (navSearchContainer.classList.contains("hide")) {
        navSearchContainer.classList.remove("hide")
      }
      if (navSearchContainer.style.bottom) {
        navSearchContainer.removeAttribute("style")
      }
      if (aside.classList.contains("slide")) {
        aside.classList.remove("slide")
      }
      if (asideLinks.classList.contains("slide-down")) {
        asideLinks.classList.remove("slide-down")
      }
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        nav.insertAdjacentElement("beforebegin", aside)
      }
      if (buttons.nextElementSibling === navSearchContainer) {
        navSearchContainer.remove()
        nav.insertAdjacentElement("afterend", navSearchContainer)
      }
      break
    case "small":
      navSearch.innerHTML = '<i class="fas fa-search"></i>Search'
      if (navSearchContainer.classList.contains("hide")) {
        navSearchContainer.classList.remove("hide")
      }
      if (buttons.nextElementSibling === navSearchContainer) {
        navSearchContainer.remove()
        nav.insertAdjacentElement("afterend", navSearchContainer)
      }
      if (buttons.nextElementSibling === aside) {
        aside.remove()
        nav.insertAdjacentElement("beforebegin", aside)
      }
      if (!navSearchContainer.style.bottom) {
        navSearchContainer.classList.add("no-transitions")
        navSearchContainer.style.bottom = "15px"
      }
      if (aside.classList.contains("slide")) {
        aside.classList.remove("slide")
      }
      if (asideLinks.classList.contains("slide-down")) {
        asideLinks.classList.remove("slide-down")
      }
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        nav.insertAdjacentElement("beforebegin", aside)
      }
      break
    case "medium":
      navSearch.innerHTML = '<i class="fas fa-search"></i>'
      if (!navSearchContainer.classList.contains("hide")) {
        navSearchContainer.classList.add("hide")
      }
      if (navSearchContainer.style) {
        navSearchContainer.removeAttribute("style")
      }
      if (aside.classList.contains("slide")) {
        aside.classList.remove("slide")
      }
      if (asideLinks.classList.contains("slide-down")) {
        asideLinks.classList.remove("slide-down")
      }
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        nav.insertAdjacentElement("beforebegin", aside)
      }
      break
    case "big":
      navSearch.innerHTML = '<i class="fas fa-search"></i>'
      if (navSearchContainer.classList.contains("hide")) {
        navSearchContainer.classList.remove("hide")
      }
      if (navSearchContainer.style) {
        navSearchContainer.removeAttribute("style")
      }
      if (asideLinks.classList.contains("hide")) {
        asideLinks.classList.remove("hide")
      }
      if (asideLinks.classList.contains("slide-down")) {
        asideLinks.classList.remove("slide-down")
      }
      if (aside.classList.contains("slide")) {
        aside.classList.remove("slide")
      }
      if (nav.nextElementSibling === navSearchContainer) {
        navSearchContainer.remove()
        nav.appendChild(navSearchContainer)
      }
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        nav.insertAdjacentElement("beforebegin", aside)
      }

      break
    case "large":
      if (navSearchContainer.classList.contains("hide")) {
        navSearchContainer.classList.remove("hide")
      }
      if (navSearchContainer.style) {
        navSearchContainer.removeAttribute("style")
      }
      if (!asideLinks.classList.contains("hide")) {
        asideLinks.classList.add("hide")
      }
      if (asideLinks.classList.contains("slide-down")) {
        asideLinks.classList.remove("slide-down")
      }
      if (nav.nextElementSibling === navSearchContainer) {
        navSearchContainer.remove()
        nav.appendChild(navSearchContainer)
      }
      if (aside.nextElementSibling === nav) {
        aside.remove()
        nav.appendChild(aside)
      }
      if (aside.style) {
        aside.removeAttribute("style")
      }
      nameWrapI.classList.remove("rotate")
      break
    default:
      break
  }
  aside.classList.add("no-transitions")
  asideLinks.classList.add("no-transitions")
  menuBtn.classList.add("no-transitions")
  menuBtnBurgirB.classList.add("no-transitions")
  menuBtnBurgir.classList.add("no-transitions")
  menuBtnBurgirA.classList.add("no-transitions")
  if (menuBtn.classList.contains("sticky")) {
    menuBtn.classList.replace("sticky", "abs")
  }
  if (menuBtn.classList.contains("open")) {
    menuBtn.classList.remove("open")
  }
  if (breakpoints[currentWindowSize] > 992) {
    asideLinks.classList.add("hide")
  } else {
    asideLinks.classList.remove("hide")
  }
  setTimeout(() => {
    aside.classList.remove("no-transitions")
    asideLinks.classList.remove("no-transitions")
    menuBtn.classList.remove("no-transitions")
    menuBtnBurgirB.classList.remove("no-transitions")
    menuBtnBurgir.classList.remove("no-transitions")
    menuBtnBurgirA.classList.remove("no-transitions")
    menuOpen = false
  }, 0)
  lastWindowSize = currentWindowSize
  currentWindowSize = ""
}

const navInit = () => {
  checkWindowSize()
  getDisplayName()
  if (path === "/login" || path === "/register") {
    speed = 0.5
    particleMod = 15
  }
  Particles.init({
    selector: ".background",
    maxParticles: 25 + particleMod,
    sizeVariations: 25 + particleMod,
    speed,
    connectParticles: true,
    color: ["#e55832", "#bf492a", "#21d8ba", "#00a388"],
    // options for breakpoints
    responsive: [
      {
        breakpoint: 768,
        options: {
          maxParticles: 20 + particleMod,
          sizeVariations: 20 + particleMod,
        },
      },
      {
        breakpoint: 576,
        options: {
          maxParticles: 15 + particleMod,
          sizeVariations: 15 + particleMod,
        },
      },
      {
        breakpoint: 320,
        options: {
          maxParticles: 10 + particleMod,
          sizeVariations: 10 + particleMod,
        },
      },
    ],
  })
}

menuBtn.addEventListener("contextmenu", () => {
  return false
})
window.addEventListener("load", navInit)
window.addEventListener("resize", checkWindowSize)
