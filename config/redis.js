const redis = require('redis')
const clientConfig = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

clientConfig.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = {
  clientConfig
}