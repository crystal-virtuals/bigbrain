/***************************************************************
                        Validate Input
***************************************************************/
export const isEmpty = (value) => {
  return value === undefined || value === null || value === '' || !value;
};

export const isEmptyString = (value) => {
  return !value || value.trim() === '';
}

const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) return 'Both passwords must match';
  return '';
};

const validateInput = (name, value, password = '') => {
  if (isEmpty(value)) return 'This field is required';
  if (name === 'confirmPassword') return validatePasswordMatch(value, password);
  return '';
}

export const getInputErrors = (name, value, formData, errors) => {
  const newErrors = new Map(errors);
  let errorMessage = validateInput(name, value, formData.password);
  !isEmpty(errorMessage) ? newErrors.set(name, errorMessage) : newErrors.delete(name);
  return newErrors;
}

export const getFormErrors = (formData) => {
  const errors = new Map();
  // iterate through object
  Object.entries(formData).forEach(([name, value]) => {
    const errorMessage = validateInput(name, value, formData.password);
    if (!isEmpty(errorMessage)) {
      errors.set(name, errorMessage);
    }
  });

  return errors;
};
