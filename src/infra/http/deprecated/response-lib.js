export function success(body, headers = {}) {
  return buildResponse(200, body, headers);
}

export function failure(body) {
  return buildResponse(500, body);
}

export function unprocessable(body) {
  return buildResponse(422, body);
}

export function unknown(body) {
  return buildResponse(404, body);
}

function buildResponse(statusCode, body, headers) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers,
    },
    body: JSON.stringify(body),
  };
}
