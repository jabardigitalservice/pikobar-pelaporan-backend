const components = {
  diseases: require('./diseases'),
}

const render = (data) => {

  const buildContactPlaces = (data) => {
    let closeContacts = [], closeContactsDoc = []
    for (i in data.closeContacts) {
      const closeContact = data.closeContacts[i]

      closeContacts.push(closeContact)
      closeContactsDoc.push([
        { text: `${closeContact.name || '-' }` },
        { text: `${closeContact.age || '-' }` },
        { text: `${closeContact.gender || '-' }` },
        { text: `${closeContact.relationship || '-'}` },
        { text: `${closeContact.address_street || '-'}` },
        { text: `${closeContact.phone_number || '-'}` },
        { text: `${closeContact.activity || '-'}` },
      ])
    }

    if (!closeContacts.length) {
      closeContactsDoc.push([
        { alignment: 'center', text: '- Tidak ada kontak erat -', colSpan: 7 },{},{},{},{},{},{},
      ])
    }

    return closeContactsDoc
  }

  return [
    {
      style: 'tableClinical',
      color: '#444',
      table: {
        widths: [85, 25, 17, 60, 75, 70, 123],
        headerRows: 1,
        body: [
          [
            {
              text: 'E. DAFTAR KONTAK ERAT KASUS',
              style: 'tableHeader',
              colSpan: 7,
              alignment: 'left'
            },{},{},{},{},{},{}
          ],
          [
            { text: 'Nama', style: 'tableColumnSubHeader' },
            { text: 'Umur', style: 'tableColumnSubHeader'  },
            { text: 'JK', style: 'tableColumnSubHeader'  },
            { text: 'Hub. dg Kasus', style: 'tableColumnSubHeader'  },
            { text: 'Alamat rumah', style: 'tableColumnSubHeader'  },
            { text: 'No HP/telp yang dapat dihubungi', style: 'tableColumnSubHeader'  },
            { text: 'Aktifitas kontak yang dilakukan', style: 'tableColumnSubHeader'  },
          ],
          ...buildContactPlaces(data)
        ],
      }
    },
  ]
}

module.exports = {
  render
}