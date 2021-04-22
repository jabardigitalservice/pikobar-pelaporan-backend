const { clientConfig } = require('../config/redis')

const getCountryList = (callback) => {
  const fs = require("fs");
  const path = require("path");
  try {
    const expireTime = 1440 * 60 * 1000 // 24 hours expire
    clientConfig.get('country', (err, result) => {
      if(result){
        const resultJSON = JSON.parse(result)
        callback(null, resultJSON)
        console.info('redis source')
      }else{
        const obj = JSON.parse(fs.readFileSync(path.join("helpers", "listcountry.json"), "utf8"));
        clientConfig.setex('country', expireTime, JSON.stringify(obj)) // set redis key
        callback(null, obj)
        console.info('api source')
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const getMenuList = (callback) => {
  const fs = require("fs");
  const path = require("path");
  try {
    const obj = JSON.parse(fs.readFileSync(path.join("menu.json"), "utf8"));
    callback(null, obj)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: "services.country.getCountryList",
    method: getCountryList
  },
  {
    name: "services.country.getMenuList",
    method: getMenuList
  },
]
