const Case = require('../models/Case');
const Unit =require('../models/Unit')
const History = require('../models/History')
const User = require('../models/User')
const Notification = require('../models/Notification')
const DistrictCity = require('../models/DistrictCity')
const Check = require('../helpers/rolecheck')
const Notif = require('../helpers/notification')
const Filter = require('../helpers/filter/casefilter')
const CloseContact = require('../models/CloseContact')
const { sqlCondition, excellOutput } = require('../helpers/filter/exportfilter')
const { WHERE_GLOBAL } = require('../helpers/constant')
const moment = require('moment')

async function ListCase (query, user, callback) {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  let sort = { updatedAt: 'desc' };
  if (query.sort && query.sort.split) {
    let splits = query.sort.split(':')
    sort[splits[0]] = splits[1];
  }

  const options = {
    page: query.page,
    limit: query.limit,
    populate: (['last_history','author']),
    sort: sort,
    leanWithId: true,
    customLabels: myCustomLabels
  };

  var params = {}

  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      params.address_district_code = query.address_district_code;
    }
  }
  if(query.address_village_code){
    params.address_village_code = query.address_village_code;
  }
  if(query.address_subdistrict_code){
    params.address_subdistrict_code = query.address_subdistrict_code;
  }
  if(query.start_date && query.end_date){
    params.createdAt = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.end_date)).setHours(23, 59, 59)
    }
  }
  if(query.stage){
    params.stage = query.stage;
  }
  if(query.status){
    params.status = query.status;
  }
  if(query.final_result){
    params.final_result = query.final_result;
  }
  if(query.author){
    params.author = query.author;
  }

  if (query.verified_status && query.verified_status.split) {
    const verified_status = query.verified_status.split(',')
    params.verified_status = { $in: verified_status }
  }

  if(query.is_reported) {
    params.is_reported = query.is_reported
  }

  // temporarily for fecth all case to all authors in same unit, shouldly use aggregate
  let caseAuthors = []
  if (user.role === "faskes" && user.unit_id) {
    delete params.author
    caseAuthors = await User.find({unit_id: user.unit_id._id}).select('_id')
    caseAuthors = caseAuthors.map(obj => obj._id)
  }

  params.last_history = { $exists: true, $ne: null }

  if(query.search){
    var search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
      { nik: new RegExp(query.search, "i") },
      { phone_number: new RegExp(query.search, "i") },
    ];

    if (query.verified_status !== 'verified') {
      let users = await User.find({username: new RegExp(query.search,"i"), code_district_city: user.code_district_city}).select('_id')
      search_params.push({ author: { $in: users.map(obj => obj._id) } })
    }

    var result_search = Check.listByRole(user, params, search_params,Case, "delete_status", caseAuthors)
  } else {
    var result_search = Check.listByRole(user, params, null,Case, "delete_status", caseAuthors)
  }

  Case.paginate(result_search, options).then(function(results){
      let res = {
        cases: results.itemsList.map(cases => cases.toJSONFor()),
        _meta: results._meta
      }
      return callback(null, res)
  }).catch(err => callback(err, null))
}

const listCaseExport = async (query, user, callback) => {
  const filter = await Filter.filterCase(user, query)
  const filterRole = Check.exportByRole({}, user, query)
  const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
  let search
  if(query.search){
    let search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
    ];
    search = search_params
  } else {
    search = {}
  }
  params.last_history = { $exists: true, $ne: null }
  const condition = sqlCondition(params, search)
  try {
    const resultExport = await Case.aggregate(condition)
    callback (null, resultExport.map(cases => excellOutput(cases)))
  } catch (error) {
    callback(error, null)
  }
}

function getCaseById (id, callback) {
  Case.findOne({_id: id})
    .populate('author')
    .populate('last_history')
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}

function getCaseByNik (nik, callback) {
  Case.findOne({nik: nik})
    .where('delete_status').ne('deleted')
    .populate('author')
    .populate('last_history')
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}

function getIdCase (query,callback) {
  const params = {}
  if(query.name_case_related){
    params.name = new RegExp(query.name_case_related, "i");
  }
  if(query.status){
    params.status = query.status;
  }
  if(query.address_district_code){
    params.address_district_code = query.address_district_code;
  }
  Case.find(params).select('id_case name')
  .where('delete_status').ne('deleted').limit(100)
  .then(cases => callback (null, cases.map(cases => cases.JSONFormIdCase())))
  .catch(err => callback(err, null));
}

