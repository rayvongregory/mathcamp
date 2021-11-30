//create
const addLessons = (list) => {
  //   console.log("adding lessons")
}

//read
const getAllLessons = async () => {
  try {
    const {
      data: { publishedLessons },
    } = await axios.get(`/api/v1/lessons/${selected_gr}`)
    addLessons(publishedLessons)
  } catch (e) {
    console.log(e)
  }
}

const getFilteredLessons = async () => {
  try {
    const { data } = await axios.get(
      `/api/v1/lessons/${selected_gr}/${selected_chapter}`
    )
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

grFilters.forEach((gr) => {
  gr.addEventListener("click", getAllLessons)
})
