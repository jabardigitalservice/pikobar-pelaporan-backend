const moment = require('moment')
const { CRITERIA } = require('../../../constant')

const isTrue = (data, value) => data[value] ? '√' : '  '
const isFalse = (data, value) =>  !data[value] ? '√' : '  '
const formattedDate = d => d ? moment(d).format('YYYY/MM/DD') : '-'
const handleEmpty = v => v || '-'
const objEmptyContactHistory = [
  { alignment: 'center', text: '- Tidak ada riwayat -', colSpan: 5 },{},{},{},{}
]
const emptyHistory = [{ alignment: 'center', text: '- Tidak ada riwayat -', colSpan: 4 },{},{},{}]

const objectTravelPlaces = (records, exception) => {
  const res = []

  for (i in records) {
    const rec = records[i]

    if (rec.travelling_type === exception) continue

    res.push([
        { alignment: 'center', text: handleEmpty(rec.travelling_visited) },
        { alignment: 'center', text: handleEmpty(rec.travelling_city) },
        { alignment: 'center', text: formattedDate(rec.travelling_date) },
        { alignment: 'center', text: formattedDate(rec.travelling_arrive) },
    ])
  }

  return res
}
const buildTravelPlaces = (data, place, type) => {
  let exception
  switch (type) {
    case 'domestic': exception = 'Dari Luar Kota'; break;
    default: exception = 'Dari Luar Negeri';
  }

  const records = data[place] || []
  const res = objectTravelPlaces(records, exception)
  if (!res.length) {
    res.push(emptyHistory)
  }

  return res
}

const objectResidence = (data) => {
  const res = []

  const records = data.visited_local_area || []

  for (i in records) {
    const rec = records[i]
    res.push([
        { alignment: 'center', colSpan: 2, text: handleEmpty(rec.visited_local_area_province) },{},
        { alignment: 'center', colSpan: 2, text: handleEmpty(rec.visited_local_area_city) },{}
    ])
  }

  return res
}
const buildResidences = (data) => {
  const res = objectResidence (data)
  if (!res.length) {
    res.push(emptyHistory)
  }

  return res
}

const travelType = (data, type) => {
  let res = false
  let records = data
  if (!records) return false

  records = records.travelling_history
  if (!records || !records.length) return false

  switch (type) {
    case 'INTL': type = 'Dari Luar Negeri'; break;
    default: type = 'Dari Luar Kota';
  }

  records.forEach(v => { if (v.travelling_type === type) { res = true } })
  return res
}

const suspectContact = (data, criterias) => {
  let res = false
  let records = data
  if (!records) return false

  records = records.closeContacts
  if (!records || !records.length) return false

  records.forEach(v => { if (criterias.includes(v.status)) { res = true } })

  return res
}

const objectSuspectContact = (records, criterias) => {
  const res = []
  for (i in records) {
    const rec = records[i]
    if (!criterias.includes(rec.status)) continue

    res.push([
        { alignment: 'left', text: handleEmpty(rec.name) },
        { alignment: 'left', text: handleEmpty(rec.address_street) },
        { alignment: 'center', text: handleEmpty(rec.relation) },
        { alignment: 'center', text: formattedDate(rec.first_contact_date) },
        { alignment: 'center', text: formattedDate(rec.last_contact_date) },
    ])
  }

  return res
}

const buildSuspectContact = (data, criterias) => {
  let records = []
  if (data && data.closeContacts) {
    records = data.closeContacts
  }

  const res = objectSuspectContact(records, criterias)

  if (!res.length) res.push(objEmptyContactHistory)

  return res
}

