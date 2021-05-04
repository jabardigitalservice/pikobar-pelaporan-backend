const Case = require('../../models/Case')
const findUserCases = async(data) => {
  const user = data.user
  const IDN_CODE_NUMBER = '+62'
  let phone_number = user.phone_number ? (user.phone_number).replace(IDN_CODE_NUMBER, '0') : user.phone_number
  let filter_nik = user.nik ? user.nik : phone_number
  let filter_phone = user.phone_number ? phone_number : user.nik
  const cases = await Case.aggregate([
    { $match : {
      $and: [{verified_status: "verified"},{delete_status: {$ne : "deleted"}} ],
      $or: [{phone_number: filter_phone}, {nik: filter_nik}]
    } },
    { $lookup :{from: "histories", localField: 'last_history', foreignField: '_id', as: 'histories' }},
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$histories", 0 ] }, "$$ROOT" ] } }},
    { $project : {histories: 0}},
    { $limit: (1)}
  ])
  return (cases.length > 0 ? cases : null)
}

module.exports = {
  findUserCases
}