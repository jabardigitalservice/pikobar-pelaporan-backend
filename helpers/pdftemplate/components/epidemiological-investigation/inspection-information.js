const moment = require('moment')

const formattedDate = (d) => {
  return d ? moment(d).format('YYYY/MM/DD') : '-'
}

let inspects = {}
const groupByType = (data) => {
  const records = data.inspection_support || []

  records.forEach(x => {
    const type = x.specimens_type.toLowerCase()
    if (!inspects[type]) {
      inspects[type] = []
    }
    inspects[type].push(x)
  })
}

const buildRow = (row, label, prop) => {
  let inspectOne = {}
  let inspectTwo = {}

  prop = prop.toLowerCase()

  if (inspects[prop] && inspects[prop][0]){
    inspectOne = inspects[prop][0]
  }

  if (inspects[prop] && inspects[prop][1]){
    inspectTwo = inspects[prop][1]
  }

  return [
    { text: `${row}. ` },
    { text: `${label}` },
    { text: formattedDate(inspectOne.inspection_date) },
    { text: `${inspectOne.inspection_location || '-'}` },
    { text: `${inspectOne.inspection_result || '-'}` },
    { text: formattedDate(inspectTwo.inspection_date) },
    { text: `${inspectTwo.inspection_location || '-'}` },
    { text: `${inspectTwo.inspection_result || '-'}` },
  ]
}

const render = (data) => {
  groupByType(data)
  return [
    {
      pageBreak: 'before',
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [13, 70, 63, 78, 40, 63, 78, 40],
        headerRows: 1,
        body: [
          [
            {
              text: 'C INFORMASI PEMERIKSAAN PENUNJANG',
              style: 'tableHeader',
              colSpan: 8,
              alignment: 'left'
            },{},{},{},{},{},{},{}
          ],
          [
            { text: 'No', style: 'tableColumnSubHeader' },
            { text: 'Jenis Pemeriksaan/Spesimen', style: 'tableColumnSubHeader' },
            { text: 'Pengambilan Spesimen 1', style: 'tableColumnSubHeader', colSpan: 3  },{},{},
            { text: 'Pengambilan Spesimen 2', style: 'tableColumnSubHeader', colSpan: 3  },{},{},
          ],
          [
            { text: '', style: 'tableColumnSubHeader' },
            { text: '', style: 'tableColumnSubHeader'  },
            { text: 'Tanggal Pengambilan', style: 'tableColumnSubHeader'  },
            { text: 'Tempat Pemeriksaan', style: 'tableColumnSubHeader'  },
            { text: 'Hasil', style: 'tableColumnSubHeader'  },
            { text: 'Tanggal Pengambilan', style: 'tableColumnSubHeader'  },
            { text: 'Tempat Pemeriksaan', style: 'tableColumnSubHeader'  },
            { text: 'Hasil', style: 'tableColumnSubHeader'  }
          ],
          [
            {
              text: 'Laboratorium konfirmasi',
              bold: true,
              colSpan: 8,
              alignment: 'left'
            },{},{},{},{},{},{},{}
          ],
          buildRow('1', 'Nasopharyngeal (NP) Swab', 'Swab Nasofaring'),
          buildRow('2', 'Oropharyngeal (NP) Swab', 'Swab Orofaring'),
          buildRow('3', 'Sputum', 'Sputum'),
          buildRow('4', 'Serum', 'Serum'),
          [
            {
              text: 'Pemeriksaan lain',
              bold: true,
              colSpan: 8,
              alignment: 'left'
            },{},{},{},{},{},{},{}
          ],
          buildRow('1', 'Darah', 'Darah'),
          buildRow('2', 'Serum', 'Serum'),
          buildRow('3', 'Lain, Sebutkan\n.', 'Lainnya'),
        ],
      }
    },
  ]
}

module.exports = {
  render
}