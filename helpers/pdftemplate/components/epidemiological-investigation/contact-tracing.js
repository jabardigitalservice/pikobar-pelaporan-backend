const moment = require('moment')
const {
  CRITERIA
} = require('../../../constant')
const render = (data) => {

  const isTrue = (value) => {
    return data[value] ? '√' : '  '
  }

  const isFalse = (value) => {
    return !data[value] ? '√' : '  '
  }

  const formattedDate = (d) => {
    return d ? moment(d).format('YYYY/MM/DD') : '-'
  }

  const buildTravelPlaces = (place, type) => {
    let res = []

    const records = data[place] || []

    const exception = type === 'domestic'
      ? 'Dari Luar Negeri'
      : 'Dari Luar Kota'

    for (i in records) {
      const rec = records[i]

      if (rec.travelling_type === exception) continue

      res.push([
          { alignment: 'center', text: rec.travelling_visited || '-' },
          { alignment: 'center', text: rec.travelling_city || '-' },
          { alignment: 'center', text: formattedDate(rec.travelling_date) },
          { alignment: 'center', text: formattedDate(rec.travelling_arrive) },
      ])
    }

    if (!res.length) {
      res.push([
        { alignment: 'center', text: '- Tidak ada riwayat -', colSpan: 4 },{},{},{},
      ])
    }

    return res
  }

  const buildResidences = () => {
    let res = []

    const records = data.visited_local_area || []

    for (i in records) {
      const rec = records[i]
      res.push([
          { alignment: 'center', colSpan: 2, text: rec.visited_local_area_province || '-' },{},
          { alignment: 'center', colSpan: 2, text: rec.visited_local_area_city || '-' },{}
      ])
    }

    if (!res.length) {
      res.push([
        { alignment: 'center', text: '- Tidak ada riwayat -', colSpan: 4 },{},{},{},
      ])
    }

    return res
  }

  const travelType = (type) => {
    let res = false
    let records = data
    if (!records) {
      return false
    }

    records = records.travelling_history
    if (!records || !records.length) {
      return false
    }

    type = type === 'INTL'
      ? 'Dari Luar Negeri'
      : 'Dari Luar Kota'

    records.forEach(v => {
      if (v.travelling_type === type) {
        res = true
      }
    })

    return res
  }

  const suspectContact = (criterias) => {
    let res = false
    let records = data
    if (!records) {
      return false
    }

    records = records.close_contact_premier
    if (!records || !records.length) {
      return false
    }

    records.forEach(v => {
      if (criterias.includes(v.close_contact_criteria)) {
        res = true
      }
    })

    return res
  }

  const buildSuspectContact = (criterias) => {
    let res = []

    let records = []
    if (data && data.close_contact_premier) {
      records = data.close_contact_premier
    }

    for (i in records) {
      const rec = records[i]
      if (!criterias.includes(rec.close_contact_criteria)) continue

      res.push([
          { alignment: 'left', text: rec.close_contact_name || '-' },
          { alignment: 'left', text: rec.close_contact_address_street || '-' },
          { alignment: 'center', text: rec.close_contact_relation || '-' },
          { alignment: 'center', text: formattedDate(rec.close_contact_first_date) },
          { alignment: 'center', text: formattedDate(rec.close_contact_last_date) },
      ])
    }

    if (!res.length) {
      res.push([
        { alignment: 'center', text: '- Tidak ada riwayat -', colSpan: 5 },{},{},{},{},
      ])
    }

    return res
  }

  return [
    {
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [145, 115, 110, 112],
        headerRows: 1,
        body: [
          [
            {
              text: 'D FAKTOR RIWAYAT PERJALANAN',
              style: 'tableHeader',
              colSpan: 4,
              alignment: 'left'
            },{},{},{}
          ],
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, apakah memiliki riwayat Perjalanan ke luar negeri?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: `: [${travelType('INTL') ? '√' : '  ' }] Ya   [${!travelType('INTL') ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
              colSpan: 2,
              alignment: 'left'
            },{}
          ],
          [
            { text: 'Negara', style: 'tableColumnSubHeader' },
            { text: 'Kota', style: 'tableColumnSubHeader'  },
            { text: 'Tgl Perjalanan', style: 'tableColumnSubHeader'  },
            { text: 'Tgl tiba di Indonesia', style: 'tableColumnSubHeader'  },
          ],
          ...buildTravelPlaces('travelling_history', 'international'),
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
              text: `: [${travelType('DOM') ? '√' : '  ' }] Ya   [${!travelType('DOM') ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
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
          ...buildTravelPlaces('travelling_history', 'domestic'),
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
              text: `: [${isTrue('visited_local_area_before_sick_14_days')}] Ya   [${isFalse('visited_local_area_before_sick_14_days')}] Tdk  [  ] Tdk Tahu`,
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
          ...buildResidences()
        ],
      }
    },
    {
      margin: [0, -15, 0, 0],
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [105, 157, 81, 65, 65],
        headerRows: 1,
        body: [
          [
            {
              border: ['black', 'black','','black'],
              text: 'Dalam 14 hari sebelum sakit, apakah memiliki kontak dengan kasus suspek/probable COVID-19 ?',
              colSpan: 2,
              alignment: 'left'
            },
            {},
            {
              border: ['', 'black','black','black'],
              text: '',
              text: `: [${suspectContact([CRITERIA.SUS, CRITERIA.PROB]) ? '√' : '  ' }] Ya   [${!suspectContact([CRITERIA.SUS, CRITERIA.PROB]) ? '√' : '  ' }] Tdk  [  ] Tdk Tahu`,
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
          ...buildSuspectContact([CRITERIA.SUS, CRITERIA.PROB]),
        ]
      }
    }
  ]
}

module.exports = {
  render
}