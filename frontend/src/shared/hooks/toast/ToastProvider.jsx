import { useState } from 'react';
import ToastContainer from './ToastContainer';
import ToastContext from './ToastContext';

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, description) => {
    const id = new Date().getTime();
    const newToast = {
      id,
      type,
      message,
      description,
      show: true,
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