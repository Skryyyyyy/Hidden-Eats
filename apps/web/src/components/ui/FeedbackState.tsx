import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeedbackStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'error' | 'warning' | 'success';
}

export const FeedbackState: React.FC<FeedbackStateProps> = ({
  icon: Icon,
  title,
  description,
  actionButton,
  variant = 'default',
}) => {
  const iconColor = {
    default: 'text-gray-400',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
  }[variant];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-gray-100 shadow-sm min-h-[300px]">
      <div className={`p-4 mb-4 rounded-full bg-gray-50 ${iconColor}`}>
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 text-gray-500 max-w-sm">{description}</p>
      
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};
