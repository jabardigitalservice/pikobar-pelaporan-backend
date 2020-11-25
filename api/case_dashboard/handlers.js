const { requestIfSame } = require('../../helpers/request')
const replyHelper = require('../helpers')
const { ROLE } = require('../../helpers/constant')
const { generateExcell } = require('../../helpers/export')
const { criteriaConvert } = require("../../helpers/custom")

const countSectionTop = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "case_dashboard", "countSectionTop",
      request, reply
    )
  }
}

const countSummary = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "case_dashboard", "countSummary",
      request, reply
    )
  }
}

const countVisualization = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "case_dashboard", "countVisualization",
      request, reply
    )
  }
}

const exportDemographic = (server) => {
  return async (request, reply) => {
    let query = request.query
    const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
    const role = request.auth.credentials.user.role
    const criteria = criteriaConvert(request.query.criteria)
    server.methods.services.case_dashboard.countSummary(
      query,
      request.auth.credentials.user,
      (err, result) => {
        const dataDemographic = mapingDemographic(criteria, result[0].demographic, role)
        const title = `Rekap-Data-Demografis-${criteria.replace(" ","-")}`
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return generateExcell(dataDemographic, title, fullName, reply)
      }
    )
  }
}

const exportCriteria = (server) => {
  return async (request, reply) => {
    const { fullname, role } = request.auth.credentials.user
    const fullName = fullname.replace(/\s/g, '-')
    const titleCriteria = criteriaConvert(request.query.criteria).replace(" ","-")
    server.methods.services.case_dashboard.countSummary(
      request.query,
      request.auth.credentials.user,
      (err, result) => {
        const dataCriteria = mapingCriteria(titleCriteria, result[0].summary, role)
        const title = `Rekap-Data-${titleCriteria}`
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return generateExcell(dataCriteria, title, fullName, reply)
      },
    )
  }
}

const lableHeader = (role) => {
  let labels
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(role)){
    labels = "Kota/Kab"
  }else{
    labels = "Kecamatan/Kelurahan"
  }

  return labels
}

const mapingDemographic = (criteria, result, role) => {
  return result.map(({
      _id, wni, wna, male, female,
      under_five, six_nine, twenty_twenty_nine,thirty_thirty_nine,
      forty_forty_nine, fifty_fifty_nine, sixty_sixty_nine,
      seventy_seventy_nine, greater_eighty
    }) => (
      {
        [lableHeader(role)]: _id, 'Kriteria': criteria, 'WNI': wni, 'WNA': wna,
        'Laki-Laki': male, 'Perempuan': female,
        '<5TH': under_five, '6-9TH': six_nine,
        '20-29TH': twenty_twenty_nine, '30-39TH': thirty_thirty_nine, '40-49TH': forty_forty_nine,
        '50-59TH': fifty_fifty_nine, '60-69TH': sixty_sixty_nine, '70-79TH': seventy_seventy_nine,
        '>80TH': greater_eighty,
      }
  ))
}

const mapingCriteria = (titleCriteria, result, role) => {
  const criteria = titleCriteria.replace("-"," ")
  return result.map(({ _id,
      active, sick_home, sick_hospital, recovered, decease,
    }) => (
      {
        [lableHeader(role)]: _id, 'Kriteria': criteria,
        'Total':active + sick_home + sick_hospital + recovered + decease,
        'Masih Sakit': active, 'Isolasi Mandiri': sick_home,
        'Isolasi Rumah Sakit': sick_hospital, 'Sembuh': recovered,
        'Meninggal': decease,
      }
  ))
}

module.exports = {
  countSectionTop, countSummary,
  countVisualization, exportDemographic, exportCriteria
}