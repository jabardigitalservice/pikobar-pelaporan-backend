const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const CaseTransferSchema = new mongoose.Schema({
    transfer_comment: String,
    transfer_status : { type: String, lowercase: true, required: [true, "can't be blank"]},
    transfer_case_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    transfer_from_unit_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: [true, "can't be blank"]},
    transfer_from_unit_name : { type: String, required: [true, "can't be blank"]},
    transfer_to_unit_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: [true, "can't be blank"]},
    transfer_to_unit_name : { type: String, required: [true, "can't be blank"]},
    transfer_last_history : {type: mongoose.Schema.Types.ObjectId, ref: 'History'},
    is_hospital_case_last_status: { type: Boolean, default: true },
    is_pair_last_status: { type: Boolean, default: true },
    createdBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps : true });

CaseTransferSchema.index( { transfer_from_unit_id: 1 } )
CaseTransferSchema.index( { transfer_to_unit_id: 1 } )
CaseTransferSchema.index( { transfer_status: 1 } )

CaseTransferSchema.plugin(aggregatePaginate);

CaseTransferSchema.methods.toJSONFor = function () {
    const lastHistory = this.transfer_last_history
    return {
        transfer_comment: this.transfer_comment,
        transfer_status : this.transfer_status,
        transfer_case_id: this.transfer_case_id,
        transfer_from_unit_id: this.transfer_from_unit_id,
        transfer_from_unit_name: this.transfer_from_unit_name,
        transfer_to_unit_id: this.transfer_to_unit_id,
        transfer_to_unit_name: this.transfer_to_unit_name,
        transfer_last_history: lastHistory ? lastHistory.JSONCaseTransfer() : null,
        is_hospital_case_last_status: this.is_hospital_case_last_status,
        is_pair_last_status: this.is_pair_last_status,
        createdBy: this.createdBy,
        createdAt : this.createdAt
    }
}

module.exports = mongoose.model('CaseTransfer', CaseTransferSchema)
