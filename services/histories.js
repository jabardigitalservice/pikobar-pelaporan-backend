const mongoose = require('mongoose');

require('../models/History');
require('../models/Case');

const Helper = require('../helpers/custom');
const { object } = require('joi');
const History = mongoose.model('History');
const Case = mongoose.model('Case');

function ListHistory (callback) {
    History.find()
        .sort({ createdAt: 'desc'})
        .exec()
        .then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getHistoryById (id, callback) {
  History.findById(id).exec().then(item => {
    return callback(null, item.toJSONFor())
  })
  .catch(err => callback(err, null))
}

function getHistoryByCase (id_case, callback) {
  History.find({ case: id_case})
        .sort({ createdAt: 'desc'})
        .exec()
        .then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getLastHistoryByIdCase (id_case, callback) {
  History.find({ case: id_case})
        .sort({ createdAt: 'desc'})
        .limit(1)
        .exec()
        .then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function createHistory (payload, callback) {
  let item = new History(payload);

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

function createHistoryIfChanged (payload, callback) {
  /* Create history only if new history and last_history of the related case
   * has difference. If the same would just return the old history. If there
   * are any difference, would create a new history, then update the related
   * case's last_history to the newly created history. */

  // guarded field (cannot be filled)
  Helper.deleteProps(['last_changed', 'createdAt', 'updatedAt'], payload)

  Case.findById(payload.case).exec().then(case_obj => {
    History.findById(case_obj.last_history).exec().then(old_history => {
      let new_history = new History(payload);
      let changed = false, changed_fields=[];

      function is_same(a,b) {
        /* Method to compare equality between 2 object. support Date object,
         * array, and generic object */
        if (typeof a == 'undefined' || typeof b == 'undefined')
          return false;
        if (a instanceof Date)
          return a.getTime() == b.getTime();
        if (Array.isArray(a))
          return JSON.stringify(a) == JSON.stringify(b);
        if (typeof(a) == 'object')
          return String(a) == String(b);
        return a == b;
      }

      for (var property in payload) {
          if (new_history[property] != null && !is_same(new_history[property],  old_history[property])) {
            changed = true;
            changed_fields.push(property);
          }
      }
      
      if (changed) {
        new_history.save((err, item) => {
          if (err) return callback(err, null);

          // update case
          let update_case = {
              status: payload.status,
              stage: payload.stage,
              final_result: payload.final_result,
              is_test_masif: payload.is_test_masif,
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
    })
    .catch(err => callback(err, null))
  })
  .catch(err => callback(err, null))

}

function deleteHistory (id, callback) {
  //let item = getCaseById(id, callback);
  History.findOne({ case: id}).exec().then(item => {

      item.save((err, item) => {
        if (err) return callback(err, null);
        return callback(null, item);
      });
    })
    .catch(err => callback(err, null))
}


function checkHistoryCasesBeforeInputTest(payload, callback) {
    Case.findOne({"id_case": new RegExp(payload.id_case, "i")}).exec().then(case_obj => {
      History.findById(case_obj.last_history).exec().then(old_history => {
        let assign = Object.assign(old_history, payload)

        return callback(null, assign)
      }).catch(err => callback(err, null))
    }).catch(err => callback(err, null))
}


function createHistoryFromInputTest(payload, callback){
  delete payload._id
  // guarded field (cannot be filled)
  Helper.deleteProps(['_id','last_changed', 'createdAt', 'updatedAt'], payload)

  Case.findById(payload.case).exec().then(case_obj => {
    History.findById(case_obj.last_history).exec().then(old_history => {
      let new_history = new History(payload);
      let changed = false, changed_fields=[];

      function is_same(a,b) {
        /* Method to compare equality between 2 object. support Date object,
         * array, and generic object */
        if (typeof a == 'undefined' || typeof b == 'undefined')
          return false;
        if (a instanceof Date)
          return a.getTime() == b.getTime();
        if (Array.isArray(a))
          return JSON.stringify(a) == JSON.stringify(b);
        if (typeof(a) == 'object')
          return String(a) == String(b);
        return a == b;
      }

      for (var property in payload) {
          if (new_history[property] != null && !is_same(new_history[property],  old_history[property])) {
            changed = true;
            changed_fields.push(property);
          }
      }
      

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
    })
    .catch(err => callback(err, null))
  })
  .catch(err => callback(err, null))
  
}


module.exports = [
  {
    name: 'services.histories.list',
    method: ListHistory
  },
  {
    name: 'services.histories.getById',
    method: getHistoryById
  },
  {
    name: 'services.histories.getByCase',
    method: getHistoryByCase
  },
  {
    name: 'services.histories.getLastHistoryByIdCase',
    method: getLastHistoryByIdCase
  },
  {
    name: 'services.histories.create',
    method: createHistory
  },
  {
    name: 'services.histories.createIfChanged',
    method: createHistoryIfChanged
  },
  {
    name: 'services.histories.delete',
    method: deleteHistory
  },
  {
    name: 'services.histories.checkHistoryCasesBeforeInputTest',
    method: checkHistoryCasesBeforeInputTest
  },
  {
    name: 'services.histories.createHistoryFromInputTest',
    method: createHistoryFromInputTest
  },
];

