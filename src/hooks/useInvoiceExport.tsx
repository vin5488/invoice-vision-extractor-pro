
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export const useInvoiceExport = () => {
  const { toast } = useToast();

  // Utility function to download a blob as a file
  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up the object URL to avoid memory leaks
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  // Process extracted data from images and format it for export
  const processExtractedData = (data: any[]) => {
    // If no data is provided, return empty template
    if (!data || data.length === 0) {
      return { items: [] };
    }
    
    const items = [];
    let stateName = "Invoice Data";
    let termsOfDelivery = "Standard";
    
    // Process each invoice in the data array
    for (const invoice of data) {
      // If invoice has items array, process each item
      if (invoice.items && Array.isArray(invoice.items)) {
        for (const item of invoice.items) {
          items.push({
            partNo: item.partNo || invoice.invoiceNumber || `ITEM-${Math.floor(Math.random() * 10000)}`,
            description: item.description || "Item description",
            hsn: item.hsn || "",
            quantity: item.quantity ? `${item.quantity} Nos.` : "1 Nos.",
            rate: item.unitPrice || item.rate || "0.00",
            per: item.per || "Nos.",
            discountPercentage: item.discountPercentage || "",
            amount: item.total || item.amount || "0.00"
          });
        }
      } else {
        // If invoice doesn't have items array, process the invoice itself as an item
        items.push({
          partNo: invoice.invoiceNumber || `INV-${Math.floor(Math.random() * 10000)}`,
          description: invoice.description || "Invoice total",
          hsn: invoice.hsn || "",
          quantity: invoice.quantity ? `${invoice.quantity} Nos.` : "1 Nos.",
          rate: invoice.unitPrice || invoice.rate || "0.00",
          per: invoice.per || "Nos.",
          discountPercentage: invoice.discountPercentage || "",
          amount: invoice.total || invoice.amount || "0.00"
        });
      }
      
      // If any invoice has stateName or termsOfDelivery, use those
      if (invoice.stateName) stateName = invoice.stateName;
      if (invoice.termsOfDelivery) termsOfDelivery = invoice.termsOfDelivery;
    }
    
    return {
      stateName,
      termsOfDelivery,
      items
    };
  };

  // Create Excel spreadsheet from extracted data
  const createExcelFromInvoiceData = (data: any) => {
    const workbook = XLSX.utils.book_new();
    
    // Process the extracted data to get formatted invoice data
    const invoiceData = processExtractedData(Array.isArray(data) ? data : [data]);
    
    // Create the sheet data
    const sheetData = [
      ["State Name", ":", invoiceData.stateName, "", "", "", "Terms of Delivery", invoiceData.termsOfDelivery]
    ];
    
    sheetData.push([]);
    
    sheetData.push([
      "SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc. %", "Amount"
    ]);
    
    // Add invoice items to the sheet
    invoiceData.items.forEach((item: any, index: number) => {
      sheetData.push([
        (index + 1).toString(),
        item.partNo,
        item.description,
        item.hsn,
        item.quantity,
        item.rate,
        item.per,
        item.discountPercentage,
        item.amount
      ]);
    });
    
    // Create the worksheet and set column widths
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    
    ws['!cols'] = [
      { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, 
      { wch: 10 }, { wch: 10 }, { wch: 5 }, { wch: 10 }, { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, ws, "Invoice Data");
    
    // Convert to blob and return
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  // Main export function - handles any file/data input
  const handleExportToExcel = (data: any = {}) => {
    try {
      toast({
        title: "Generating Excel file",
        description: "Creating invoice export...",
      });
      
      // Create Excel blob
      const excelBlob = createExcelFromInvoiceData(data);
      
      // Generate a meaningful filename based on data or use default
      const fileName = Array.isArray(data) && data.length > 0 && data[0].invoiceNumber 
        ? `Invoice_Export_${data[0].invoiceNumber}.xlsx`
        : `Invoice_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Download the file
      downloadBlob(excelBlob, fileName);
      
      toast({
        title: "Export successful",
        description: "Invoice data has been exported to Excel",
      });
    } catch (error) {
      console.error("Excel generation error:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating the Excel file",
        variant: "destructive",
      });
    }
  };

  return {
    handleExportToExcel
  };
};
