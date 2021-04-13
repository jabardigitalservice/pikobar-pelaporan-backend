const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')
const Filter = require('../helpers/filter/casefilter')
const { WHERE_GLOBAL, ROLE } = require('../helpers/constant')
const { filterEdges, filterNodes } = require('../helpers/filter/relatedfilter')
const { patientStatus } = require('../helpers/custom')
const { clientConfig } = require('../config/redis')
const whereRole = (user) => {
  return {
      ...Check.countByRole(user),
      close_contact_parents: { $elemMatch: {
      author_district_code: user.code_district_city
      }
    }
  }
}

const select = {
  "_id": 1,
  "id_case": 1,
  "gender": 1,
  "status": 1,
  "age": 1,
  "final_result": 1,
}

const lookup =  {
  $lookup: {
    from: "cases",
    localField: "case_related_ids",
    foreignField: "id_case",
    as: "cases_related"
  }
}

const addFields =  {
  $addFields: {
    case_related_ids: {
      $map: {
        input: "$close_contact_parents",
        as: "thisParent",
        in: "$$thisParent.id_case"
      }
    }
  }
}

const project = {
  "$project": {
    ...select,
    "cases_related" : {
      ...select
    }
  }
}

const projectByCase =  {
  "$project": {
    "_id": 1,
    "id_case": "$id_case",
    "status": "$status",
    "age": "$age",
    "gender": "$gender",
    "final_result": "$final_result",
    "first_symptom_date": "$history.first_symptom_date",
    "current_location_address" : "$history.current_location_address"
  }
}

// debugger config
const debug = true
const _debugger = {
  errorIds: [],
  skippedIds: [],
}

// declare error attributes
const errors = {
  errorOccured: 0,
  processed: 0,
  notFoundCase: 0,
  notFoundCaseRelated: 0,
  invalidCaseAuthor: 0,
  invalidCaseRelatedIdCase: 0,
  invalidCaseRelatedStatus: 0,
  idCaseSameAsRelated: 0,
}

const getCaseData = async () => {
  return await Case.find({
    id_case_related: {
      $exists: true,
      $nin: [ null, '' ],
    },
    delete_status: {
      $ne: 'deleted'
    },
  })
}

const createCloseContact = async (services, c, cc) => {
  return await services.cases.closecontact.create(
    services, { cases: c }, c.author,
    [{ id_case: cc.id_case, status: cc.status }],
    (err, result) => {
      if (err) {
        errors.errorOccured++
        if (debug) _debugger.errorIds.push(cc.id_case);
        throw new Error
      }
      errors.processed++
    })
}

const condition = async (query, user) => {
  const filter = await Filter.filterCase(user, query)
  const condition = Object.assign(whereRole(user), filter)
  const staticParam = { ...WHERE_GLOBAL, "close_contact_parents": { $gt: [] } }
  const searching = { ...condition, ...staticParam }
  const aggregateCondition = [
    { $match: searching }, addFields, lookup, project
  ]

  return aggregateCondition
}

const listQuery = async (query, user) => {
  try {
    const aggregateCondition = await condition(query, user)
    const res = await Case.aggregate(aggregateCondition)
    const resultEdgesFrom = res.map(rowEdgesFrom => filterEdges(rowEdgesFrom))
    const rawResultEdgesTo = res.map(rowEdgesTo => rowEdgesTo.cases_related).filter(e => e.length)
    const resultEdgesTo = [].concat.apply([], rawResultEdgesTo)
    // maping array dimensional
    const output = resultEdgesTo.map(s_id => filterEdges(s_id))
    // filter remove duplicate
    const filterOutput = output.reduce((unique, o) => {
      if (!unique.some(obj => obj.label === o.label && obj.value === o.value)) {
        unique.push(o)
      }
      return unique
    }, [])
    // combine array object
    const resultEdges = resultEdgesFrom.concat(filterOutput)
    const resultNodes = filterNodes(res)
    const resultJson = { "edges": resultEdges, "nodes": resultNodes }

    return resultJson
  } catch (error) {
    return error
  }
}
const listCaseRelated = async (query, user, callback) => {
  const expireTime = 15 * 60 * 1000 // 15 minute expire
  let key
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    key = `related-map-${user.username}-${user.code_district_city}`
  }else if([ROLE.KOTAKAB].includes(user.role)){
    key = `related-map-${user.username}-${user.code_district_city}`
  }else{
    key = `related-map-${user.id}-${user.code_district_city}`
  }
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        callback(null, JSON.parse(result))
        console.info(`redis source ${key}`)
      }else{
        const row = await listQuery(query, user)
        clientConfig.setex(key, expireTime, JSON.stringify(row)) // set redis key
        callback(null, row)
        console.info(`api source ${key}`)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const getByCaseRelated = async (id_case, callback) => {
  const wheres = { ...WHERE_GLOBAL, 'id_case': id_case }
  try {
    const conditionAggregate = [
      {
        $match: wheres
      },
      {
        $lookup: {
          from: "histories",
          localField: "last_history",
          foreignField: "_id",
          as: "history"
        }
      },
      { $unwind: '$history' },
      projectByCase
    ]
    const result = await Case.aggregate(conditionAggregate)
    result.map(res => {
      res.final_result = patientStatus(res)
    })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const sync = async (services, callback) => {
  try {
    // get case that have an id related case
    const data = await getCaseData()
    // do mapping to closecontact field in case schema
    for (let i = 0; i < data.length; i++) {
      const c = data[i] // active case
      const cc = await Case // related case
        .findOne({ id_case: c.id_case_related }).select(['id_case', 'status'])
      if (!c || !cc || !cc.id_case || !cc.status || !c.author) {
        if (debug) _debugger.skippedIds.push(c.id_case_related);
      }
      if (!c) { errors.notFoundCase++; continue; }
      if (!c.author) { errors.invalidCaseAuthor++; continue; }
      if (!cc) { errors.notFoundCaseRelated++; continue; }
      if (!cc.id_case) { errors.invalidCaseRelatedIdCase++; continue; }
      if (!cc.status) { errors.invalidCaseRelatedStatus++; continue; }
      if (c.id_case === cc.id_case) { errors.idCaseSameAsRelated++; continue; }
      await createCloseContact(services, c, cc)
    }
    if (debug) Object.assign(errors, _debugger)
    callback(null, errors)
  } catch (error) {
    console.log(error)
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.case_related.list',
    method: listCaseRelated,
  },
  {
    name: 'services.case_related.getById',
    method: getByCaseRelated,
  },
  {
    name: 'services.case_related.sync',
    method: sync,
  },
];

