const Travel = require('../models/Case')
const ObjectId = require('mongodb').ObjectID

const createTravel = async (payload, id_case, callback) => {
  try {
    const inserted = await Travel.updateOne(
      { "_id": ObjectId(id_case) },
      { $set: { 'travelling_history_before_sick_14_days': true },
        $addToSet: {
          'travelling_history': {
            "travelling_type": payload.travelling_type,
            "travelling_visited": payload.travelling_visited,
            "travelling_city": payload.travelling_city,
            "travelling_date": payload.travelling_date,
            "travelling_arrive": payload.travelling_arrive
          }
        }
      }, { new: true })
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
    const updated = await Travel.updateOne(
      {
        "travelling_history._id": ObjectId(id_history_travel)
      },
      { "$set": {
        "travelling_history.$.travelling_type": payload.travelling_type,
        "travelling_history.$.travelling_visited": payload.travelling_visited,
        "travelling_history.$.travelling_city": payload.travelling_city,
        "travelling_history.$.travelling_date": payload.travelling_date,
        "travelling_history.$.travelling_arrive": payload.travelling_arrive
      }}, { new : true })
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

