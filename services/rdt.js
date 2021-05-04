const LocationTest = require('../models/LocationTest')
const Rdt = require('../models/Rdt')
const Case = require('../models/Case')
const RdtHistory = require('../models/RdtHistory')
const DistrictCity = require('../models/DistrictCity')
const { listByRole, thisUnitCaseAuthors } = require('../helpers/rolecheck')
const https = require('https')
const { optionsLabel, resultJson } = require('../helpers/paginate')
const { filterRdt } = require('../helpers/filter/casefilter')
const { getLastRdtNumber } = require('../helpers/rdt/custom')

async function ListRdt (query, user, callback) {
  try {
    const sorts = (query.sort == "desc" ? {createdAt:"desc"} : query.sort)
    const options = optionsLabel(query, sorts, (['author']))
    const params = filterRdt(user, query)
    const caseAuthors = await thisUnitCaseAuthors(user)
    if (query.search) {
      var search_params = [
        { name: new RegExp(query.search, "i") },
        { code_test: new RegExp(query.search, "i") },
        { final_result: new RegExp(query.search, "i") },
        { mechanism: new RegExp(query.search, "i") },
        { test_method: new RegExp(query.search, "i") },
      ];
      var result_search = listByRole(user, params, search_params, Rdt, "status", caseAuthors)
    } else {
      var result_search = listByRole(user, params, null, Rdt, "status", caseAuthors)
    }
    const paginateResult = await Rdt.paginate(result_search, options)
    callback(null, resultJson('rdt', paginateResult))
  } catch (err) {
    callback(err, null)
  }
}

const loopFilter = (i) => {
const { CRITERIA } = require('../helpers/constant')
  if (i.target === CRITERIA.CLOSE){
    i.target = CRITERIA.CLOSE_ID
  }
  if (i.target === CRITERIA.SUS){
    i.target = CRITERIA.SUS_ID
  }
  if (i.target === CRITERIA.PROB){
    i.target = CRITERIA.PROB_ID
  }
  if (i.target === CRITERIA.CONF){
    i.target = CRITERIA.CONF_ID
  }
  return i
}

function getRdtById (id, callback) {
  Rdt.findOne({_id: id})
    .populate('author')
    .exec()
    .then(rdt => {
      const manipulate = loopFilter(rdt)
      return callback(null, manipulate)
    })
    .catch(err => callback(err, null));
}

function GetRdtHistoryByRdtId (id, callback) {
  RdtHistory.find({ rdt: id})
    .sort({updatedAt: -1})
    .exec()
    .then(item => {
    return callback(null, item);
  })
  .catch(err => callback(err, null))
}

