const mongoose = require('mongoose');

require('../models/LocationTest')
const LocationTest = mongoose.model('LocationTest')

require('../models/Rdt');
const Rdt = mongoose.model('Rdt');

require('../models/Case')
const Case = mongoose.model('Case');

require('../models/RdtHistory')
const RdtHistory = mongoose.model('RdtHistory');

require('../models/User')
const User = mongoose.model('User')

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')
const Check = require('../helpers/rolecheck')
const https = require('https')
const url = require('url');


async function ListRdt (query, user, callback) {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  const sorts = (query.sort == "desc" ? {createdAt:"desc"} : query.sort)

  const options = {
    page: query.page,
    limit: query.limit,
    populate: ( 'author'),
    sort: sorts,
    leanWithId: true,
    customLabels: myCustomLabels
  };

  var params = new Object();

  if(query.category){
    params.category = query.category;
  }
  if(query.final_result){
    params.final_result = query.final_result;
  }
  if(query.mechanism){
    params.mechanism = query.mechanism;
  }
  if(query.test_method){
    params.test_method = query.test_method;
  }
  if(query.tool_tester){
    params.tool_tester = query.tool_tester;
  }
  if(query.test_address_district_code){
    params.test_address_district_code = query.test_address_district_code;
  }
   if (user.role == "dinkesprov" || user.role == "superadmin") {
     if (query.address_district_code) {
       params.address_district_code = query.address_district_code;
     }
   }
  if(user.role == "dinkeskota"){
    // params.author = new ObjectId(user._id);
    params.author_district_code = user.code_district_city;
  }

  if(query.start_date && query.end_date){
    params.test_date = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.end_date)).setHours(23, 59, 59)
    }
  }

  let caseAuthors = []
  if (user.role === "faskes" && user.unit_id) {
    delete params.author
    caseAuthors = await User.find({unit_id: user.unit_id._id}).select('_id')
    caseAuthors = caseAuthors.map(obj => obj._id)
  }

  if (query.search) {
    var search_params = [
      { name: new RegExp(query.search, "i") },
      { code_test: new RegExp(query.search, "i") },
      { final_result: new RegExp(query.search, "i") },
      { mechanism: new RegExp(query.search, "i") },
      { test_method: new RegExp(query.search, "i") },
    ];
    var result_search = Check.listByRole(user, params, search_params, Rdt, "status", caseAuthors)
  } else {
    var result_search = Check.listByRole(user, params, null, Rdt, "status", caseAuthors)
  }

  Rdt.paginate(result_search, options).then(function (results) {
    let res = {
      rdt: results.itemsList.map(rdt => rdt.toJSONFor()),
      _meta: results._meta
    }
    return callback(null, res)
  }).catch(err => callback(err, null))
}

function getRdtById (id, callback) {
  Rdt.findOne({_id: id})
    .populate('author')
    .exec()
    .then(rdt => {
        return callback(null, rdt)
    })
    .catch(err => callback(err, null));
}

function GetRdtSummaryByCities (query, callback) {
  var aggStatus = [
    { $match: { tool_tester: 'RDT'} },
    {$group: {
      _id: "$test_address_district_code",
      total: {$sum: 1}
    }}
  ];

  Rdt.aggregate(aggStatus).exec().then(item => {
      return callback(null, item)
    })
    .catch(err => callback(err, null))
}

