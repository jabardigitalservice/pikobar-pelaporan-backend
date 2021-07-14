const mongoose = require('mongoose')

const LogQueueSchema = new mongoose.Schema({
  job_id: {
    type: String, default: null, unique: true,
    required: [true, "can't be blank"], index : true
  },
  job_name: { type: String, default: null, index : true },
  job_status: { type: String, index: true, default: null },
  job_progress: { type: Number, index: true, default: null },
  queue_name: { type: String, index: true, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  email: { type: String, index: true, default: null },
  file_name: { type: String, index: true, default: null },
  path: { type: String, index: true, default: null },
  type: { type: String, index: true, default: null },
  message: { type: String, index: true, default: null },
  history: [{
    email: { type: String, index: true, default: null },
    sendAt: { type: Date, index: true, default: Date.now} ,
    status: { type: String, index: true, default: null },
    message: { type: String, index: true, default: null }
  }],
}, { timestamps:true })

module.exports = mongoose.model('LogQueue', LogQueueSchema)