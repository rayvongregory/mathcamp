const noAccess = document.getElementById("no-access")
const access = document.getElementById("access")
const commentsSection = document.getElementById("comment")
const newMsgBtn = document.getElementById("new-msg-btn")
const newMsg = document.getElementById("new-msg")
const submitQBtn = document.getElementById("submit-q")
const questionInput = document.getElementById("question")
const detailsTextarea = document.getElementById("details")
let displayName

const allowSubmit = (e) => {
  let { value } = e.target
  value = value.trim()
  if (value && !submitQBtn.classList.contains("allow")) {
    submitQBtn.classList.add("allow")
  } else if (!value && submitQBtn.classList.contains("allow")) {
    submitQBtn.classList.remove("allow")
  }
}

const getRole = async () => {
  if (token) {
    try {
      const {
        data: { role, displayName: d },
      } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
      if (role === "admin") {
        window.location.href = "/help/admin"
      }
      displayName = d
    } catch (err) {
      console.log(err)
    }
    access.classList.add("reveal")
    noAccess.remove()
    addListeners()
    getComments()
    newMsgBtn.classList.add("reveal")
  } else {
    noAccess.classList.add("reveal")
    access.remove()
  }
}

const openNewMsg = (e) => {
  const { target } = e
  switch (target.classList.contains("rotate")) {
    case true:
      target.classList.remove("rotate")
      newMsg.classList.remove("open")
      break
    default:
      target.classList.add("rotate")
      newMsg.classList.add("open")
      break
  }
}

const addListeners = () => {
  newMsgBtn.addEventListener("pointerup", openNewMsg)
  submitQBtn.addEventListener("pointerup", submitQ)
  questionInput.addEventListener("input", allowSubmit)
}

//create
const addComments = (list) => {
  list.forEach((item) => {
    const {
      comment: { question, details },
      replies,
      replies: { length },
      _id: liId,
    } = item
    const div = document.createElement("div")
    const title = document.createElement("p")
    const sub = document.createElement("p")
    const flexContainer_f = document.createElement("div")
    const flexContainer_b = document.createElement("div")
    const replyBtn = document.createElement("button")
    const front = document.createElement("div")
    const back = document.createElement("div")
    const backBtn = document.createElement("button")
    const textArea = document.createElement("textarea")
    const submitBtn = document.createElement("button")
    const editBtn = document.createElement("button")
    editBtn.textContent = "Edit"
    editBtn.setAttribute("name", "edit")
    editBtn.addEventListener("pointerup", editComment)
    const delBtn = document.createElement("button")
    delBtn.textContent = "Delete"
    delBtn.setAttribute("name", "del")
    delBtn.addEventListener("pointerup", deleteComment)
    setAria(replyBtn, "Reply")
    let numReplies = document.createElement("button")
    div.setAttribute("data-id", liId)
    title.setAttribute("class", "larger")
    sub.setAttribute("class", "sub")
    numReplies.setAttribute("class", "smaller")
    numReplies.addEventListener("pointerup", showReplies)
    title.textContent = question
    sub.textContent = details
    if (length === 1) {
      numReplies.textContent = `1 reply`
      setAria(numReplies, "See reply")
    } else {
      numReplies.textContent = `${length} replies`
      setAria(numReplies, "See replies")
    }
    if (length > 0) {
      numReplies.classList.add("clickable")
    }
    replyBtn.innerHTML = '<i class="fas fa-reply"></i>'
    replyBtn.setAttribute("name", "reply")
    backBtn.setAttribute("name", "back")
    backBtn.textContent = "Back"
    submitBtn.setAttribute("name", "submit")
    replyBtn.addEventListener("pointerup", reply)
    backBtn.addEventListener("pointerup", reply)
    submitBtn.addEventListener("pointerup", reply)
    flexContainer_f.setAttribute("class", "flex")
    flexContainer_b.setAttribute("class", "flex")
    textArea.setAttribute("placeholder", "Add your reply")
    submitBtn.textContent = "Submit"
    front.setAttribute("class", "front")
    back.setAttribute("class", "back")
    front.appendChild(title)
    front.appendChild(sub)
    flexContainer_f.appendChild(editBtn)
    flexContainer_f.appendChild(delBtn)
    flexContainer_f.appendChild(replyBtn)
    flexContainer_f.appendChild(numReplies)
    front.appendChild(flexContainer_f)
    back.appendChild(textArea)
    flexContainer_b.appendChild(backBtn)
    flexContainer_b.appendChild(submitBtn)
    back.appendChild(flexContainer_b)
    div.appendChild(front)
    div.appendChild(back)
    if (list.length === 1) {
      commentsSection.insertAdjacentElement("afterbegin", div)
    } else {
      commentsSection.appendChild(div)
    }
    if (replies.length > 0) {
      replies.forEach((r) => {
        const { sender, reply } = r
        addReply(sender, reply, liId)
      })
    }
  })
}

