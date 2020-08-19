module.exports = {
  VERIFIED_STATUS: {
    PENDING: 'pending',
    VERIFIED: 'verified',
  },
  ROLE: {
    ADMIN: 'superadmin',
    PROVINCE: 'dinkesprov',
    KOTAKAB: 'dinkeskota',
    FASKES: 'faskes',
  },
  CASE: {
    CODE: 'covid-',
    PRE: 'precovid-'
  },
  CRITERIA:{
    CLOSE: 'CLOSECONTACT',
    SUS: 'SUSPECT',
    PROB: 'PROBABLE',
    CONF: 'CONFIRMATION'
  },
  PATIENT_STATUS: {
    NEGATIVE: 'Negatif',
    DONE: 'Selesai Isolasi/Sembuh',
    DEAD: 'Meninggal',
    DISCARDED: 'Discarded',
    SICK: 'Masih Sakit',
    QUARANTINED: 'Masih Dikarantina'
  },
  GENDER: {
    MALE: 'L',
    FEMALE: 'P',
    M: 'male',
    F: 'female',
    INDO_L: 'Laki-Laki',
    INDO_P: 'Perempuan'
  },
  DEFAULT_PROVINCE: {
    CODE: '32',
    NAME: 'JAWA BARAT'
  },
  REF: {
    CLOSE_CONTACT: {
      TYPES: {
        OTHER: 1,
        HOME: 2,
        OFFICER: 3
      },
      PLACES: {
        OTHER: 1,
        HOME: 2,
        WORK: 3,
        TOUR: 4,
        MEDICAL: 5
      }
    }
  }
}