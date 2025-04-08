
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import InvoiceTable from '@/components/invoice/InvoiceTable';
import { useInvoiceExport } from '@/hooks/useInvoiceExport';

const MultipleInvoices = ({ extractedData }: { extractedData: any[] }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const { handleExportToExcel, handleExportLaserCuttingInvoice } = useInvoiceExport();

  const viewInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-lg font-medium">
          {extractedData.length} Invoice{extractedData.length !== 1 && 's'} Processed
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExportLaserCuttingInvoice} className="gap-2" variant="outline">
            <FileText className="h-4 w-4" />
            Export Laser Cutting Template
          </Button>
          <Button onClick={() => handleExportToExcel(extractedData)} className="gap-2">
            <Download className="h-4 w-4" />
            Export Summary
          </Button>
        </div>
      </div>

      <InvoiceTable 
        extractedData={extractedData} 
        onViewDetails={viewInvoiceDetails}
      />

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          To export all invoice data, click the "Export Summary" button above
        </p>
      </div>
    </div>
  );
};

export default MultipleInvoices;