async function GetRdtSummaryResultByCities (query, callback) {
  var aggStatus = [
    { $match: {
      tool_tester : "RAPID TEST",
      test_location_type : "RS",
      author_district_code : query.city_code
    }
    },
    {$group: {
      _id: "$final_result",
      total: {$sum: 1}
    }}
  ];

  let result =  {
    'POSITIF':0,
    'NEGATIF':0,
    'INVALID':0
  }

  Rdt.aggregate(aggStatus).exec().then(item => {
      item.forEach(function(item){
        if (item['_id'] == 'POSITIF') {
          result.POSITIF = item['total']
        }
        if (item['_id'] == 'NEGATIF') {
          result.NEGATIF = item['total']
        }
        if (item['_id'] == 'INVALID') {
          result.INVALID = item['total']
        }
      });
      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

async function GetRdtSummaryResultListByCities (query, callback) {
  var aggStatus = [
  { "$facet": {
    "total_used": [
        { $match: {tool_tester : "RAPID TEST", test_location_type : "RS", author_district_code : query.city_code}  },
        { $group : { _id : "$test_location", total_used: { $sum: 1 } }}
    ],
    // positif, negatif, invalid
    "total_positif": [
        { $match: {tool_tester : "RAPID TEST", test_location_type : "RS", final_result : "POSITIF", author_district_code : query.city_code}  },
        { $group : { _id : "$test_location", total_positif: { $sum: 1 } }}
    ],
    "total_negatif": [
        { $match: {tool_tester : "RAPID TEST", test_location_type : "RS", final_result : "NEGATIF", author_district_code : query.city_code}  },
        { $group : { _id : "$test_location", total_negatif: { $sum: 1 } }}
    ],
     "total_invalid": [
        { $match: {tool_tester : "RAPID TEST", test_location_type : "RS", final_result : "INVALID", author_district_code : query.city_code}  },
        { $group : { _id : "$test_location", total_invalid: { $sum: 1 } }}
    ],
  }},
  { "$project": {
    "total_used_list": "$total_used",
    "total_positif_list": "$total_positif",
    "total_negatif_list": "$total_negatif",
    "total_invalid_list": "$total_invalid",
  }}
];

  Rdt.aggregate(aggStatus).exec().then(item => {
      return callback(null, item)
    })
    .catch(err => callback(err, null))
}

function GetRdtFaskesSummaryByCities (query, callback) {
  var aggStatus = [
    { $match: {
      tool_tester: 'RAPID TEST',
      author_district_code: query.district_code,
    } },
    {$group: {
      _id: "$test_location",
      total: {$sum: 1}
    }}
  ];

  Rdt.aggregate(aggStatus).exec().then(item => {
      return callback(null, item)
    })
    .catch(err => callback(err, null))
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
    // let dates = moment(new Date()).format("YY");
    // let covid = "covid-"
    // let pendingCount = '';
    // let pad = "";
    // let dinkesCode = pre.code_dinkes.code;

    // if (payload.source_data === "external" || payload.source_data === "manual") {
    // pendingCount = pre.count_rdt.count;
    // pad = pendingCount.toString().padStart(7, "0")
    // id_case = `${covid}${dinkesCode}${dates}${pad}`;
    // }

    let code = {
      code_test: code_test,
      code_tool_tester: code_tool_tester,
      id_case: id_case,
      author_district_code: author.code_district_city,
      author_district_name: author.name_district_city,
      rdt_count: rdt_count,
      pcr_count: pcr_count,
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
            // let dates = moment(new Date()).format("YY");
            // let covid = "covid-"
            // let pendingCount = '';
            // let pad = "";
            // let dinkesCode = pre.code_dinkes.code;

            // if (payload.source_data === "external" || payload.source_data === "manual") {
            // pendingCount = pre.count_rdt.count;
            // pad = pendingCount.toString().padStart(7, "0")
            // id_case = `${covid}${dinkesCode}${dates}${pad}`;
            // }

            let code = {
              code_test: code_test,
              code_tool_tester: code_tool_tester,
              id_case: id_case,
              author_district_code: author.code_district_city,
              author_district_name: author.name_district_city,
              rdt_count: rdt_count,
              pcr_count: pcr_count,
              source_data: query.source_data
            }

            let rdt = new Rdt(Object.assign(code, payload))
            rdt = Object.assign(rdt,{author})


            return rdt.save();


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

                      let count = 1;
                      if (res.length > 0){
                        // ambil 5 karakter terakhir yg merupakan nomor urut dari id_rdt
                        let str = res[0].code_test
                        count = (Number(str.substring(10)) + 1)
                      }

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

function updateRdt (id, payload, author, callback) {
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

                          let count = 1;
                          if (res.length > 0){
                            // ambil 5 karakter terakhir yg merupakan nomor urut dari id_rdt
                            let str = res[0].code_test
                            count = (Number(str.substring(10)) + 1)
                          }

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

  Case.findOne(param)
      .exec()
      .then(cases => {
          if (cases !== null) {
            return callback(null, cases)
          }else{
            return callback(null, null)
          }
      })
      .catch(err => callback(err, null))

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

function FormSelectIdCaseDetail(search_internal, search_external, callback) {
    if (search_internal === null || search_internal=== undefined) {
      return callback(null, search_external)
    }else{
      return callback(null, search_internal.JSONSeacrhOutput())
    }
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

function seacrhFromInternal(query, callback) {
  let params = new Object();

  if (query.address_district_code) {
    params.author_district_code = query.address_district_code;
  }

  Case.findOne(params)
      //  .and({
      //   status: 'ODP'
      // })
      .where('delete_status')
      .ne('deleted')
      .or([
        {name: query.search},
        {nik: query.search},
        {phone_number: query.search}
      ])
      .exec()
      .then(res =>{
          // let result = res.JSONSeacrhOutput()
          return callback(null, res)
      }).catch(err => callback(err, null))
}

function getRegisteredUser(search_external, user, callback) {
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

function getLocationTest(callback) {
  LocationTest.find({})
              .exec()
              .then(res => {
                let result = res.map(x => x.toJSONFor())
                return callback(null, result)
              })
              .catch(err => callback(err, null))

}

function sendMessagesSMS(rdt) {
    console.log("call function sms");
  // console.log(rdt.nik);
  // console.log(rdt.name);
  // console.log(rdt.phone_number);
  // console.log(rdt.final_result);
  // console.log(rdt.tool_tester);
  // console.log(rdt.test_location);
  // console.log(rdt.test_date);
  // console.log(rdt.test_method);
  let name = rdt.name
  let split_name = name.split(" ")
  let params = {
    username: process.env.SMS_USERNAME,
    key: process.env.SMS_KEY,
    number: '6281223953113',
    // number: '6285223407000',
    message: "Halo Sdr/i " + split_name[0] + ", hasil test anda sudah keluar. \nSilahkan cek hasilnya pada link berikut http://bit.ly/ikutRDT",
  }


  const requestUrl = url.parse(url.format({
      protocol: 'https',
      hostname: process.env.SMS_URL_SERVER,
      pathname: '/sms/smsmasking.php',
      query: params
  }));


  const req = https.request(url.format(requestUrl), (res) => {
    console.log(`statusCode: ${res.statusCode}`)
    let data =''

    res.on('data', (d) => {
      data += d
    })

     res.on('end', () => {
      let result = data.split('|')
      let id_sms = result[1]
      let status = result[0]
      let send
       if (status === '\n0'){
          send = 'Terkirim'
       } else if (status === '\n1') {
        send = 'Username/key salah'
       } else if (status === '\n2') {
        send = 'Saldo Minus'
       } else if (status === '\n3') {
        send = 'Masa Aktif Sudah lewat '
       } else if (status === '\n4') {
        send = 'Penulisan nomor handphone salah'
       } else if (status === '\n5') {
       sends = 'Maksimum sms per nomor per menit'
       } else if (status === '\n6') {
        send = 'Format api salah'
       } else if (status === '\n7')(
        send = 'System Error'
       )

       return (console.log({
         id_sms: id_sms,
         no_sms: params.number,
         status_sms: send
       }))

      //  return callback(null, {id_sms: id_sms, no_sms: params.number, status_sms: send})
     });

  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.end()

}

function sendMessagesWA(rdt) {
  console.log("call function wa");
  // console.log(rdt.nik);
  // console.log(rdt.name);
  // console.log(rdt.phone_number);
  // console.log(rdt.final_result);
  // console.log(rdt.tool_tester);
  // console.log(rdt.test_location);
  // console.log(rdt.test_date);
  // console.log(rdt.test_method);

  let name = rdt.name
  let split_name = name.split(" ")
  let hp = rdt.phone_number
  let substr = hp.substring(0,1)
  let substr_blk = hp.substring(1)

  let phone
  if (substr === '0'){
    phone = parseInt('62'+substr_blk)
  }else{
    phone = hp
  }

  let body = JSON.stringify({
      // phone:6285223407000,
      phone: 6281223953113,
      body: "Halo Sdr/i " + split_name[0] + ", hasil test anda sudah keluar. \nSilahkan cek hasilnya pada link berikut http://bit.ly/ikutRDT"
  })

  var options = {
    hostname: process.env.WA_URL,
    method: 'POST',
    path: '/' + process.env.WA_USER + '/sendMessage?token=' + process.env.WA_TOKEN,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json'
    }
  };


  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
    let data =''

    res.on('data', (d) => {
      data += d
    })

     res.on('end', () => {
      let result = JSON.parse(data)

      return (console.log({
                 id_wa: result.id,
                 no_wa: 6281223953113,
                 status_wa: result.sent
               }))

      //  return callback(null, {
      //    id_wa: result.id,
      //    no_wa: query.number,
      //    status_wa: result.sent
      //  })
     });

  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.write(body)
  req.end()

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
    name: 'services.rdt.GetRdtSummaryByCities',
    method: GetRdtSummaryByCities
  },
  {
    name: 'services.rdt.GetRdtSummaryResultByCities',
    method: GetRdtSummaryResultByCities
  },
  {
    name: 'services.rdt.GetRdtSummaryResultListByCities',
    method: GetRdtSummaryResultListByCities
  },
  {
    name: 'services.rdt.GetRdtFaskesSummaryByCities',
    method: GetRdtFaskesSummaryByCities
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
    name: 'services.rdt.sendMessagesSMS',
    method: sendMessagesSMS
  },
  {
    name: 'services.rdt.sendMessagesWA',
    method: sendMessagesWA
  },
  {
    name: 'services.rdt.getLocationTest',
    method: getLocationTest
  },
];