async function createRdt(query, payload, author, pre, callback) {

  if ((payload.nik === null && payload.phone_number === null) || (payload.nik ==='' && payload.phone_number === '') ) {

     if (payload.source_data === "external" || payload.source_data === "manual") {
       delete payload.id
       delete payload.id_case
     }

    let date = new Date().getFullYear().toString()
    let code_test = "PTS-"
    code_test += pre.code_dinkes.code
    code_test += date.substr(2, 2)
    code_test += "0".repeat(5 - pre.count_rdt.count.toString().length)
    code_test += pre.count_rdt.count

    let code_tool_tester
    let pcr_count = 0
    let rdt_count = 0
    if (payload.tool_tester === "PCR") {
      pcr_count += 1
      code_tool_tester = "PCR-"
    } else {
      rdt_count += 1
      code_tool_tester = "RDT-"
    }
    code_tool_tester += pre.code_dinkes.code
    code_tool_tester += date.substr(2, 2)
    code_tool_tester += "0".repeat(5 - pre.count_rdt.count.toString().length)
    code_tool_tester += pre.count_rdt.count

    let id_case = null

    let code = {
      code_test, code_tool_tester, id_case,
      author_district_code: author.code_district_city,
      author_district_name: author.name_district_city,
      rdt_count, pcr_count,
      source_data: query.source_data
    }

    let rdt = new Rdt(Object.assign(code, payload))
    rdt = Object.assign(rdt, {author})

    let rdt_history = new RdtHistory(Object.assign(payload, {rdt}))
    rdt_history.save((err, item) => {
      if (err) return callback(err, null);

      //TODO: for send sms and whatsap message efter input test result
      // sendMessagesSMS(rdt)
      // sendMessagesWA(rdt)

      let last_history = {last_history: item._id}
      rdt = Object.assign(rdt, last_history)
      rdt.save()
      return callback(null, rdt);
    });


  } else {
    // find existing Rdt by nik & phone_number
    Rdt.findOne({ nik: payload.nik })
      .where('status').ne('deleted')
      .or({ phone_number: payload.phone_number })
      .exec()
      .then( (rdt) => {
          if (rdt) {
            // if rdt found, update rdt
            payload.author_district_code = author.code_district_city
            payload.author_district_name = author.name_district_city

            let pcr_count = rdt.pcr_count
            let rdt_count = rdt.rdt_count

            if (payload.tool_tester === "PCR") {
              pcr_count += 1
            } else {
              rdt_count += 1
            }

            let count_test_tool ={
                pcr_count: pcr_count,
                rdt_count: rdt_count
            }

            payload = Object.assign(payload, count_test_tool)
            rdt = Object.assign(rdt, payload);


            return rdt.save();


          } else {
            // if rdt not found, create new rdt
            if (payload.source_data === "external" || payload.source_data === "manual") {
              delete payload.id
              delete payload.id_case
            }

            let date = new Date().getFullYear().toString()
            let code_test = "PTS-"
                code_test += pre.code_dinkes.code
                code_test += date.substr(2, 2)
                code_test += "0".repeat(5 - pre.count_rdt.count.toString().length)
                code_test += pre.count_rdt.count

            let code_tool_tester
            let pcr_count = 0
            let rdt_count = 0
            if (payload.tool_tester === "PCR") {
              pcr_count += 1
              code_tool_tester = "PCR-"
            }else{
              rdt_count += 1
              code_tool_tester = "RDT-"
            }
            code_tool_tester += pre.code_dinkes.code
            code_tool_tester += date.substr(2, 2)
            code_tool_tester += "0".repeat(5 - pre.count_rdt.count.toString().length)
            code_tool_tester += pre.count_rdt.count

            let id_case = null

            let code = { }
            code.code_test = code_test
            code.code_tool_tester = code_tool_tester
            code.id_case = id_case
            code.author_district_code = author.code_district_city
            code.author_district_name = author.name_district_city
            code.rdt_count = rdt_count
            code.pcr_count = pcr_count
            code.source_data = query.source_data

            let rdt = new Rdt(Object.assign(code, payload))
            rdt = Object.assign(rdt,{author})
            return rdt.save()
          }
      })
      .then( (rdt) => {
          // whatever happen always create new TestHistory
            let arr = {...rdt, ...payload}
            let rdt_history = new RdtHistory(Object.assign(arr, {rdt}))
            rdt_history.save((err, item) => {
              if (err) return callback(err, null);

              //TODO: for send sms and whatsap message efter input test result
              // sendMessagesSMS(rdt)
              // sendMessagesWA(rdt)

              let last_history = {last_history: item._id}
              rdt = Object.assign(rdt, last_history)
              rdt.save()

              return callback(null, rdt);
            });

      })
      .catch( (err) => callback(err, null));
  }
}

