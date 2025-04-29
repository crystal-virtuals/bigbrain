import { useContext } from 'react';
import ToastContext from './ToastContext';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = context;

  return {
    success: ({ message, description = '', replace = false }) => addToast('success', message, description, replace),
    error: ({message, description = '', replace=false}) => addToast('error', message, description, replace),
    info: ({message, description = '', replace=false}) => addToast('info', message, description, replace),
    warn: ({message, description = '', replace=false}) => addToast('warning', message, description, replace),
  }
}

export default useToast;
