const Travel = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const {
  createGlobal, updateGlobal
} = require('../helpers/global/crud')

const createTravel = async (payload, id_case, callback) => {
  try {
    const column = 'travelling_history_before_sick_14_days'
    const payloads = {
      'travelling_history': {
        "travelling_type": payload.travelling_type,
        "travelling_visited": payload.travelling_visited,
        "travelling_city": payload.travelling_city,
        "travelling_date": payload.travelling_date,
        "travelling_arrive": payload.travelling_arrive
      }
    }
    const inserted = await createGlobal(Travel, id_case, column, payloads)
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listTravel = async (id_case, callback) => {
  try {
    const result = await Travel.find({_id: id_case})
    .select(["travelling_history"])
    .sort({ updatedAt:-1 })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updateTravel = async (id_history_travel, payload, callback) => {
  try {
    const payloads = {
      "travelling_history.$.travelling_type": payload.travelling_type,
      "travelling_history.$.travelling_visited": payload.travelling_visited,
      "travelling_history.$.travelling_city": payload.travelling_city,
      "travelling_history.$.travelling_date": payload.travelling_date,
      "travelling_history.$.travelling_arrive": payload.travelling_arrive
    }
    const _id = 'travelling_history._id'
    const updated = await updateGlobal(Travel, _id, id_history_travel, payloads)
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deleteTravel = async (id_history_travel, callback) => {
  try {
    const deleted  = await Travel.updateOne(
    {
      "travelling_history._id": ObjectId(id_history_travel)
    },
    { $pull: { travelling_history: { _id: ObjectId(id_history_travel) } } })
    callback(null, deleted)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.history_travel.create',
    method: createTravel
  },{
    name: 'services.history_travel.read',
    method: listTravel
  },{
    name: 'services.history_travel.update',
    method: updateTravel
  },{
    name: 'services.history_travel.delete',
    method: deleteTravel
  },
]

