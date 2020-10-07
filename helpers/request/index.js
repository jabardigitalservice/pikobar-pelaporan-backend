const headerRequest = (request) => {
  return {
    "query": request.query,
    "user": request.auth.credentials.user,
    "params": request.params,
    "payload": request.payload
  }
}

