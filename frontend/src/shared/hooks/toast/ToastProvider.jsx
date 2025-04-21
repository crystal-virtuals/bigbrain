import { useState } from 'react';
import ToastContainer from './ToastContainer';
import ToastContext from './ToastContext';

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, description) => {
    const timestamp = Date.now();
    const id = `${type}-${timestamp}`;
    // If toast with same id already exists, remove it (same timestamp + same type)
    const existingToast = toasts.find((toast) => toast.id === id);
    if (existingToast) removeToast(id);
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