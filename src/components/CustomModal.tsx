import React from 'react';

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
