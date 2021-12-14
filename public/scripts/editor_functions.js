const addMathBtn = document.querySelector(".add_eqn")
const mathEditor = document.querySelector(".math_editor")
const fontFamilySelectBtn = document.querySelector("#font-family_select button")
const fontFamilyP = fontFamilySelectBtn.querySelector("p")
const fontSizeSelectBtn = document.querySelector("#font-size_select button")
const fontsUL = document.getElementById("fonts")
const sizesUL = document.getElementById("sizes")
const fonts = fontsUL.querySelectorAll("li")
const sizes = sizesUL.querySelectorAll("li")
const txtClrBtn = document.querySelector(".text_clr")
const changeTxtClrBtn = document.querySelector(".change_text_clr")
const txtColorsUL = document.querySelector(".text_colors")
const txtClrs = txtColorsUL.querySelectorAll("li")
const hltClrBtn = document.querySelector(".text_hi")
const changeHltClrBtn = document.querySelector(".change_text_hi")
const hltClrsUL = document.querySelector(".highlight_colors")
const hltClrs = hltClrsUL.querySelectorAll("li")
const alignLeftBtn = document.querySelector(".align_left")
const alignCenterBtn = document.querySelector(".align_center")
const alignRightBtn = document.querySelector(".align_right")
const alignJustifyBtn = document.querySelector(".align_justify")
const indentBtn = document.querySelector(".indent")
const outdentBtn = document.querySelector(".outdent")
const options = document.querySelector(".options")
const groups = options.querySelectorAll(".group:not(#more)")
const moreOptionsBtn = document.querySelector(".more")
const moreOptions = document.querySelector(".more_options")
const textArea = document.querySelector("div[contenteditable]")
let highlight = Selection
let keysPressed = {}
let optionsWidth

const closeOtherList = (list) => {
  if (list === textArea) {
    let openList = moreOptions.querySelector("ul:not(.invis)")
    if (openList) {
      openList.classList.add("invis")
    }
    openList = options.querySelector(
      "ul:not(.invis), .more_options:not(.invis)"
    )
    if (openList) {
      openList.classList.add("invis")
      if (openList === moreOptions) {
        moreOptionsBtn.classList.remove("active")
      }
    }
    return
  }
  if (!list.classList.contains("invis")) {
    return
  }
  if (!moreOptions.contains(list) && moreOptions !== list) {
    if (!moreOptions.classList.contains("invis")) {
      let openList = moreOptions.querySelector("ul:not(.invis)")
      if (openList) {
        openList.classList.add("invis")
      }
      moreOptions.classList.add("invis")
      moreOptionsBtn.classList.remove("active")
    } else {
      let openList = options.querySelector(
        "ul:not(.invis), .more_options:not(.invis)"
      )
      if (openList) {
        openList.classList.add("invis")
      }
    }
  } else if (moreOptions.contains(list) && moreOptions !== list) {
    let openList = moreOptions.querySelector("ul:not(.invis)")
    if (openList) {
      openList.classList.add("invis")
    }
  } else if (moreOptions === list) {
    let openList = options.querySelector("ul:not(.invis)")
    if (openList) {
      openList.classList.add("invis")
    }
  }
}

addMathBtn.addEventListener("pointerup", () => {
  mathEditor.classList.toggle("slide-up")
})

fontFamilySelectBtn.addEventListener("pointerup", () => {
  document.activeElement.blur()
  closeOtherList(fontsUL)
  fontsUL.classList.toggle("invis")
})

fonts.forEach((font) => {
  font.addEventListener("pointerup", () => {
    fontFamilyP.innerText = font.innerText

    fontsUL.classList.add("invis")
  })
})

fontSizeSelectBtn.addEventListener("pointerup", () => {
  document.activeElement.blur()
  closeOtherList(sizesUL)
  if (sizesUL.classList.contains("invis")) {
    const selection = window.getSelection()
    if (!selection.isCollapsed) {
      highlight = selection
    }
  }
  sizesUL.classList.toggle("invis")
})

sizes.forEach((size) => {
  size.addEventListener("pointerup", (e) => {
    const { target } = e
    fontSizeSelectBtn.innerText = size.innerText
    const { anchorNode, focusNode } = highlight
    if (anchorNode && anchorNode === focusNode) {
      const { anchorOffset, focusOffset } = highlight
      console.log(highlight.getRangeAt(0))
      let span = document.createElement("span")
      span.setAttribute("style", target.getAttribute("style"))
      span.innerText = anchorNode.textContent.substring(
        anchorOffset,
        focusOffset
      )
      anchorNode.parentElement.appendChild(span)
    }
    sizesUL.classList.add("invis")
  })
})

changeTxtClrBtn.addEventListener("pointerup", () => {
  document.activeElement.blur()
  closeOtherList(txtColorsUL)
  txtColorsUL.classList.toggle("invis")
})

txtClrs.forEach((col) => {
  col.addEventListener("pointerup", () => {
    txtClrBtn.style = col.style.cssText.substr(11)
    setAria(txtClrBtn, `Text color: ${col.getAttribute("aria-label")}`)
    txtColorsUL.classList.toggle("invis")
  })
})

