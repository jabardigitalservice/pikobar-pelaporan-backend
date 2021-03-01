const json2xls = require('json2xls')
const moment = require('moment')
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

const generateExcellPath = (data, title, fullName) => {
  const fileName = `${title}-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
  const path = `./tmp/cases/${fileName}`
  const jsonXls = json2xls(data)
  fs.writeFileSync(path, jsonXls, 'binary')
  
  return { filename: fileName, path, data: jsonXls }
}

module.exports = {
  generateExcell, generateExcellPath
}