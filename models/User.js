const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const mongoosePaginate = require('mongoose-paginate-v2');
const { date } = require('joi');

const UserSchema = new mongoose.Schema({
  fullname: String,
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {
    type: String, lowercase: true, unique: true, required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'], index: true,
  },
  role: { type: String, lowercase: true, required: [true, "can't be blank"]},
  code_district_city: { type: String, default: null},
  name_district_city: { type: String, default: null},
  phone_number: {type:String,default: null},
  address_street: {type:String,default: null},
  address_village_code: { type: String, default: null},
  address_village_name: { type: String, default: null},
  // kecamatan
  address_subdistrict_code: { type: String, default: null},
  address_subdistrict_name: { type: String , default: null},
  address_province_code: { type: String, default:32},
  address_province_name: { type: String, default:"Jawa Barat"},
  hash: String,
  salt: String,
  unit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' ,default:null},
  delete_status: { type: String, default:null},
  deletedAt: { type: Date, default:null},
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,default:null},
  last_login: {type: Date}
}, {timestamps: true})

UserSchema.index( { role: 1 } )
UserSchema.index( { unit_id: 1 } )

UserSchema.plugin(uniqueValidator, {
  message: 'sudah ada di basisdata'
});
UserSchema.plugin(mongoosePaginate);
UserSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
} ;
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}
UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate());
  exp.setMinutes(today.getMinutes() + 900); // set expires to 8 work hours

  return jwt.sign({
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },config.auth.secret, { algorithm: config.auth.algorithm });
};

UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    fullname: this.fullname,
    username: this.username,
    email: this.email,
    role: this.role,
    code_district_city: this.code_district_city,
    name_district_city: this.name_district_city,
    address_subdistrict_name: this.address_subdistrict_name,
    address_subdistrict_code: this.address_subdistrict_code,
    address_village_name: this.address_village_name,
    address_village_code: this.address_village_code,
    address_street: this.address_street,
    phone_number: this.phone_number,
    unit_id : this.unit_id,
    token: this.generateJWT(),
    last_login: this.last_login
  }
}

UserSchema.methods.toJSONFor = function () {
  return {
    id: this._id,
    fullname: this.fullname,
    username: this.username,
    email: this.email,
    role: this.role,
    code_district_city: this.code_district_city,
    name_district_city: this.name_district_city,
    phone_number: this.phone_number,
    address_street: this.address_street,
    address_village_name: this.address_village_name,
    address_subdistrict_name: this.address_subdistrict_name,
    unit_id : this.unit_id,
    last_login: this.last_login
  }
}

UserSchema.methods.JSONCase = function () {
  return {
    _id: this._id,
    username: this.username,
    fullname: this.fullname,
    code_district_city: this.code_district_city,
    name_district_city: this.name_district_city,
  }
}

UserSchema.post('findOneAndUpdate', function(error, doc, next) {
  const { MONGO } = require('../helpers/constant')
  if (error.name === 'MongoError' && error.code === MONGO.DUPLICATE_CODE_ERR) {
    const email = error.keyValue.email
    next(new Error(`Email ${email} telah digunakan, silahkan ubah alamat email anda!`))
  } else {
    next(error)
  }
})

module.exports = mongoose.model('User', UserSchema)
