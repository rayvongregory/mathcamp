const getAllHelp = async (req, res) => {
  console.log(req)
  res.send("hopefully getting all help")
}

const getHelp = async (req, res) => {
  res.send("hopefully getting a singular help")
}

const postHelp = async (req, res) => {
  res.send("hopefully posting a help")
}

const updateHelp = async (req, res) => {
  res.send("hopefully updating a help")
}

const deleteHelp = async (req, res) => {
  res.send("hopefully deleting a help")
}
module.exports = {
  getAllHelp,
  getHelp,
  postHelp,
  updateHelp,
  deleteHelp,
}
