import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'Something went wrong. Please try again.', 
  retry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-red-50 p-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Error</h3>
      <p className="mb-6 max-w-md text-gray-600">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="rounded-lg bg-primary px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
