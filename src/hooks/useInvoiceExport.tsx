
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

  // Flexible data processing that can handle various input formats
  const processExtractedData = (data: any) => {
    // Handle empty data case
    if (!data) return { items: [] };
    
    // Ensure data is always treated as an array
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) return { items: [] };
    
    const items = [];
    let stateName = "Invoice Data";
    let termsOfDelivery = "Standard";
    
    // Process each data item
    for (const invoice of dataArray) {
      if (!invoice) continue;
      
      // Handle different data structures
      if (invoice.items && Array.isArray(invoice.items)) {
        // Case 1: Invoice contains items array
        for (const item of invoice.items) {
          if (!item) continue;
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
      } else if (typeof invoice === 'object') {
        // Case 2: Invoice is an object without items array
        items.push({
          partNo: invoice.invoiceNumber || invoice.partNo || `INV-${Math.floor(Math.random() * 10000)}`,
          description: invoice.description || "Invoice total",
          hsn: invoice.hsn || "",
          quantity: invoice.quantity ? `${invoice.quantity} Nos.` : "1 Nos.",
          rate: invoice.unitPrice || invoice.rate || "0.00",
          per: invoice.per || "Nos.",
          discountPercentage: invoice.discountPercentage || "",
          amount: invoice.total || invoice.amount || "0.00"
        });
      }
      
      // Extract metadata if available
      if (invoice.stateName) stateName = invoice.stateName;
      if (invoice.termsOfDelivery) termsOfDelivery = invoice.termsOfDelivery;
      
      // Handle file metadata if present
      if (invoice.fileName) {
        const fileMeta = {
          partNo: `FILE-${Math.floor(Math.random() * 10000)}`,
          description: `Source: ${invoice.fileName}`,
          hsn: "",
          quantity: "1 Nos.",
          rate: "",
          per: "",
          discountPercentage: "",
          amount: ""
        };
        items.push(fileMeta);
      }
    }
    
    return {
      stateName,
      termsOfDelivery,
      items
    };
  };

  // Create Excel spreadsheet with improved handling of diverse data
  const createExcelFromInvoiceData = (data: any) => {
    const workbook = XLSX.utils.book_new();
    
    // Process data with more flexible approach
    const invoiceData = processExtractedData(data);
    
    // Create sheet data with metadata
    const sheetData = [
      ["State Name", ":", invoiceData.stateName || "", "", "", "", "Terms of Delivery", invoiceData.termsOfDelivery || ""]
    ];
    
    // Add empty row for spacing
    sheetData.push([]);
    
    // Add headers
    sheetData.push([
      "SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc. %", "Amount"
    ]);
    
    // Add invoice items with error handling
    if (invoiceData.items && Array.isArray(invoiceData.items)) {
      invoiceData.items.forEach((item: any, index: number) => {
        if (item) {
          sheetData.push([
            (index + 1).toString(),
            item.partNo || "",
            item.description || "",
            item.hsn || "",
            item.quantity || "",
            item.rate || "",
            item.per || "",
            item.discountPercentage || "",
            item.amount || ""
          ]);
        }
      });
    }
    
    // Create and format worksheet
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    
    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, 
      { wch: 10 }, { wch: 10 }, { wch: 5 }, { wch: 10 }, { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, ws, "Invoice Data");
    
    // Convert to blob and return
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  // Main export function with enhanced error handling
  const handleExportToExcel = (data: any = {}) => {
    try {
      toast({
        title: "Generating Excel file",
        description: "Creating invoice export...",
      });
      
      // Handle empty data case
      if (!data || (Array.isArray(data) && data.length === 0)) {
        toast({
          title: "No data to export",
          description: "There is no invoice data available to export",
          variant: "destructive",
        });
        return;
      }
      
      // Create Excel blob with more robust handling
      const excelBlob = createExcelFromInvoiceData(data);
      
      // Generate filename from data if possible
      const fileName = getFilenameFromData(data);
      
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

  // Helper function to generate meaningful filenames
  const getFilenameFromData = (data: any): string => {
    // Handle array of invoices
    if (Array.isArray(data) && data.length > 0) {
      // Try to get invoice number from first item
      if (data[0].invoiceNumber) {
        return `Invoice_${data[0].invoiceNumber}_and_${data.length - 1}_others.xlsx`;
      }
      
      // If we have filenames, use those
      if (data[0].fileName) {
        const baseName = data[0].fileName.split('.')[0];
        return `${baseName}_processed.xlsx`;
      }
    } 
    // Handle single invoice object
    else if (data && typeof data === 'object') {
      if (data.invoiceNumber) {
        return `Invoice_${data.invoiceNumber}.xlsx`;
      }
      if (data.fileName) {
        const baseName = data.fileName.split('.')[0];
        return `${baseName}_processed.xlsx`;
      }
    }
    
    // Default fallback with timestamp
    return `Invoice_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  };

  return {
    handleExportToExcel
  };
};
