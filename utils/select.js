const closeContactsColumn = {
  _id: "$case._id",
  id_case: "$case.id_case",
  name: "$case.name",
  nik: "$case.nik",
  phone_number: "$case.phone_number",
  age: "$case.age",
  birth_date: "$case.birth_date",
  gender: "$case.gender",
  status: "$case.status",
  address_street: "$case.address_street",
  address_district_name: "$case.address_district_name",
  address_subdistrict_name: "$case.address_subdistrict_name",
  address_village_name: "$case.address_village_name",
  relation: 1,
  relation_others: 1,
  activity: 1,
  activity_others: 1,
  first_contact_date: 1,
  last_contact_date: 1,
  id_case_registrant: 1,
  is_access_granted: 1,
  is_reported: "$case.is_reported",
  createdAt: 1,
}

const relatedCloseContactsColumn = {
  relatedCase: {
    close_contact_childs: 0,
    close_contact_parents: 0,
    createdAt: 0,
    updatedAt: 0,
    last_history: 0,
    __v: 0,
  },
}

module.exports = {
  closeContactsColumn, relatedCloseContactsColumn
}