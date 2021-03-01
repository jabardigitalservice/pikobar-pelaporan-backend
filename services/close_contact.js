const custom = require('../helpers/custom')
const paginate = require('../helpers/paginate')
const CloseContact = require('../models/CloseContact')
const filters = require('../helpers/filter/closecontactfilter')

async function index (query, authorized, callback) {
  try {
    const sorts = (query.sort == "desc" ? { createdAt: "desc" } : custom.jsonParse(query.sort))
    const options = paginate.optionsLabel(query, sorts, ['case', 'createdBy'])
    const params = filters.filterCloseContact(query, authorized)
    const search_params = filters.filterSearch(query)
    const result = CloseContact.find(params).or(search_params).where('delete_status').ne('deleted')
    const paginateResult = await CloseContact.paginate(result, options)
    const response = {
      itemsList: paginateResult.itemsList.map(res => res.toJSONList()),
      _meta: paginateResult._meta
    }
    return callback(null, response)
  } catch (e) {
    return callback(e, null)
  }
}

async function getByCase (caseId, callback) {
  try {
    const results = await CloseContact.find({
      case: caseId,
      delete_status: { $ne: 'deleted' }
    }).populate(['case', 'createdBy'])
    
    return callback(null, results.map(res => res.toJSONList()))
  } catch (e) {
    return callback(e, null)
  }
}

async function show (id, callback) {
  try {
    let result = await CloseContact
      .findById(id)
      .where('delete_status').ne('deleted')
      .populate(['case', 'latest_history'])

    result = result ? result.toJSONFor() : null
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function create (caseId, authorized, raw_payload, callback) {
  try {
    const { latest_history, ...payload } = raw_payload
    let result = new CloseContact(Object.assign(payload, {
      case: caseId,
      createdBy: authorized,
      is_reported: true
    }))

    result = await result.save()
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function update (id, authorized, raw_payload, callback) {
  try {
    const { latest_history, ...payload } = raw_payload
    const result = await CloseContact.findByIdAndUpdate(id,
      { $set: { ...payload, updatedBy: authorized } },
      { new: true })

    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function softDelete (id, authorized, callback) {
  try {
    const payload = custom.deletedSave({}, authorized)
    const result = await CloseContact.findByIdAndUpdate(id, payload)
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.closeContacts.index',
    method: index
  },
  {
    name: 'services.closeContacts.getByCase',
    method: getByCase
  },
  {
    name: 'services.closeContacts.show',
    method: show
  },
  {
    name: 'services.closeContacts.create',
    method: create
  },
  {
    name: 'services.closeContacts.update',
    method: update
  },
  {
    name: 'services.closeContacts.delete',
    method: softDelete
  }
];

