const { referrer } = document
if (!referrer) {
  window.location.href = "/"
}
