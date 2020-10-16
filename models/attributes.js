// case attributes: section status
const mongoose = require('mongoose')

const sectionStatus = {
  status_identity: { type: Number, default: 0 },
  status_clinical: { type: Number, default: 0 },
  status_inspection_support: { type: Number, default: 0 },
  status_travel_import: { type: Number, default: 0 },
  status_travel_local: { type: Number, default: 0 },
  status_travel_public: { type: Number, default: 0 },
  status_transmission: { type: Number, default: 0 },
  status_exposurecontact: { type: Number, default: 0 },
  status_closecontact: { type: Number, default: 0 },
}

// case attributes: refRelatedCase
const refRelatedCase = [{
  // case attributes
  _id: false,
  id_case: { type: String, default: null },
  id_case_registrant: { type: String, default: null },
  is_west_java: { type: Boolean, default: true },
  name: { type: String,  default: null },
  address_district_code: { type: String, default: null },
  status: { type: String, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, default: null },
  author_district_code: { type: String, default: null },
  createdAt: { type: Date, default: Date.now() },
  // additional relationship attributes
  relation: { type: String, default: null },
  relation_others: { type: String, default: null },
  activity: { type: Array, default: [] },
  activity_others: { type: String, default: null },
  first_contact_date: { type: Date, default: null },
  last_contact_date: { type: Date, default: null },
  is_access_granted: { type: Boolean, default: false },
  related_by: mongoose.Schema.Types.ObjectId,
  related_at: { type: Date, default: Date.now() },
}]

module.exports = {
  sectionStatus,
  refRelatedCase,
}
