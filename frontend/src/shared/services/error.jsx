/***************************************************************
                  Error Handling
***************************************************************/
export class InputError extends Error {
  constructor (message, options) {
    super(message, options);
    this.name = 'InputError';
    this.statusText = 'Bad Input';
    this.redirect = false;
  }
}

export class AccessError extends Error {
  constructor (message, options) {
    super(message, options);
    this.name = 'AccessError';
    this.statusText = 'Unauthorized Access';
    this.redirect = true;
    this.redirectPath = '/403';
  }
}

export class NotFoundError extends Error {
  constructor (message, options) {
    super(message, options);
    this.name = 'NotFoundError';
    this.statusText = 'Not Found';
    this.redirect = true;
    this.redirectPath = '/404';
  }
}

export class SystemError extends Error {
  constructor (message, options) {
    super(message, options);
    this.name = 'SystemError';
    this.statusText = 'System Error';
    this.redirect = true;
    this.redirectPath = '/500';
  }
}

export class NetworkError extends Error {
  constructor (message, options) {
    super(message, options);
    this.name = 'NetworkError';
    this.statusText= 'Network Error';
    this.redirect = false;
  }
}

// Player API Errors
export class ActiveSessionError extends Error {
  constructor (message, options) {
    super(message, options);
    this.name = 'ActiveSessionError';
    this.redirect = false;
  }
}

export class InactiveSessionError extends Error {
  constructor (message, options) {
    super(message, options);
    this.name = 'InactiveSessionError';
    this.redirect = false;
  }
}

/***************************************************************
                  Create Error Functions
***************************************************************/
export const APIErrors = {
  400: {
    statusCode: 400,
    statusText: 'Bad Input',
    message: 'Invalid input. Please check your data and try again.',
    redirect: false,
  },
  403: {
    statusCode: 403,
    statusText: 'Unauthorized Access',
    message: "Access denied. Please check your credentials and try logging in again.",
    redirect: true,
    redirectPath: '/403',
  },
  404: {
    statusCode: 404,
    statusText: 'Not Found',
    message: "The requested resource was not found. Please check the URL and try again.",
    redirect: true,
    redirectPath: '/404',
  },
  500: {
    statusCode: 500,
    statusText: 'System Error',
    message: "Sorry, something went wrong on our end. Please try again later.",
    redirect: true,
    redirectPath: '/500',
  },
}

export const createError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.error || APIErrors[status]?.message || 'An unknown error occurred.';
    const options = { cause: error };

    if (status === 400) return new InputError(message, options);
    if (status === 403) return new AccessError(message, options);
    if (status === 404) return new NotFoundError(message, options);
    return new SystemError(message, options);
  }

  if (error.request) {
    return new NetworkError('Please check your network connection and try again.', { cause: error });
  }

  return new Error(error.message, { cause: error });
};


export const createPlayerError = (error) => {
  if (error.response && error.response.status === 400) {
    // Throw custom errors for specific 400 Bad Request
    const { error: errorMessage } = error.response.data;

    if (errorMessage === 'Player ID does not refer to valid player id') {
      return new InputError(errorMessage);
    }
    else if (errorMessage === 'Session ID is not an active session') {
      return new InactiveSessionError(errorMessage);
    }
    else {
      return new ActiveSessionError(errorMessage);
    }
  }
  return createError(error);
};
