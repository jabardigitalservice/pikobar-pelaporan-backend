const Case = require('../models/Case')
const User = require('../models/User')
const ObjectId = require('mongodb').ObjectID
const service = 'services.casesVerifications'
const { ucwords } = require('../helpers/custom')
const { notify } = require('../helpers/notification')
const Notification = require('../models/Notification')
const CaseVerification = require('../models/CaseVerification')
const Validate = require('../helpers/cases/revamp/handlerpost')
const { ROLE, VERIFIED_STATUS } = require('../helpers/constant')
const { getCountBasedOnDistrict } = require('../helpers/cases/global')
const { doUpdateEmbeddedClosecontactDoc } = require('../helpers/cases/setters')

async function getCaseVerifications (caseId, callback) {
  try {

    let verifications = await CaseVerification
      .find({ case: caseId })
      .populate('verifier')
      .sort({ createdAt: 'desc'})

    verifications = verifications.map(verifications => verifications.toJSONFor())

    callback(null, verifications)
  } catch (error) {
    callback(error, null)
  }
}

async function createCaseVerification (id, author, pre, payload, callback) {
  try {
    const updatePayload = {
      verified_comment: payload.verified_comment,
      verified_status: payload.verified_status
    }

    // generate new verified id_case
    if (payload.verified_status === VERIFIED_STATUS.VERIFIED) {
      updatePayload.id_case = Validate.generateIdCase(author, {
        count_case: pre,
        count_case_pending: {}
      }, payload)
    }

    // update case verifed status
    const case_ = await Case.findOneAndUpdate(
      { _id: id}, { $set: updatePayload},
      { new: true }
    )

    // insert verification logs
    payload.verifier = author._id
    payload.case = case_._id

    const item = new CaseVerification(payload)

    const caseVerification = await item.save()

    if (payload.verified_status === VERIFIED_STATUS.VERIFIED) {
      await doUpdateEmbeddedClosecontactDoc(pre.id_case, updatePayload.id_case, Case)
    }

    notify(`Case${ucwords(payload.verified_status)}`, case_, author)
    callback(null, caseVerification)
  } catch (error) { callback(error, null) }
}

async function createCasesVerification (services, callback) {
  const start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))

  const unverifiedCasesFor24Hours = await Case.find({
    verified_status: VERIFIED_STATUS.PENDING,
    delete_status: { $ne: 'deleted' },
    updatedAt: { $lt: start }
  })

  try {
    for (i in unverifiedCasesFor24Hours) {
      let item = unverifiedCasesFor24Hours[i]
      const id = item._id

      const payload = {
        verified_status: VERIFIED_STATUS.VERIFIED,
        verified_comment: 'Automatically verified by the system'
      }

      let idCase
      if (item.id_case.substr(0,3) === 'pre') {
        // get requirement doc to generate id case
        const pre = await getCountBasedOnDistrict(services, item.address_district_code)
        idCase = Validate.generateIdCase({role: ROLE.KOTAKAB}, pre, item)
        payload.id_case = idCase
      }

      await Case.updateOne({ _id: ObjectId(id) }, {
        $set: payload
      })

      // insert verification logs
      const verificationPayload = {
        ...payload,
        case: id,
        verifier: null,
      }

      const verification = new CaseVerification(verificationPayload)

      await verification.save()
      await doUpdateEmbeddedClosecontactDoc(item.id_case, idCase, Case)
    }
    callback(null, true)
  } catch (error) {
    callback(error, null)
  }

}

async function submitMultipleVerifications (services, payload, author, callback) {
  try {
    const { ids } = payload

    const reqPayload = {
      verified_status: VERIFIED_STATUS.PENDING,
      verified_comment: 'submit a verification case on draft',
    }

    if (!ids || !ids.length) {
      throw new Error('ids must be provided as an array')
    }

    const result = await Case.updateMany(
      { _id: { $in: ids }, verified_status: VERIFIED_STATUS.DRAFT },
      { $set: reqPayload },
    )

    // insert verification logs
    for (let i in payload.ids) {
      await CaseVerification.create({
        ...reqPayload,
        case: ids[i],
        verifier: author._id,
      })
    }

    callback(null, result)
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  { name: `${service}.get`, method: getCaseVerifications },
  { name: `${service}.create`, method: createCaseVerification },
  { name: `${service}.createCasesVerification`, method: createCasesVerification },
  { name: `${service}.submitMultipleVerifications`, method: submitMultipleVerifications },
];
