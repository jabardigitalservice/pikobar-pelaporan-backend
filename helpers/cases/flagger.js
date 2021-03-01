const ObjectId = require('mongodb').ObjectID
const closeconProps = [
  'close_contact_parents',
  'close_contact_childs'
]

const getSectionStatusName = (prop) => {
  let res = null

  switch(prop) {
    case 'visited_local_area': res = 'status_travel_local'; break;
    case 'visited_public_place': res = 'status_travel_public'; break;
    case 'travelling_history': res = 'status_travel_import'; break;
    case 'inspection_support': res = 'status_inspection_support'; break;
    case 'transmission_type': res = 'status_transmission'; break;
    case 'cluster_type': res = 'status_transmission'; break;
    case 'close_contact_heavy_ispa_group': res = 'status_exposurecontact'; break;
    case 'close_contact_pets': res = 'status_exposurecontact'; break;
    case 'health_workers': res = 'status_exposurecontact'; break;
    case 'apd_use': res = 'status_exposurecontact'; break;
    case 'close_contact_performing_aerosol': res = 'status_exposurecontact'; break;
    default: res = null;
  }

  return res
}

const getProp = (opt) => {
  let prop

  if (opt['$pull']) {
    prop = Object.keys(opt['$pull'])[0]
  } else if (opt['$addToSet']) {
    prop = Object.keys(opt['$addToSet'])[0]
  }

  return prop
}

const getFilter = (opt, prop) => {
  let filter

  if (opt['$pull']) {
    filter = `${prop}._id`
  } else if (opt['$addToSet']) {
    filter = '_id'
  }

  return filter
}

const doFlagging = async (source, self, Case) => {
  const pre = source === 'pre'
  const cond = self._conditions
  const opt = self._update

  if (!cond || !opt) return

  const prop = getProp(opt)
  const filter = getFilter(opt, prop)

  let id = cond._id || cond[`${prop}._id`]

  if (closeconProps.includes(prop)) {
    if (pre) return
    return handleClosecontactFlag(Case, cond.id_case)
  }

  if (!id || !prop) return

  const record = await Case.findOne({ [filter]: id }).select([prop])

  if (record && record[prop]) {
    if (pre && record[prop].length) {
      id = record._id
      record[prop].shift()
    }

    const status = record[prop].length ? 1 : 0

    const field = getSectionStatusName(prop)

    if (field) {
      await Case.updateOne(
        { _id: ObjectId(id) },
        { $set: { [field]: status } }
      )
    }
  }

}

const handleClosecontactFlag = async (Case, idCase) => {
  const rules = { id_case: idCase }

  const record = await Case
    .findOne(rules)
    .select(closeconProps)

  if (!record) return

  const {
    close_contact_childs,
    close_contact_parents,
  } = record

  let status = 0, childs = null, parents = null;

  if (close_contact_childs) {
    childs = close_contact_childs.filter(v => !!v.is_access_granted)
  }

  if (close_contact_parents) {
    parents = close_contact_parents.filter(v => !!v.is_access_granted)
  }

  if (childs.length || parents.length) {
    status = 1
  }

  await Case.updateOne(rules, {
    $set: { status_closecontact: status }
  })
}

const flagOnSection = (payload, flag, prop, isArray) => {
  const value = payload[prop]

  if ((isArray && value.length) || (!isArray && value)) {
    const section = getSectionStatusName(prop)
    flag[section] = 1
  }

  return flag
}

const assignPrePostFlag = (payload) => {
  let flag = {}

  flag = flagOnSection(payload, flag, 'inspection_support', true)
  flag = flagOnSection(payload, flag, 'visited_local_area', true)
  flag = flagOnSection(payload, flag, 'visited_public_place', true)
  flag = flagOnSection(payload, flag, 'travelling_history', true)
  // transmission
  flag = flagOnSection(payload, flag, 'transmission_type', false)
  flag = flagOnSection(payload, flag, 'cluster_type', false)
  // exposure contact
  flag = flagOnSection(payload, flag, 'close_contact_heavy_ispa_group', false)
  flag = flagOnSection(payload, flag, 'close_contact_pets', false)
  flag = flagOnSection(payload, flag, 'health_workers', false)
  flag = flagOnSection(payload, flag, 'apd_use', true)
  flag = flagOnSection(payload, flag, 'close_contact_performing_aerosol', false)

  return flag
}

module.exports = {
  doFlagging,
  assignPrePostFlag,
}
