const InspectionSupport = require('../models/Case')
const ObjectId = require('mongodb').ObjectID

const createInspectionSupport = async (payload, id_case, callback) => {
  try {
    const inserted = await InspectionSupport.updateOne(
      { "_id": ObjectId(id_case) },
      { $addToSet: {
        "inspection_support": {
            "inspection_type": payload.inspection_type,
            "specimens_type": payload.specimens_type,
            "inspection_date": payload.inspection_date,
            "inspection_location": payload.inspection_location,
            "get_specimens_to": payload.get_specimens_to,
            "inspection_result": payload.inspection_result,
          }
        }
      }, { new: true })
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listInspectionSupport = async (id_case, callback) => {
  try {
    const result = await InspectionSupport.find({ _id: id_case })
      .select(["inspection_support"])
      .sort({ updatedAt: -1 })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updateInspectionSupport = async (id_inspection_support, payload, callback) => {
  try {
    const updated = await InspectionSupport.updateOne(
      {
        "inspection_support._id": ObjectId(id_inspection_support)
      },
      { $set: {
          "inspection_support.$.inspection_type": payload.inspection_type,
          "inspection_support.$.specimens_type": payload.specimens_type,
          "inspection_support.$.inspection_date": payload.inspection_date,
          "inspection_support.$.inspection_location": payload.inspection_location,
          "inspection_support.$.get_specimens_to": payload.get_specimens_to,
          "inspection_support.$.inspection_result": payload.inspection_result,
        }
      }, { new: true })
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deleteInspectionSupport = async (id_inspection_support, callback) => {
  try {
    const deleted = await InspectionSupport.updateOne(
    {
      "inspection_support._id": ObjectId(id_inspection_support)
    },
    { $pull: { inspection_support: { _id: ObjectId(id_inspection_support) } } })
    callback(null, deleted)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.inspection_support.create',
    method: createInspectionSupport
  }, {
    name: 'services.inspection_support.read',
    method: listInspectionSupport
  }, {
    name: 'services.inspection_support.update',
    method: updateInspectionSupport
  }, {
    name: 'services.inspection_support.delete',
    method: deleteInspectionSupport
  },
]

