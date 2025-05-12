import { useContext } from 'react';
import ToastContext from './ToastContext';
import { Toast } from '@constants/toast';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = context;

  const showToast = (type, input, overrideOptions = {}) => {
    let message = '';
    let description = '';
    let options = {};

    if (typeof input === 'string') {
      message = input;
    } else if (typeof input === 'object' && input !== null) {
      const fallback = Object.values(input).filter(v => typeof v === 'string');
      message = input.message || fallback[0] || '';
      description = input.description || fallback[1] || '';
      options = input.options || {};
    }

    // Final options: override default with any passed overrides
    const finalOptions = {
      ...Toast.DEFAULT_OPTIONS,
      ...options,
      ...overrideOptions,
    };

    addToast(type, message, description, finalOptions);
  };

  const toastify = {
    success: (input, options) => showToast(Toast.SUCCESS, input, options),
    error: (input, options) => showToast(Toast.ERROR, input, options),
    info: (input, options) => showToast(Toast.INFO, input, options),
    warn: (input, options) => showToast(Toast.WARNING, input, options),
  }

  return toastify;
};

export default useToast;