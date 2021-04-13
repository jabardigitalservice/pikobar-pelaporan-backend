const mongoose = require('mongoose')

const OccupationSchema = new mongoose.Schema({
  title: String,
  seq: Number,
})

module.exports = mongoose.model('Occupation', OccupationSchema)