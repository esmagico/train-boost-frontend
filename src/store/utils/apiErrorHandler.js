export const getErrorMessage = (error) => {
  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  if (error?.status) {
    switch (error.status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Resource Not Found';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Something went wrong';
    }
  }
  
  return 'An unknown error occurred';
};

export const isErrorWithMessage = (error) => {
  return error?.status === 'rejected' || error?.status === 'failed';
};
