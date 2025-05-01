export const ERRORS = {
  400: {
    statusText: 'Bad Input',
    message: 'Invalid input. Please check your data and try again.'
  },
  401: {
    statusText: 'Unauthorized',
    message: 'Authorization failed. Please log in again.'
  },
  403: {
    statusText: 'Forbidden',
    message: 'Access denied. Please log in again.'
  },
  404: {
    statusText: 'Not Found',
    message: 'The resource you are looking for does not exist.'
  },
  500: {
    statusText: 'Internal Server Error',
    message: 'Oops, something went wrong. Please try again later.'
  }
};

export class InputError extends Error {
  constructor (message) {
    super(message);
    this.name = 'InputError';
  }
}

export class AccessError extends Error {
  constructor (message) {
    super(message);
    this.name = 'AccessError';
  }
}

export class NotFoundError extends Error {
  constructor (message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ClientError extends Error {
  constructor (message) {
    super(message);
    this.name = 'ClientError';
  }
}

export class InternalServerError extends Error {
  constructor (message) {
    super(message );
    this.name = 'InternalServerError';
  }
}

export class NetworkError extends Error {
  constructor (message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export const createError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    const message = data?.error || ERRORS[status]?.message || 'Oops, something went wrong. Please try again later.';
    const options = { cause: error };

    if (status === 400) return new InputError(message, options);
    if (status === 401 || status === 403) return new AccessError(message, options);
    if (status === 404) return new NotFoundError(message, options);
    if (status >= 400 && status < 500) return new ClientError(message, options);
    if (status >= 500 && status < 600) return new InternalServerError(message, options);

    return new Error(message, options);
  }

  if (error.request) {
    return new NetworkError('Network error. Please check your network connection and try again.', { cause: error });
  }

  return new Error(error.message, { cause: error });

};
