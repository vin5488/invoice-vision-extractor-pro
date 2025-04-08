
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useInvoiceExport } from '@/hooks/useInvoiceExport';

interface ExportButtonsProps {
  invoice: any;
}

const ExportButtons = ({ invoice }: ExportButtonsProps) => {
  const { handleExportLaserCuttingInvoice } = useInvoiceExport();

  return (
    <div className="pt-2 space-y-2">
      <Button 
        variant="default" 
        className="gap-2 w-full"
        onClick={() => handleExportLaserCuttingInvoice(invoice)}
      >
        <FileText className="h-4 w-4" />
        Export as Laser Cutting Invoice
      </Button>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Exports invoice data in the laser cutting format
      </p>
    </div>
  );
};

export default ExportButtons;
