const Unit = require('../models/Unit');
const paginate = require('../helpers/paginate');
const custom = require('../helpers/custom');
const filters = require('../helpers/filter/unitfilter');

const listUnit = async (query, callback) => {
  try {
    const sorts = (query.sort == "desc" ? { createdAt: "desc" } : custom.jsonParse(query.sort));
    const populate = (['createdBy']);
    const options = paginate.optionsLabel(query, sorts, populate);
    const params = filters.filterUnit(query);
    const search_params = filters.filterSearch(query);
    const result = Unit.find(params).or(search_params).where('delete_status').ne('deleted');
    const paginateResult = await Unit.paginate(result, options);
    callback(null, paginateResult);
  } catch (error) {
    callback(error, null);
  }
}

const listUnitById = async (id, callback) => {
  try {
    let result;
    if (id) {
      result = await Unit.findById(id).populate('createdBy');
    } else {
      result = await Unit.find().populate('createdBy');
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const createUnit = async (payload, user, callback) => {
  try {
    payload.createdBy = user._id;
    const result = await Unit.create(payload);
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const updateUnit = async (pay, id, category, author, callback) => {
  try {
    const payloads = {};
    const payload = (pay == null ? {} : pay);
    if (category == "delete") {
      custom.deletedSave(payloads, author);
    }
    const params = Object.assign(payload, payloads);
    const result = await Unit.findByIdAndUpdate(id,
      { $set: params }, { new: true });
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

module.exports = [
  {
    name: 'services.unit.create',
    method: createUnit
  },
  {
    name: 'services.unit.read',
    method: listUnit
  },
  {
    name: 'services.unit.update',
    method: updateUnit
  },
  {
    name: 'services.unit.readbyid',
    method: listUnitById
  },
];

