const moment = require('moment')
const { transformAge } = require('../../helper')
const { CRITERIA } = require('../../../constant')
const render = (data) => {
  const age = transformAge(data)['age']
  const ageInMonths = transformAge(data)['ageInMonths']

  return {
      style: 'tableExample',
      color: '#444',
      table: {
        widths: [112, 150, 80, 140],
        headerRows: 1,
        // keepWithHeaderRows: 1,
        body: [
          [
            {
              text: 'A. IDENTITAS PASIEN',
              style: 'tableHeader',
              colSpan: 4,
              alignment: 'left',
            },{},{},
            'Pasien Dalam Pengawasan'
          ],
          [
            {
              text: 'Nama Pasien',
              borderColor: ['black', 'black', 'black', 'black']
            },
            {
              text: `: ${data.name}`,
              borderColor: ['white', 'black', 'black', 'black']
            },
            {
              rowSpan: 3,
              text: 'Kriteria* :',
              borderColor: ['black', 'black', 'white', 'black']
            },
            {
              rowSpan: 3,
              text: `${data.status === CRITERIA.SUS ? '[√]' : '[  ]'} Suspek
                ${data.status === CRITERIA.PROB ? '[√]' : '[  ]'} Kasus Probabel
                ${data.status === CRITERIA.CONF ? '[√]' : '[  ]'} Kasus Konfirmasi
                ${data.status === CRITERIA.CLOSE ? '[√]' : '[  ]'} Kontak Erat`,
            }
          ],
          [
            {
              text: 'Nomor ID',
              borderColor: ['black', 'black', 'black', 'black']
            },
            {
              text: `: ${data.id_case.toUpperCase()}`,
              borderColor: ['white', 'black', 'black', 'black']
            },
            '',''
          ],
          [
            {
              text: 'Nama Orang tua/KK',
              borderColor: ['black', 'black', 'black', 'black']
            },
            {
              text: `: ${data.name_parents || '-' } `,
              borderColor: ['white', 'black', 'black', 'black']
            },
            '',''
          ],
          [
            { text: `Tgl lahir: ${data.birth_date ? moment(data.birth_date).format('YYYY/MM/DD') : '-' }` },
            { text: `Umur: ${age} tahun, ${ageInMonths} bulan` },
            { text: `${data.gender === 'L' ? '[√]' : '[  ]'} Laki-laki
              ${data.gender === 'P' ? '[√]' : '[  ]'} Perempuan` },
            { text: 'Pekerjaan: ' + (data.occupation || '-') },
          ],
          [
            { text: `Alamat Jalan/Blok`, borderColor: ['black', 'black', 'black', 'white']},
            { text: `: ${data.address_street || '-' }`, borderColor: ['white', 'black', 'black', 'white'] },
            { text: `Kecamatan`, borderColor: ['white', 'black', 'black', 'white'] },
            { text: `: ${data.address_subdistrict_name}` },
          ],
          [
            { text: `\t\t\t RT/RW`, borderColor: ['black', 'white', 'black', 'white'] },
            { text: `: ${data.rt || '-'} / ${data.rw || '-'}`, borderColor: ['black', 'white', 'black', 'white'] },
            { text: `Kabupaten/Kota`, borderColor: ['black', 'white', 'black', 'white'] },
            { text: `: ${data.address_district_name}`, borderColor: ['black', 'white', 'black', 'white'] },
          ],
          [
            { text: `\t\t Desa/Kelurahan`, borderColor: ['black', 'white', 'black', 'black'] },
            { text: `: ${data.address_village_name}`, borderColor: ['black', 'white', 'black', 'black'] },
            { text: `Telepon/Hp`, borderColor: ['black', 'white', 'black', 'black'] },
            { text: `: ${data.phone_number || '-' }`, borderColor: ['black', 'white', 'black', 'black'] },
          ],
          [
            { text: `Latitude: ${data.latitude || '-' }`, colSpan: 2 },
            {},
            { text: `Longitude: ${data.longitude || '-' }`, colSpan: 2 },
            {},
          ]
        ],
      },
  }
}

module.exports = {
  render
}