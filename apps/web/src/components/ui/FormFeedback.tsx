import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFeedbackProps {
  type: 'error' | 'success';
  message: string;
}

export const FormFeedback: React.FC<FormFeedbackProps> = ({ type, message }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={`flex items-start gap-2 p-3 mt-2 rounded-md text-sm ${
      isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      {isError ? (
        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
      ) : (
        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
      )}
      <p>{message}</p>
    </div>
  );
};

interface FormInputErrorProps {
  message?: string;
}

export const FormInputError: React.FC<FormInputErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
      <AlertCircle size={14} />
      {message}
    </p>
  );
};
