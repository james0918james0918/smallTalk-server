export const HTTP_CODES = Object.freeze({
  SUCCESS: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  GATEWAY_TIMEOUT: 504
});

export const HTTP_RESPONSE_MSG = Object.freeze({
  SUCCESS: 'Confirmed request',
  UNAUTHORIZED: 'No credential provided',
  FORBIDDEN: 'Invalid credential',
});
