/***************************************************************
                         Auth Functions
***************************************************************/
export const storeAuthToken = (authToken) => {
  localStorage.setItem('authToken', authToken);
}

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
}

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
}