const addReply = (sender, reply, liId) => {
  let repliesDiv = document.querySelector(`[data-id="${liId}"] + .replies`)
  let comment = document.querySelector(`[data-id="${liId}"]`)
  if (!repliesDiv) {
    repliesDiv = document.createElement("div")
    repliesDiv.setAttribute("class", "replies")
    comment.insertAdjacentElement("afterend", repliesDiv)
  }
  let replyDiv = document.createElement("div")
  replyDiv.setAttribute("class", "reply")
  replyDiv.setAttribute("data-reply-number", repliesDiv.childElementCount)
  let flexContainer,
    editBtn,
    delBtn,
    replier = document.createElement("p")
  replier.setAttribute("class", "larger")
  if (sender === "user") {
    replier.textContent = displayName
    flexContainer = document.createElement("div")
    flexContainer.setAttribute("class", "flex")
    editBtn = document.createElement("button")
    editBtn.textContent = "Edit"
    editBtn.setAttribute("name", "edit")
    editBtn.addEventListener("pointerup", editReply)
    delBtn = document.createElement("button")
    delBtn.textContent = "Delete"
    delBtn.setAttribute("name", "del")
    delBtn.addEventListener("pointerup", deleteReply)
  } else {
    replier.textContent = `${sender}@MC`
    replyDiv.classList.add("smaller")
  }
  let msg = document.createElement("p")
  msg.setAttribute("class", "sub")
  msg.textContent = reply
  replyDiv.appendChild(replier)
  replyDiv.appendChild(msg)
  if (flexContainer) {
    flexContainer.appendChild(editBtn)
    flexContainer.appendChild(delBtn)
    replyDiv.appendChild(flexContainer)
  }
  repliesDiv.appendChild(replyDiv)
  let numReplies = repliesDiv.childElementCount
  let numRepliesBtn = comment.querySelector("button.smaller")
  numRepliesBtn.addEventListener("pointerup", showReplies)
  if (numReplies === 1) {
    numRepliesBtn.textContent = "1 reply"
    setAria(numRepliesBtn, "See reply")
  } else {
    numRepliesBtn.textContent = `${numReplies} replies`
    setAria(numRepliesBtn, "See replies")
  }
  if (!numRepliesBtn.classList.contains("clickable")) {
    numRepliesBtn.classList.add("clickable")
  }
}

const submitQ = async (e) => {
  const { value: question } = questionInput
  const { value: details } = detailsTextarea
  try {
    const {
      data: { newComment },
    } = await axios.post("/api/v1/comment", {
      token: token.split(" ")[1],
      question,
      details,
    })
    addComments([newComment])
    questionInput.value = ""
    detailsTextarea.value = ""
    newMsgBtn.dispatchEvent(new Event("pointerup"))
  } catch (err) {
    console.log(err)
  }
}

//read
const getComments = async (e) => {
  try {
    const {
      data: { comments },
    } = await axios.get(`/api/v1/comment/${token.split(" ")[1]}`)
    addComments(comments)
    if (path.split("/")[2]) {
      const comment = document.querySelector(
        `div[data-id="${path.split("/")[2]}"]`
      )
      comment
        .querySelector("button.clickable")
        .dispatchEvent(new Event("pointerup"))
      const { nextElementSibling: replies } = comment
      replies.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  } catch (err) {
    console.log(err)
  }
}

const showReplies = (e) => {
  const { target } = e
  const { nextElementSibling: replies } =
    target.parentElement.parentElement.parentElement
  switch (replies.classList.contains("reveal")) {
    case true:
      replies.setAttribute("style", "")
      setAria(target, "See replies")
      break
    default:
      const { scrollHeight } = replies
      replies.setAttribute("style", `max-height: ${scrollHeight}px`)
      setAria(target, "Hide replies")
      break
  }
  replies.classList.toggle("reveal")
}

//update
const editComment = async (e) => {
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
          const { id } = p.parentElement.parentElement.dataset
          await axios.patch(`/api/v1/comment`, {
            token: token.split(" ")[1],
            id,
            details: textContent,
          })
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
      const { parentElement: li } = target.parentElement.parentElement
      const { id } = li.dataset
      try {
        const {
          data: { msg },
        } = await axios.delete(`/api/v1/comment/${id}`)
        li.replaceChildren()
        li.classList.add("center")
        li.textContent = msg
        const { nextElementSibling: next } = li
        if (next && next.classList.contains("replies")) {
          next.remove()
        }
        setTimeout(() => {
          li.remove()
        }, 1400)
      } catch (err) {
        console.log(err)
      }
  }
}

//delete
const deleteComment = async (e) => {
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

const init = () => {
  getRole()
}

window.addEventListener("load", init)
