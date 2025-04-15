
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileImage } from 'lucide-react';
import { useInvoiceExport } from '@/hooks/useInvoiceExport';

interface ExportButtonsProps {
  invoice: any;
}

const ExportButtons = ({ invoice }: ExportButtonsProps) => {
  const { handleExportToExcel, handleImageToExcel } = useInvoiceExport();

  return (
    <div className="pt-2 space-y-2">
      <Button 
        variant="default" 
        className="gap-2 w-full"
        onClick={() => handleExportToExcel(invoice)}
      >
        <FileText className="h-4 w-4" />
        Export to Excel
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-2 w-full"
        onClick={() => handleImageToExcel(invoice)}
      >
        <FileImage className="h-4 w-4" />
        Process Image to Excel
      </Button>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Supports all image types and sizes including A3, A4 sheets and PDFs
      </p>
    </div>
  );
};

export default ExportButtons;
