'use strict';
const CasesRevamp = require('../models/Case');
const HistoryRevamp = require('../models/History');
const CloseContact = require('../models/CloseContact');
const User =  require('../models/User');
const Notification = require('../models/Notification');
const Check = require('../helpers/rolecheck');
const Notif = require('../helpers/notification');
const Filter = require('../helpers/filter/casefilter');
const { thisUnitCaseAuthors } = require('../helpers/cases/revamp/handlerget');
const Validate = require('../helpers/cases/revamp/handlerpost');
const { CRITERIA, VERIFIED_STATUS, ROLE, WHERE_GLOBAL } = require('../helpers/constant');

const createCaseRevamp = async (services, raw_payload, author, pre, callback) => {
  let verified = {
    'verified_status': VERIFIED_STATUS.VERIFIED,
  };

  if (raw_payload.travel === ""){
    raw_payload.travel = 2;
  }

  if (author.role === ROLE.FASKES) {
    verified.verified_status = VERIFIED_STATUS.PENDING;
  };

  const id_case = Validate.generateIdCase(author, pre);

  //TODO: check is verified is not overwritten ?
  let insert_id_case = Object.assign(raw_payload, verified);

  if (!insert_id_case.hasOwnProperty('id_case') || [null, ""].includes(insert_id_case['id_case'])) {
    insert_id_case = Object.assign(raw_payload, { id_case });
  }

  const unit_kerja = author.unit_id !== null ? author.unit_id.name : "";

  insert_id_case.author_district_code = author.code_district_city;
  insert_id_case.author_district_name = author.name_district_city;
  insert_id_case.fasyankes_type = author.role;
  insert_id_case.fasyankes_code = author._id;
  insert_id_case.fasyankes_name = author.fullname;
  insert_id_case.fasyankes_province_code = author.address_province_code;
  insert_id_case.fasyankes_province_name = author.address_province_name;
  insert_id_case.fasyankes_subdistrict_code = author.address_subdistrict_code;
  insert_id_case.fasyankes_subdistrict_name = author.address_subdistrict_name;
  insert_id_case.fasyankes_village_code = author.address_village_code;
  insert_id_case.fasyankes_village_name = author.address_village_name;
  insert_id_case.assignment_place = unit_kerja;

  let item = new CasesRevamp(Object.assign(insert_id_case, { author }));

  try {
    const saveCase = await item.save();
    const c = {'case': saveCase._id};

    raw_payload = Validate.validatePost(raw_payload);

    const history = new HistoryRevamp(Object.assign(raw_payload, c));
    const saveHistory =  await history.save();
    const last_history = {'last_history': saveHistory._id};
    const x = Object.assign(saveCase, last_history);
    const finalSave = await x.save();

    if (raw_payload.closecontact) {
      const pre = { cases: finalSave }
      await services.cases.closecontact.create(
        services, pre, author, raw_payload.closecontact,
        (err, result) => {
          if (err) throw new Error
          Object.assign(finalSave, { closecontact: result })
        })
    }

    await Notif.send(Notification, User, x, author, 'case-created');
    callback(null, finalSave);
  } catch (error) {
    callback(error, null);
  }
}

const checkIfExisting = async (query, callback) => {
  let check;
  if (query.params) {
    const gets = await CasesRevamp.find({
      $or: [{'nik': query.params }]
    }).where('delete_status').ne('deleted');
    check = gets.length > 0;
  } else {
    check = 'parameter not set';
  }
  callback(null, check);
}

// deprecated, todo delete
async function createCaseContact (id, author, payload, callback) {
  try {
    if (payload instanceof Array) {
      payload.map(r => {
        r.case = id;
        r.createdBy = author._id;
        return r;
      })
    }else{
      payload.case = id;
      payload.createdBy = author._id;
    }
    const result = await CloseContact.create(payload);
    callback(null, result);
  } catch (e) {
    callback(e, null);
  }
}

async function update (id, author, payload, callback) {
  try {
    payload.updatedBy = author._id;
    const result = await CloseContact.findByIdAndUpdate(id,
      { $set: payload },
      { new: true });
    callback(null, result);
  } catch (e) {
    callback(e, null);
  }
}

async function getCaseSummary(query, user, callback) {
  try {
    const caseAuthors = await thisUnitCaseAuthors(user)
    const scope = Check.countByRole(user, caseAuthors)
    const filter = await Filter.filterCase(user, query)
    const searching = Object.assign(scope, filter)

    const conditions = [
      { $match: {
        $and: [  searching, { ...WHERE_GLOBAL, last_history: { $exists: true, $ne: null } } ]
      }},
      {
        $group: {
          _id: 'status',
          confirmed: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.CONF] },
                  ]
                }, 1, 0]
            }
          },
          probable: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.PROB] },
                  ]
                }, 1, 0]
            }
          },
          suspect: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.SUS] },
                  ]
                }, 1, 0]
            }
          },
          closeContact: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.CLOSE] },
                  ]
                }, 1, 0]
            }
          },
        },
      },
      { $project: { _id : 0 } },
    ]
    const result = await CasesRevamp.aggregate(conditions)
    callback(null, result.shift())
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.cases_revamp.create',
    method: createCaseRevamp,
  },
  {
    name: "services.cases_revamp.checkIfExisting",
    method: checkIfExisting,
  },
  {
    name: "services.cases_revamp.createCaseContact",
    method: createCaseContact,
  },
  {
    name: "services.cases_revamp.update",
    method: update,
  },
  {
    name: 'services.cases_revamp.getSummary',
    method: getCaseSummary
  },
];