async function getCaseSummaryFinal (query, user, callback) {
  let searching = Check.countByRole(user);

  if(query.address_village_code){
    searching.address_village_code = query.address_village_code;
  }
  if(query.address_subdistrict_code){
    searching.address_subdistrict_code = query.address_subdistrict_code;
  }

  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      searching.address_district_code = query.address_district_code;
    }
  }

  const searchingPositif = {status:"POSITIF", final_result : { $in: [0,"",null] }}
  const searchingSembuh = {status:"POSITIF",final_result:1}
  const searchingMeninggal = {status:"POSITIF",final_result:2}

  try {
    const positif = await Case.find(Object.assign(searching,searchingPositif))
    .where("delete_status").ne("deleted").and({verified_status: 'verified'}).countDocuments()
    const sembuh = await Case.find(Object.assign(searching,searchingSembuh))
    .where("delete_status").ne("deleted").and({verified_status: 'verified'}).countDocuments()
    const meninggal = await Case.find(Object.assign(searching,searchingMeninggal))
    .where("delete_status").ne("deleted").and({verified_status: 'verified'}).countDocuments()
    const result =  {
      "SEMBUH":sembuh,
      "MENINGGAL":meninggal,
      "POSITIF":positif
    }
    callback(null,result)
  } catch (error) {
    callback(error, null)
  }
}

