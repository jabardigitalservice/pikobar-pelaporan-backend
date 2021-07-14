const LogQueue = require('../../models/LogQueue')
const { dynamicColumnCreate } = require('../../utils')

const createLogJob = async (progress, job_id, job_name, queue_name, query, user) => {
  const body = {
    job_id: job_id,
    job_name: job_name,
    job_status: 'Progress',
    job_progress: progress,
    queue_name: queue_name,
    author: user.id,
    email: query.email,
    file_name: query.file_name || null,
    path: query.path || null,
  }
  try {
    return await LogQueue.create(body)
  } catch (error) {
    return error
  }
}

const updateLogJob = async (job_id, param) => {
  try {
    return await LogQueue.findOneAndUpdate({ job_id: job_id }, param), { lean: true };
  } catch (error) {
    return error
  }
}

const createHistoryEmail = async (payload, jobId) => {
  payload.sendAt = Date.now()
  const column = ['email', 'sendAt', 'message' , 'status']
  try {
    payload.status = "Sent"
    payload.message = null
    const addToSet = {
      'history': dynamicColumnCreate(column, payload)
    }
    return await LogQueue.updateOne(
      { "job_id": jobId }, { $addToSet: addToSet }, { new: true }
    )
  } catch (error) {
    payload.status = "Error"
    payload.message = error.toString()
    await LogQueue.updateOne(
      { "job_id": jobId }, { $addToSet: addToSet }, { new: true }
    )
  }
}

module.exports = {
  createLogJob, updateLogJob, createHistoryEmail
}