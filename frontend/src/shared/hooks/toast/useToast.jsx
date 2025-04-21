import { useContext } from 'react';
import ToastContext from './ToastContext';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = context;

  return {
    success: (message, description = '') => addToast('success', message, description),
    error: (message, description = '') => addToast('error', message, description),
    info: (message, description = '') => addToast('info', message, description),
    warn: (message, description = '') => addToast('warning', message, description),
  }
}

export default useToast;
