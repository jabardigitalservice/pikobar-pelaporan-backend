const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

const filterConfig = (validation, output, description, role) => {
  return {
      auth: 'jwt',
      validate: inputValidations[validation],
      response: outputValidations[output],
      description: description,
      tags: ['api', 'users'],
      pre: role
    }
}

const filterConfigSame = (description) => {
  return {
      auth: 'jwt',
      validate: inputValidations.GetCurrentPayload,
      response: outputValidations.AuthOutputValidationConfig,
      description: description,
      tags: ['api', 'users']
    }
}

module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const { routeOldNoPre, routeWithPreOld } = require('../../helpers/routes')
  const CheckRoleView = require('./route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('./route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('./route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('./route_prerequesites').CheckRoleDelete(server)

  return [
    // Get list user
    {
      method: 'GET',
      path: '/users',
      config: {
        auth: 'jwt',
        description: 'Get list user',
        validate: inputValidations.UserQueryValidations,
        tags: ['api', 'users'],
         pre: [
           CheckRoleView
         ]
      },
      handler: handlers.getListUser
    },
    // Get user by id
    routeWithPreOld(server, 'GET', '/users/{id}', 'users', CheckRoleView, 'getUserById'),
    // Get user by username
    routeWithPreOld(server, 'GET', '/users/username/{value}', 'users', CheckRoleView, 'getUserByUsername'),
    // Reset password by id
    routeWithPreOld(server, 'PUT', '/users/reset/{id}', 'users', CheckRoleUpdate, 'resetPassword'),
    // Get user by email or username
    routeWithPreOld(server, 'GET', '/users/check', 'users', CheckRoleView, 'checkUser'),
    // Get current user
    {
      method: 'GET',
      path: '/users/info',
      config: filterConfigSame('Get current info user'),
      handler: handlers.getCurrentUser
    },
    // Get faskes of current user
    {
      method: 'GET',
      path: '/users/faskes',
      config: filterConfigSame('Get faskes data of current user'),
      handler: handlers.getFaskesOfCurrentUser
    },
    // Update user
    {
      method: 'PUT',
      path: '/users/change-password',
      config: filterConfig(
        'UpdatePayload',
        'AuthOnPutOutputValidationConfig',
        'Update me in user',
        [ CheckRoleUpdate ]
      ),
      handler: handlers.updateMe
    },
    // Soft delete user
    routeWithPreOld(server, 'DELETE', '/users/{id}', 'users', CheckRoleDelete, 'deleteUsers'),
    // UPDATE user
    routeWithPreOld(server, 'PUT', '/users/{id}', 'users', CheckRoleUpdate, 'updateUsers'),
    // Register
    {
      method: 'POST',
      path: '/users',
      config: filterConfig(
        'RegisterPayload',
        'AuthOnRegisterOutputValidationConfig',
        'Add user',
        [ CheckRoleCreate ]
      ),
      handler: handlers.registerUser
    },
    // Login
    {
      method: 'POST',
      path: '/login',
      config: {
        validate: inputValidations.LoginPayload,
        response: outputValidations.AuthOnLoginOutputValidationConfig,
        description: 'Login  user',
        tags: ['api', 'users'],
      },
      handler: handlers.loginUser
    },
    // Get case name and id
    routeOldNoPre(server, 'GET', '/users-listid', 'users', 'getListUserIds'),
    // Update fcm token
    routeWithPreOld(server, 'POST', '/users/{id}/devices', 'users', CheckRoleUpdate, 'updateUserDevice'),
  ]
}
