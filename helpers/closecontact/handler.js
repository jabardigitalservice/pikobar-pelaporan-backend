<<<<<<< HEAD
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
    is_west_java: true,
    status: v.status,
    relation: null,
    relation_others: null,
    activity: null,
    activity_others: null,
    first_contact_date: null,
    last_contact_date: null,
    is_access_granted: granted,
  }
}

module.exports = {
  append,
  relatedPayload,
}
=======
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
    is_west_java: true,
    status: v.status,
    relation: null,
    relation_others: null,
    activity: null,
    activity_others: null,
    first_contact_date: null,
    last_contact_date: null,
    is_access_granted: granted,
  }
}

module.exports = {
  append,
  relatedPayload,
}
>>>>>>> 8af6db5df1f9fe528a6c5e6a519e3922b6c9fe5b
