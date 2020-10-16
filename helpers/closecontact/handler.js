const append = async (state, schema, req, cases) => {
  let contacts = cases
  const rules = req.id_case
    ? { id_case: req.id_case }
    : { nik: req.nik }


  if (cases && !Array.isArray(cases)) {
    contacts = [ cases ]
  }

  const founded = await schema.findOne(rules)

  if (founded) {
    const existsRules = {
      [state]: {
        $not: {
          $elemMatch: { id_case: founded.id_case },
        },
      }
    }
    await schema.updateOne({ ...rules, ...existsRules }, {
      $addToSet: {
        [state]: {
          $each: contacts
        }
      }
    })
  }

  return founded
}

const relatedPayload = (payload, author, v, idCaseRegistrant, granted) => {
  return {
    id_case: v.id_case,
    id_case_registrant: idCaseRegistrant,
    is_west_java: v.is_west_java,
    name: v.name,
    address_district_code: v.address_district_code,
    status: v.status,
    author: v.author || author,
    author_district_code: v.author_district_code,
    createdAt: v.createdAt,
    relation: payload.relation,
    relation_others: payload.relation_others,
    activity: payload.activity,
    activity_others: payload.activity_others,
    first_contact_date: payload.first_contact_date,
    last_contact_date: payload.last_contact_date,
    is_access_granted: granted,
    related_by: author._id,
    related_at: new Date(),
  }
}

module.exports = {
  append,
  relatedPayload,
}
