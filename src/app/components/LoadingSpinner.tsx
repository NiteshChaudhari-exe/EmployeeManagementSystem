import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  loading: boolean;
  message?: string;
  fullScreen?: boolean;
  children?: React.ReactNode;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loading,
  message = 'Loading...',
  fullScreen = false,
  children,
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      {message && <p className="text-gray-600 font-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
