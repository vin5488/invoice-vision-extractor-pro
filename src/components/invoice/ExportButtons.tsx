
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, ImageIcon, FileText } from 'lucide-react';
import { useInvoiceExport } from '@/hooks/useInvoiceExport';

interface ExportButtonsProps {
  invoice: any;
}

const ExportButtons = ({ invoice }: ExportButtonsProps) => {
  const { handleExportSingleInvoice, handleExportFromImage, handleExportLaserCuttingInvoice } = useInvoiceExport();

  return (
    <>
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Export Options</h4>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleExportSingleInvoice(invoice, 0)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Construction
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleExportSingleInvoice(invoice, 1)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Manufacturing
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleExportSingleInvoice(invoice, 2)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Services
          </Button>
        </div>
      </div>

      <div className="pt-2 space-y-2">
        <Button 
          variant="default" 
          className="gap-2 w-full"
          onClick={() => handleExportFromImage(invoice)}
        >
          <ImageIcon className="h-4 w-4" />
          Export from Image
        </Button>
        
        <Button 
          variant="outline" 
          className="gap-2 w-full"
          onClick={handleExportLaserCuttingInvoice}
        >
          <FileText className="h-4 w-4" />
          Export as Laser Cutting Invoice
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Uses image recognition data to generate Excel file
        </p>
      </div>
    </>
  );
};

export default ExportButtons;
