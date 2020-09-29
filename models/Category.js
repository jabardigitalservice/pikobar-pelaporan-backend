const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
  category_name: { type: String, required: [true, "can't be blank"] },
  label: { type: String, required: [true, "can't be blank"] },
  targets: { type: String, required: [true, "can't be blank"] }
})

module.exports = mongoose.model('Category', CategorySchema)