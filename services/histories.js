const Case = require('../models/Case')
const History = require('../models/History')
const Helper = require('../helpers/custom')
const ObjectId = require('mongodb').ObjectID
const { exportByRole } = require('../helpers/rolecheck')
const { WHERE_GLOBAL, HISTORY_DEFAULT_SORT } = require('../helpers/constant')
const { filterCase } = require('../helpers/filter/casefilter')
const { condition, excellHistories } = require('../helpers/filter/historyfilter')
const { conditionHistories } = require('../helpers/aggregate/histories')
const services = 'services.histories'
const setFlag = (id, status) => {
  return Case.updateOne(
    { _id: ObjectId(id) },
    { $set: { status_clinical: status } },
  )
}

function ListHistory(callback) {
  History.find().sort({ createdAt: 'desc' }).exec()
    .then(item => {
      let res = item.map(q => q.toJSONFor())
      return callback(null, res)
    }).catch(err => callback(err, null))
}

function getHistoryById(id, callback) {
  History.findById(id).exec().then(item => {
    return callback(null, item.toJSONFor())
  }).catch(err => callback(err, null))
}

async function getHistoryByCase(id_case, callback) {
  try {
    const aggQuery = conditionHistories(ObjectId(id_case))
    const result = await History.aggregate(aggQuery).sort(HISTORY_DEFAULT_SORT)
    callback(null, result)
  } catch (e) { callback(e, null) }
}

function getLastHistoryByIdCase(id_case, callback) {
  History.find({ case: id_case }).where('delete_status').ne('deleted')
    .sort(HISTORY_DEFAULT_SORT).limit(1).exec()
    .then(item => {
      return callback(null, item)
    }).catch(err => callback(err, null))
}

