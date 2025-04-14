
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
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
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-lg font-medium">
          {extractedData.length} Invoice{extractedData.length !== 1 && 's'} Processed
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleExportToExcel(extractedData)} className="gap-2">
            <FileText className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      <InvoiceTable 
        extractedData={extractedData} 
        onViewDetails={viewInvoiceDetails}
      />

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Click the "Export to Excel" button above to download the Excel file
        </p>
      </div>
    </div>
  );
};

export default MultipleInvoices;