const compTravelingHis = data => {
  return [
    [
      { text: 'D FAKTOR RIWAYAT PERJALANAN', style: 'tableHeader', colSpan: 4, alignment: 'left' },{},{},{}
    ],
    [
      {
        border: ['black', 'black','','black'], colSpan: 2, alignment: 'left',
        text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat Perjalanan ke luar negeri?',
      },{},
      {
        border: ['', 'black','black','black'], colSpan: 2, alignment: 'left',
        text: `: [${travelType(data, 'INTL') ? '√' : '  ' }] Ya   [${!travelType(data, 'INTL') ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
      },{}
    ],
    [
      { text: 'Negara', style: 'tableColumnSubHeader' },
      { text: 'Kota', style: 'tableColumnSubHeader'  },
      { text: 'Tgl Perjalanan', style: 'tableColumnSubHeader'  },
      { text: 'Tgl tiba di Indonesia', style: 'tableColumnSubHeader'  },
    ],
    ...buildTravelPlaces(data, 'travelling_history', 'international'),
  ]
}

const compTravePlaces = (data) => {
  return [
    [
      {
        border: ['black', 'black','','black'],
        text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat Perjalanan ke area transmisi lokal?',
        colSpan: 2,
        alignment: 'left'
      },
      {},
      {
        border: ['', 'black','black','black'],
        text: `: [${travelType(data, 'DOM') ? '√' : '  ' }] Ya   [${!travelType(data, 'DOM') ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
        colSpan: 2,
        alignment: 'left'
      },{}
    ],
    [
      { text: 'Provinsi', style: 'tableColumnSubHeader' },
      { text: 'Kota', style: 'tableColumnSubHeader'  },
      { text: 'Tgl Perjalanan', style: 'tableColumnSubHeader'  },
      { text: 'Tgl tiba di tempat', style: 'tableColumnSubHeader'  },
    ],
    ...buildTravelPlaces(data, 'travelling_history', 'domestic'),
  ]
}

const compLocalTransmission = data => {
  return [
    [
      {
        border: ['black', 'black','','black'],
        text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat tinggal ke area transmisi lokal?',
        colSpan: 2,
        alignment: 'left'
      },
      {},
      {
        border: ['', 'black','black','black'],
        text: `: [${isTrue(data, 'visited_local_area_before_sick_14_days')}] Ya   [${isFalse(data, 'visited_local_area_before_sick_14_days')}] Tdk  [  ] Tdk Tahu`,
        colSpan: 2,
        alignment: 'left'
      },{}
    ],
    [
      { text: 'Provinsi', colSpan: 2, style: 'tableColumnSubHeader' },
      {},
      { text: 'Kota', colSpan: 2, style: 'tableColumnSubHeader'  },
      {},
    ],
    ...buildResidences(data)
  ]
}

const compSuspectContact = data => {
  return [
    [
      {
        border: ['black', 'black','','black'],
        text: 'Dalam 14 hari sebelum sakit, apakah memiliki kontak dengan kasus suspek/probable COVID-19 ?',
        colSpan: 2,
        alignment: 'left'
      },{},
      {
        border: ['', 'black','black','black'],
        text: `: [${suspectContact(data, [CRITERIA.SUS, CRITERIA.PROB]) ? '√' : '  ' }] Ya   [${!suspectContact(data, [CRITERIA.SUS, CRITERIA.PROB]) ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
        colSpan: 3,
        alignment: 'left'
      },{},{}
    ],
    [
      { text: 'Nama', style: 'tableColumnSubHeader' },
      { text: 'Alamat', style: 'tableColumnSubHeader'  },
      { text: 'Hubungan', style: 'tableColumnSubHeader'  },
      { text: 'Tgl Kontak Pertama', style: 'tableColumnSubHeader'  },
      { text: 'Tgl Kontak Terakhir', style: 'tableColumnSubHeader'  },
    ],
    ...buildSuspectContact(data, [CRITERIA.SUS, CRITERIA.PROB]),
  ]
}

const tableHeader = { style: 'tableClinical', color: '#444' }

const render = (data) => {

  return [
    {
      ...tableHeader,
      table: {
        widths: [145, 115, 110, 112],
        headerRows: 1,
        body: [ ...compTravelingHis(data), ...compTravePlaces(data), ...compLocalTransmission(data) ],
      }
    },
    {
      ...tableHeader,
      margin: [0, -15, 0, 0],
      table: {
        widths: [105, 157, 81, 65, 65],
        headerRows: 1,
        body: [ ...compSuspectContact(data) ]
      }
    }
  ]
}

module.exports = { render, objEmptyContactHistory }
