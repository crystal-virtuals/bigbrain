import { useState } from 'react';
import ToastContainer from './ToastContainer';
import ToastContext from './ToastContext';
import { uid } from '@utils/helpers';

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, description, replace=false) => {
    const timestamp = new Date().getTime();
    const id = uid();

    // If toast with same id or timestamp already exists, remove it
    const duplicates = toasts.filter((toast) => toast.id === id || toast.timestamp === timestamp);
    if (duplicates.length > 0) {
      duplicates.forEach((toast) => removeToast(toast.id));
    }

    // Also remove toasts if there are more than 5
    if (toasts.length >= 5) {
      removeToast(toasts[0].id);
    }

    // if replace is true, remove the last toast
    if (replace && toasts.length > 0) {
      removeToast(toasts[toasts.length - 1].id);
    }

    const newToast = {
      id,
      type,
      message,
      description,
      timestamp,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id)
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Global notification live region, render this permanently at the end of the document */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;