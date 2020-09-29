const mongoose = require('mongoose')

const SpecimenSchema = new mongoose.Schema({
    item: { type: String}
})

SpecimenSchema.methods.toJSONFor = function () {
    return {
        item: this.item,
    }
}

module.exports = mongoose.model('Specimen', SpecimenSchema)