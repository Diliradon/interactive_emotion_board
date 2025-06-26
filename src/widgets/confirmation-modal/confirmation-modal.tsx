import { FC } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmButton: 'bg-red-500 text-white hover:bg-red-600',
          iconBg: 'bg-red-100',
        };

      case 'warning':
        return {
          icon: '⚠️',
          confirmButton: 'bg-yellow-500 text-white hover:bg-yellow-600',
          iconBg: 'bg-yellow-100',
        };

      case 'info':
        return {
          icon: 'ℹ️',
          confirmButton: 'bg-blue-500 text-white hover:bg-blue-600',
          iconBg: 'bg-blue-100',
        };

      default:
        return {
          icon: '⚠️',
          confirmButton: 'bg-red-500 text-white hover:bg-red-600',
          iconBg: 'bg-red-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="zoom-in-95 relative w-full max-w-md animate-in rounded-xl bg-white shadow-2xl duration-200">
        <div className="p-6">
          <div className="mb-4 flex items-start space-x-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}
            >
              <span className="text-2xl">{styles.icon}</span>
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-xl font-bold text-gray-900">{title}</h2>
              <p className="leading-relaxed text-gray-600">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 rounded-lg px-4 py-2 font-medium shadow-md transition-all duration-200 hover:shadow-lg ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
