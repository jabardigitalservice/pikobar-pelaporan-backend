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
    CONF: 'CONFIRMATION',
    CLOSE_ID: 'Kontak Erat',
    SUS_ID: 'Suspek',
    PROB_ID: 'Probable',
    CONF_ID: 'Konfirmasi'
  },
  INCOME:{
    NO_INCONME: 'Tidak ber penghasilan',
    SMALLER: '< 1juta',
    ONE_TO3: '1 s/d 3 juta',
    THREET_O5: '3 s/d 5 juta',
    GREATHER_5: '> 5juta'
  },
  PATIENT_STATUS: {
    NEGATIVE: 'Negatif',
    DONE: 'Selesai Isolasi/Sembuh',
    DEAD: 'Meninggal',
    DISCARDED: 'Discarded',
    SICK: 'Masih Sakit',
    QUARANTINED: 'Masih Dikarantina'
  },
  WHERE_GLOBAL: {
    delete_status: { $ne: 'deleted' },
    verified_status: 'verified',
    is_west_java: true,
  },
  GENDER: {
    MALE: 'L',
    FEMALE: 'P',
    M: 'male',
    F: 'female',
    ID_L: 'Laki-Laki',
    ID_P: 'Perempuan'
  },
  PYSICHAL: {
    SEDENTER: 'Sedenter',
    SMALLER_150MINUTE: 'Latihan fisik < 150 menit',
    GREATHER_150MINUTE: 'Latihan fisik > 150 menit'
  },
  ANSWER: {
    YES: 'Yes',
    NO: 'No',
    YA: 'Ya',
    TIDAK: 'Tidak',
    TIDAK_TAHU: 'Tidak Tahu'
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
  },
  RS: {
    REFERRAL: 'RS RUJUKAN',
    NON_REFERRAL: 'RS NON RUJUKAN'
  },
  DAILY_REPORT: {
    DAY: 'Hari ini',
    WEEK: '1 minggu terakhir',
    MONTH: '1 bulan terakhir',
    REFERRAL_HOSPITAL: 'RS Rujukan',
    EMERGENCY_HOSPITAL: 'RS Darurat',
    SELF_ISOLATION: 'Isolasi / Karantina Mandiri',
    SECT_SUSPECT: 'DATA KASUS SUSPEK',
    SECT_CONFIRMED: 'DATA KASUS KONFIRMASI',
    SECT_CONTACT: 'DATA PEMANTAUAN KONTAK ERAT',
    SECT_DECEASE: 'DATA KASUS MENINGGAL',
    SECT_PCR: 'PEMERIKSAAN RT-PCR',
    SECT_SEROLOGY: 'SURVEIILANS SEROLOGI',
    SECT_ISOLATION: 'ISOLASI/KARANTINA HARI INI',
    CLASSIFICATION: 'KLASIFIKASI',
    SUSPECT: 'Jumlah kasus suspek',
    PROBABLE: 'Jumlah kasus probable',
    SUSPECT_ISOLATED: 'Jumlah kasus suspek diisolasi',
    SUSPECT_DISCARDED: 'Jumlah kasus suspek discarded',
    CONFIRMED: 'Jumlah kasus konfrmasi',
    CONFIRMED_SYMPTOMATIC: 'Jumlah kasus konfirmasi bergejala',
    CONFIRMED_ASYMPTOMATIC: 'Jumlah kasus konfirmasi tanpa bergejala',
    CONFIRMED_TRAVEL: 'Jumlah kasus konfirmasi perjalanan(impor)',
    CONFIRMED_NO_TRAVEL: 'Jumlah kasus konfirmasi tidak ada riwayat perjalanan atau kontak erat	',
    CONFIRMED_RECOVERED: 'Selesai isolasi kasus konfirmasi hari ini',
    CLOSE_CONTACT: 'Jumlah kasus konfirmasi dilakukan pelacakan kontak erat',
    CLOSE_CONTACT_NEW: 'Jumlah kontak erat baru',
    CLOSE_CONTACT_SUSPECT: 'Jumlah kontak erat menjadi kasus suspek',
    CLOSE_CONTACT_CONFIRMED: 'Jumlah kontak erat menjadi kasus konfirmasi',
    CLOSE_CONTACT_DISCARDED: 'Jumlah kontak erat discarded',
    DECEASE_CONFIRMED: 'Meninggal RT-PCR(+)',
    DECEASE_PROBABLE: 'Meninggal Probabel',
    PCR_SWAB: 'Jumlah kasus diambil spesimen/swab',
    RAPID_TEST: 'Jumlah rapid test',
    RAPID_TEST_REACTIVE: 'Jumlah rapid test reaktif',
    PCR: 'Jumlah reaktif periksa RTPCR',
    PCR_POSITIVE: 'Jumlah reaktif dengan RTPCR(+)',
    SUSPECT_PROBABLE_ISOLATION: 'Jumlah kasus suspek + kasus probabel',
    CONFIRMED_ISOLATION: 'Jumlah kasus konfirmasi',
    CLOSE_CONTACT_ISOLATION: 'Jumlah kontak erat sedang dipantau'
  }
}