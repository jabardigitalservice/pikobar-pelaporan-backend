const dir = './upload/'
const xlsx = require('node-xlsx')
const mongoose = require('mongoose')
const conf = require('./config.json')
const caseSheet = require('./getters/index')
// const { isTemplateVerified } = require('./helper')

const extractSheetToJson = async (request) => {
    //  generate unique import batch id (debug purpose)
    const uniqueBatchId = require('uuid').v4()

    const uploaded = await handleFileUpload(request.payload.file)

    const dataSheet = (await xlsx.parse(dir + uploaded.filename))[0]['data']

    dataSheet.splice(0, conf.start_row)
    let payload = []

    for (let i in dataSheet) {
      const d = dataSheet[i]

      if (!caseSheet.isRowFilled(d)) continue;

      let obj = await caseSheet.getBuiltCreateCasePayload(d, uniqueBatchId)

      Object.keys(obj).map(k => {
        if (obj[k] && obj[k].trim) {
          obj[k] = obj[k].trim()
        }
      })

      payload.push(obj)
    }

    handleFileUnlink(dir + uploaded.filename)
    return payload
}

const isDistrictCodeValid = async (code) => {
  const DistrictCity = mongoose.model('Districtcity')
  const district = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
  return !!district
}

const isNikExists = async (nik) => {
  const Case = mongoose.model('Case')
  return !!(await Case.findOne({ nik: nik, delete_status: {$ne: 'deleted'} }))
}

const handleFileUpload = file => {
  const fs = require('fs')
  const dir = './upload/'

  return new Promise((resolve, reject) => {
    var filename = new Date().getTime() + '_' + file.hapi.filename.replace(' ', '')
    const data = file._data

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    fs.writeFile(dir + filename, data, err => {
      if (err) {
        return callback(err, null)
      }
      resolve({ filename: filename })
    })
  })
}

const handleFileUnlink = file => {
  const fs = require('fs')
  return fs.unlink(file, (err) => {
      if (err) {
        console.error(err)
        return
      }
  })
}

module.exports = {
  isNikExists,
  extractSheetToJson,
  isDistrictCodeValid,
}
