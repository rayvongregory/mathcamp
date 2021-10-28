const nav = document.querySelector("nav")
const navSearch = document.querySelector("#nav-search-btn")
const navSearchContainer = document.querySelector(".nav___search-container")
const aside = document.querySelector("aside")
const asideUL = aside.querySelector("ul")
const menuBtn = document.querySelector(".menu-btn")
const menuBtnBurgir = menuBtn.querySelector("*")
const nameWrap = document.querySelector(".name-wrapper")
const nameWrapI = nameWrap.querySelector("i")
const nameWrapH3 = nameWrap.querySelector("h3")
const avatar = nameWrap.querySelector("img")
const loginButton = document.querySelector("#login")
const registerButton = document.querySelector("#register")
const accountButton = document.querySelector("#account")
const createLessonButton = document.querySelector("#createlesson")
const createExerciseButton = document.querySelector("#createexercise")
const draftsButton = document.querySelector("#drafts")
const logoutButton = document.querySelector("#logout")
let root = document.documentElement.style
let role = "user"
let menuOpen = false
const token = localStorage.getItem("token")
let justLoaded = true
let breakpoints = { tiny: 320, small: 576, medium: 768, big: 992, large: 1200 }
let lastWindowSize = 1,
  currentWindowSize = 1
let tx = "translateX(-50px)"
let rt = "rotate(45deg) translate(35px, -35px)"
let rt2 = "rotate(-45deg) translate(35px, 35px)"
let t = "transform 0.3s ease-in-out"

logoutButton.addEventListener("pointerup", async () => {
  try {
    const { data } = await axios.patch("/api/v1/auth/logout", {
      token,
    })
    localStorage.removeItem("token")
    location.reload()
  } catch (err) {
    console.error(err)
  }
})