changeHltClrBtn.addEventListener("pointerup", () => {
  document.activeElement.blur()
  closeOtherList(hltClrsUL)
  hltClrsUL.classList.toggle("invis")
})

hltClrs.forEach((col) => {
  col.addEventListener("pointerup", () => {
    hltClrBtn.style = col.style.cssText.substr(11)
    setAria(hltClrBtn, `Highlight color: ${col.getAttribute("aria-label")}`)
    hltClrsUL.classList.toggle("invis")
  })
})

alignLeftBtn.addEventListener("pointerup", (e) => {
  e.preventDefault()
  e.stopPropagation()
  console.log(window.getSelection())
})

indentBtn.addEventListener("pointerup", (e) => {
  // find cursor
  const { target } = e
  console.log(target)
})

moreOptionsBtn.addEventListener("pointerup", () => {
  document.activeElement.blur()
  moreOptionsBtn.classList.toggle("active")
  closeOtherList(moreOptions)
  moreOptions.classList.toggle("invis")
})

textArea.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true
  //   if (e.key === "Tab") {
  //     e.preventDefault()
  //     indentBtn.dispatchEvent(new Event("pointerup"))
  //   }
})

textArea.addEventListener("keyup", (e) => {
  delete keysPressed[e.key]
  if (e.key === "Tab") {
    e.preventDefault()
    indentBtn.dispatchEvent(new Event("pointerup"))
  }
})

textArea.addEventListener("pointerup", () => {
  closeOtherList(textArea)
})

textArea.addEventListener("blur", (e) => {
  //   console.log(e)
})

const adjustBorders = () => {
  const { clientWidth: cw } = moreOptions
  let moGroups = moreOptions.querySelectorAll(".group")
  for (let i = 0; i < moGroups.length; i++) {
    let gr = moGroups[i]
    let { offsetWidth: grw, classList: grc } = gr
    if (moreOptions.firstElementChild === gr) {
      let nextGr = moGroups[i + 1]
      if (!nextGr) {
        gr.setAttribute("class", "group")
        break
      }
      let { offsetWidth: ngw } = nextGr
      if (grc.contains("bt")) {
        grc.remove("bt")
      }
      if (ngw < grw) {
        if (!grc.contains("bb")) {
          grc.add("bb")
        }
      } else {
        if (grc.contains("bb")) {
          grc.remove("bb")
        }
      }
      if (grw !== cw && !grc.contains("br")) {
        grc.add("br")
      } else if (grw === cw && grc.contains("br")) {
        grc.remove("br")
      }
    } else if (moreOptions.lastElementChild === gr) {
      let prevGr = moGroups[i - 1]
      let { offsetWidth: pgw } = prevGr
      if (gr.classList.contains("bb")) {
        gr.classList.remove("bb")
      }
      if (pgw <= grw) {
        if (!grc.contains("bt")) {
          grc.add("bt")
        }
      } else {
        if (grc.contains("bt")) {
          grc.remove("bt")
        }
      }
      if (grw !== cw && !grc.contains("br")) {
        grc.add("br")
      } else if (grw === cw && grc.contains("br")) {
        grc.remove("br")
      }
    } else {
      if (grw === cw) {
        if (!grc.contains("bt")) {
          gr.classList.add("bt")
        }
        if (!grc.contains("bb")) {
          gr.classList.add("bb")
        }
        if (grc.contains("br")) {
          grc.remove("br")
        }
      } else {
        // with the current setup, this is this the only case to consider
        // may need to revisit if you add anything to the toolbar
        // let prevGr = moGroups[i - 1]
        // let { offsetWidth: pgw } = prevGr
        let nextGr = moGroups[i + 1]
        let { offsetWidth: ngw } = nextGr
        if (ngw < grw && !grc.contains("bb")) {
          grc.add("bb")
        }
      }
    }
  }
}

const optionsResizeObserver = new ResizeObserver((e) => {
  const { inlineSize: newWidth } = e[0].borderBoxSize[0]
  const btnWidth = 50
  let runningWidth = btnWidth
  if (!optionsWidth || optionsWidth > newWidth) {
    optionsWidth = newWidth
    let noMoreSpace = false
    groups.forEach((group) => {
      if (runningWidth + group.offsetWidth <= optionsWidth && !noMoreSpace) {
        runningWidth += group.offsetWidth
      } else {
        moreOptions.appendChild(group)
        let grUL = group.querySelector("ul:not(.invis)")
        if (grUL) {
          grUL.classList.add("invis")
        }
        adjustBorders()
        if (!noMoreSpace) {
          noMoreSpace = true
        }
      }
    })
  } else {
    optionsWidth = newWidth
    let spaceAvailable = true
    groups.forEach((group) => {
      if (runningWidth + group.offsetWidth <= optionsWidth && spaceAvailable) {
        runningWidth += group.offsetWidth
        if (moreOptions.contains(group)) {
          moreOptions.parentElement.insertAdjacentElement("beforebegin", group)
          group.setAttribute("class", "group")
          let grUL = group.querySelector("ul:not(.invis)")
          if (grUL) {
            grUL.classList.add("invis")
          }
          adjustBorders()
        }
      } else {
        if (spaceAvailable) {
          spaceAvailable = false
        }
      }
    })
    optionsWidth = newWidth
  }
})

optionsResizeObserver.observe(options)
