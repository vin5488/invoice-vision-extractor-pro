
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
    
    // Convert image data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Invoice Generated from Image"],
      [""],
      ["Invoice Number:", invoice.invoiceNumber || "Auto-generated"],
      ["Date:", invoice.date || new Date().toLocaleDateString()],
      ["Total Amount:", invoice.total || "0.00"],
      [""],
      ["Note: This Excel file was generated based on image recognition of invoice data."]
    ]);
    
    // Add the items if available
    if (invoice.items && invoice.items.length > 0) {
      const itemsData: any[][] = [
        ["Description", "Quantity", "Unit Price", "Total"]
      ];
      
      invoice.items.forEach((item: any) => {
        itemsData.push([
          item.description,
          item.quantity.toString(),
          item.unitPrice,
          item.total
        ]);
      });
      
      const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData);
      XLSX.utils.book_append_sheet(workbook, itemsSheet, "Extracted Items");
    }
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice Summary");
    
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

  return {
    handleExportToExcel,
    handleExportSingleInvoice,
    handleExportFromImage
  };
};
