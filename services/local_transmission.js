const LocalTransmission = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const { findGlobal, deleteGlobal } = require('../helpers/global/crud')
const service = 'services.local_transmission'

const createLocalTransmission = async (payload, id_case, callback) => {
  try {
    const inserted = await LocalTransmission.updateOne(
      { "_id": ObjectId(id_case) },
      { $set: { 'visited_local_area_before_sick_14_days': true },
        $addToSet: {
          'visited_local_area': {
            "visited_local_area_province": payload.visited_local_area_province,
            "visited_local_area_city": payload.visited_local_area_city
          }
        }
      }, { new: true })
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listLocalTransmission = async (id_case, callback) => {
  try {
    const result = await findGlobal(LocalTransmission, id_case, "visited_local_area")
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updateLocalTransmission = async (id_local_transmission, payload, callback) => {
  try {
    const updated = await LocalTransmission.updateOne(
      {
        "visited_local_area._id": ObjectId(id_local_transmission)
      },
      { $set: {
          "visited_local_area.$.visited_local_area_province": payload.visited_local_area_province,
          "visited_local_area.$.visited_local_area_city": payload.visited_local_area_city
        }
      }, { new: true })
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deleteLocalTransmission = async (id, callback) => {
  try {
    callback(null, await deleteGlobal(LocalTransmission, "visited_local_area", id))
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  { name: `services.local_transmission.create`, method: createLocalTransmission }, {
    name: `${service}.read`, method: listLocalTransmission }, {
    name: `${service}.update`, method: updateLocalTransmission }, {
    name: `${service}.delete`, method: deleteLocalTransmission
  },
]

