const mongoose = require('mongoose');

require('../models/Unit');
const Unit = mongoose.model('Unit');

const listUnit = async (query, callback) => {
    try {
        const myCustomLabels = {
            totalDocs: 'itemCount',
            docs: 'itemsList',
            limit: 'perPage',
            page: 'currentPage',
            meta: '_meta'
        };
        const sorts = (query.sort == "desc" ? { createdAt: "desc" } : JSON.parse(query.sort))
        const options = {
            page: query.page,
            limit: query.limit,
            populate: (['createdBy']),
            sort: sorts,
            leanWithId: true,
            customLabels: myCustomLabels
        };
        let params = {};
        if(query.unit_type){
            params.unit_type = query.unit_type;
        }
        if(query.code_district_code){
            params.code_district_code = query.code_district_code;
        }
        let search_params;
        if(query.search){ 
            search_params = [
                { unit_code: new RegExp(query.search, "i") },
                { unit_type: new RegExp(query.search, "i") },
                { name: new RegExp(query.search, "i") }
            ];
        }else{
            search_params = {};
        }
        const result = Unit.find(params).or(search_params).where('delete_status').ne('deleted');
        const paginateResult = await Unit.paginate(result, options);
        callback(null, paginateResult);
    } catch (error) {
        callback(error, null);
    }
}

const listUnitById = async (id, callback) => {
    try {
        const result = await Unit.findById(id).populate('createdBy');
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

const createUnit = async (payload, user, callback) => {
    try {
        payload.createdBy = user._id;
        const result = await Unit.create(payload);
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

const updateUnit = async (pay, id, category, author, callback) => {
    try {
        const payloads = {};
        const payload = (pay == null ? {} : pay);
        if (category == "delete") {
            const date = new Date();
            payloads.delete_status = "deleted";
            payloads.deletedAt = date.toISOString();
            payloads.deletedBy = author;
        }
        const params = Object.assign(payload, payloads);
        const result = await Unit.findByIdAndUpdate(id,
            { $set: params }, { new: true });
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

const migrate = async (payload, user, callback) => {    
    require('../models/Hospital');
    const Hospital = mongoose.model('Hospital');
    const ObjectId = require("mongoose").Types.ObjectId
    try {
        let hosp = {}
        let insertUnitRsPayload = {}
        let insertUnitRsPayloads = []
        const deleteResult = await Unit.deleteMany({unit_type: 'rumahsakit'})
        console.log('delete', deleteResult)
        const hospitals = await Hospital.find({})
        for (i in hospitals) {
            hosp = hospitals[i]
            insertUnitRsPayload = {
                _id: ObjectId(hosp._id),
                unit_level: 3,
                unit_code: null, //null sementara
                unit_type: 'rumahsakit', //puskesmas, rs, klinik
                name: hosp.name || '',
                description: hosp.description || '',
                address: hosp.address || '',
                phone_numbers: hosp.phone_numbers.toString() || '',
                kemendagri_kabupaten_kode: hosp.kemendagri_kabupaten_kode || null,
                kemendagri_kecamatan_kode: hosp.kemendagri_kecamatan_kode || null,
                kemendagri_kelurahan_kode: hosp.kemendagri_kelurahan_kode || null,
                rs_jabar: hosp.rs_jabar ? true : false
            }
            insertUnitRsPayloads.push(insertUnitRsPayload)
        }
        console.log(insertUnitRsPayloads.length)
        const result = await Unit.insertMany(insertUnitRsPayloads)
        // console.log('insertMany', result)
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

module.exports = [
    {
        name: 'services.unit.create',
        method: createUnit
    },
    {
        name: 'services.unit.read',
        method: listUnit
    },
    {
        name: 'services.unit.update',
        method: updateUnit
    },
    {
        name: 'services.unit.readbyid',
        method: listUnitById
    },
    {
        name: 'services.unit.migrate',
        method: migrate
    },
];

