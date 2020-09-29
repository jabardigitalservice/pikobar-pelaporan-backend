const addFields = {
  $addFields: {
    lastHis: { $arrayElemAt: [ `$histories`, 0 ] },
    prevHis: {
      $cond: [
        { $lt: [ { "$size": `$histories` }, 2 ] },
        { $literal: null },
        { $arrayElemAt: [ `$histories`, 1 ] }
      ]
    }
  }
}

/*
 * Why using transformer?
 * Firstly, "inspection_support" is an array of objects fields
 * Daily report need to calculate inspection_support based on child field of an array of objects (type/result)
 * the problem is, we just need to sum it, only if the array of inspection_supprt(type/result) has specified one match
 * so, the quick solve problem to transform an array of objects to a single needed informative value that's boolean
 */
const transformedFields = {
  $addFields: {
    pcrSwab: { $toBool: {
      $arrayElemAt: [{
        $filter: {
          input: "$inspection_support",
          as: "item",
          cond: { $in: [ "$$item.specimens_type", ["Swab Nasofaring", "Swab Orofaring", "Swab Naso - Orofaring" ] ] }
        }
      }, 0]
    } },
    rapidTest: { $toBool: {
      $arrayElemAt: [{
        $filter: {
          input: "$inspection_support",
          as: "item",
          cond: { $eq: [ "$$item.inspection_type", "other_checks" ] }
        }
      }, 0]
    } },
    rapidTestReactive: { $toBool: {
      $arrayElemAt: [{
        $filter: {
          input: "$inspection_support",
          as: "item",
          cond: { $and:[
            { $eq: [ "$$item.inspection_type", "other_checks" ] },
            /*founded typo value in DB, it should be reactive*/
            { $eq: [ "$$item.inspection_result", "reactif" ] }
          ] }
        }
      }, 0]
    } },
    pcr: { $toBool: {
        $arrayElemAt: [{
          $filter: {
            input: "$inspection_support",
            as: "item",
            cond: { $eq: [ "$$item.inspection_type", "lab_confirm" ] }
          }
        }, 0]
    } },
    pcrPositive: { $toBool: {
      $arrayElemAt: [{
        $filter: {
            input: "$inspection_support",
            as: "item",
            cond: { $and:[
                { $eq: [ "$$item.inspection_type", "lab_confirm" ] },
                { $eq: [ "$$item.inspection_result", "positif" ] }
            ] }
        }
      }, 0]
    } },
  }
}

/*
 * Transformer func for json2xls param
 * @param {object} docs
 */
const transformedXlsFor = (docs) => {
  const $t = require('../constant')['DAILY_REPORT']

  const header = (label, isolation = false) => {
    sect++; num = 1;

    res.push(row())

    res.push(row(`${sect}.`, label))

    if (isolation) {
      res.push(row(
        null,
        $t.CLASSIFICATION,
        $t.REFERRAL_HOSPITAL,
        $t.EMERGENCY_HOSPITAL,
        $t.SELF_ISOLATION
      ))
    }
  }

  const row =(no, stat, day, week, month) => {
    return {
      no: no,
      status: stat,
      [$t.DAY]: day,
      [$t.WEEK]: week,
      [$t.MONTH]: month
    }
  }

  let sect = 1, num = 1

  let res = [
    row(`${sect}.`, $t.SECT_SUSPECT)
  ]

  for (i in docs) {

    const v = docs[i]

    const prop = (v._id
      .replace(/[A-Z]/g, v => `_${v}`))
      .toUpperCase()

    let param, subNum

    switch (v._id) {
      case 'confirmed':
        header($t.SECT_CONFIRMED); break;
      case 'closeContact':
        header($t.SECT_DECEASE); break;
      case 'deceaseConfirmed':
        header($t.SECT_DECEASE); break;
      case 'pcrSwab':
        header($t.SECT_PCR); break;
      case 'rapidTest':
        header($t.SECT_SEROLOGY); break;
      case 'suspectProbableIsolation':
        header($t.SELF_ISOLATION, true)
    }

    subNum = `${sect}.${num}`

    param = [
      subNum,
      $t[prop],
    ]

    if (v.hasOwnProperty('aDay')) {
      param = [
        ...param,
        v.aDay,
        v.aWeek,
        v.aMonth
      ]
    } else {
      param = [
        ...param,
        v.referralHospital,
        v.emergencyHospital,
        v.selfIsolation
      ]
    }

    res.push(row(...param))

    num++

  }

  return res
}

module.exports = {
    addFields,
    transformedFields,
    transformedXlsFor
}