function createRdtMultiple(payload, author, pre, callback) {
  let resultForResnpose =[]
  const process = async () =>{
    for (const payloads of payload) {
      const result = await returnPayload(payloads)
      const countRdt = await getCountRdt(result.address_district_code)
      const countCase = await getCountCase(result.address_district_code)

      // find existing Rdt by nik & phone_number
      Rdt.findOne({ nik: result.nik })
        .or({ phone_number: result.phone_number })
        .exec()
        .then((rdt) => {

            if (rdt) {
              // if rdt found, update rdt
              result.author_district_code = author.code_district_city
              result.author_district_name = author.name_district_city
              let pcr_count = rdt.pcr_count
              let rdt_count = rdt.rdt_count
              if (rdt.tool_tester === "PCR") {
                result.pcr_count = pcr_count += 1
              } else {
                result.rdt_count = rdt_count += 1
              }

              rdt = Object.assign(rdt, result);

              return rdt.save();
            } else {
              // if rdt found, create new rdt

              // "code_test": "PST-100012000001"
              // "code_tool_tester": "RDT-10012000001",
              // "code_tool_tester": "PCR-10012000001",

              let date = new Date().getFullYear().toString()
              let code_test = "PTS-"
                  code_test += countRdt.dinkes_code
                  code_test += date.substr(2, 2)
                  code_test += "0".repeat(5 - countRdt.count.toString().length)
                  code_test += countRdt.count

              let code_tool_tester
              let pcr_count = 0
              let rdt_count = 0
              if (result.tool_tester === "PCR") {
                pcr_count += 1
                code_tool_tester = "PCR-"
              } else {
                rdt_count += 1
                code_tool_tester = "RDT-"
              }
              code_tool_tester += countRdt.dinkes_code
              code_tool_tester += date.substr(2, 2)
              code_tool_tester += "0".repeat(5 - countRdt.count.toString().length)
              code_tool_tester += countRdt.count

              let id_case = null
              // let dates = moment(new Date()).format("YY");
              // let covid = "covid-"
              // let pendingCount = '';
              // let pad = "";
              // let dinkesCode = countCase.dinkes_code;

              //sementara tidak digunakan dulu
              // if (result.final_result === "POSITIF") {
              // pendingCount = countCase.count_pasien;
              // pad = pendingCount.toString().padStart(7, "0")
              // id_case = `${covid}${dinkesCode}${dates}${pad}`;
              // }

              let codes = {
                code_test: (code_test === undefined ? "" : code_test),
                code_tool_tester: (code_tool_tester === undefined? "": code_tool_tester),
                id_case: (id_case === undefined ? "": id_case),
                author_district_code: author.code_district_city,
                author_district_name: author.name_district_city,
                rdt_count: rdt_count,
                pcr_count: pcr_count,
                source_data: "external"
              }

              let rdt = new Rdt(Object.assign(codes, result))
              rdt = Object.assign(rdt,{author})


              return rdt.save();


            }
        }).then((rdt) => {
            // whatever happen always create new TestHistory
            let rdt_history = new RdtHistory(Object.assign(result, {rdt}))
            return rdt_history.save((err, item) => {
              if (err) console.log(err)
              // sendMessagesSMS(rdt)
              // sendMessagesWA(rdt)
              let last_history = { last_history: item._id }
              rdt = Object.assign(rdt, last_history)
              rdt.save()
            });


        }).catch( (err) => console.log(err));

    }
  }

  const returnPayload = x =>{
    return new Promise((resolve,reject) =>{
      setTimeout(() =>{
        resolve(x)
        resultForResnpose.push(x)
      }, 100)
    })
  }

  const getCountRdt = code => {
    return new Promise((resolve, reject) =>{
      DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
          .exec()
          .then(dinkes =>{
                Rdt.find({ address_district_code: code})
                  .sort({code_test: -1})
                  .exec()
                  .then(res =>{
                      let count = getLastRdtNumber(1, res, 10);
                      let results = {
                        prov_city_code: code,
                        dinkes_code: dinkes.dinkes_kota_kode,
                        count: count
                      }

                    resolve (results)
                  }).catch(err => console.log(err))
          })
    })
  }

  const getCountCase = code =>{
    return new Promise((resolve,reject)=>{
        DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{
                Case.find({ address_district_code: code})
                    .sort({id_case: -1})
                    .exec()
                    .then(res =>{
                        let count = 1;
                        if (res.length > 0)
                          // ambil 4 karakter terakhir yg merupakan nomor urut dari id_case
                          count = (Number(res[0].id_case.substring(12)));
                        let results = {
                          prov_city_code: code,
                          dinkes_code: dinkes.dinkes_kota_kode,
                          count_pasien: count
                        }

                        resolve(results)
                    }).catch(err => console.log(err))
              })
    })
  }


  process().then(()=> {
    return callback(null, resultForResnpose)
  })


}