function createHistory(payload, callback) {
  let item = new History(payload);
  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

// get latest history sort by last_date_status_patient
async function getLatestHistory(caseId) {
  return await History.findOne({ case: ObjectId(caseId), delete_status: { $ne: 'deleted' },
  }).sort(HISTORY_DEFAULT_SORT)
}

function createHistoryIfChanged(request, callback) {
  /* Create history only if new history and last_history of the related case
   * has difference. If the same would just return the old history. If there
   * are any difference, would create a new history, then update the related
   * case's last_history to the newly created history. */

  // guarded field (cannot be filled)
  const payload = request.payload

  Helper.deleteProps(['_id', 'last_changed', 'delete_status', 'createdAt', 'updatedAt'], payload)

  Case.findById(payload.case).select("-close_contact_health_worker").exec().then(case_obj => {
    History.findById(case_obj.last_history).exec().then(old_history => {
      let new_history = new History(payload);
      const changed = Helper.checkProperty(payload, new_history, old_history)
      if (changed) {
        new_history.save(async (err, item) => {
          if (err) return callback(err, null);
          const latestHis = await getLatestHistory(payload.case)

          // update case
          let update_case = {
            status: latestHis.status,
            stage: latestHis.stage,
            final_result: latestHis.final_result,
            is_test_masif: latestHis.is_test_masif,
            last_date_status_patient: latestHis.last_date_status_patient,
            last_history: latestHis._id
          }

          let objcase = Object.assign(case_obj, update_case)

          objcase.save((err, updated_case) => {
            if (err) return callback(err, null);
            return callback(null, new_history);
          });
        });
      } else
        // return old history if not changed
        return callback(null, old_history);
    }).then(async () => await setFlag(payload.case, 1)).catch(err => callback(err, null))
  }).catch(err => callback(err, null))
}

function deleteHistory(id, callback) {
  //let item = getCaseById(id, callback);
  History.findOne({ case: id }).exec().then(item => {
    item.save((err, item) => {
      if (err) return callback(err, null);
      return callback(null, item);
    });
  }).catch(err => callback(err, null))
}


function checkHistoryCasesBeforeInputTest(payload, callback) {
  Case.findOne({ "id_case": new RegExp(payload.id_case, "i") }).exec().then(case_obj => {
    History.findById(case_obj.last_history).exec().then(old_history => {
      let assign = Object.assign(old_history, payload)
      return callback(null, assign)
    }).catch(err => callback(err, null))
  }).catch(err => callback(err, null))
}


function createHistoryFromInputTest(payload, callback) {
  delete payload._id
  // guarded field (cannot be filled)
  Helper.deleteProps(['_id', 'last_changed', 'createdAt', 'updatedAt'], payload)

  Case.findById(payload.case).exec().then(case_obj => {
    History.findById(case_obj.last_history).exec().then(old_history => {
      let new_history = new History(payload);
      const changed = Helper.checkProperty(payload, new_history, old_history)
      if (changed) {
        new_history.save((err, item) => {
          if (err) return callback(err, null);

          // update case
          let update_case = {
            status: payload.status,
            stage: payload.stage,
            final_result: payload.final_result,
            is_test_masif: true,
            last_history: item._id
          }

          let objcase = Object.assign(case_obj, update_case)

          objcase.save((err, updated_case) => {
            if (err) return callback(err, null);
            return callback(null, new_history);
          });
        });
      } else
        // return old history if not changed
        return callback(null, old_history);
    }).catch(err => callback(err, null))
  }).catch(err => callback(err, null))
}

async function updateHistoryById(request, callback) {
  try {
    const id = request.params.id
    const payload = request.payload
    // guarded fields
    Helper.deleteProps(['_id', 'case'], payload)
    const res = await History.findByIdAndUpdate(id,
      { $set: payload },
      { new: true },
    )
    if (!res) throw new Error('History not found!')
    await setFlag(res.case, 1)
    callback(null, res)
  } catch (e) {
    callback(e, null)
  }
}

const listHistoryExport = async (query, user, callback) => {
  const filter = await filterCase(user, query)
  const filterRole = exportByRole({}, user, query)
  const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
  const { searchExport } = require('../helpers/filter/search')
  const search = searchExport(query)
  params.last_history = { $exists: true, $ne: null }
  const where = condition(params, search, query)
  try {
    const resultHistory = await Case.aggregate(where).allowDiskUse(true)
    // .allowDiskUse(true) for handler memory limit in aggregate
    callback(null, resultHistory.map(cases => excellHistories(cases)))
  } catch (error) {
    callback(error, null)
  }
}

// soft delete (dont suudzon / its never destroy any document) (fitur baru ada di sprint 9)
async function deleteHistoryById(id, author, callback) {
  try {
    const historyToDelete = await History.findById(id)
    const histories = await History.find({
      case: ObjectId(historyToDelete.case), delete_status: { $ne: 'deleted' }
    }).sort({ last_date_status_patient: 'desc', createdAt: 'desc' })
    if (histories.length <= 1) {
      throw new Error("Riwayat kasus hanya ada satu, tidak dapat dihapus!")
    }
    const result = await History.updateOne({ _id: ObjectId(id) }, { $set: Helper.deletedSave({}, author) })
    // update if deleted history is a last history of case
    if (historyToDelete._id.toString() == histories[0]._id.toString()) {
      histories.shift()
      await Case.updateOne(
        { _id: ObjectId(historyToDelete.case) }, { $set: {
            status: histories[0].status, final_result: histories[0].final_result,
            last_date_status_patient: histories[0].last_date_status_patient,
            last_history: ObjectId(histories[0]._id),
          }
        },
      )
    }
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

module.exports = [
  { name: `${services}.list`, method: ListHistory },
  { name: `${services}.getById`, method: getHistoryById },
  { name: `${services}.getByCase`, method: getHistoryByCase },
  { name: `${services}.getLastHistoryByIdCase`, method: getLastHistoryByIdCase },
  { name: `${services}.create`, method: createHistory },
  { name: `${services}.createIfChanged`, method: createHistoryIfChanged },
  { name: `${services}.delete`, method: deleteHistory },
  { name: `${services}.checkHistoryCasesBeforeInputTest`, method: checkHistoryCasesBeforeInputTest },
  { name: `${services}.createHistoryFromInputTest`, method: createHistoryFromInputTest },
  { name: `${services}.updateById`, method: updateHistoryById },
  { name: `${services}.deleteById`, method: deleteHistoryById },
  { name: `${services}.listHistoryExport`, method: listHistoryExport },
];
