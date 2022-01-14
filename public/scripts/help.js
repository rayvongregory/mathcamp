const noAccess = document.getElementById("no-access")
const access = document.getElementById("access")
const commentsSection = document.getElementById("comments")
const newMsgBtn = document.getElementById("new-msg-btn")
const newMsg = document.getElementById("new-msg")
const submitQBtn = document.getElementById("submit-q")
const questionInput = document.getElementById("question")
const detailsTextarea = document.getElementById("details")
let displayName

//util
const setAria = (el, string) => {
  el.setAttribute("aria-label", string)
  el.setAttribute("title", string)
}

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
    const li = document.createElement("li")
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
    li.setAttribute("data-id", liId)
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
    li.appendChild(front)
    li.appendChild(back)
    if (list.length === 1) {
      commentsSection.insertAdjacentElement("afterbegin", li)
    } else {
      commentsSection.appendChild(li)
    }
    if (replies.length > 0) {
      replies.forEach((r) => {
        const { sender, reply, _id: replyId } = r
        addReply(sender, reply, replyId, liId)
      })
    }
  })
}

const addReply = (sender, reply, replyId, liId) => {
  let repliesDiv = document.querySelector(`[data-id="${liId}"] + .replies`)
  let comment = document.querySelector(`[data-id="${liId}"]`)
  if (!repliesDiv) {
    repliesDiv = document.createElement("div")
    repliesDiv.setAttribute("class", "replies")
    comment.insertAdjacentElement("afterend", repliesDiv)
  }
  let replyDiv = document.createElement("div")
  replyDiv.setAttribute("class", "reply")
  replyDiv.setAttribute("data-id", replyId)
  const flexContainer = document.createElement("div")
  flexContainer.setAttribute("class", "flex")
  const editBtn = document.createElement("button")
  editBtn.textContent = "Edit"
  editBtn.setAttribute("name", "edit")
  editBtn.addEventListener("pointerup", editReply)
  const delBtn = document.createElement("button")
  delBtn.textContent = "Delete"
  delBtn.setAttribute("name", "del")
  delBtn.addEventListener("pointerup", deleteReply)
  let replier = document.createElement("p")
  replier.setAttribute("class", "larger")
  if (sender === "user") {
    replier.textContent = displayName
  } else {
    replier.textContent = sender
  }
  let msg = document.createElement("p")
  msg.setAttribute("class", "sub")
  msg.textContent = reply
  flexContainer.appendChild(replier)
  flexContainer.appendChild(editBtn)
  flexContainer.appendChild(delBtn)
  replyDiv.appendChild(flexContainer)
  replyDiv.appendChild(msg)
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
      let { id } = parentElement.parentElement.dataset
      value = value.trim()
      if (value) {
        try {
          const {
            data: { sender, reply, _id: replyId },
          } = await axios.patch(`/api/v1/comment/${id}`, {
            token: token.split(" ")[1],
            reply: value,
          })
          addReply(sender, reply, replyId, id)
          textArea.value = ""
          const { previousElementSibling: p } = parentElement
          p.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log("nothing here")
      }
      break
  }
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
    default:
      // save
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
  }
}

const editReply = async (e) => {
  console.log("clicked")
  const { target } = e
}

//delete
const deleteComment = async (e) => {
  console.log("clicked")
}

const deleteReply = async (e) => {
  console.log("clicked")
}

const init = () => {
  getRole()
}

window.addEventListener("load", init)