function updateRdt (request, author, callback) {
  const id = request.params.id
  let payload = request.payload

  delete payload._id
  // update Rdt
  payload.author_district_code = author.code_district_city
  payload.author_district_name = author.name_district_city

  Rdt.findOne({ _id: id}).then(rdt_item => {

    let rdt_count = rdt_item.rdt_count
    let pcr_count = rdt_item.pcr_count

    if (rdt_item.tool_tester === payload.tool_tester) {
      rdt_count = rdt_item.rdt_count
      pcr_count = rdt_item.pcr_count
    } else if (rdt_item.tool_tester === "RDT" && payload.tool_tester === "PCR") {
      rdt_count = (rdt_item.rdt_count -1)
      pcr_count = (rdt_item.pcr_count +1)
    } else if (rdt_item.tool_tester === "PCR" && payload.tool_tester === "RDT") {
      rdt_count = (rdt_item.rdt_count +1)
      pcr_count = (rdt_item.pcr_count -1)
    }

    let tool ={
      rdt_count: rdt_count,
      pcr_count: pcr_count
    }

    payload = Object.assign(payload, tool)
    rdt_item = Object.assign(rdt_item, payload);

    rdt_item.save((err, res) => {
       if (err) return callback(err, null)

       RdtHistory.findByIdAndUpdate(rdt_item.last_history, { $set: payload }, { new: true }, (err, result) =>{
         if (err) console.log(err)

         return callback(null, result)
       })

    })

  }).catch(err => callback(err, null))
}

function getCountRdtCode(code,callback) {
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
  .exec()
  .then(dinkes =>{
    Rdt.find({ address_district_code: code})
    .sort({code_test: -1})
    .exec()
    .then(res =>{
      let count = getLastRdtNumber(1, res, 10);
      let result = {
        prov_city_code: code,
        dinkes_code: dinkes.dinkes_kota_kode,
        count: count
      }
      return callback(null, result)
    }).catch(err => callback(err, null))
  })
}

function getCountByDistrict(code, callback) {
  /* Get last number of current district id case order */
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
  .exec()
  .then(dinkes =>{
    Case.find({ address_district_code: code})
    .sort({id_case: -1})
    .exec()
    .then(res =>{
      let count = 1;
      if (res.length > 0)
      // ambil 4 karakter terakhir yg merupakan nomor urut dari id_case
      count = (Number(res[0].id_case.substring(12)));
      let result = {
        prov_city_code: code,
        dinkes_code: dinkes.dinkes_kota_kode,
        count_pasien: count
      }
      return callback(null, result)
    }).catch(err => callback(err, null))
  })
}

function softDeleteRdt(rdt, deletedBy, callback) {
  let date = new Date()
  let dates = {
    status: 'deleted',
    deletedAt: date.toISOString()
  }
  let param = Object.assign({deletedBy}, dates)
  rdt = Object.assign(rdt, param)

  rdt.save((err, item) => {
    if (err) return callback(err, null)
    return callback(null, item)
  })
}

function getCodeDinkes(code, callback) {
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
  .exec()
  .then(dinkes =>{
    let result = {
      prov_city_code: code,
      code: dinkes.dinkes_kota_kode,
    }
    return callback(null, result)
  })
}

function getCaseByidcase(idcase,callback) {
  let param = {
    id_case: new RegExp(idcase, "i"),
    is_test_masif: true
  }

  Case.findOne(param).exec()
  .then(cases => {
    if (cases !== null) {
      return callback(null, cases)
    }else{
      return callback(null, null)
    }
  }).catch(err => callback(err, null))
}

function FormSelectIdCase(query, user, data_pendaftaran, callback) {
  let params = new Object();

  if (query.address_district_code) {
    params.author_district_code = query.address_district_code;
  }

  Case.find(params)
    // .and({
    //   status: 'ODP'
    // })
    .where('delete_status')
    .ne('deleted')
    .or([{name: new RegExp(query.search, "i")},
          {nik: new RegExp(query.search , "i")},
          {phone_number: new RegExp(query.search , "i")}])
    .exec()
    .then(x => {
      let res = x.map(res => res.JSONFormCase())
      let concat = res.concat(data_pendaftaran)
      return callback(null, concat)
    })
    .catch(err => callback(err, null))
}

function getDatafromExternal(address_district_code, search, callback) {
  let Url = process.env.URL_PENDAFTARAN_COVID + '&data_source=tesmasif' + '&mode=bykeyword' + '&keyword=' + search.toLowerCase() + '&address_district_code=' + address_district_code
   https.get(Url, (res) => {
     let data = '';
     // A chunk of data has been recieved.
     res.on('data', (chunk) => {
       data += chunk;
     });


     res.on('end', () => {
      let jsonData = JSON.parse(data)
      let result = jsonData.data.content

      let outputData = []
      result.forEach(val => {
        outputData.push({
          display: val.name + "/" + val.nik + "/" + val.phone_number,
          last_status: val.final_result,
          source_data:"external"
        })
      });

      return callback(null, outputData)
     });

   }).on("error", (err) => {
     console.log("Error: " + err.message);
   });
}

