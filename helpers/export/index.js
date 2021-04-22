const json2xls = require('json2xls')
const moment = require('moment')
const { updateLogJob } = require('../job/log')
const { uploadFileToAwsBucket } = require('../../config/aws')
const fs = require('fs')

const generateExcell = (data, title, fullName, reply) => {
  const jsonXls = json2xls(data);
  const fileName = `${title}-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
  fs.writeFileSync(fileName, jsonXls, 'binary');
  const xlsx = fs.readFileSync(fileName)
  reply(xlsx)
    .header('Content-Disposition', 'attachment; filename=' + fileName);
  return fs.unlinkSync(fileName)
}

const generateExcellPath = async (data, title, fullName, pathFolder, jobId) => {
  const fileName = `${title}-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}-${jobId}.xlsx`
  const path = `./tmp/${pathFolder}/${fileName}`
  const jsonXls = json2xls(data)
  let bucketName
  if(pathFolder === 'cases'){
    bucketName = process.env.CASE_BUCKET_NAME
  } else {
    bucketName = process.env.HISTORY_BUCKET_NAME
  }
  fs.writeFileSync(path, jsonXls, 'binary')
  uploadFileToAwsBucket(fileName, fs.createReadStream(path), bucketName)
  await updateLogJob(jobId, { file_name: fileName, path:bucketName })
  return { filename: fileName, path, data: jsonXls }
}

module.exports = {
  generateExcell, generateExcellPath
}