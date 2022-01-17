const commentId = path.split("/")[3]
const notFound = document.getElementById("not_found")
const found = document.getElementById("found")
let username

const getRole = async () => {
  if (token) {
    try {
      const {
        data: { role },
      } = await axios.get(`/api/v1/token/${token.split(" ")[1]}`)
      if (role !== "admin") {
        window.location.href = "/help"
      }
    } catch (err) {
      console.log(err)
    }
  } else {
    window.location.href = "/"
  }
}

const addComment = (thread) => {
  const {
    comment: { question, details },
    replies,
    replies: { length },
    _id: liId,
  } = thread
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
  setAria(replyBtn, "Reply")
  let numReplies = document.createElement("button")
  div.setAttribute("data-id", liId)
  title.setAttribute("class", "larger")
  sub.setAttribute("class", "sub")
  numReplies.setAttribute("class", "smaller")
  title.textContent = question
  sub.textContent = details
  if (length === 1) {
    numReplies.textContent = `1 reply`
    setAria(numReplies, "See reply")
  } else {
    numReplies.textContent = `${length} replies`
    setAria(numReplies, "See replies")
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
  flexContainer_f.appendChild(replyBtn)
  flexContainer_f.appendChild(numReplies)
  front.appendChild(flexContainer_f)
  back.appendChild(textArea)
  flexContainer_b.appendChild(backBtn)
  flexContainer_b.appendChild(submitBtn)
  back.appendChild(flexContainer_b)
  div.appendChild(front)
  div.appendChild(back)
  found.appendChild(div)
  if (replies.length > 0) {
    replies.forEach((r) => {
      const { sender, reply } = r
      addReply(sender, reply, liId)
    })
  }
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
    replier.textContent = username
  } else {
    replyDiv.classList.add("taller")
    replier.textContent = `${sender}@MC`
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
  if (numReplies === 1) {
    numRepliesBtn.textContent = "1 reply"
    setAria(numRepliesBtn, "See reply")
  } else {
    numRepliesBtn.textContent = `${numReplies} replies`
    setAria(numRepliesBtn, "See replies")
  }
}

const getComment = async () => {
  try {
    const {
      data: { thread, displayName },
    } = await axios.get(`/api/v1/comment/admin/${commentId}`)
    notFound.remove()
    found.classList.add("reveal")
    username = displayName
    addComment(thread)
  } catch (err) {
    notFound.classList.add("reveal")
    found.remove()
    console.log(err)
  }
}

const init = () => {
  getRole()
  getComment()
}

window.addEventListener("load", init)