async function getCaseSummary (query, user, callback) {
  // Temporary calculation method for faskes as long as the user unit has not been mapped, todo: using lookup
  const caseAuthors = await thisUnitCaseAuthors(user)

  let searching = Check.countByRole(user,caseAuthors);
  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      searching.address_district_code = query.address_district_code;
    }
  }

  if(query.address_village_code){
    searching.address_village_code = query.address_village_code;
  }

  if(query.address_subdistrict_code){
    searching.address_subdistrict_code = query.address_subdistrict_code;
  }

  var aggStatus = [
    { $match: {
      $and: [  searching, { delete_status: { $ne: 'deleted' }, verified_status: 'verified' } ]
    }},
    {
      $group: { _id: "$status", total: {$sum: 1}}
    }
  ];

  let result =  {
    'OTG':0,
    'OTG_PROCESS':0,
    'OTG_DONE':0,
    'ODP':0,
    'ODP_PROCESS':0,
    'ODP_DONE':0,
    'PDP':0,
    'PDP_PROCESS':0,
    'PDP_DONE':0,
    'POSITIF':0,
    'KONTAKERAT' : 0,
    'PROBABEL' : 0
  }
  Case.aggregate(aggStatus).exec().then(async item => {
      item.forEach(function(item){
        if (item['_id'] == 'OTG') {
          result.OTG = item['total']
        }
        if (item['_id'] == 'ODP') {
          result.ODP = item['total']
        }
        if (item['_id'] == 'PDP') {
          result.PDP = item['total']
        }
        if (item['_id'] == 'POSITIF') {
          result.POSITIF = item['total']
        }
        if (item['_id'] == 'KONTAKERAT') {
          result.KONTAKERAT = item['total']
        }
      });

      // OTG
      result.OTG_PROCESS = await Case.find(Object.assign(searching,{"status":"OTG", $or:[{'stage':0}, {'stage':"0"}, {'stage':'Proses'}], "verified_status": "verified","delete_status": { $ne: "deleted" }})).countDocuments();
      result.OTG_DONE = await Case.find(Object.assign(searching,{"status":"OTG",$or:[{'stage':1}, {'stage':"1"}, {'stage':'Selesai'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();

      // ODP
      result.ODP_PROCESS = await Case.find(Object.assign(searching,{"status":"ODP",$or:[{'stage':0}, {'stage':"0"}, {'stage':'Proses'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();
      result.ODP_DONE = await Case.find(Object.assign(searching,{"status":"ODP",$or:[{'stage':1}, {'stage':"1"}, {'stage':'Selesai'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();

      // PDP
      result.PDP_PROCESS = await Case.find(Object.assign(searching,{"status":"PDP",$or:[{'stage':0}, {'stage':"0"}, {'stage':'Proses'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();
      result.PDP_DONE = await Case.find(Object.assign(searching,{"status":"PDP",$or:[{'stage':1}, {'stage':"1"}, {'stage':'Selesai'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();

      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

async function getCaseSummaryVerification (query, user, callback) {
  // Temporary calculation method for faskes as long as the user unit has not been mapped, todo: using lookup
  const caseAuthors = await thisUnitCaseAuthors(user)

  let searching = Check.countByRole(user,caseAuthors);
  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      searching.address_district_code = query.address_district_code;
    }
  }

  if(query.address_village_code){
    searching.address_village_code = query.address_village_code;
  }

  if(query.address_subdistrict_code){
    searching.address_subdistrict_code = query.address_subdistrict_code;
  }

  var aggStatus = [
    { $match: {
      $and: [  searching, { delete_status: { $ne: 'deleted' } } ]
    }},
    {
      $group: { _id: "$verified_status", total: {$sum: 1}}
    }
  ];

  let result =  {
    'PENDING': 0,
    'DECLINED': 0,
    'VERIFIED': 0
  }

  Case.aggregate(aggStatus).exec().then(async item => {

      item.forEach(function(item){
        if (item['_id'] == 'pending') {
          result.PENDING = item['total']
        }
        if (item['_id'] == 'declined') {
          result.DECLINED = item['total']
        }
        if (item['_id'] == 'verified') {
          result.VERIFIED = item['total']
        }
      })

      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

function createCase (raw_payload, author, pre, callback) {

  let verified  = {
    verified_status: 'verified'
  }

  if (author.role === "faskes") {
    verified.verified_status = 'pending'
  }

  let date = moment(new Date()).format("YY");
  let id_case
  let preCovid = "precovid-"
  let covid = "covid-"
  let pendingCount = '';
  let pad = "";
  let dinkesCodeFaskes = pre.count_case_pending.dinkes_code;
  let dinkesCode = pre.count_case.dinkes_code;

  if (author.role === 'faskes') {
    pendingCount = pre.count_case_pending.count_pasien;
    pad = pendingCount.toString().padStart(5, "0")
    id_case = `${preCovid}${dinkesCodeFaskes}${date}${pad}`;
  } else {
    pendingCount = pre.count_case.count_pasien;
    pad = pendingCount.toString().padStart(7, "0")
    id_case = `${covid}${dinkesCode}${date}${pad}`;
  }

  let insert_id_case = Object.assign(raw_payload, verified) //TODO: check is verified is not overwritten ?

  if (!insert_id_case.hasOwnProperty('id_case') || [null, ""].includes(insert_id_case['id_case']) ) {
      insert_id_case = Object.assign(raw_payload, {id_case})
  }

  insert_id_case.author_district_code = author.code_district_city
  insert_id_case.author_district_name = author.name_district_city

  let item = new Case(Object.assign(insert_id_case, {author}))

  item.save().then(x => { // step 1 : create dan save case baru
    let c = {case: x._id}

    if (raw_payload.current_hospital_id == ""){
      raw_payload.current_hospital_id = null;
    }

    if (raw_payload.first_symptom_date == ""){
      raw_payload.first_symptom_date = Date.now();
    }

    let history = new History(Object.assign(raw_payload, c))
    history.save().then(last => { // step 2: create dan save historuy baru jangan lupa di ambil object id case
      let last_history = { last_history: last._id }
      x = Object.assign(x, last_history)
      x.save().then(async final =>{ // step 3: udpate last_history di case ambil object ID nya hitory

        await Notif.send(Notification, User, x, author, 'case-created')
        return callback(null, final)
      })
    })
   }).catch(err => callback(err, null))
}

function updateCase (id, pre, author, payload, callback) {

  /* can't update id_case & verified props from here */
  delete payload.id_case
  delete payload.verified_status
  delete payload.verified_comment

  payload.author_district_code = author.code_district_city
  payload.author_district_name = author.name_district_city

  // Regenerate id_case if district code address is changed.
  if (payload.address_district_code && (payload.address_district_code !== pre.cases.address_district_code)) {
    let date = moment(new Date()).format("YY");
    let id_case
    let preCovid = "precovid-"
    let covid = "covid-"
    let pendingCount = '';
    let pad = "";
    let dinkesCodeFaskes = pre.count_case_pending.dinkes_code;
    let dinkesCode = pre.count_case.dinkes_code;

    if (pre.cases.verified_status !== 'verified') {
      pendingCount = pre.count_case_pending.count_pasien;
      pad = pendingCount.toString().padStart(5, "0")
      id_case = `${preCovid}${dinkesCodeFaskes}${date}${pad}`;
    } else {
      pendingCount = pre.count_case.count_pasien;
      pad = pendingCount.toString().padStart(7, "0")
      id_case = `${covid}${dinkesCode}${date}${pad}`;
    }

    payload.id_case = id_case
  }

  const options = { new: true }
  if (pre.cases.verified_status !== 'verified') options.timestamps = false

  Case.findOneAndUpdate({ _id: id}, { $set: payload }, options)
  .then(result => {
    return callback(null, result);
  }).catch(err => {
    return callback(null, err);
  })
}

function getCountCaseByDistrict(callback) {
  /*
  var summary = {};
  DistrictCity.find().then(district_city => {
    Case.find({ address_district_code: district_city.kemendagri_kabupaten_kode }).then( res => {
      summary[district_city.name] = res.length();
    })
    .catch(err => callback(err, null));
  })
  .catch(err => callback(err, null));

  return callback(null, summary);

  var res = DistrictCity.collection.aggregate([
    {"$group": { _id: "$address_district_code", count: {$sum:1}}}
  ])
  return callback(null, res.toArray());
  */
  var aggStatus = [
    { $match: { delete_status: { $ne: 'deleted' }} },
    {$group: {
      _id: "$address_district_name",
      total: {$sum: 1}
    }}
  ];

  let result =  {}

  Case.aggregate(aggStatus).exec().then(item => {
      item.forEach(function(item){
        result[item['_id']] = item['total']
      });
      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

async function getCountByDistrict(code, callback) {
  /* Get last number of current district id case order */
  try {
    const params = {
      address_district_code: code,
      verified_status: 'verified'
    }
    const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code});
    const res = await Case.find(params).sort({id_case: -1}).limit(1);
    let count = 1;
    // find array data is not null
    if (res.length > 0){
      count = (Number(res[0].id_case.substring(12)) + 1);
    }
    let result = {
      prov_city_code: code,
      dinkes_code: dinkes.dinkes_kota_kode,
      count_pasien: count
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

async function getCountPendingByDistrict(code, callback) {
  /* Get last number of current district id case order */
  try {
    const params = {
      address_district_code: code,
      verified_status: { $in: ['pending', 'declined'] },
    }
    const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code});
    const res = await Case.find(params).sort({id_case: -1}).limit(1);
    let count = 1;
    // find array data is not null
    if (res.length > 0){
      count = (Number(res[0].id_case.substring(15)) + 1);
    }
    let result = {
      prov_city_code: code,
      dinkes_code: dinkes.dinkes_kota_kode,
      count_pasien: count
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

async function importCases (raw_payload, author, pre, callback) {

  const dataSheet = pre

  let savedCases = null //[]

  let promise = Promise.resolve()

  const refHospitals = await Unit.find({unit_type: 'rumahsakit'})
  /**
   * # The method used temporarily
   * Prevent duplicate id_case generated at another import process in the same time
   * Explanation:
   * - When counting cases, the resulting numbers will be the same if other users import simultaneously,
   *   this causes duplication in the case id.
   * current todo options:
   * 1. Make the import process in series can be entered into the queue first
   * 2. Check the current db model in process *(the current method is compared in 1 millisecond)
   *
   * to remember, this is only a temporary method to prevent :)
   */
  promise = delayIfAnotherImportProcessIsRunning(promise)

  for (i in dataSheet) {

    let item = dataSheet[i]

    promise = promise.then(async () => {

      const code = item.address_district_code
      const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
      const verifStatus = author.role === 'faskes' ? ['pending', 'declined'] : ['verified']
      const districtCases = await Case.findOne({ address_district_code: code, verified_status: { $in: verifStatus } }).sort({id_case: -1})

      let count = 1
      let casePayload = {}

      if (districtCases) {
        const startNum = author.role === 'faskes' ? 15 : 12
        count = (Number(districtCases.id_case.substring(startNum)) + 1)
      }

      let district = {
        prov_city_code: code,
        dinkes_code: dinkes.dinkes_kota_kode,
        count_pasien: count
      }

      let verified  = {
        verified_status: 'verified'
      }

      if (author.role === "faskes") {
        verified.verified_status = 'pending'
      }

      // create case
      let date = new Date().getFullYear().toString()
      const digit = author.role === 'faskes' ? 5 : 4
      let id_case = author.role === 'faskes' ? "precovid-" : "covid-"
      id_case += district.dinkes_code
      id_case += date.substr(2, 2)
      id_case += "0".repeat(digit - district.count_pasien.toString().length)
      id_case += district.count_pasien

      casePayload = Object.assign(item, verified)
      casePayload = Object.assign(item, {id_case})

      casePayload.author_district_code = author.code_district_city
      casePayload.author_district_name = author.name_district_city
      casePayload.input_source = 'import-data-sheets'

      casePayload = new Case(Object.assign(casePayload, {author}))

      let savedCase = await casePayload.save()

      let historyPayload = { case: savedCase._id }

      let hospitalId = null

      if (item && item.current_location_type === 'RS') {

        const hospital = refHospitals.find((h) => h.name === item.current_location_address) || null

        hospitalId = hospital && hospital._id ? hospital._id : null

        if (!hospitalId) {
          if (item.other_notes) {
            item.other_notes += ' , Dirawat di ' + item.current_location_address
          } else {
            item.other_notes = 'Dirawat di ' + item.current_location_address
          }
        }
      }

      item.current_hospital_id = hospitalId || null

      if (item.first_symptom_date == "") {
        item.first_symptom_date = Date.now()
      }

      let history = new History(Object.assign(item, historyPayload))

      let savedHistory = await history.save()

      let last_history = { last_history: savedHistory._id }
      savedCase = Object.assign(savedCase, last_history)
      savedCase = await savedCase.save()

      // savedCases.push(savedCase)

      return new Promise(resolve => resolve())

    }).catch((e) => { throw new Error(e) })
  }

  promise
    .then(() => callback(null, savedCases))
    .catch(err => callback(err, null))
}

function softDeleteCase(cases,deletedBy, payload, callback) {
   let date = new Date()
   let dates = {
     delete_status: 'deleted',
     deletedAt: date.toISOString()
   }
   let param = Object.assign({deletedBy}, dates)

   cases = Object.assign(cases, param)
   cases.save((err, item) => {
     if (err) return callback(err, null)
     return callback(null, item)
   })

}

async function healthCheck(payload, callback) {
  try {
    let case_no_last_history = await Case.find({ last_history: {"$exists": false}})
    .or({ last_history:null })
    let result = {
      'case_no_last_history' : case_no_last_history,
    }
    return callback(null, result);
  } catch (error) {
    return callback(error, null)
  }
}

async function epidemiologicalInvestigationForm (detailCase, callback) {
  const pdfmaker = require('../helpers/pdfmaker')
  const histories = await History.find({ case: detailCase._id })
  const closeContacts = await CloseContact.find({ case: detailCase._id, delete_status: { $ne: 'deleted' } })
  Object.assign(detailCase, { histories: histories, closeContacts: closeContacts })
  return callback(null, pdfmaker.epidemiologicalInvestigationsForm(detailCase))
}

/**
* compare data in 1 millisecond
* if different means the case is in the process of insertion by another process
* to remember, this is only a temporary method to prevent :)
*/
async function delayIfAnotherImportProcessIsRunning () {
  const totalOne = await Case.find().countDocuments()
  promise = delay(100)

  return promise.then(async () => {
    const totalTwo = await Case.find().countDocuments()
    if (totalOne !== totalTwo) return delay(10000)

    return new Promise(resolve => resolve())
  })
}

function delay(t) {
  return new Promise(resolve => setTimeout(resolve.bind(), t))
}

async function thisUnitCaseAuthors (user) {
  let caseAuthors = []
  if (user.role === "faskes" && user.unit_id) {
    caseAuthors = await User.find({unit_id: user.unit_id._id, role: 'faskes'}).select('_id')
    caseAuthors = caseAuthors.map(obj => obj._id)
  }
  return caseAuthors
}

module.exports = [
  {
    name: 'services.cases.list',
    method: ListCase
  },
  {
    name: 'services.cases.getById',
    method: getCaseById
  },
  {
    name: 'services.cases.getByNik',
    method: getCaseByNik
  },
  {
    name: 'services.cases.getSummary',
    method: getCaseSummary
  },
  {
    name: 'services.cases.GetSummaryFinal',
    method: getCaseSummaryFinal
  },
  {
    name: 'services.cases.getSummaryVerification',
    method: getCaseSummaryVerification
  },
  {
    name: 'services.cases.getSummaryByDistrict',
    method: getCountCaseByDistrict
  },
  {
    name: 'services.cases.create',
    method: createCase
  },
  {
    name: 'services.cases.update',
    method: updateCase
  },
  {
    name: 'services.cases.getCountByDistrict',
    method: getCountByDistrict
  },
  {
    name: 'services.cases.getCountPendingByDistrict',
    method: getCountPendingByDistrict
  },
  {
    name: 'services.cases.softDeleteCase',
    method: softDeleteCase
  },
  {
    name: 'services.cases.listCaseExport',
    method: listCaseExport
  },
  {
    name: 'services.cases.ImportCases',
    method: importCases
  },
  {
    name: 'services.cases.getIdCase',
    method: getIdCase
  },
  {
    name: 'services.cases.healthcheck',
    method: healthCheck,
  },
  {
    name: 'services.cases.epidemiologicalInvestigationForm',
    method: epidemiologicalInvestigationForm
  }
];

