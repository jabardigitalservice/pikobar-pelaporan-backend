const Category = require('../models/Category')
const Specimen = require('../models/Specimen')

const listTarget = async (callback) => {
  try {
    const result = await Category.find()
    callback(null,  result)
  } catch (error) {
    callback(error, null)
  }
}

const listTargetByCategory = async (category_name, callback) => {

  try {
    const result = await Category.find({ category_name: category_name })
    callback(null,  result)
  } catch (error) {
    callback(error, null)
  }
}

const createCategory = async (request, callback) => {
  try {
    const category = new Category(request.payload);
    const save = await category.save()
    callback(null, save)
  } catch (error) {
    callback(error, null)
  }
}

const typeSpeciment = async (callback) => {
  try {
    const result = await Specimen.find()
    callback(null, result.map(q => q.toJSONFor()))
  } catch (error) {
    callback(err, null)
  }
}

module.exports = [
  {
    name: 'services.category.list',
    method: listTarget
  },
  {
    name: 'services.category.listTargetByCategory',
    method: listTargetByCategory
  },
  {
    name: 'services.category.create',
    method: createCategory
  },
  {
    name: 'services.category.typeSpeciment',
    method: typeSpeciment
  },
];

