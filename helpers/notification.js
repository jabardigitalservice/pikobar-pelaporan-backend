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
  integration_labkes_created,
} = lang.titles

const { KOTAKAB, FASKES } = ROLE

const {
  ACT_CASES_LIST,
  ACT_CASES_VERIFICATION_LIST,
  ACT_RDT_LIST,
  ACT_SYSTEM_UPDATES,
} = CLICK_ACTION

const {
  EVT_INTEGRATION_LABKES,
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

const getCaseCreatedPayload = (author, data) => {
  const message = `${author.fullname} telah menginput kasus baru atas nama ${data.name}`
  return MessageNotification(faskes_cases_created, message, FASKES, EVT_CASE_CREATED, ACT_CASES_VERIFICATION_LIST, [KOTAKAB], [])
}

// TODO DIRAPIHAKAN
const getMessagePayload = (event, data, author) => {
  let message, payload = {}

  switch (event) {
    case eventName(FASKES, EVT_INTEGRATION_LABKES):
      message = `Kasus DRAFT baru hasil uji lab atas nama ${data.name}`
      payload = MessageNotification(integration_labkes_created, message, EVT_INTEGRATION_LABKES, ACT_CASES_VERIFICATION_LIST, ['none'], [data.author])
    case eventName(FASKES, EVT_CASE_CREATED, FASKES, ):
      payload = getCaseCreatedPayload(author, data); break;
    case eventName(KOTAKAB, 'EVT_CASE_VERIFIED'):
      payload = MessageNotification(case_has_been_verified, `${case_has_been_verified} a/n Dummy`, KOTAKAB, EVT_CASE_VERIFIED, ACT_CASES_LIST, [FASKES], []); break;
    case eventName(KOTAKAB, EVT_CASE_DECLINED):
      message = `Kasus ${data.name} telah ditolak oleh ${author.fullname}`
      payload = MessageNotification(case_has_been_declined, message, KOTAKAB, EVT_CASE_DECLINED, ACT_CASES_VERIFICATION_LIST, ['none'], [data.author]); break;
    case eventName(FASKES, EVT_CASE_REVISED):
      payload = getCaseCreatedPayload(author, data); break;
    case eventName('scheduler', EVT_CLOSECONTACT_FINISHED_QUARANTINE):
      message = `Pasien ${data.name} sudah menjalani 14 hari karantina mandiri`
      payload = MessageNotification(faskes_cases_recreated, message, 'scheduler', EVT_CLOSECONTACT_FINISHED_QUARANTINE, ACT_CASES_LIST, [KOTAKAB], [data.author]); break;
    default:
  }

  return payload
}

const getDistrictCode = (author, data) => {
  return author.role === 'scheduler'
    ? data.author_district_code
    : author.code_district_city
}

const getRecipientIds = (author, data, to, usersIn) => {
  return model('User').find({
    $or: [ { role: { $in: to } }, usersIn ],
    code_district_city: getDistrictCode(author, data)
  }).select(['_id'])
}

const getDeviceTokens = (recipientUIds) => {
  return model('UserDevice').find({
    userId: { $in: recipientUIds.map(u => u._id) }
  }).select(['token'])
}

const notify = async (event, data, author) => {
  try {
    const messgPayload = getMessagePayload(eventName(author.role, event), data, author)
    const { title, body, eventRole, eventType, clickAction, to, toSpecificUsers } = messgPayload

    if (!to || !to.length) return

    const usersIn = { _id: { $in: toSpecificUsers } }
    const recipientUIds = await getRecipientIds(author, data, to, usersIn)
    const deviceTokens = await getDeviceTokens(recipientUIds)

    const payload = []
    for (i in recipientUIds) {
      payload.push({
        ...messgPayload,
        message: body,
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
