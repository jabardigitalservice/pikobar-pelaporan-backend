const mongoose = require('mongoose')

const CaseVerificationSchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    verified_comment: String,
    verified_status : { type: String, lowercase: true, required: [true, "can't be blank"]},
    verifier : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps : true });

CaseVerificationSchema.methods.toJSONFor = function () {
    return {
        case: this.case,
        verified_comment: this.verified_comment,
        verified_status : this.verified_status,
        verifier: this.verifier ? this.verifier.JSONCase() : null,
        createdAt : this.createdAt
    }
}

module.exports = mongoose.model('CaseVerification', CaseVerificationSchema)
