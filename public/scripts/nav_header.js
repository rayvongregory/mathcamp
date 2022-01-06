const path = window.location.pathname
const html = document.querySelector("html")
const body = html.querySelector("body")
const nav = body.querySelector("nav")
const buttons = document.querySelector(".buttons")
const navSearch = document.getElementById("nav-search-btn")
const navSearchContainer = document.querySelector(".nav___search-container")
const searchInput = navSearchContainer.querySelector("input")
const submitSearchBtn = document.getElementById("submit-search")
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
const token = localStorage.getItem("token")
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
      // localStorage.removeItem("token")
      // location.reload()
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

aside.addEventListener("pointerup", () => {
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

document.addEventListener("pointerup", (e) => {
  const { target } = e
  if (target !== aside && target !== asideLinks) {
    if (lastWindowSize !== "large" && target !== menuBtn && menuOpen) {
      menuBtn.dispatchEvent(new Event("pointerup"))
    } else if (
      lastWindowSize === "large" &&
      !asideLinks.classList.contains("hide")
    ) {
      aside.dispatchEvent(new Event("pointerup"))
    }
  }
})

navSearch.addEventListener("pointerup", () => {
  let i = navSearch.querySelector("i")
  document.activeElement.blur()
  if (lastWindowSize === "medium") {
    navSearchContainer.classList.toggle("hide")
    if (i.classList.contains("fa-times")) {
      i.classList.replace("fa-times", "fa-search")
    } else {
      i.classList.replace("fa-search", "fa-times")
      if (searchInput.value !== "") {
        searchInput.value = ""
      }
    }
  } else if (lastWindowSize === "small") {
    if (navSearchContainer.classList.contains("no-transitions")) {
      navSearchContainer.classList.remove("no-transitions")
    }
    if (i.classList.contains("fa-times")) {
      i.classList.replace("fa-times", "fa-search")
      navSearchContainer.classList.add("down")
      setTimeout(() => {
        if (searchInput.value !== "") {
          searchInput.value = ""
        }
      }, 250)
    } else {
      i.classList.replace("fa-search", "fa-times")
      navSearchContainer.classList.remove("down")
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
      if (navSearchContainer.classList.contains("down")) {
        navSearchContainer.classList.remove("down")
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
      if (!navSearchContainer.classList.contains("down")) {
        navSearchContainer.classList.add("no-transitions")
        navSearchContainer.classList.add("down")
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
      if (navSearchContainer.classList.contains("down")) {
        navSearchContainer.classList.remove("down")
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
      if (navSearchContainer.classList.contains("down")) {
        navSearchContainer.classList.remove("down")
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
      if (navSearchContainer.classList.contains("down")) {
        navSearchContainer.classList.remove("down")
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

const removeInvalidCharacters2 = (string) => {
  let bool = true
  while (bool) {
    let firstLetterCode = string.charCodeAt(0)
    let lastLetterCode = string.charCodeAt(string.length - 1)
    if (
      firstLetterCode < 97 ||
      firstLetterCode > 122 ||
      lastLetterCode < 97 ||
      lastLetterCode > 122
    ) {
      if (firstLetterCode < 97 || firstLetterCode > 122) {
        string = string.substring(1, string.length)
      }
      if (lastLetterCode < 97 || lastLetterCode > 122) {
        string = string.substring(0, string.length - 1)
      }
    } else {
      bool = false
    }
  }

  for (let index in string) {
    let code = string.charCodeAt(index)
    if ((code < 97 || code > 122) && code !== 32) {
      string = string.replace(string[index], "")
    }
  }
  string = string.replaceAll(" ", "+")
  return string
}

const submitSearch = (e) => {
  const { target } = e
  const { key } = e
  if (key === "Enter" || target === submitSearchBtn) {
    let { value } = searchInput
    value = removeInvalidCharacters2(value)
    if (!value) {
      window.location.href = "/search"
    } else {
      window.location.href = `/search?q=${value.replaceAll(" ", "+")}`
    }
  }
}

const navInit = () => {
  checkWindowSize()
  getDisplayName()
  if (path === "/login" || path === "/register") {
    speed = 0.5
    particleMod = 15
  }
  if (path === "/") {
    particleMod = 3
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

window.addEventListener("load", navInit)
window.addEventListener("resize", checkWindowSize)
submitSearchBtn.addEventListener("pointerup", submitSearch)
searchInput.addEventListener("keypress", submitSearch)
