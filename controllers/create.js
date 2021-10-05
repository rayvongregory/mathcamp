const getAllPosts = async (req, res) => {
  console.log(req)
  res.send("hopefully getting all posts")
}

const getPost = async (req, res) => {
  res.send("hopefully getting a singular post")
}

const createPost = async (req, res) => {
  res.send("hopefully creating a post")
}

const editPost = async (req, res) => {
  res.send("hopefully editing a post")
}

const deletePost = async (req, res) => {
  res.send("hopefully deleting a post")
}
module.exports = {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
}
