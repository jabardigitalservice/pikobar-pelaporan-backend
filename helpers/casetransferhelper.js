const ObjectId = require("mongoose").Types.ObjectId
function isObjectIdValid (uuid) { 
  return ObjectId.isValid(uuid) 
}

module.exports = {
  setFalseAllThisCaseTransferLogs: async (schema, caseId, unitId, toUnitId)  => {
    let res = {}
    res.one = await schema.updateMany(
      { transfer_case_id: caseId, transfer_from_unit_id: unitId }, 
      { $set: { is_hospital_case_last_status: false } })
    res.two =  await schema.updateMany(
      { transfer_case_id: caseId, transfer_from_unit_id: unitId, transfer_to_unit_id: toUnitId }, 
      { $set: { is_pair_last_status: false } })
    return res
  },

  buildTransferCasePaylod: (detailCase, detail, author, req) => {
    return {
      transfer_from_unit_id: detail ? detail.transfer_from_unit_id : author.unit_id._id,
      transfer_from_unit_name: detail ? detail.transfer_from_unit_name : author.unit_id.name,
      transfer_comment: req.transfer_comment || null,
      transfer_case_id: detail ? detail.transfer_case_id : detailCase._id,
      transfer_last_history: detailCase.last_history,
      createdBy: author._id
    }
  },

  buildUpdateCasePayload: async (action, author, caseId, req, schema, detail)  => {
    let casePayload = {
      transfer_status: 'pending',
      transfer_to_unit_id: req.transfer_to_unit_id,
      transfer_to_unit_name: req.transfer_to_unit_name
    }

    if (['approve', 'decline', 'abort'].includes(action)) {
      casePayload.transfer_to_unit_id = detail.transfer_to_unit_id
      casePayload.transfer_to_unit_name = detail.transfer_to_unit_name
    }

    if (action === 'approve') {
      casePayload.transfer_status = 'approved'
      casePayload.latest_faskes_unit = detail.transfer_to_unit_id
    } else if (action === 'decline') {
      casePayload.transfer_status = 'declined'
    } else if (action === 'abort') {
      casePayload.transfer_status = null
      casePayload.transfer_to_unit_id = null
      casePayload.transfer_to_unit_name = null
      const latestApproved = await schema.findOne({
        transfer_case_id: caseId,
        transfer_from_unit_id: { $ne: author.unit_id._id },
        transfer_status: 'approved'
      })

      if (latestApproved) {
        casePayload.transfer_status = latestApproved.transfer_status
        casePayload.transfer_to_unit_id = latestApproved.transfer_to_unit_id
        casePayload.transfer_to_unit_name = latestApproved.transfer_to_unit_name
      }
    }

    return casePayload
  },

  buildParams: (type, user, query)  => {
    let params = {
      transfer_status: { $ne: 'aborted' }
    }
    
    if (query.transfer_status) {
      params.transfer_status = query.transfer_status
    }

    if(query.createdAt){
      let due = new Date(new Date(query.createdAt))
      due = new Date(due.setDate(due.getDate() + 1)).toISOString()
      params.createdAt = {
        $gte: new Date(query.createdAt),
        $lt: new Date(due)
      }
    }

    let filterBy = 'transfer_from_unit_id'
    let filterable = 'transfer_to_unit_id'
    
    if (type === 'in') {
      filterBy = 'transfer_to_unit_id'
      filterable = 'transfer_from_unit_id'
      params.is_pair_last_status = true
    } else {
      params.is_hospital_case_last_status = true
    }
  
    params[filterBy] = user.unit_id._id
    if (query[filterable]) {
      let isValid = isObjectIdValid(query[filterable])
      params[filterable] = isValid
        ? new ObjectId(query[filterable])
        : null
    }

    return params
  },

  buildCaseParams: (query)  => {
    let caseParams = {}
    const flterFields = [
      'stage',
      'status',
      'final_result',
      'address_district_code',
      'address_subdistrict_code',
      'address_village_code'
    ]
    flterFields.forEach(key => {
      if (query[key]) {
        caseParams[key] = query[key]
      }
    })
    return caseParams
  },

  buildSearchParams: (query)  => {
    let search = {}
    if (query.search) {
      search.$or = [
        { id_case : new RegExp(query.search || '',"i") },
        { name: new RegExp(query.search || '', "i") },
        { nik: new RegExp(query.search || '', "i") },
      ]
    }
    return search
  },

  listCaseQuery: (params, caseParams, search) => {
    return [
      { $match: params },
      { $lookup:
        {
          from: 'cases',
          let: {
            transferCaseId: "$transfer_case_id",
            tounit_id: "$transfer_to_unit_id",
            status: "$transfer_status"
          },
          pipeline: [
            { $match:
                { $expr:
                  { $and:
                      [
                        { $eq: [ "$_id",  "$$transferCaseId" ] }
                      ],
                  },
                  ...caseParams,
                  ...search
                },
            }
          ],
          as: 'case'
        },
      },
      { $sort: {createdAt: - 1} },
      { $unwind: "$case" }
    ]
  },

  transferLogsQuery: (caseId)  => {
    const dbQuery = [
      { $match: {
          transfer_case_id: new ObjectId(caseId),
          transfer_status: { $ne: 'aborted' }
        }
      },
      {
        $lookup:
          {
            from: 'histories',
            localField: 'transfer_last_history',
            foreignField: '_id',
            as: 'transfer_last_history'
          }
      },
      { "$addFields": {
        "transfer_last_history": {
          "$map": {
            "input": "$transfer_last_history",
            "as": "val",
            "in": {
              "status": "$$val.status",
              "stage": "$$val.stage",
              "final_result": "$$val.final_result"
            }
          } 
        }  
      }},
      { $unwind: "$transfer_last_history" },
      { $sort: {createdAt: -1} },
      {
        $group:
        {
          _id: {
            "transfer_to_unit_id": "$transfer_to_unit_id",
            "transfer_from_unit_id": "$transfer_from_unit_id"
          },
          data: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$data" } },
      { $sort: {createdAt: -1} },
    ]
    return dbQuery
  },

  canAction: (request, result, action, user) => {
    let msg = null
    if (!result.is_hospital_case_last_status) {
      msg =  'Invalid transfer case _id'
    } else if (result.transfer_status === 'approved') {
        msg =  'Case is already approved!'
    } else if (result && action === result.transfer_status) {
        msg = request.params.action + ' is already in process!'               
    } else if (request.params.action === 'approve') {
        if (result.transfer_to_unit_id.toString() !== user.unit_id._id.toString()) {
            msg =  'Only the destination unit is allowed to approve!'
        } else if (result.transfer_status !== 'pending') {
            msg =  'Only pending transfer cases are allow to approve!'
        }
    } else if (request.params.action === 'decline') {
        if (result.transfer_to_unit_id.toString() !== user.unit_id._id.toString()) {
            msg =  'Only the destination unit is allowed to decline!'
        } else if (result.transfer_status !== 'pending') {
            msg =  'Only pending transfer cases are allow to decline!'
        }
    } else if (request.params.action === 'abort') {
        if (result.transfer_from_unit_id.toString() !== user.unit_id._id.toString()) {
            msg =  'Only the transfer creator is allowed to abort!'
        }
    } else if (action === 'revise') {
        if (result.transfer_from_unit_id.toString() !== user.unit_id._id.toString()) {
            msg =  'Only the transfer creator is allowed to revise!'
        } else if (request.payload.transfer_to_unit_id.toString() === user.unit_id._id.toString()) {
          msg =  'Cannot transfer to your own unit!'
        } else if (result.transfer_status !== 'declined') {
          msg =  'Only declined transfer cases are allow to revise!'
        }
    }
    return msg
  }
}