const getDisplayName = async () => {
  if (token) {
    try {
      const { data } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
      nameWrapH3.innerHTML = data.displayName
      avatar.classList.remove("hide")
      avatar.src = data.avatar
      role = data.role
      loginButton.classList.add("hide")
      registerButton.classList.add("hide")
      accountButton.classList.remove("hide")
      logoutButton.classList.remove("hide")
      if (role === "admin") {
        createLessonButton.classList.remove("hide")
        createExerciseButton.classList.remove("hide")
        draftsButton.classList.remove("hide")
      }
      let nameWrapWidth = nameWrap.offsetWidth
      if (nameWrapWidth > 163) {
        asideUL.style.width = `${nameWrapWidth}px`
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem("token")
      location.reload()
    }
  } else {
    nameWrapH3.innerHTML = "Guest"
  }
  nav.style.visibility = "visible"
  aside.style.visibility = "visible"
}

nameWrap.addEventListener("pointerup", () => {
  if (lastWindowSize === "large") {
    if (asideUL.classList.contains("slide-down")) {
      asideUL.classList.toggle("slide-down")
      setTimeout(() => {
        asideUL.classList.toggle("hide")
      }, 300)
    } else {
      asideUL.classList.toggle("hide")
      setTimeout(() => {
        asideUL.classList.toggle("slide-down")
      }, 0)
    }
    nameWrapI.classList.toggle("rotate")
  }
})

const resetMenuBtn = () => {
  menuBtn.classList.replace("open", "no-transitions")
  menuBtnBurgir.classList.add("no-transitions")
  root.setProperty("--translateX", "0")
  root.setProperty("--rotateTranslate", "0")
  root.setProperty("--rotateTranslate2", "0")
  root.setProperty("--transition", "none")
  setTimeout(() => {
    menuOpen = false
    menuBtn.classList.remove("no-transitions")
    menuBtnBurgir.classList.remove("no-transitions")
    root.setProperty("--translateX", tx)
    root.setProperty("--rotateTranslate", rt)
    root.setProperty("--rotateTranslate2", rt2)
    root.setProperty("--transition", t)
  }, 0)
}

menuBtn.addEventListener("pointerup", () => {
  aside.classList.toggle("slide")
  if (lastWindowSize !== "big") {
    navSearchContainer.classList.add("hide")
  }
  if (lastWindowSize === "small") {
    navSearch.innerHTML = '<i class="fas fa-search"></i><span>Search</span>'
  } else if (currentWindowSize === "medium") {
    navSearch.innerHTML = '<i class="fas fa-search"></i><span></span>'
  }
  if (!menuOpen) {
    menuBtn.classList.add("open")
    menuOpen = true
  } else {
    menuBtn.classList.remove("open")
    menuOpen = false
  }
})

navSearch.addEventListener("pointerup", () => {
  navSearchContainer.classList.toggle("hide")
  aside.classList.replace("slide", "no-transitions")
  setTimeout(() => {
    aside.classList.remove("no-transitions")
  }, 0)
  resetMenuBtn()
  if (lastWindowSize === "medium") {
    if (navSearch.innerHTML === '<i class="fas fa-times"></i><span></span>') {
      navSearch.innerHTML = '<i class="fas fa-search"></i><span></span>'
    } else {
      navSearch.innerHTML = '<i class="fas fa-times"></i><span></span>'
    }
  } else if (lastWindowSize === "small") {
    if (
      navSearch.innerHTML === '<i class="fas fa-times"></i><span>Search</span>'
    ) {
      navSearch.innerHTML = '<i class="fas fa-search"></i><span>Search</span>'
    } else {
      navSearch.innerHTML = '<i class="fas fa-times"></i><span>Search</span>'
    }
    if (root.getPropertyValue("--offset") !== "100px") {
      root.setProperty("--offset", "100px")
    } else {
      root.setProperty("--offset", "90px")
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
    resetMenuBtn()
  }
  switch (currentWindowSize) {
    case "tiny":
      navSearch.innerHTML = '<i class="fas fa-search"></i><span></span>'
      navSearchContainer.classList.remove("hide")
      aside.classList.remove("slide")
      root.setProperty("--offset", "100px")
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        menuBtn.insertAdjacentElement("afterend", aside)
      }
      break
    case "small":
      navSearch.innerHTML = '<i class="fas fa-search"></i><span>Search</span>'
      navSearchContainer.classList.add("hide")
      aside.classList.remove("slide")
      root.setProperty("--offset", "90px")
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        menuBtn.insertAdjacentElement("afterend", aside)
      }
      break
    case "medium":
      navSearch.innerHTML = '<i class="fas fa-search"></i><span></span>'
      navSearchContainer.classList.add("hide")
      aside.classList.remove("slide")
      root.setProperty("--offset", "90px")
      root.setProperty("--offset", "0px")
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        menuBtn.insertAdjacentElement("afterend", aside)
      }
      break
    case "big":
      navSearch.innerHTML = '<i class="fas fa-search"></i><span></span>'
      navSearchContainer.classList.remove("hide")
      asideUL.classList.remove("hide")
      aside.classList.remove("slide")
      if (navSearchContainer.nextElementSibling === aside) {
        aside.remove()
        menuBtn.insertAdjacentElement("afterend", aside)
      }
      root.setProperty("--offset", "0px")
      break
    case "large":
      navSearchContainer.classList.remove("hide")
      asideUL.classList.add("hide")
      asideUL.classList.remove("slide-down")
      if (menuBtn.nextElementSibling === aside) {
        aside.remove()
        nav.appendChild(aside)
      }
      nameWrapI.classList.remove("rotate")
      break
    default:
      break
  }
  if (breakpoints[currentWindowSize] > 992) {
    aside.classList.add("no-transitions")
    asideUL.classList.add("no-transitions")
    asideUL.classList.add("hide")
    setTimeout(() => {
      aside.classList.remove("no-transitions")
      asideUL.classList.remove("no-transitions")
    }, 0)
  } else {
    aside.classList.add("no-transitions")
    asideUL.classList.add("no-transitions")
    asideUL.classList.remove("hide")
    setTimeout(() => {
      aside.classList.remove("no-transitions")
      asideUL.classList.remove("no-transitions")
    }, 0)
  }
  lastWindowSize = currentWindowSize
  currentWindowSize = ""
}

const navInit = () => {
  checkWindowSize()
  getDisplayName()
}

window.addEventListener("load", navInit)
window.addEventListener("resize", checkWindowSize)
