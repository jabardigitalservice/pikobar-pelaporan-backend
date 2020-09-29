const render = (data) => {

  const history = data.last_history
  const isTrue = (key, n) => {
    return history[key] == n ? '√' : '  '
  }

  return [
    {
      colSpan: 4,
      table: {
        widths: [250, 250],
        body: [
          [
            { text: 'Pneumonia (Klinis atau Radiologi)', border: [] },
            { text: `: [${isTrue('diagnosis_pneumonia', 1)}] Ya   [${isTrue('diagnosis_pneumonia', 2)}] Tdk  [${isTrue('diagnosis_pneumonia', 3)}] Tdk tahu `, border: [] },
          ],
          [
            { text: 'ARDS (Acute Respiratory Distress Syndrome)', border: [] },
            { text: `: [${isTrue('diagnosis_ards', 1)}] Ya   [${isTrue('diagnosis_ards', 2)}] Tdk  [${isTrue('diagnosis_ards', 3)}] Tdk tahu `, border: [] },
          ],
          [
            { text: `Diagnosis lainnya, Sebutkan!`, margin: [0, 0, 0, 5], border: [] },
            { text: `: ${history.other_diagnosis || '-' } `, margin: [0, 0, 0, 5], border: [] },
          ],
          [
            { text: 'Apakah pasien mempunyai diagnosis atau', margin: [0, 5, 0, 0], border: ['', 'black', '', ''] },
            { text: `: [${isTrue('is_other_diagnosisr_respiratory_disease', true)}] Ya   [${isTrue('is_other_diagnosisr_respiratory_disease', false)}] Tdk  [  ] Tdk tahu `, margin: [0, 5, 0, 0], border: ['', 'black', '', ''] },
          ],
          [
            { text: 'etiologi lain untuk penyakit pernafasannya?', border: [] },
            { text: `: ${history.other_diagnosisr_respiratory_disease || '-' } `, border: [] },
          ],
          [
            { text: `Jika Ya, Sebutkan!`, border: [] },
            { text: ':', border: [] },
          ],
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