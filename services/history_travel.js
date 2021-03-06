const Travel = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const { dynamicColumnCreate, dynamicColumnUpdate } = require('../utils')
const column = [
  'travelling_type', 'travelling_visited' , 'travelling_city',
  'travelling_date', 'travelling_arrive'
]
const createTravel = async (payload, id_case, callback) => {
  try {
    const set = { 'travelling_history_before_sick_14_days': true }
    const addToSet = {
      'travelling_history': dynamicColumnCreate(column, payload)
    }
    const inserted = await Travel.updateOne(
      { "_id": ObjectId(id_case) },
      { $set: set , $addToSet: addToSet }, { new: true })
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
  const idUpdate = {
    "travelling_history._id": ObjectId(id_history_travel)
  }
  try {
    const set = 'travelling_history.$.'
    const updated = await Travel.updateOne(
      idUpdate,
      { "$set": dynamicColumnUpdate(set, column, payload)}, { new : true })
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

