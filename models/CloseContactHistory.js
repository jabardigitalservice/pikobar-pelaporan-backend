const mongoose = require('mongoose')

const REF_CLOSE_CONTACT = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContact',
    required: true
}

const CloseContactHistorySchema = new mongoose.Schema({
    symptoms: { type: Array, default: [] },
    symptoms_date: { type: Date, default: null },
    symptoms_other: { type: String, default: null },
    diseases: { type: Array, default: [] },
    diseases_other: { type: String, default: null },
    vaccination_influenza_vaccine: { type: Boolean, default: false },
    vaccination_influenza_vaccine_date: { type: Date, default: null },
    vaccination_pvc_vaccine: { type: Boolean, default: false },
    vaccination_pvc_vaccine_date: { type: Date, default: null },
    test_nasal_swab: { type: Boolean, default: false },
    test_nasal_swab_date: { type: Date, default: null },
    test_nasal_swab_result: { type: String, default: null },
    test_throat_swab: { type: Boolean, default: false },
    test_throat_swab_date: { type: Date, default: null },
    test_throat_swab_result: { type: String, default: null },
    test_nasopharyngeal_swab: { type: Boolean, default: false },
    test_nasopharyngeal_swab_date: { type: Date, default: null },
    test_nasopharyngeal_swab_result: { type: String, default: null },
    test_orofaringeal_swab: { type: Boolean, default: false },
    test_orofaringeal_swab_date: { type: Date, default: null },
    test_orofaringeal_swab_result: { type: String, default: null },
    test_serum: { type: Boolean, default: false },
    close_contact : REF_CLOSE_CONTACT
}, { timestamps : true })

CloseContactHistorySchema.methods.toJSONFor = function () {
    return {
        symptoms: this.symptoms,
        symptoms_date: this.symptoms_date,
        symptoms_other: this.symptoms_other,
        diseases: this.diseases,
        diseases_other: this.diseases_other,
        vaccination_influenza_vaccine: this.vaccination_influenza_vaccine,
        vaccination_influenza_vaccine_date: this.vaccination_influenza_vaccine_date,
        vaccination_pvc_vaccine: this.vaccination_pvc_vaccine,
        vaccination_pvc_vaccine_date: this.vaccination_pvc_vaccine_date,
        test_nasal_swab: this.test_nasal_swab,
        test_nasal_swab_date: this.test_nasal_swab_date,
        test_nasal_swab_result: this.test_nasal_swab_result,
        test_throat_swab: this.test_throat_swab,
        test_throat_swab_date: this.test_throat_swab_date,
        test_throat_swab_result: this.test_throat_swab_result,
        test_nasopharyngeal_swab: this.test_nasopharyngeal_swab,
        test_nasopharyngeal_swab_date: this.test_nasopharyngeal_swab_date,
        test_nasopharyngeal_swab_result: this.test_nasopharyngeal_swab_result,
        test_orofaringeal_swab: this.test_orofaringeal_swab,
        test_orofaringeal_swab_date: this.test_orofaringeal_swab_date,
        test_orofaringeal_swab_result: this.test_orofaringeal_swab_result,
        test_serum: this.test_serum
    }
}

module.exports = mongoose.model(
    'CloseContactHistory',
    CloseContactHistorySchema)
