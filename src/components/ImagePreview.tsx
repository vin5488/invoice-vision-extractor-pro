
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

interface ImagePreviewProps {
  file: File | null;
  processedImageUrl: string | null;
  highlightedAreas?: Array<{x: number, y: number, width: number, height: number}>;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  file, 
  processedImageUrl,
  highlightedAreas = [] 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  useEffect(() => {
    if (processedImageUrl) {
      setImageUrl(processedImageUrl);
      return;
    }
    
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl(null);
    }
  }, [file, processedImageUrl]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    if (zoom < 3) {
      setZoom(zoom + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.25);
    }
  };

  if (!imageUrl) {
    return null;
  }

  const renderHighlightOverlays = () => {
    return highlightedAreas.map((area, index) => (
      <div 
        key={index}
        className="absolute border-2 border-app-teal bg-app-teal/10"
        style={{
          left: `${area.x}%`,
          top: `${area.y}%`,
          width: `${area.width}%`,
          height: `${area.height}%`,
        }}
      />
    ));
  };

  return (
    <div 
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center' : 'h-[400px]'
      }`}
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 hover:bg-white" 
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 hover:bg-white" 
          onClick={handleZoomIn}
          disabled={zoom >= 3}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 hover:bg-white" 
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="h-full w-full overflow-auto flex items-center justify-center">
        <div className="relative" style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}>
          <img 
            src={imageUrl} 
            alt="Invoice Preview" 
            className="max-w-full object-contain"
            style={{ maxHeight: isFullscreen ? '90vh' : '380px' }}
          />
          {renderHighlightOverlays()}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
