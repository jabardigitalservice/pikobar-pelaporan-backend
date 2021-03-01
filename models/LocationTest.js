const mongoose = require('mongoose')

const LocationTest = new mongoose.Schema({
   IdLocation: String,
   Name: String,
   Address: String,
   Description: String
})


LocationTest.methods.toJSONFor = function () {  
    return {
        // id: this._id,
        slug: this.IdLocation,
        name: this.Name,
        address: this.Address
    }
}


module.exports = mongoose.model('LocationTest', LocationTest)
