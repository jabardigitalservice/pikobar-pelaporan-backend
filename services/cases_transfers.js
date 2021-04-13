const helper = require('../helpers/casetransferhelper')
const mongoose = require('mongoose')

require('../models/Case')
const Case = mongoose.model('Case')

require('../models/CaseTransfer')
const CaseTransfer = mongoose.model('CaseTransfer')

const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'itemsList',
  limit: 'perPage',
  page: 'currentPage',
  meta: '_meta'
}

async function ListCase (query, user, type, callback) {
  try {
    const search = helper.buildSearchParams(query)
    const caseParams = helper.buildCaseParams(query)
    const params = helper.buildParams(type, user,  query)
    const dbQuery = helper.listCaseQuery(params, caseParams, search)
    const aggregate = CaseTransfer.aggregate(dbQuery)

    const results = await CaseTransfer.aggregatePaginate(aggregate,
    {
      page: query.page || 1,
      limit: query.limit || 10,
      customLabels: myCustomLabels
    })

    const response = {
      cases: results.itemsList,
      _meta: (() => {
        delete results.itemsList
        return results
      })()
    }

    callback(null, response)
  } catch (error) {
    callback(error, null)
  }
}

async function getCasetransfers (caseId, callback) {
  try {
    const dbQuery = helper.transferLogsQuery(caseId)
    let transferLogs = await CaseTransfer.aggregate(dbQuery)
    return callback(null, transferLogs)
  } catch (error) {
    return callback(error, null)
  }
}

async function createCaseTransfer (caseId, auth, pre, req, callback) {

  try {
    Object.assign(req, {
      transfer_status: 'pending',
      transfer_from_unit_id: auth.unit_id._id,
      transfer_from_unit_name: auth.unit_id.name,
      transfer_last_history: pre.cases.last_history._id
    })

    await Case.findOneAndUpdate({ _id: caseId}, {
      $set: {
        transfer_status: req.transfer_status,
        transfer_to_unit_id: req.transfer_to_unit_id
      }
    })

    Object.assign(req, {
      transfer_case_id: caseId,
      createdBy: auth._id
    })

    const item = new CaseTransfer(req)

    const caseTransfer = await item.save()

    return callback(null, caseTransfer)
  } catch (error) {
    return callback(error, null)
  }
}

async function processTransfer (transferId, caseId, act, auth, req = {}, callback) {
  try {
    let detail = await CaseTransfer.findById(transferId)
    const detailCase = await Case.findById(caseId).populate('last_history')
    if(detail) {
      await helper.setFalseAllThisCaseTransferLogs(
        CaseTransfer, caseId,
        detail.transfer_from_unit_id,
        req.transfer_to_unit_id || detail.transfer_to_unit_id
      )
    }

    let casePayload = await helper.buildUpdateCasePayload(
      act, auth, caseId, req, CaseTransfer, detail)
    let transferCasePayload = helper.buildTransferCasePaylod(
      detailCase, detail, auth, req)
    const { transfer_to_unit_name, ...caseUpdatePayload } = casePayload
    await Case.findOneAndUpdate({ _id: caseId }, { $set: caseUpdatePayload })
    if (act === 'abort') return actionAbort(CaseTransfer, caseId, auth, callback)
    const item = new CaseTransfer(Object.assign(casePayload, transferCasePayload))
    const results = await item.save()
    return callback(null, results)
  } catch (error) {
    return callback(error, null)
  }
}

async function actionAbort (schema, caseId, auth, callback) {
  try {
    const results = await schema.updateMany(
      { transfer_case_id: caseId, transfer_from_unit_id: auth.unit_id._id}, {
      $set: { transfer_status: 'aborted' }
    }, { new: true }).populate('transfer_last_history')

    return callback(null, results)
  } catch (error) {
    return callback(error, null)
  }
}

async function geTransferCaseSummary (type, user, callback) {
  let params = new Object()

  if (type == 'in') {
    params.is_pair_last_status = true
    params.transfer_to_unit_id = user.unit_id._id
  } else {
    params.is_hospital_case_last_status = true
    params.transfer_from_unit_id = user.unit_id._id
  }

  const dbQuery = [
    { $match: params },
    { $group: { _id: "$transfer_status", total: {$sum: 1}} }
  ]
  let result =  { 'PENDING': 0, 'DECLINED': 0, 'APPROVED': 0 }

  CaseTransfer.aggregate(dbQuery).exec().then(async item => {
    item.forEach(function(item){
      if (item['_id'] == 'pending') result.PENDING = item['total']
      if (item['_id'] == 'declined') result.DECLINED = item['total']
      if (item['_id'] == 'approved') result.APPROVED = item['total']
    })
    return callback(null, result)
  }).catch(err => callback(err, null))
}

function getTransferCaseById (id, callback) {
  CaseTransfer.findOne({_id: id})
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null))
}

function getLastTransferCase (params, callback) {
  CaseTransfer.findOne(params)
    .sort({createdAt: -1})
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null))
}

module.exports = [
  {
    name: 'services.casesTransfers.list',
    method: ListCase
  },
  {
    name: 'services.casesTransfers.get',
    method: getCasetransfers
  },
  {
    name: 'services.casesTransfers.create',
    method: createCaseTransfer
  },
  {
    name: 'services.casesTransfers.getById',
    method: getTransferCaseById
  },
  {
    name: 'services.casesTransfers.getLastTransferCase',
    method: getLastTransferCase
  },
  {
    name: 'services.casesTransfers.processTransfer',
    method: processTransfer
  },
  {
    name: 'services.casesTransfers.geTransferCaseSummary',
    method: geTransferCaseSummary
  },
]
