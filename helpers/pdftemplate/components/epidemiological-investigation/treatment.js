
const moment = require('moment')
const render = (data) => {

  const hospitalName = data.last_history.current_location_type === 'RS'
    ? data.last_history.current_location_address
    : ''

  return [
    {
      colSpan: 4,
      table: {  
        widths: [112, 135, 170, 75],
        body: [
          [
            { text: 'Bila Ya,', border: [] },
            { text: 'Nama RS terakhir', border: [] },
            { colspan: 2, text: `: ${hospitalName || '-' }`, border: [] },
            { text: '', border: [] },
          ],
          [
            { text: '', border: [] },
            { text: 'Tanggal masuk RS terakhir', border: [] },
            { text: ': .....', border: [] },
            { text: '', border: [] },
          ],
          [
            { text: '', border: [] },
            { text: 'Ruang rawat', border: [] },
            { text: ': .....', border: [] },
            { text: '', border: [] },
          ],
          [
            { text: '', border: [] },
            { text: 'Tindakan perawatan', border: [] },
            { text: '- dirawat di ICU', border: [] },
            { text: `: [  ] Ya   [  ] Tdk`, border: [] },
          ],
          [
            { text: '', border: [] },
            { text: '', border: [] },
            { text: '- Inkubasi', border: [] },
            { text: `: [  ] Ya   [  ] Tdk`, border: [] },
          ],
          [
            { text: '', border: [] },
            { text: '', border: [] },
            { text: '- Penggunaan EMCO ***)', border: [] },
            { text: `: [  ] Ya   [  ] Tdk`, border: [] },
          ]
        ],
      },
      layout: {
        paddingLeft: (i, node) => 0,
        paddingTop: (i, node) => -0.2,
        paddingBottom: (i, node) => 0
      }
      // 
    },{},{},{}
  ]
}

module.exports = {
  render
}