const getResource = (req, res) => {
  const { baseUrl } = req
  let title, bannerTitle
  if (baseUrl === "/learn") {
    title = "Learn"
  } else {
    title = "Practice"
  }
  res.render("pages/single_resource", {
    title,
    bannerTitle,
  })
}

const getAllResources = (req, res) => {
  const { baseUrl } = req
  if (baseUrl === "/learn") {
    res.render("pages/learn", {
      msg: "Browse our articles and video lessons.",
      title: "Learn",
      bannerTitle: "Learn",
    })
  } else {
    res.render("pages/practice", {
      msg: "Engage in our adaptive learning exercises.",
      title: "Practice",
      bannerTitle: "Practice",
    })
  }
}

module.exports = { getResource, getAllResources }
