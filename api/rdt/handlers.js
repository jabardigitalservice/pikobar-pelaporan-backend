const { queryIfSame, funcIfSame, funcNoParam } = require('../../helpers/request')
const {
  replyJson
} = require('../helpers')

const ListRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.list(
      request.query,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const CreateRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.create(
      request.query,
      request.payload,
      request.auth.credentials.user,
      request.pre,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const CreateRdtMultiple = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.createMultiple(
      request.payload,
      request.auth.credentials.user,
      request.pre,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const GetRdtDetail = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "rdt", "getById", request, "id", reply)
  }
}

const GetRdtHistories = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "rdt", "getHistoriesByRdtId", request, "id", reply)
  }
}

const UpdateRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.update(
      request,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const DeleteRdt = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.softDeleteRdt(
      request.pre.rdt,
      // request.pre.cases,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetListIdCase = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.FormSelectIdCase(
      request.query,
      request.auth.credentials.user,
      request.pre.data_pendaftaran,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetListIdCaseDetail = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.FormSelectIdCaseDetail(
      request.pre.search_internal,
      request.pre.search_external,
      // request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const GetListRegisteredUser = (server) => {
  return async(request, reply) => {
    await funcCreate(server, "rdt", "getRegisteredUser", request, reply)
  }
}

const formLocationTest = (server) => {
  return async(request, reply) => {
    await funcNoParam(server, "rdt", "getLocationTest", reply)
  }
}

const GetRdtSummaryByCities = (server) => {
  return async (request, reply) => {
     await queryIfSame(server, "rdt", "GetRdtSummaryByCities", request, reply)
  }
}

const GetRdtSummaryResultByCities = (server) => {
  return async(request, reply) => {
      await queryIfSame(server, "rdt", "GetRdtSummaryResultByCities", request, reply)
  }
}

const GetRdtSummaryResultListByCities = (server) => {
  return async(request, reply) => {
      await queryIfSame(server, "rdt", "GetRdtSummaryResultListByCities", request, reply)
  }
}

const GetRdtFaskesSummaryByCities = (server) => {
  return async(request, reply) => {
    await queryIfSame(server, "rdt", "GetRdtFaskesSummaryByCities", request, reply)
  }
}

const sendMessage = (server) => {
  return (request, reply) => {
    server.methods.services.rdt.sendMessagesSMS(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      })
    server.methods.services.rdt.sendMessagesWA(
      request.query,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

module.exports = {
  ListRdt,
  CreateRdt,
  CreateRdtMultiple,
  GetRdtDetail,
  GetRdtHistories,
  UpdateRdt,
  DeleteRdt,
  GetListIdCase,
  GetListIdCaseDetail,
  GetListRegisteredUser,
  formLocationTest,
  GetRdtSummaryByCities,
  GetRdtSummaryResultByCities,
  GetRdtSummaryResultListByCities,
  GetRdtFaskesSummaryByCities,
  sendMessage
}