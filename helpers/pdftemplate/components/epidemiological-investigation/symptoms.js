
const moment = require('moment')

const isTrue = (symptoms, value) => {
  return symptoms.includes(value) ? '√' : '  '
}

const isFalse = (symptoms, value) => {
  return !symptoms.includes(value) ? '√' : '  '
}

const isFever = (symptoms) => {
  return symptoms.includes('suhu tubuh >= 38 °c')
}

const tdBody = (symptoms, textHeader, textBorder) => {
  const lowerText = textHeader.toLowerCase()
  const lowerTextBorder = textBorder.toLowerCase().replace('/',' atau ')
  return [
    { text: textHeader, borderColor: ['black', 'white', 'black', 'white']  },
    { text: `: [${isTrue(symptoms, lowerText)}] Ya   [${isFalse(symptoms, lowerText)}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'black', 'black', 'white'] },
    { text: textBorder, borderColor: ['black', 'white', 'black', 'white'] },
    { text: `: [${isTrue(symptoms, lowerTextBorder)}] Ya   [${isFalse(symptoms, lowerTextBorder)}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
  ]
}

const render = (data) => {
  const symptoms = data.last_history.diagnosis.map(s => s.toLowerCase())
  return [
    [
      { text: `Tanggal pertama kali timbul gejala (onset)`, /* border: [] */ },
      { text: `: ${moment(data.last_history.first_symptom_date).format('YYYY/MM/DD')}`, /* border: [] */ },
      { text: ``, /* border: [] */ },
      { text: ``, /* border: [] */ },
    ],
    [
      { text: `Demam`, borderColor: ['black', 'black', 'white', 'black'] },
      { text: `: ${isFever(symptoms) ? '≥38' : '___' } °C [${isFever(symptoms) ? '√' : '  '}] Riwayat Demam `, /* border: [] */ },
      { text: `Lemah (malaise)`, borderColor: ['black', 'white', 'black', 'white'] },
      { text: `: [${isTrue(symptoms, 'lemah (malaise)')}] Ya   [${isFalse(symptoms, 'lemah (malaise)')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'white'] },
    ],
    tdBody(symptoms, 'Batuk', 'Nyeri Otot'),
    tdBody(symptoms, 'Pilek', 'Mual/muntah'),
    tdBody(symptoms, 'Sakit tenggorokan', 'Nyeri abdomen'),
    tdBody(symptoms, 'Sesak napas', 'Diare'),
    [
      { text: `Sakit Kepala`, borderColor: ['black', 'white', 'black', 'black'] },
      { text: `: [${isTrue(symptoms, 'sakit kepala')}] Ya   [${isFalse(symptoms, 'sakit kepala')}] Tdk  [  ] Tdk tahu `, borderColor: ['black', 'white', 'black', 'black'] },
      { text: `Lainnya (sebutkan)`, borderColor: ['black', 'white', 'black', 'black'] },
      { text: `: ${data.last_history.diagnosis_other || '-' }`, borderColor: ['black', 'white', 'black', 'black'] },
    ]
  ]
}

module.exports = {
  render
}