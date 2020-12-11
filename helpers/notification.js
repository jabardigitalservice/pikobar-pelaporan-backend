const { model } = require('mongoose')
const lang = require('./dictionary/id.json')
const { sendMessageNotification } = require('./firebase')
const { CLICK_ACTION, EVENT_TYPE, ROLE } = require('./constant')
const { thisUnitCaseAuthors } = require('../helpers/cases/revamp/handlerget')

const {
  case_has_been_declined,
  case_has_been_verified,
  faskes_cases_created,
  faskes_cases_recreated,
} = lang.titles

const { KOTAKAB, FASKES } = ROLE

const {
  ACT_CASES_LIST,
  ACT_CASES_VERIFICATION_LIST,
  ACT_RDT_LIST,
  ACT_SYSTEM_UPDATES,
} = CLICK_ACTION

const {
  EVT_CASE_CREATED,
  EVT_CASE_REVISED,
  EVT_CASE_VERIFIED,
  EVT_CASE_DECLINED,
  EVT_CLOSECONTACT_FINISHED_QUARANTINE,
} = EVENT_TYPE

const eventName = (role, event) => `${role}:${event}`

const MessageNotification = (title, body, eventRole, eventType, clickAction, to, toSpecificUsers) => {
  return { title, body, eventRole, eventType, clickAction, to, toSpecificUsers }
}

const getMessagePayload = (event, data, author) => {
  let message, payload = {}

  switch (event) {
    case eventName(FASKES, EVT_CASE_CREATED):
      message = `${author.fullname} telah menginput kasus baru atas nama ${data.name.toUpperCase()}`
      payload = MessageNotification(faskes_cases_created, message, FASKES, EVT_CASE_CREATED, ACT_CASES_VERIFICATION_LIST, [KOTAKAB], [])
      break
    case eventName(KOTAKAB, 'EVT_CASE_VERIFIED'):
      message = `${case_has_been_verified} a/n Masih Dummy`
      payload = MessageNotification(case_has_been_verified, message, KOTAKAB, EVT_CASE_VERIFIED, ACT_CASES_LIST, [FASKES], [])
      break
    case eventName(KOTAKAB, EVT_CASE_DECLINED):
      message = `${case_has_been_declined} a/n Masih Dummy`
      message = `Kasus ${data.name.toUpperCase()} telah ditolak oleh ${author.fullname}`
      payload = MessageNotification(case_has_been_declined, message, KOTAKAB, EVT_CASE_DECLINED, ACT_CASES_VERIFICATION_LIST, ['none'], [data.author])
      break
    case eventName(FASKES, 'EVT_CASE_REVISED'):
      message = `${faskes_cases_recreated} a/n Masih Dummy`
      payload = MessageNotification(faskes_cases_recreated, message, FASKES, EVT_CASE_REVISED, ACT_CASES_VERIFICATION_LIST, [KOTAKAB], [])
      break
    case eventName('scheduler', EVT_CLOSECONTACT_FINISHED_QUARANTINE):
      message = `Pasien ${data.name.toUpperCase()} sudah menjalani 14 hari karantina mandiri`
      payload = MessageNotification(faskes_cases_recreated, message, 'scheduler', EVT_CLOSECONTACT_FINISHED_QUARANTINE, ACT_CASES_LIST, [KOTAKAB], [data.author])
      break
    default:
  }

  return payload
}

const notify = async (event, data, author) => {
  try {
    const messgPayload = getMessagePayload(eventName(author.role, event), data, author)
    const { title, body, eventRole, eventType, clickAction, to, toSpecificUsers } = messgPayload

    if (!to || !to.length) return

    const usersIn = { _id: { $in: toSpecificUsers } }
    const districtCode = author.role === 'scheduler' ? data.author_district_code : author.code_district_city
    const recipientUIds = await model('User').find({ $or: [ { role: { $in: to } }, usersIn ], code_district_city: districtCode}).select(['_id'])
    const deviceTokens = await model('UserDevice').find({ userId: { $in: recipientUIds.map(u => u._id) } }).select(['token'])

    const payload = []
    for (i in recipientUIds) {
      payload.push({
        message: body,
        eventRole: eventRole,
        eventType: eventType,
        clickAction: clickAction,
        referenceId: data._id,
        senderId: author._id,
        recipientId: recipientUIds[i]._id,
      })
    }

    const tokens = deviceTokens.map(d => d.token)
    if (!tokens.length) return

    // firebase cloud messaging: send multicast
    sendMessageNotification(tokens, title, body, clickAction)
    return model('Notification').insertMany(payload)
  } catch (error) {
    console.log('err', error)
    return error
  }
}

module.exports = {
  notify,
}
