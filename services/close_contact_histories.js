const CloseContact = require('../models/CloseContact')
const CloseContactHistory = require('../models/CloseContactHistory')

async function eventCreate (closeContact, insertedHistory) {
  try {
    await CloseContact
      .findByIdAndUpdate(closeContact, {
        latest_history: insertedHistory._id
      })
  } catch (error) {
    console.log(error)
  }
}

async function create (closeContact, payload, callback) {
  try {
    let result = new CloseContactHistory(
      Object.assign(payload, {
        close_contact: closeContact
      }))
  
    result = await result.save()
    eventCreate(closeContact, result)
    return callback(null, result)
  } catch (error) {
    return callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.closeContactHistories.create',
    method: create
  }
];
