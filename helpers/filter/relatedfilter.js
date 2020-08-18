'use strict'
const { GENDER, CRITERIA } = require('../constant')
const filterEdges = (this_) => {
  const replaceString = this_.id_case.replace("covid-", "")
  const gender = (this_.gender === 'L' ? GENDER.M : GENDER.F)
  let image
  let status
  // logic status label
  if (this_.status === CRITERIA.SUS || this_.status === CRITERIA.PROB || this_.status === CRITERIA.CLOSE) {
    status = 'normal'
  }
  if (this_.status === CRITERIA.CONF &&
    this_.final_result === '' || this_.final_result === null
    || this_.final_result === 0) {
    status = 'positive_active'
  }
  if (this_.status === CRITERIA.CONF && this_.final_result === 1) {
    status = 'positive_recovery'
  }
  if (this_.status === CRITERIA.CONF && this_.final_result === 2) {
    status = 'positive_dead'
  }
  // logic image label by age
  if (this_.age >= 0 && this_.age <= 1) {
    image = `avatar/baby-${gender}-${status}.svg`
  }
  if (this_.age >= 2 && this_.age <= 5) {
    image = `avatar/child-${gender}-${status}.svg`
  }
  if (this_.age >= 6 && this_.age <= 19) {
    image = `avatar/teen-${gender}-${status}.svg`
  }
  if (this_.age >= 20 && this_.age <= 59) {
    image = `avatar/adult-${gender}-${status}.svg`
  }
  if (this_.age >= 60) {
    image = `avatar/elderly-${gender}-${status}.svg`
  }
  return {
    _id: this_._id,
    id: this_.id_case,
    label: replaceString,
    shape: 'image',
    image: image,
    size: (this_.status === CRITERIA.CONF ? 50 : '')
  }
}
const filterNodes = (this_) => {
  return {
    from: this_.id_case_related,
    to: this_.id_case,
  }
}
module.exports = {
  filterEdges, filterNodes
}