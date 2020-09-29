const Occupation = require('../models/Occupation')

const getOccupationList = async (request, callback) => {
  try {
    const result = await Occupation.find().sort({ seq: 'asc' })
    callback(null, result.map(q => q.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getOccupationDetail = async (request, callback) => {
  let id = request.params.id
  try {
    const result = await Occupation.findOne({ _id : id })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.occupations.getOccupation',
    method: getOccupationList
  },
  {
    name: 'services.occupations.getOccupationDetail',
    method: getOccupationDetail
  }
]
