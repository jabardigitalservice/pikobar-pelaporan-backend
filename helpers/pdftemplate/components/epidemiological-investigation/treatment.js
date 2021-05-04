const sameTd = (textValue) => {
  return [
    { text: '', border: [] },
    { text: textValue, border: [] },
    { text: ': .....', border: [] },
    { text: '', border: [] },
  ]
}

const sameTdYesOrNo = (textValue) => {
  return [
    { text: '', border: [] },
    { text: '', border: [] },
    { text: textValue, border: [] },
    { text: `: [  ] Ya   [  ] Tdk`, border: [] },
  ]
}

const render = (data) => {
  const hospitalName = data.last_history.current_location_type === 'RS'
    ? data.last_history.current_location_address
    : ''

  return [{
      colSpan: 4,
      table: {
        widths: [112, 135, 170, 75],
        body: [
          [{ text: 'Bila Ya,', border: [] }, { text: 'Nama RS terakhir', border: [] },
            { colspan: 2, text: `: ${hospitalName || '-' }`, border: [] },
            { text: '', border: [] },
          ],sameTd('Tanggal masuk RS terakhir'),sameTd('Ruang rawat'),
          [{ text: '', border: [] }, { text: 'Tindakan perawatan', border: [] },
            { text: '- dirawat di ICU', border: [] }, { text: `: [  ] Ya   [  ] Tdk`, border: [] },
          ],sameTdYesOrNo('- Inkubasi'),sameTdYesOrNo('- Penggunaan EMCO ***)'),
        ],
      },
      layout: {
        paddingLeft: (i, node) => 0, paddingTop: (i, node) => -0.2, paddingBottom: (i, node) => 0
      }
      //
    },{},{},{}
  ]
}

module.exports = {
  render
}