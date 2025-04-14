/***************************************************************
                        Validate Input
***************************************************************/
export const isEmpty = (value) => {
  return value === undefined || value === null || value === '';
};

export const validateInput = (name, value) => {
  if (isEmpty(value)) return 'This field is required';
  return '';
};

export const validateForm = (formData) => {
  const errors = {};
  Object.entries(formData).forEach(([name, value]) => {
    errors[name] = validateInput(name, value);
  });
  const { password, confirmPassword } = formData;
  if (password && confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};
