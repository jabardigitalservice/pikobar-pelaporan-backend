const fs = require('fs')
const PdfPrinter = require('pdfmake')

const generate = (docDefinition, filePath) => {
  return new Promise((resolve, reject) => {
      try {
          const fonts = {
            Roboto: {
              normal: 'static/fonts/Roboto-Regular.ttf',
              bold: 'static/fonts/Roboto-Medium.ttf',
              italics: 'static/fonts/Roboto-Italic.ttf',
              bolditalics: 'static/fonts/Roboto-MediumItalic.ttf'
            }
          }
          const printer = new PdfPrinter(fonts)
          const pdfDoc = printer.createPdfKitDocument(docDefinition)
          const stream = pdfDoc.pipe(fs.createWriteStream(filePath))
          stream.on('finish', function(){
              const pdfFile = fs.readFileSync(filePath)
              fs.unlinkSync(filePath)
              resolve(pdfFile)
          })
          pdfDoc.end();
      } catch (err) {
          console.log(err)
          reject(err)
      }
  })
}

const epidemiologicalInvestigationsForm = (data) => {
  const layout = require('../helpers/pdftemplate/layouts/epidemiological-investigation')
  const components = {
    patientIdentity: require('../helpers/pdftemplate/components/epidemiological-investigation/patient-identity'),
    clinicalInformation: require('../helpers/pdftemplate/components/epidemiological-investigation/clinical-information'),
    inspectionInformation: require('../helpers/pdftemplate/components/epidemiological-investigation/inspection-information'),
    contactTracing: require('./pdftemplate/components/epidemiological-investigation/contact-tracing'),
    contactTracingAdvanced: require('./pdftemplate/components/epidemiological-investigation/contact-tracing-advanced'),
    closeContactList: require('./pdftemplate/components/epidemiological-investigation/close-contact-list'),
    patientNotes: require('./pdftemplate/components/epidemiological-investigation/patient-notes'),
  }
  const docDefinition = {
      content: [
        // layout.header,
        layout.subheader(data),
        components.patientIdentity.render(data),
        components.clinicalInformation.render(data),
        components.inspectionInformation.render(data),
        components.contactTracing.render(data),
        components.contactTracingAdvanced.render(data),
        components.closeContactList.render(data),
        // components.patientNotes.render(data),
        layout.footer,
      ],
      styles: layout.styles,
      defaultStyle: layout.defaultStyle
    }

    return docDefinition
}

module.exports = {
  generate,
  epidemiologicalInvestigationsForm
}