
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileImage } from 'lucide-react';
import InvoiceTable from '@/components/invoice/InvoiceTable';
import { useInvoiceExport } from '@/hooks/useInvoiceExport';

const MultipleInvoices = ({ extractedData }: { extractedData: any[] }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const { handleExportToExcel, handleImageToExcel } = useInvoiceExport();

  const viewInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  // Add file information to extracted data if missing
  const enhanceDataWithFileInfo = () => {
    if (extractedData && extractedData.length > 0) {
      return extractedData.map((invoice, index) => {
        if (!invoice.fileName) {
          return {
            ...invoice,
            fileName: `Invoice_${index + 1}`
          };
        }
        return invoice;
      });
    }
    return extractedData;
  };

  const handleSelectImageFile = () => {
    handleImageToExcel();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-lg font-medium">
          {extractedData.length} Invoice{extractedData.length !== 1 && 's'} Processed
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => handleExportToExcel(enhanceDataWithFileInfo())} 
            className="gap-2"
            disabled={extractedData.length === 0}
          >
            <FileText className="h-4 w-4" />
            Export to Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleSelectImageFile}
            className="gap-2"
          >
            <FileImage className="h-4 w-4" />
            Convert Image to Excel
          </Button>
        </div>
      </div>

      <InvoiceTable 
        extractedData={extractedData} 
        onViewDetails={viewInvoiceDetails}
      />

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Supports all image formats and sizes including PDFs, A3, and A4 sheets
        </p>
      </div>
    </div>
  );
};

export default MultipleInvoices;
