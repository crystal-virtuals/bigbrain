/***************************************************************
    Token in Local Storage (User is stored in React Context)
***************************************************************/
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
}

export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? token : null;
}

export const removeAuthToken = () => {
  localStorage.clear();
}
