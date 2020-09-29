const mongoose = require('mongoose')

const OccupationSchema = new mongoose.Schema({
  title: String,
  seq: Number,
})


OccupationSchema.methods.toJSONFor = function () {
  return {
    _id: this._id,
    title: this.title,
    seq: this.seq,
  }
}

module.exports = mongoose.model('Occupation', OccupationSchema)