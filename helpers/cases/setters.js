const ObjectId = require('mongodb').ObjectID

const doUpdateEmbeddedClosecontactDoc = async (oldIdCase, newIdCase, Case) => {
  if (oldIdCase === newIdCase) return

  const updating = (prop, target, caseId) => {
    return Case.updateOne(
      { _id: ObjectId(caseId), [`${prop}.${target}`]: oldIdCase },
      { $set: { [`${prop}.$.${target}`]: newIdCase } })
  }

  try {
    const allEmbeddedDocuments = await Case.find({
      $or: [
        { close_contact_parents: { $elemMatch: { id_case: oldIdCase } } },
        { close_contact_childs: { $elemMatch: { id_case: oldIdCase } } },
      ]
    })

    for (let i in allEmbeddedDocuments) {
      const document = allEmbeddedDocuments[i]
      await updating('close_contact_parents', 'id_case', document._id)
      await updating('close_contact_childs', 'id_case', document._id)
      await updating('close_contact_parents', 'id_case_registrant', document._id)
      await updating('close_contact_childs', 'id_case_registrant', document._id)
    }

  } catch (e) {}
}

module.exports = {
  doUpdateEmbeddedClosecontactDoc,
}
