
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingOverlayProps {
  isActive: boolean;
  currentStage?: string;
  progress?: number;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ 
  isActive,
  currentStage = "Processing image...",
  progress = -1 // -1 for indeterminate
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-app-blue animate-spin mb-4" />
          <h3 className="text-lg font-medium mb-2">{currentStage}</h3>
          
          {progress >= 0 ? (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-app-blue h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          ) : (
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-app-blue to-app-teal animate-pulse-opacity"></div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 text-center">
            This may take a few moments depending on the complexity of your document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
