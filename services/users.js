require('../models/User');
require('../models/Unit');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Unit = mongoose.model('Unit');
const ObjectId = require('mongodb').ObjectID;
const UserDevice = require('../models/UserDevice');
const { resultJson, optionsLabel } = require('../helpers/paginate');
const custom = require('../helpers/custom');
const filters = require('../helpers/filter/userfilter');

const listUser = async (user, query, callback) => {
  try {
    const sorts = (query.sort == "desc" ? { _id: "desc" } : JSON.parse(query.sort));
    const populate = (['unit_id']);
    const options = optionsLabel(query, sorts, populate);
    const params = filters.filterUser(query, user);
    const search_params = filters.searchUser(query);
    const result = User.find(params).or(search_params).where("delete_status").ne("deleted");
    const paginateResult = await User.paginate(result, options);
    callback(null, resultJson('users', paginateResult));
  } catch (error) {
    callback(error, null);
  }
}

const getUserById = async (id, category, callback) => {
  let result;
  try {
    result = await User.findById(id);
    if (category == 'reset') {
      result = { 'msg': 'Harap hubungi administrator' };
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const getUserBySpecifiedKey = async (key, value, callback) => {
  try {
    let result = null
    const user = await User.findOne({ [key]: value });
    if (user) {
      result = user.JSONCase();
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const getUserByUsername = (username, callback) => {
  User.findOne({ username }, async (err, user) => {
    if (err) return callback(err, null);
    if (user !== null) await LastLogin(user);
    return callback(null, user);
  }).populate('unit_id');
}

const checkUser = async (query, callback) => {
  let check;
  if (query.params) {
    const gets = await User.find({
      $or: [
        { 'username': query.params }, { 'email': query.params }]
    }).then(res => { return res.length });
    check = (gets > 0 ? true : false);
  } else {
    check = {};
  }
  callback(null, check);
}

const getFaskesOfUser = async (user, callback) => {
  if (user.role != 'faskes' || !user.hasOwnProperty('faskes_id')) {
    let err = { message: "This user has no faskes data ascociated with it" }
    callback(err, null);
  } else {
    const res = await Unit.find(user.faskes_id);
    callback(null, res);
  }
}

const createUser = async (payload, callback) => {
  try {
    if (payload.unit_id == '') {
      payload.unit_id = null;
    }
    custom.setPwd(payload);
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
    email: payload.email ? payload.email : user.email,
    role: payload.role ? payload.role : user.role,
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

const updateUsers = async (id, pay, category, author, callback) => {
  try {
    const payloads = {};
    const payload = (pay == null ? {} : pay);
    if (category == "delete") {
      custom.deletedSave(payloads, author);
    }
    if (typeof payload.password !== "undefined") {
      custom.setPwd(payload);
    }
    const params = Object.assign(payload, payloads);
    const result = await User.findByIdAndUpdate(id,
      { $set: params }, { runValidators: true, context: 'query', new: true });
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

const listUserIds = async (user, query, callback) => {
  const params = {}

  if (query.search) {
    params.fullname = new RegExp(query.search, "i")
  }

  if (query.code_district_city) {
    params.code_district_city = query.code_district_city
  }

  if (query.role) {
    params.role = query.role
  }

  try {
    const users = await User.find(params).select('fullname')
    return callback(null, users.map(users => users.JSONCase()))
  } catch (err) {
    callback(err, null)
  }
}

const updateUserDevice = async (id, payload, author, callback) => {
  try {
    const { appId, token } = payload
    const res = await UserDevice.updateOne(
      { userId: ObjectId(id) },
      { $set: { appId, token } }, { upsert: true })
    callback(null, res)
  } catch (e) {
    callback(e, null)
  }
}

const LastLogin = async (user) => {
  let result;
  try {
    let date = new Date()
    let last_login = {
      last_login: date.toISOString()
    }
    result = await User.findByIdAndUpdate(user._id,
      { $set: last_login }, { new: true });
  } catch (error) {
    result = error;
  }
  return result;
}


module.exports = [
  {
    name: "services.users.checkUser",
    method: checkUser,
  },
  {
    name: "services.users.listUser",
    method: listUser,
  },
  {
    name: "services.users.getById",
    method: getUserById,
  },
  {
    name: "services.users.getBySpecifiedKey",
    method: getUserBySpecifiedKey,
  },
  {
    name: "services.users.getByUsername",
    method: getUserByUsername,
  },
  {
    name: "services.users.create",
    method: createUser,
  },
  {
    name: "services.users.update",
    method: updateUser,
  },
  {
    name: "services.users.updateUsers",
    method: updateUsers,
  },
  {
    name: "services.users.listUserIds",
    method: listUserIds,
  },
  {
    name: "services.users.updateUserDevice",
    method: updateUserDevice,
  },
  {
    name: "services.users.getFaskesOfUser",
    method: getFaskesOfUser,
  },
];

