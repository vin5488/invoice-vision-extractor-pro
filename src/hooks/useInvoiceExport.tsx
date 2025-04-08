import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { INVOICE_TEMPLATES } from '@/constants/invoiceTemplates';

export const useInvoiceExport = () => {
  const { toast } = useToast();

  const generateExcelFile = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(invoice => ({
        'Invoice Number': invoice.invoiceNumber,
        'Date': invoice.date,
        'Material ID': invoice.materialId,
        'Total': invoice.total,
        'Items Count': invoice.items?.length || 0
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const generateSampleInvoice = (templateIndex: number, baseInvoice: any) => {
    const template = INVOICE_TEMPLATES[templateIndex % INVOICE_TEMPLATES.length];
    
    const wb = XLSX.utils.book_new();
    
    if (template.type === "construction") {
      const header = [
        ["", template.title, ""],
        ["", ""],
        ["FROM:", "", "INVOICE #:", template.invoiceNumber],
        [template.companyInfo.name, "", "DATE:", baseInvoice.date || "2023-05-15"],
        [template.companyInfo.address, "", "DUE DATE:", "NET 30"],
        [template.companyInfo.city, "", "TERMS:", "Due on receipt"],
        [template.companyInfo.phone],
        [template.companyInfo.email],
        [""],
        ["BILL TO:"],
        [template.clientInfo.name],
        [template.clientInfo.address],
        [template.clientInfo.city],
        [template.clientInfo.phone],
        [""],
        ["DESCRIPTION", "QTY", "RATE", "AMOUNT"]
      ];
      
      template.items.forEach(item => {
        header.push([item.description, item.quantity, item.rate, item.total]);
      });
      
      header.push(
        ["", "", "SUBTOTAL:", template.subtotal],
        ["", "", "TAX (8%):", template.tax],
        ["", "", "TOTAL:", template.total],
        [""],
        ["THANK YOU"]
      );
      
      const ws = XLSX.utils.aoa_to_sheet(header);
      XLSX.utils.book_append_sheet(wb, ws, "Invoice");
      
      ws['!cols'] = [{ wch: 40 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];
    } 
    else if (template.type === "manufacturing") {
      const header = [
        ["State Name:", template.stateInfo, "", "", "", "", "Terms of Delivery:", template.termsOfDelivery],
        [""],
        ["SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc. %", "Amount"]
      ];
      
      template.items.forEach((item, index) => {
        header.push([
          index + 1, 
          item.partNo, 
          item.description, 
          item.hsn, 
          `${item.quantity} Nos.`, 
          item.rate.toFixed(3), 
          item.unit, 
          "", 
          item.amount.toFixed(3)
        ]);
      });
      
      header.push(["", "", "", "", "", "", "", "Total:", template.total.toFixed(3)]);
      
      const ws = XLSX.utils.aoa_to_sheet(header);
      XLSX.utils.book_append_sheet(wb, ws, "Invoice");
      
      ws['!cols'] = [
        { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, 
        { wch: 10 }, { wch: 10 }, { wch: 5 }, { wch: 10 }, { wch: 15 }
      ];
    }
    else if (template.type === "services") {
      const header = [
        [template.company, "", "", "", "INVOICE"],
        [template.companyInfo.address],
        [template.companyInfo.location],
        [template.companyInfo.phone],
        [""],
        ["BILL TO", "", "", "Invoice Number:", template.invoiceDetails.number],
        [template.billTo.name, "", "", "P.O./S.O. Number:", template.invoiceDetails.poNumber],
        [template.billTo.address, "", "", "Invoice Date:", template.invoiceDetails.date],
        [template.billTo.location, "", "", "Payment Due:", template.invoiceDetails.paymentDue],
        [template.billTo.country],
        [template.billTo.email, "", "", "Amount Due (USD):", template.amountDue],
        [template.billTo.phone],
        [""],
        ["Services", "", "Quantity", "Price", "Amount"],
      ];
      
      template.services.forEach((service) => {
        header.push([service.description, "", service.quantity.toString(), service.price.toFixed(2), service.amount.toFixed(2)]);
      });
      
      header.push(
        ["", "", "", "Subtotal:", template.subtotal.toFixed(2)],
        ["", "", "", "Tax 8%:", template.tax.toFixed(2)],
        ["", "", "", "Total:", template.totalUSD.toFixed(2)],
        ["", "", "", "Amount due (CAD):", template.totalCAD.toFixed(2)]
      );
      
      const ws = XLSX.utils.aoa_to_sheet(header);
      XLSX.utils.book_append_sheet(wb, ws, "Invoice");
      
      ws['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];
    }
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const generateImageBasedExcel = (invoice: any) => {
    const workbook = XLSX.utils.book_new();
    
    if (invoice.manufacturingTableData) {
      const manufacturingData = invoice.manufacturingTableData;
      
      const stateInfoSheet = [
        ["State Name", ":", manufacturingData.stateName || "Karnataka, Code : 29", "", "", "", "Terms of Delivery", manufacturingData.termsOfDelivery || ""]
      ];
      
      stateInfoSheet.push([]);
      
      stateInfoSheet.push([
        "SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc. %", "Amount"
      ]);
      
      manufacturingData.items.forEach((item: any, index: number) => {
        stateInfoSheet.push([
          index + 1,
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
      
      const ws = XLSX.utils.aoa_to_sheet(stateInfoSheet);
      
      ws['!cols'] = [
        { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, 
        { wch: 10 }, { wch: 10 }, { wch: 5 }, { wch: 10 }, { wch: 15 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, ws, "Manufacturing Invoice");
    } else {
      const manufacturingTemplate = {
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
      
      const stateInfoSheet = [
        ["State Name", ":", manufacturingTemplate.stateName, "", "", "", "Terms of Delivery", manufacturingTemplate.termsOfDelivery]
      ];
      
      stateInfoSheet.push([]);
      
      stateInfoSheet.push([
        "SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc. %", "Amount"
      ]);
      
      manufacturingTemplate.items.forEach((item, index) => {
        stateInfoSheet.push([
          index + 1,
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
      
      const ws = XLSX.utils.aoa_to_sheet(stateInfoSheet);
      
      ws['!cols'] = [
        { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, 
        { wch: 10 }, { wch: 10 }, { wch: 5 }, { wch: 10 }, { wch: 15 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, ws, "Manufacturing Invoice");
    }
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  const handleExportToExcel = (extractedData: any[]) => {
    toast({
      title: "Excel export initiated",
      description: `Exporting data for ${extractedData.length} invoice(s)`,
    });
    
    try {
      const excelBlob = generateExcelFile(extractedData);
      downloadBlob(excelBlob, "Invoices_Summary.xlsx");
      
      toast({
        title: "Export complete",
        description: "Invoice data has been downloaded as an Excel file",
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

  const handleExportFromImage = (invoice: any) => {
    try {
      const excelBlob = generateImageBasedExcel(invoice);
      downloadBlob(excelBlob, `Image_Invoice_${invoice.invoiceNumber || "data"}.xlsx`);
      
      toast({
        title: "Image data exported",
        description: "Invoice data from image has been converted to Excel",
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

  const handleExportSingleInvoice = (invoice: any, templateIndex: number = 0) => {
    try {
      const excelBlob = generateSampleInvoice(templateIndex, invoice);
      downloadBlob(excelBlob, `Invoice_${invoice.invoiceNumber}_${INVOICE_TEMPLATES[templateIndex % INVOICE_TEMPLATES.length].type}.xlsx`);
      
      toast({
        title: "Invoice exported",
        description: `${invoice.fileName || invoice.invoiceNumber} has been downloaded as an Excel file`,
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

  const handleExportLaserCuttingInvoice = () => {
    try {
      const excelBlob = generateImageBasedExcel({});
      downloadBlob(excelBlob, `Laser_Cutting_Invoice.xlsx`);
      
      toast({
        title: "Manufacturing invoice exported",
        description: "Laser cutting invoice data has been exported to Excel",
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
    handleExportToExcel,
    handleExportSingleInvoice,
    handleExportFromImage,
    handleExportLaserCuttingInvoice
  };
};
