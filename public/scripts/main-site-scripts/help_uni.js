//util
const setAria = (el, string) => {
  el.setAttribute("aria-label", string)
  el.setAttribute("title", string)
}

const reply = async (e) => {
  const { target } = e
  const {
    name,
    parentElement: { parentElement },
  } = target
  switch (name) {
    case "reply":
      const { nextElementSibling: n } = parentElement
      n.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      })
      break
    case "back":
      const { previousElementSibling: p } = parentElement
      p.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      })
      break
    default:
      let textArea = parentElement.querySelector("textarea")
      let { value } = textArea
      let { parentElement: li } = textArea.parentElement
      let { id } = li.dataset
      value = value.trim()
      if (value) {
        try {
          const {
            data: { sender, reply },
          } = await axios.patch(`/api/v1/comment/${id}`, {
            reply: value,
          })
          console.log(sender, reply)
          addReply(sender, reply, id)
          textArea.value = ""
          let next = li.nextElementSibling
          if (next && next.classList.contains("reveal")) {
            next.setAttribute("style", `max-height: ${next.scrollHeight}px`)
          }
          const { previousElementSibling: p } = parentElement
          p.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        target.parentElement.setAttribute("name", "denied")
        setTimeout(() => {
          target.parentElement.setAttribute("name", "submit")
        }, 2000)
      }
      break
  }
}

const editReply = async (e) => {
  const { target } = e
  const { name } = target
  const {
    parentElement: { parentElement },
    nextElementSibling,
  } = target
  let p = parentElement.querySelector("p.sub")
  switch (name) {
    case "edit":
      p.setAttribute("contenteditable", true)
      p.setAttribute("data-prev-val", p.textContent.trim())
      target.setAttribute("name", "save")
      target.textContent = "Save"
      nextElementSibling.setAttribute("name", "cancel")
      nextElementSibling.textContent = "Cancel"
      break
    case "save":
      const { prevVal } = p.dataset
      let { textContent } = p
      textContent = textContent.trim()
      if (prevVal !== textContent) {
        try {
          const { replyNumber } = parentElement.dataset
          const { id: commentId } =
            parentElement.parentElement.previousElementSibling.dataset
          await axios.patch(
            `/api/v1/comment/${commentId}/reply/${replyNumber}`,
            {
              reply: textContent,
            }
          )
        } catch (err) {
          console.log(err)
        }
      }
      p.removeAttribute("contenteditable")
      delete p.dataset.prevVal
      target.setAttribute("name", "edit")
      target.textContent = "Edit"
      nextElementSibling.setAttribute("name", "del")
      nextElementSibling.textContent = "Delete"
      break
    case "yes":
      const { replyNumber } = parentElement.dataset
      const { previousElementSibling } = parentElement.parentElement
      const { id: commentId } = previousElementSibling.dataset
      const {
        data: { msg },
      } = await axios.delete(
        `/api/v1/comment/${commentId}/reply/${replyNumber}`
      )
      let forWhile = parentElement
      while (forWhile.nextElementSibling) {
        const { nextElementSibling } = forWhile
        nextElementSibling.dataset.replyNumber =
          Number(nextElementSibling.dataset.replyNumber) - 1
        forWhile = nextElementSibling
      }
      parentElement.replaceChildren()
      parentElement.classList.add("center")
      parentElement.textContent = msg
      const numRepliesBtn =
        previousElementSibling.querySelector("button.smaller")
      let numReplies = Number(numRepliesBtn.textContent.split(" ")[0])
      numReplies--
      setTimeout(() => {
        if (numReplies === 1) {
          numRepliesBtn.textContent = "1 reply"
        } else {
          numRepliesBtn.textContent = `${numReplies} replies`
        }
        if (numReplies === 0) {
          numRepliesBtn.classList.remove("clickable")
          parentElement.parentElement.remove()
        }
        parentElement.remove()
      }, 1400)
      try {
      } catch (err) {
        console.log(err)
      }
  }
}

const deleteReply = async (e) => {
  const { target } = e
  const { name } = target
  const {
    parentElement: { parentElement },
    previousElementSibling,
  } = target
  let p = parentElement.querySelector("p.sub")
  switch (name) {
    case "cancel":
      p.textContent = p.dataset.prevVal
      p.removeAttribute("contenteditable")
      delete p.dataset.prevVal
      target.setAttribute("name", "del")
      target.textContent = "Delete"
      previousElementSibling.setAttribute("name", "edit")
      previousElementSibling.textContent = "Edit"
      break
    case "del":
      target.setAttribute("name", "no")
      target.textContent = "No"
      previousElementSibling.setAttribute("name", "yes")
      previousElementSibling.textContent = "Yes"
      break
    default:
      target.setAttribute("name", "del")
      target.textContent = "Delete"
      previousElementSibling.setAttribute("name", "edit")
      previousElementSibling.textContent = "Edit"
      break
  }
}
