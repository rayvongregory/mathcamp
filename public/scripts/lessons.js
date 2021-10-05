window.addEventListener("load", async (e) => {
  e.preventDefault()
  try {
    const token = localStorage.getItem("token")
    // console.log("grabbed the token from local storage")
    // const { data } = await axios.post("/api/v1/lessons", "", {
    //   //! passing in a dummy string to represent the data you want to send along with post request so that you can send custom request headers
    //   //! without this string, the headers info ends up in the body
    //   headers: { Authorization: token },
    // })
    // console.log(data)
  } catch (error) {
    console.log(error)
  }
})
