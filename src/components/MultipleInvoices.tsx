
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import InvoiceTable from '@/components/invoice/InvoiceTable';
import { useInvoiceExport } from '@/hooks/useInvoiceExport';

const MultipleInvoices = ({ extractedData }: { extractedData: any[] }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const { handleExportToExcel } = useInvoiceExport();

  const viewInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {extractedData.length} Invoice{extractedData.length !== 1 && 's'} Processed
        </h3>
        <Button onClick={() => handleExportToExcel(extractedData)} className="gap-2">
          <Download className="h-4 w-4" />
          Export Summary
        </Button>
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
