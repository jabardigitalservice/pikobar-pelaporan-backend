const User = require('../../../models/User')
const { ROLE } = require('../../constant')
async function thisUnitCaseAuthors (user) {
    let caseAuthors = []
    if (user.role === ROLE.FASKES && user.unit_id) {
      caseAuthors = await User.find({unit_id: user.unit_id._id, role: 'faskes'}).select('_id')
      caseAuthors = caseAuthors.map(obj => obj._id)
    }
    return caseAuthors
  }

module.exports = {
    thisUnitCaseAuthors
}
