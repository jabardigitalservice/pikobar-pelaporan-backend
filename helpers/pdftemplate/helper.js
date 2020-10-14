
/*
  * Age in db is in decimal
  * birth_date isn't mandatory.
  * if birth_date is exists, count from this date to make it more accurate
  * if birth_date not exists, simply use the decimal data which is quite risky due to its accuracy
  */
const transformAge = (data) => {
  let age = 0
  let ageInMonths = 0

  if (data.birth_date) {
    age = moment().diff(data.birth_date, 'years')
    ageInMonths = moment().diff(data.birth_date, 'months')
  } else {
    age = parseInt(data.age) || 0
    ageInMonths = Math.round((Number(data.age) - age) * 12)
  }

  const tramsformed = {
    age: age,
    ageInMonths: ageInMonths < 12 ? ageInMonths : ageInMonths%12
  }

  return tramsformed
}

module.exports = {
  transformAge,
}
