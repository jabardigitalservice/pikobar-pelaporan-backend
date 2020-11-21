const helpers = require("../custom")
const { dateFilter } = require("../filter/date")
const { casesHistory, author } = require("../export/cases/lookup")
const { columnIdentityClinic, columnInfo, columnAuthor } = require("../export/cases/select_column")
const { combineInfo, sectionOthers } = require("../export/histories/column")

const excellHistories = (this_) => {
  const mapingColumn = {
    ...combineInfo(this_),
    ...helpers.checkDiagnosis(this_.diagnosis),
    "Gejala Lainnya": helpers.checkExistColumn(this_.diagnosis_other),
    ...helpers.checkDiseases(this_.diseases),
    ...sectionOthers(this_),
  }

  return mapingColumn
}

const condition = (params, search, query) => {
  let searching = Object.keys(search).length == 0 ? [search] : search
  // let createdAt = dateFilter(query, "createdAt")
  let andParam = { ...params }
  return [
    {
      $match: {
        $and: [andParam],
        $or: searching
      }
    },
    { ...casesHistory }, { ...author },
    { $sort: { "id_case": 1} },
    {
      $project: {
        histories: {
          ...columnInfo,
        ...columnIdentityClinic,
        ...columnAuthor
        }
      }
    },
    {
      $unwind: "$histories"
    },
    { $replaceRoot: { newRoot: "$histories" } }
  ]
}

module.exports = {
  excellHistories, condition
}