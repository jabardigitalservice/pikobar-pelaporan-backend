module.exports = (server) =>{
    const handlers = require('./handlers');
    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server);
    const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server);
    const {configRouteComplete} = require('../../helpers/routes')


    return [
        configRouteComplete('GET', '/history_cases', null, [CheckRoleView], 'Histories', handlers.ListHistory(server)),
        configRouteComplete('POST', '/history_cases', null, [CheckRoleCreate], 'Histories', handlers.CreateHistory(server)),
        configRouteComplete('GET', '/history_cases/{id}', null, [CheckRoleView], 'Histories', handlers.GetHistoryDetail(server)),
        configRouteComplete('PUT', '/history_cases/{id}', null, [CheckRoleUpdate], 'Histories', handlers.UpdateHistory(server)),
        configRouteComplete('DELETE', '/history_cases/{id}', null, [CheckRoleUpdate], 'Histories', handlers.DeleteHistory(server)),
        configRouteComplete('GET', '/history-export', null, [CheckRoleView], 'Histories', handlers.exportHistory(server)),
    ]
}
