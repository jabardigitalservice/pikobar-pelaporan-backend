const lookupCases = (alias) => {
  return {
    $lookup: {
      from: "cases",
      localField: "id_case",
      foreignField: "id_case",
      as: alias,
    },
  }
}

module.exports = {
  lookupCases
}