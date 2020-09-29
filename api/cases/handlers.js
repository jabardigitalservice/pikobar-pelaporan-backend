const pdfmaker = require('../../helpers/pdfmaker')
const replyHelper = require('../helpers')
const json2xls = require('json2xls');
const moment = require('moment')
const fs = require('fs');
module.exports = (server) => {
    function constructCasesResponse(cases) {
        let jsonCases = {
            status: 200,
            message: "Success",
            data: cases
        }
        // return survey
        return jsonCases
    }

    return {
        /**
         * GET /api/cases
         * @param {*} request
         * @param {*} reply
         */
        async ListCase(request, reply){
            let query = request.query

            server.methods.services.cases.list(
                query,
                request.auth.credentials.user,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result,request)
                ).code(200)
            })
        },
        /**
         * POST /api/cases
         * @param {*} request
         * @param {*} reply
         */
        async CreateCase(request, reply){
            let payload = request.payload
            server.methods.services.cases.create(
                payload,
                request.auth.credentials.user,
                request.pre,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result,request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases/{id}
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseDetail(request, reply) {
            let id = request.params.id
            server.methods.services.cases.getById(id, (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases/{id}/history
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseHistory(request, reply) {
            server.methods.services.histories.getByCase(
                request.params.id,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCasesResponse(districs, request)
                    ).code(200)
                }
            )
        },
        /**
         * GET /api/cases/{id}/last-history
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseHistoryLast(request, reply) {
            server.methods.services.histories.getLastHistoryByIdCase(
                request.params.id,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCasesResponse(districs, request)
                    ).code(200)
                }
            )
        },
        /**
         * GET /api/cases/summary
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseSummary(request, reply) {
            server.methods.services.cases_revamp.getSummary(
                request.query,
                request.auth.credentials.user,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases/summary-by-district
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseSummaryByDistrict(request, reply) {
            server.methods.services.cases.getSummaryByDistrict(
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases/summary-final
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseSummaryFinal(request, reply) {
            server.methods.services.cases.GetSummaryFinal(
                request.query,
                request.auth.credentials.user,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },
        /**
         * PUT /api/cases/{id}
         * @param {*} request
         * @param {*} reply
         */
        async UpdateCase(request, reply){
            let pre = request.pre
            let payload = request.payload
            let id = request.params.id
            let author = request.auth.credentials.user
            server.methods.services.cases.update(id, pre, author, payload, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result, request)
                ).code(200)
            })
        },
        /**
         * DELETE /api/cases/{id}
         * @param {*} request
         * @param {*} reply
         */
        async DeleteCase(request, reply) {
            server.methods.services.cases.softDeleteCase(
                request.pre.cases,
                request.auth.credentials.user,
                request.payload,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                     return reply(
                         constructCasesResponse(item, request)
                     ).code(202)
                })
        },
        /**
         * GET /api/cases
         * @param {*} request
         * @param {*} reply
         */
        async ListCaseExport(request, reply){
            let query = request.query
            const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
            server.methods.services.cases.listCaseExport(
                query,
                request.auth.credentials.user,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                const jsonXls = json2xls(result);
                const fileName = `Data-Kasus-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`
                fs.writeFileSync(fileName, jsonXls, 'binary');
                const xlsx = fs.readFileSync(fileName)
                reply(xlsx)
                .header('Content-Disposition', 'attachment; filename='+fileName);
                return fs.unlinkSync(fileName);
            })
        },
        /**
         * GET /api/cases/{id}/pdf
         * @param {*} request
         * @param {*} reply
         */
        async EpidemiologicalInvestigationForm(request, reply){
            const detailCase = request.pre.cases
            const caseName = detailCase.name.replace(/[\W_]+/g, '-')
            server.methods.services.cases.epidemiologicalInvestigationForm(
                detailCase,
                async (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                const fileName = `FORMULIR-PE-${caseName}-${moment().format("YYYY-MM-DD-HH-mm")}.pdf`
                const pdfFile = await pdfmaker.generate(result, fileName)
                return reply(pdfFile).header('Content-Disposition', 'attachment; filename='+fileName)
            })
        },
        /**
         * POST /api/cases-import
         * @param {*} request
         * @param {*} reply
         */
        async ImportCases(request, reply){
            let payload = request.payload
            server.methods.services.cases.ImportCases(
                payload,
                request.auth.credentials.user,
                request.pre.data_sheet,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result,request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases-listid
         * @param {*} request
         * @param {*} reply
         */
        async GetIdCase(request, reply){
            server.methods.services.cases.getIdCase(
                request.query,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result,request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases-by-nik/{nik}
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseDetailByNik(request, reply) {
            let nik = request.params.nik
            server.methods.services.cases.getByNik(nik, (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases-healthcheck
         * @param {*} request
         * @param {*} reply
         */
        async HealthCheck(request, reply) {
            server.methods.services.cases.healthcheck(
                request.query,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases/{id}/verifications
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseVerifications(request, reply){
            server.methods.services.casesVerifications.get(
                request.params.id,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result, request)
                ).code(200)
            })
        },
        /**
         * PUT /api/cases/{id}/verifications
         * @param {*} request
         * @param {*} reply
         */
        async CreateCaseVerification(request, reply){
            let payload = request.payload
            let id = request.params.id
            let author = request.auth.credentials.user

            server.methods.services.casesVerifications.create(
                id,
                author,
                request.pre.count_case,
                payload,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result, request)
                ).code(200)
            })
        },
        /**
         * GET /api/cases/summary-verification
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseSummaryVerification(request, reply) {
            server.methods.services.cases.getSummaryVerification(
                request.query,
                request.auth.credentials.user,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        }
    }
}
