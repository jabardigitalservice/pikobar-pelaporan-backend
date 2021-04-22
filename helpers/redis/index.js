
const { clientConfig } = require('../../config/redis')

const setCacheRedis = (key, data, expireTime, callback) => {
  try {
    clientConfig.get(key, (err, result) => {
      if(result){
        const resultJSON = JSON.parse(result)
        callback(null, resultJSON)
        console.info('redis source')
      }else{
        clientConfig.setex(key, expireTime, JSON.stringify(data)) // set redis key
        callback(null, data)
        console.info('api source')
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const deleteCacheRedis = (key) => {
  try {
    clientConfig.del(key, function (err, reply) {
      console.log(`Deleted Redis key : ${key}`, reply)
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  setCacheRedis, deleteCacheRedis
}