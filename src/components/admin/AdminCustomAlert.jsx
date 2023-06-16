import React, { useEffect, useState } from 'react';

const CustomAlert = ({ message, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible && onDismiss) {
      onDismiss();
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div 
      className="fixed top-20 right-20 p-4 bg-red-500 text-white rounded shadow-md z-50 transition ease-in duration-200"
      role="alert"
    >
      {message}
    </div>
  );
};

export default CustomAlert;
