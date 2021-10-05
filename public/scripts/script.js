const buttons = document.querySelector(".buttons")
let urlSearchParams, params

//! don't be confuse by how little there is here; this will need more when you
//! create more posts
buttons.addEventListener("pointerup", async (e) => {
  if (e.target.id === "nav-search-btn") {
    return
  }
  urlSearchParams = window.location.search
  params = urlSearchParams.substr(1, urlSearchParams.length - 1)
  // try {
  //   const data = await axios.get(`api/v1/${params}`)
  //   console.log(data)
  // } catch (err) {
  //   console.log("hi")
  // }
})
