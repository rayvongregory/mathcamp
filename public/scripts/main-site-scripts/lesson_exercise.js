const addEditBtn = (resource) => {
  const fixedDiv = document.createElement("div")
  const editBtn = document.createElement("a")
  fixedDiv.setAttribute("id", "fixed")
  editBtn.setAttribute("id", "edit-btn")
  editBtn.setAttribute("href", `/drafts/exercise/${id}`)
  editBtn.innerHTML = '<i class="fas fa-edit"></i>'
  fixedDiv.appendChild(editBtn)
  resource.appendChild(fixedDiv)
}
