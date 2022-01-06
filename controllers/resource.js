const getResource = (req, res) => {
  const { baseUrl } = req
  let title, bannerTitle
  if (baseUrl === "/learn") {
    title = "Learn"
    bannerTitle = "Learn"
    res.render("pages/lesson", {
      title,
      bannerTitle,
    })
  } else {
    title = "Practice"
    bannerTitle = "Practice"
    res.render("pages/exercise", {
      title,
      bannerTitle,
    })
  }
}

const getAllResources = (req, res) => {
  const { baseUrl } = req
  let msg, title, bannerTitle
  if (baseUrl === "/learn") {
    msg = "Engage in our adaptive learning exercises."
    title = "Learn"
    bannerTitle = "Learn"
  } else {
    msg = "Browse our articles and video lessons."
    title = "Practice"
    bannerTitle = "Practice"
  }
  res.render("pages/learn_practice", {
    msg,
    title,
    bannerTitle,
  })
}

module.exports = { getResource, getAllResources }
