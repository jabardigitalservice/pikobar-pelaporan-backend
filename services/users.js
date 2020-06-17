require('../models/User');
require('../models/Unit');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
const Unit = mongoose.model('Unit');
const Check = require('../helpers/rolecheck');
const Helper = require('../helpers/custom');

const listUser = async (user, query, callback) => {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  const sorts = (query.sort == "desc" ? {_id:"desc"} : JSON.parse(query.sort));
  const options = {
    page: query.page,
    limit: query.limit,
    populate: (['unit_id']),
    sort: sorts,
    leanWithId: true,
    customLabels: myCustomLabels,
  };

  let result_search;
  let params = Check.userByRole({}, user);

  if(query.role){
    params.role = query.role;
  }

  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.code_district_city){
      params.code_district_city = query.code_district_city;
    }
  }
  if(query.address_village_code){
    params.address_village_code = query.address_village_code;
  }
  if(query.address_subdistrict_code){
    params.address_subdistrict_code = query.address_subdistrict_code;
  }

  if(query.search){
    var search_params = [
      { username : new RegExp(query.search,"i") },
      { fullname: new RegExp(query.search, "i") },
      { email: new RegExp(query.search, "i") },
      { phone_number: new RegExp(query.search, "i"), },
      { address_street: new RegExp(query.search, "i"), },
      { address_village_name: new RegExp(query.search, "i"), },
    ];
    result_search = User.find(params).or(search_params).where("delete_status").ne("deleted");
  } else {
    result_search = User.find(params).where("delete_status").ne("deleted");
  }

  User.paginate(result_search, options).then(function(results){
    const res = {
      users: results.itemsList.map(users => users.toJSONFor()),
      _meta: results._meta,
    }
    return callback(null, res);
  }).catch(err => callback(err, null));
}

const getUserById = async (id, category, callback) => {
  let result;
  try {
    result = await User.findById(id);
    if(category == 'reset'){
      const salt = crypto.randomBytes(16).toString('hex');
      const params = {
        salt:salt,
        hash:crypto.pbkdf2Sync(`${result.username}890`, salt, 10000, 512, 'sha512').toString('hex'),
        password:Helper.setPwd(`${result.username}890`),
      }
      result = await User.findByIdAndUpdate(id,{ $set: params }, { new: true });
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const getUserByUsername = (username, callback) => {
  User.findOne({ username }, (err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  }).populate('unit_id');
}

const checkUser = async (query, callback) => {
  let check;
  if(query.params){
    const gets = await User.find({ $or:[ 
      {'username':query.params}, {'email':query.params} ]}).then(res => { return res.length });
    check = (gets > 0 ? true : false);
  } else {
    check = {};
  }
  callback(null, check);
}

const getFaskesOfUser = async (user, callback) => {
  if (user.role != 'faskes' || !user.hasOwnProperty('faskes_id')) {
      let err = { message: "This user has no faskes data ascociated with it" }
      callback(err, null)
  } else {
      const res = await Unit.find(user.faskes_id)

      callback(null, res)
  }
}

const createUser = async (payload, callback) => {
  try {
    payload.salt = crypto.randomBytes(16).toString('hex');
    payload.hash = crypto.pbkdf2Sync(payload.password, payload.salt, 10000, 512, 'sha512').toString('hex');
    payload.password = Helper.setPwd(payload.password);
    const user = new User(payload);
    const result = await user.save();
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const updateUser = (user, payload, callback) => {
  let passwords = user.setPassword(payload.password)

  let users = {
    fullname: payload.fullname ? payload.fullname : user.fullname,
    username: payload.username ? payload.username : user.username,
    password: passwords,
    email: payload.email ? payload.email: user.email,
    role: payload.role ? payload.role: user.role,
    code_district_city: payload.code_district_city ? payload.code_district_city : user.code_district_city,
    name_district_city: payload.name_district_city ? payload.name_district_city : user.name_district_city,
    phone_number: payload.phone_number ? payload.phone_number : user.phone_number,
    address_street: payload.address_street ? payload.address_street : user.address_street,
    address_subdistrict_code: payload.address_subdistrict_code ? payload.address_subdistrict_code : user.address_subdistrict_code,
    address_subdistrict_name: payload.address_subdistrict_name ? payload.address_subdistrict_name : user.address_subdistrict_name,
    address_village_code: payload.address_village_code ? payload.address_village_code : user.address_village_code,
    address_village_name: payload.address_village_name ? payload.address_village_name : user.address_village_name,
    unit_id: payload.unit_id ? payload.unit_id : user.unit_id
  }
  
  user = Object.assign(user, users);

  user.save((err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

const updateUsers = async (id, pay, category, author, callback) =>{
  try {
    const payloads = {};
    const payload = (pay == null ? {} : pay );
    if(category == "delete"){
      const date = new Date();
      payloads.delete_status = "deleted";
      payloads.deletedAt = date.toISOString();
      payloads.deletedBy = author;
    }
    if(typeof payload.password !== "undefined"){
      payload.salt = crypto.randomBytes(16).toString('hex');
      payload.hash = crypto.pbkdf2Sync(payload.password, payload.salt, 10000, 512, 'sha512').toString('hex');
      payload.password = Helper.setPwd(payload.password);
    }
    const params = Object.assign(payload,payloads);
    const result = await User.findByIdAndUpdate(id,
    { $set: params }, { new: true });
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const listUserIds = async (user, query, callback) => {
  const params = {}
  
  if(query.search){
    params.fullname = new RegExp(query.search, "i")
  }

  if(query.code_district_city){
    params.code_district_city = query.code_district_city
  }

  if(query.role){
    params.role = query.role
  }

  try {
    const users = await User.find(params).select('fullname')
    return callback(null, users.map(users => users.JSONCase()))
  } catch (err) {
    callback(err, null)
  }
}

const updateUsersFcmToken = async (id, payload, author, callback) =>{
  try {
    const params = { fcm_token: payload.fcm_token }
    const result = await User.findByIdAndUpdate(id,
    { $set: params }, { new: true });
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

module.exports = [
  {
    name: 'services.users.checkUser',
    method: checkUser
  },
  {
    name: 'services.users.listUser',
    method: listUser
  },
  {
    name: 'services.users.getById',
    method: getUserById
  },
  {
    name: 'services.users.getByUsername',
    method: getUserByUsername
  },
  {
    name: 'services.users.create',
    method: createUser
  },
  {
    name: 'services.users.update',
    method: updateUser
  },
  {
    name: 'services.users.updateUsers',
    method: updateUsers
  },
  {
    name: 'services.users.listUserIds',
    method: listUserIds
  },
  {
    name: 'services.users.updateUsersFcmToken',
    method: updateUsersFcmToken
  },
  {
    name: 'services.users.getFaskesOfUser',
    method: getFaskesOfUser
  }
];
 
