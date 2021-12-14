const path = require("path")
const fs = require("fs")
const { StatusCodes } = require("http-status-codes")

const getSnippet = async (req, res) => {
  console.log(req.params)
  const { lang, name } = req.params
  const snip = path.join(
    __dirname,
    "..",
    "public/snippets",
    `${lang}/${name}.txt`
  )
  fs.readFile(snip, "utf-8", (err, data) => {
    if (err) {
      console.log(err)
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No snippet found" })
    }
    res.status(StatusCodes.OK).json({ data })
  })
}

module.exports = getSnippet
