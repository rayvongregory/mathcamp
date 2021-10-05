// this file will handle all operations regarding refresh tokens
const redis = require("redis")
const refreshTokens = redis.createClient()
const { promisify } = require("util")
const getAsync = promisify(refreshTokens.get).bind(refreshTokens)
const scanAsync = promisify(refreshTokens.scan).bind(refreshTokens)

module.exports = refreshTokens
