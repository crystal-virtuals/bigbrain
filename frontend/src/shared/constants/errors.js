export const API_ERRORS = {
  0: {
    statusText: 'Network Error',
    message: 'There was an error with your network request. Please check your internet connection and try again.',
  },
  400: {
    statusText: 'Bad Input',
    message: 'Invalid input. Please check your data and try again.',
  },
  403: {
    statusText: 'Access Denied',
    message: 'Access denied. Please check your credentials and try logging in again.',
    details: {
      status: 403,
      title: 'Unauthorized access',
      description: 'Sorry, the page you were trying to reach is absolutely forbidden for some reason.',
      redirectPath: '/login',
      redirectText: 'Back to login',
    }
  },
  404: {
    statusText: 'Not Found',
    message: 'The resource you are looking for could not be found. Please check the URL and try again.',
    details: {
      status: 404,
      title: 'Page not found',
      description: "Sorry, we couldn't find the page you are looking for.",
      redirectPath: '/home',
      redirectText: 'Back to home',
    }
  },
  500: {
    statusText: 'System Error',
    message: 'Oops! Something went wrong. Please try again later.',
    details: {
      status: 500,
      title: 'Error',
      description: 'Sorry, something went wrong on our end. Please try again later.',
      redirectPath: '/home',
      redirectText: 'Back to home',
    }
  },
};

/***************************************************************
                  API Error Handler
***************************************************************/
export const APIError = (error) => {
  if (error.response) {
    const { status, data, config } = error.response;
    const playerError = config.url.startsWith('/play') && status === 400;

    const message = data?.error || API_ERRORS[status]?.message || API_ERRORS[500].message;
    const options = { cause: error };

    if (playerError) return PlayerError(error);
    if (status === 400) return new InputError(message, options);
    if (status === 403) return new AccessError(message, options);
    if (status === 404) return new NotFoundError(message, options);
    return new SystemError(message, options);
  }

  if (error.request) {
    const message = API_ERRORS[0].message;
    const options = { cause: error };
    return new NetworkError(message, options);
  }

  return new SystemError(error.message, { cause: error });
};

const PlayerError = (error) => {
  const message = error.response.data.error;
  const options = { cause: error };

  if (message === 'Player ID does not refer to valid player id') {
    return new InputError(message, options);
  } else if (message === 'Session ID is not an active session') {
    return new InactiveSessionError(message, options);
  } else {
    return new ActiveSessionError(message, options);
  }
};

/***************************************************************
                  Error classes
***************************************************************/
export class InputError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'InputError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Player API Errors (extends InputError)
export class ActiveSessionError extends InputError {
  constructor(message, options) {
    super(message, options);
    this.name = 'ActiveSessionError';
  }
}

export class InactiveSessionError extends InputError {
  constructor(message, options) {
    super(message, options);
    this.name = 'InactiveSessionError';
  }
}

export class NetworkError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'NetworkError';
  }
}

export class AccessError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'AccessError';
    this.details = API_ERRORS[403].details;
  }
}

export class NotFoundError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'NotFoundError';
    this.details = API_ERRORS[404].details;
  }
}

export class SystemError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'SystemError';
    this.details = API_ERRORS[500].details;
  }
}
