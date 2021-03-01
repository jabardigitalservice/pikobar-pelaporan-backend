const components = {
  diseases: require('./diseases'),
}

const render = (data) => {
  
  return [
    {
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [151, 170, 170],
        headerRows: 1,
        body: [
          [
            {
              text: 'F. CATATAN PASIEN',
              style: 'tableHeader',
              colSpan: 3,
              alignment: 'left'
            },{},{}
          ],
          [
            { text: 'NIK (KTP) pasien' },
            { text: `${data.nik || data.note_nik || '-'}`, colSpan: 2 },
            {}
          ],
          [
            { text: 'Lokasi rumah pasien', rowSpan: 2 },
            { text: 'Latitude' },
            { text: 'Longitude' },
          ],
          [
            '',
            { text: '-' },
            { text: '-' },
          ],
        ],
      }
    },
  ]
}

module.exports = {
  render
}