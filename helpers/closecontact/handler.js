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

const relatedPayload = (v, idCaseRegistrant, granted) => {
  return {
    id_case: v.id_case,
    id_case_registrant: idCaseRegistrant,
    is_west_java: v.is_west_java,
    status: v.status,
    relation: v.relation,
    relation_others: v.relation_others,
    activity: v.activity,
    activity_others: v.activity_others,
    first_contact_date: v.first_contact_date,
    last_contact_date: v.last_contact_date,
    is_access_granted: granted,
  }
}

module.exports = {
  append,
  relatedPayload,
}
