## HOW TO USE

### CODE QUALITY (CODE OF CONDUCT)
This function is useful for preventing Similar blocks of code in the handler

require in your handler this function

example function request same have 6 parameter
- `parameter 1 = send server`
- `parameter 2 = name your service ex : "areas"`
- `parameter 3 = name method in your service`
- `parameter 4 = send request`
- `parameter 5 = query param header ex : "city _code"`
- `parameter 6 = send reply`

```javascript
const queryParamSame = async (server, name, methods, request, param, reply) => {
  server.methods.services[name][methods](
    request.params[param],
    request.query,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}
```

```javascript
const { queryParamSame } = require('../../helpers/request')
```

example in your handler

```javascript
const SubDistrict = (server) => {
  return async (request, reply) => {
    await queryParamSame(
      server, "areas", "getSubDistrict",
      request, "query", "city_code", reply
    )
  }
}
```

