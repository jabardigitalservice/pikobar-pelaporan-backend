const { CRITERIA } = require('../../constant')
const Unit = require('../../../models/Unit')

const refSymptoms = [
  'Suhu tubuh >= 38 °C',
  'Suhu tubuh < 38 °C',
  'Batuk',
  'Pilek',
  'Sakit Tenggorokan',
  'Sakit Kepala',
  'Sesak Napas',
  'Menggigil',
  'Lemah (malaise)',
  'Nyeri Otot',
  'Mual atau muntah',
  'Nyeri Abdomen',
  'Diare'
]

const refDiseases = [
  'Hamil',
  'Diabetes',
  'Penyakit Jantung',
  'Hipertensi',
  'Keganasan',
  'Gangguan Imunologi',
  'Gagal Ginjal Kronis',
  'Gagal Hati Kronis',
  'PPOK',
]

const refApd = [
  'Gown',
  'Masker Bedah',
  'Sarung Tangan',
  'Masker N95 Standar FFP3',
  'FFP3',
  'Kacamata Pelindung Goggle',
  'Tidak Sama Sekali',
]

const refHealthWorkers = [
  { value: 'Dokter', text: 'doker' },
  { value: 'Perawat', text: 'perawat' },
  { value: 'Farmasi', text: 'farmasi' },
  { value: 'Dokter Spesialis Paru', text: 'dokter spesialis paru' },
  { value: 'Dokter Spesialis Lain', text: 'dokter spesialis lain' },
  { value: 'Bidan', text: 'bidan' },
  { value: 'Ahli Gizi', text: 'ahli gizi' },
  { value: 'Tenaga Kesehatan Masyarakat', text: 'tenaga kesehatan masyarakat' },
  { value: 'Lainnya', text: 'lainnya' },
]

const refTravelingType = [
  { value: 'Dari Luar Negeri', text: 'dari luar negeri' },
  { value: 'Dari Luar Kota', text: 'dari luar negeri' },
]

const refPlaceCategories = [
  { value: 'Pasar Modern / Tradisional', text: 'pasar modern / tradisional' },
  { value: 'Pasar Hewan', text: 'pasar hewan' },
  { value: 'Fasilitas Kesehatan', text: 'fasilitas kesehatan' },
  { value: 'Tempat Wisata', text: 'tempat wisata' },
  { value: 'Restoran', text: 'restoran' },
  { value: 'Tempat Publik Lainnya', text: 'tempat publik lainnya' },
]

const refTransmissionType = [
  { value: 1, text: 'kasus impor' },
  { value: 2, text: 'kasus kontak dengan kasus impor' },
  { value: 3, text: 'kasus lokal tanpa diketahui sumber penuralannya' },
  { value: 4, text: 'kasus lokal dengan kaitan epidemiologis' },
]

const refClusterType = [
  { value: 1, text: 'lainnya' },
  { value: 2, text: 'nakes' },
  { value: 3, text: 'pasar/pusat perbelanjaan/toko' },
  { value: 4, text: 'pabrik' },
  { value: 5, text: 'perkantoran' },
  { value: 6, text: 'tempat wisata' },
  { value: 7, text: 'tempat ibadah' },
  { value: 8, text: 'rumah tangga' },
  { value: 9, text: 'rumah makan' },
]

const refIncomes = [
  { value: 0, text: 'tidak berpenghasilan' },
  { value: 1, text: '< 1 juta' },
  { value: 2, text: '1 s/d 3 juta' },
  { value: 3, text: '3 s/d 5 juta' },
  { value: 4, text: '> 5 juta' },
]

const refCriterias = [
  { value: CRITERIA.CLOSE, text: 'kontak erat' },
  { value: CRITERIA.SUS, text: 'suspek' },
  { value: CRITERIA.CONF, text: 'konfirmasi' },
  { value: CRITERIA.PROB, text: 'probable' },
]

const refFinalResults = [
  { value: '0', text: 'negatif' },
  { value: '1', text: 'selesai isolasi/sembuh' },
  { value: '2', text: 'meninggal' },
  { value: '3', text: 'discarded' },
  { value: '4', text: 'masih sakit' },
  { value: '5', text: 'masih dikarantina' },
]

const refActivities = [
  { value: 0, text: 'sedenter' },
  { value: 1, text: '<150 menit per-minggu' },
  { value: 2, text: '>150 menit per-minggu' },
]

const findHospital = async (name) => {
  const hospital = await Unit.findOne({
    unit_type: 'rumahsakit',
    name: new RegExp(name.trim(), 'i')
  }).select('_id')

  if (!hospital) {
    return null
  }

  return hospital._id
}

module.exports = {
  refSymptoms,
  refDiseases,
  refApd,
  refHealthWorkers,
  refTravelingType,
  refPlaceCategories,
  refTransmissionType,
  refClusterType,
  refIncomes,
  refCriterias,
  refFinalResults,
  refActivities,
  findHospital,
}