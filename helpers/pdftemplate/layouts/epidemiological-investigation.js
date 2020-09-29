const moment = require('moment')
const layout = {
    header: [
        {
            text: 'Lampiran 6. Formulir Penyelidikan Epidemiologi Coronavirus Disease (COVID-19)',
            style: 'header'
        }
    ],
    subheader: (data) => {
      return {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [112, 170, 100, 100],
          headerRows: 1,
          body: [
            [
              {
                text: 'Nama Fasyankes',
                style: 'tableHeader'
              },
              {
                text: `: ${data.fasyankes_name || '-'}`,
                style: 'tableHeader'
              },
              {
                text: 'Tgl Wawancara',
                style: 'tableHeader'
              },
              {
                text: `: ${data.interview_date ? moment(data.interview_date).format('YYYY/MM/DD') : '-' }`,
                style: 'tableHeader'
              }
            ],
            [
              {
                text: 'Tempat Tugas',
                style: 'tableHeader'
              },
              {
                text: `: ${data.fasyankes_name || '-'}`,
                style: 'tableHeader'
              },
              {
                text: 'HP Pewawancara',
                style: 'tableHeader'
              },
              {
                text: `${data.interviewers_phone_number || '-'}`,
                style: 'tableHeader'
              }
            ],
            [
              {
                text: 'Nama Pewawancara',
                style: 'tableHeader'
              },
              {
                text: `: ${data.interviewers_name || '-'}`,
                style: 'tableHeader',
                colSpan: 3
              },
              {},
              {}
            ],
          ]
        }
      }
    },
    footnoteSectionOne: [
      {
        margin: [10, -5, 0, 0],
        text: '*) Diisi sesuai dengan defenisi operasional (lihat pedoman)'
      },
      {
        style: 'footnote',
        text: '**) Nomor ID (pasien) : (kode kota/kab permendagri <3 digit nomor urut)'
      },
      {
        style: 'footnote',
        text: '***) Oksigenasi membran ekstrakorporea'
      },
    ],
    footer: [
      {
        style: 'footer',
        margin: [10, 10, 0, 0],
        bold: true,
        text: 'KETERANGAN'
      },
      {
        style: 'footer',
        margin: [15, 0, 0, 0],
        text: '*) Diisi sesuai dengan defenisi operasional (lihat pedoman)'
      },
      {
        style: 'footer',
        margin: [15, 0, 0, 0],
        text: '**) Oksigenasi membran ekstrakorporea'
      },
      {
        style: 'footer',
        margin: [15, 0, 0, 0],
        text: '***) Diisi jika kriteria suspek, konfirmasi, dan probabel.'
      },
      {
        style: 'footer',
        margin: [10, 10, 0, 0],
        bold: true,
        text: 'INSTRUKSI'
      },
      {
        style: 'footer',
        margin: [15, 0, 0, 0],
        text: '- Semua pernyataan dalam formulir ini harus diisi, tidak boleh ada pertanyaan apapun yang kosong/tidak terjawab'
      },
      {
        style: 'footer',
        margin: [15, 0, 0, 0],
        text: '- Untuk pertanyaan dengan pilihan jawaban "Ya/Tidak/Tidak Tahu", pilih salah satu jawaban saja'
      },
    ],
    styles: {
        footnote: {
          fontSize: 9,
          margin: [10, 0, 0, 0]
        },
        footer: {
          fontSize: 9
        },
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          margin: [0, 10, 0, 0],
        },
        tableExample: {
          margin: [0, 5, 0, 0]
        },
        tableClinical: {
          margin: [0, 0, 0, 15]
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: 'blue',
          fillOpacity: 0.3
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#92d050'
        },
        tableSubHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
        tableColumnSubHeader: {
          alignment: 'center',
          bold: true,
          fontSize: 10,
          color: 'black',
          fillColor: '#92d050'
        }
      },
      defaultStyle: {
        fontSize: 10
        // alignment: 'justify'
      }
}

module.exports = layout