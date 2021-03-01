const { ROLE } = require('../../helpers/constant')

const validationRole = (request, reply) => {
  const role = request.auth.credentials.user.role
  if([ROLE.ADMIN, ROLE.FASKES, ROLE.KOTAKAB].includes(role)) {
    return reply(request.auth.credentials.user.role)
  } else {
    return reply({
      status: 403,
      message: 'Anda Tidak Mempunyai Akses!',
      data: null
    }).code(403).takeover()
  }
}

const validationRoleWithProv = (request, reply) => {
  const role = request.auth.credentials.user.role
  if([ROLE.ADMIN, ROLE.FASKES, ROLE.KOTAKAB, ROLE.PROVINCE].includes(role)) {
    return reply(request.auth.credentials.user.role)
  } else {
    return reply({
      status: 403,
      message: 'Anda Tidak Mempunyai Akses!',
      data: null
    }).code(403).takeover()
  }
}

const CheckRoleView = server => {
  return {
    method: (request, reply) => { validationRoleWithProv(request, reply) },
    assign: 'roles'
  }
}

const CheckRoleCreate = server => {
  return {
    method: (request, reply) => { validationRole(request, reply) },
    assign: 'roles'
  }
}

const CheckRoleUpdate = server => {
  return {
    method: (request, reply) => { validationRole(request, reply) },
    assign: 'roles'
  }
}

const CheckRoleDelete = server => {
  return {
    method: (request, reply) => { validationRole(request, reply) },
    assign: 'roles'
  }
}



module.exports = {
  CheckRoleView,
  CheckRoleCreate,
  CheckRoleUpdate,
  CheckRoleDelete
}
