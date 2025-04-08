
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

  // Generate standard manufacturing template data
  const getDefaultManufacturingTemplateData = () => {
    return {
      stateName: "Karnataka, Code : 29",
      termsOfDelivery: "As per terms",
      items: [
        {
          partNo: "Laser Cutting-MIT-EA012B014-04",
          description: "SIZE:147.4X179.7X6MM-CUT LENGTH-1207MM-HR",
          hsn: "73269070",
          quantity: "116 Nos.",
          rate: "118.500",
          per: "Nos.",
          discountPercentage: "",
          amount: "13,746.000"
        },
        {
          partNo: "Laser Cutting-MIT-EA015C294-02",
          description: "SIZE:110X222.4X6MM-CUT LENGTH-949MM-HR",
          hsn: "73269070",
          quantity: "100 Nos.",
          rate: "103.000",
          per: "Nos.",
          discountPercentage: "",
          amount: "10,300.000"
        },
        {
          partNo: "Laser Cutting-MIT-EA021C281-05",
          description: "SIZE:110X125X6MM-CUT LENGTH-543MM-HR",
          hsn: "73269070",
          quantity: "10 Nos.",
          rate: "58.400",
          per: "Nos.",
          discountPercentage: "",
          amount: "584.000"
        },
        {
          partNo: "Laser Cutting-MIT-EA033C300-01",
          description: "SIZE:170X240X6MM-CUT LENGTH-1287MM-HR",
          hsn: "73269070",
          quantity: "20 Nos.",
          rate: "160.900",
          per: "Nos.",
          discountPercentage: "",
          amount: "3,218.000"
        },
        {
          partNo: "Laser Cutting-MIT-EA033C301-01",
          description: "SIZE:125X145X6MM-CUT LENGTH-768MM-HR",
          hsn: "73269070",
          quantity: "10 Nos.",
          rate: "78.900",
          per: "Nos.",
          discountPercentage: "",
          amount: "789.000"
        },
        {
          partNo: "Laser Cutting-MIT-EA111B538-04 REV 0",
          description: "SIZE:175X355X6MM- CUT LENGTH1384MM-HR",
          hsn: "73269070",
          quantity: "12 Nos.",
          rate: "223.300",
          per: "Nos.",
          discountPercentage: "",
          amount: "2,679.600"
        },
        {
          partNo: "Laser Cutting-MIT-EA131D685-01",
          description: "SIZE:32X32X6MM-CUT LENGTH -157MM-HR 2062",
          hsn: "73269070",
          quantity: "180 Nos.",
          rate: "8.800",
          per: "Nos.",
          discountPercentage: "",
          amount: "1,584.000"
        },
        {
          partNo: "Laser Cutting-MIT-EA175C796-01",
          description: "SIZE:115X255.4X6MM-CUT LENGTH-1322MM-HR",
          hsn: "73269070",
          quantity: "28 Nos.",
          rate: "130.800",
          per: "Nos.",
          discountPercentage: "",
          amount: "3,662.400"
        },
        {
          partNo: "Laser Cutting-MIT-EA179D554-01",
          description: "SIZE:100X110X6MM-CUT LENGTH-664MM-HR",
          hsn: "73269070",
          quantity: "10 Nos.",
          rate: "55.900",
          per: "Nos.",
          discountPercentage: "",
          amount: "559.000"
        },
        {
          partNo: "Laser Cutting-MIT-EA214C825-01LS1",
          description: "SIZE:50X1155X6MM-CUT LENGTH 2617MM-HR",
          hsn: "73269070",
          quantity: "6 Nos.",
          rate: "257.900",
          per: "Nos.",
          discountPercentage: "",
          amount: "1,547.400"
        },
        {
          partNo: "Laser Cutting-MIT-EA214C825-01LS2",
          description: "SIZE:50X1230X6MM-CUT LENGTH 2767MM-HR",
          hsn: "73269070",
          quantity: "6 Nos.",
          rate: "273.900",
          per: "Nos.",
          discountPercentage: "",
          amount: "1,643.400"
        }
      ]
    };
  };

  // Create manufacturing invoice Excel file
  const createManufacturingExcel = (data: any) => {
    const workbook = XLSX.utils.book_new();
    
    // Extract data or use default if not available
    const manufacturingTemplate = data.manufacturingTableData || getDefaultManufacturingTemplateData();
    
    // Create the sheet data
    const stateInfoSheet = [
      ["State Name", ":", manufacturingTemplate.stateName, "", "", "", "Terms of Delivery", manufacturingTemplate.termsOfDelivery]
    ];
    
    stateInfoSheet.push([]);
    
    stateInfoSheet.push([
      "SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc. %", "Amount"
    ]);
    
    manufacturingTemplate.items.forEach((item: any, index: number) => {
      stateInfoSheet.push([
        (index + 1).toString(), // Convert index+1 to string to avoid type mismatch
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
    const ws = XLSX.utils.aoa_to_sheet(stateInfoSheet);
    
    ws['!cols'] = [
      { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, 
      { wch: 10 }, { wch: 10 }, { wch: 5 }, { wch: 10 }, { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, ws, "Manufacturing Invoice");
    
    // Convert to blob and return
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  // Main export function - handles any file/data input
  const handleExportLaserCuttingInvoice = (data: any = {}) => {
    try {
      toast({
        title: "Generating invoice",
        description: "Creating laser cutting invoice template...",
      });
      
      // Create Excel blob
      const excelBlob = createManufacturingExcel(data);
      
      // Generate a meaningful filename based on data or use default
      const fileName = Array.isArray(data) && data.length > 0 && data[0].invoiceNumber 
        ? `Laser_Cutting_Invoice_${data[0].invoiceNumber}.xlsx`
        : 'Laser_Cutting_Invoice.xlsx';
      
      // Download the file
      downloadBlob(excelBlob, fileName);
      
      toast({
        title: "Export successful",
        description: "Laser cutting invoice template has been downloaded",
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
    handleExportLaserCuttingInvoice
  };
};