function FormSelectIdCaseDetail(search_internal, callback) {
    // if (search_internal === null || search_internal=== undefined) {
    //   return callback(null, search_external)
    // }else{
    //   return callback(null, search_internal.JSONSeacrhOutput())
    // }
    return callback(null, search_internal.JSONSeacrhOutput())
}

function seacrhFromExternal(address_district_code, search, callback) {
 let Url = process.env.URL_PENDAFTARAN_COVID + '&data_source=tesmasif' + '&mode=bykeyword' + '&keyword=' + search.toLowerCase() + '&address_district_code=' + address_district_code
  https.get(Url, (res) => {
      let data = '';
      // A chunk of data has been recieved.
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let jsonData = JSON.parse(data)
        let result = jsonData.data.content

        let outputData = {}
        result.forEach(val => {
          outputData = val
        });
        let concate ={
          id: null,
          id_case: null,
          source_data: "external"
        }
        let res = Object.assign(outputData, concate)
        return callback(null, res)
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}

async function seacrhFromInternal(query, callback) {
  try {
    const params = new Object()
    if (query.address_district_code) params.author_district_code = query.address_district_code
    const result = await Case.findOne(params).where('delete_status').ne('deleted')
    .or([
      {name: query.search},
      {nik: query.search},
      {phone_number: query.search}
    ])
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

function getRegisteredUser(request, callback) {
  let search_external = request.pre.reg_user_external
  return callback(null, search_external)
}

function getRegisteredFromExternal(query, callback) {
  let date = new Date()
  let years = date.getFullYear()
  let month = date.getMonth()+1
  let months
  if (month >= 10) {
    months = month
  } else {
    months = '0' + month
  }
  https.get(process.env.URL_USER_PENDAFTARAN_COVID + '&mode=bytest' + '&test_location=' + query.test_location + '&test_date_from=' + years+'-'+months+'-01' + '&test_date_to=' + query.test_date, (res) => {
    let data = '';
    // A chunk of data has been recieved.
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      let jsonData = JSON.parse(data)
      let result = jsonData.data.content
      return callback(null, result)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

async function getLocationTest(callback) {
  try {
    const result = await LocationTest.find({})
    const mapingResult = result.map(x => x.toJSONFor())
    callback(null, mapingResult)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.rdt.list',
    method: ListRdt
  },
  {
    name: 'services.rdt.getById',
    method: getRdtById
  },
  {
    name: 'services.rdt.getHistoriesByRdtId',
    method: GetRdtHistoryByRdtId
  },
  {
    name: 'services.rdt.create',
    method: createRdt
  },
  {
    name: 'services.rdt.createMultiple',
    method: createRdtMultiple
  },
  {
    name: 'services.rdt.update',
    method: updateRdt
  },
  {
    name: 'services.rdt.softDeleteRdt',
    method: softDeleteRdt
  },
  {
    name: 'services.rdt.getCountRdtCode',
    method: getCountRdtCode
  },
  {
    name: 'services.rdt.getCodeDinkes',
    method: getCodeDinkes
  },
  {
    name: 'services.rdt.getCountByDistrict',
    method: getCountByDistrict
  },
  {
    name: 'services.rdt.getCaseByidcase',
    method: getCaseByidcase
  },
  {
    name: 'services.rdt.FormSelectIdCase',
    method: FormSelectIdCase
  },
  {
    name: 'services.rdt.getDatafromExternal',
    method: getDatafromExternal
  },
  {
    name: 'services.rdt.FormSelectIdCaseDetail',
    method: FormSelectIdCaseDetail
  },
  {
    name: 'services.rdt.getRegisteredUser',
    method: getRegisteredUser
  },
  {
    name: 'services.rdt.seacrhFromExternal',
    method: seacrhFromExternal
  },
  {
    name: 'services.rdt.getRegisteredFromExternal',
    method: getRegisteredFromExternal
  },
  {
    name: 'services.rdt.seacrhFromInternal',
    method: seacrhFromInternal
  },
  {
    name: 'services.rdt.getLocationTest',
    method: getLocationTest
  },
];

