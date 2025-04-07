import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ChevronRight, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

const INVOICE_TEMPLATES = [
  {
    type: "construction",
    logo: "YOUR LOGO",
    title: "CONSTRUCTION BILLING INVOICE EXAMPLE TEMPLATE",
    invoiceNumber: "INV-2023-001",
    companyInfo: {
      name: "Company Name",
      address: "Street Address",
      city: "City, State ZIP",
      phone: "Phone",
      email: "Email",
      website: "Website"
    },
    clientInfo: {
      name: "Client Name",
      address: "Client Address",
      city: "Client City, State ZIP",
      phone: "Client Phone",
      email: "Client Email"
    },
    items: [
      { description: "Project Management", quantity: 1, rate: 2500, total: 2500 },
      { description: "Architecture and Design", quantity: 1, rate: 5000, total: 5000 },
      { description: "Construction Labor", quantity: 120, rate: 45, total: 5400 },
      { description: "Materials", quantity: 1, rate: 12000, total: 12000 },
      { description: "Equipment Rental", quantity: 1, rate: 3500, total: 3500 },
      { description: "Permits and Inspections", quantity: 1, rate: 1200, total: 1200 },
    ],
    subtotal: 29600,
    tax: 2368,
    total: 31968
  },
  {
    type: "manufacturing",
    title: "LASER CUTTING INVOICE",
    stateInfo: "Karnataka, Code: 29",
    termsOfDelivery: "30 days from invoice date",
    items: [
      { partNo: "Laser Cutting-MIT-EA012B014-04", description: "SIZE:147.4X179.7X6MM-CUT LENGTH:1207MM-HR", hsn: 73269070, quantity: 116, rate: 118.5, unit: "Nos.", amount: 13746 },
      { partNo: "Laser Cutting-MIT-EA015C294-02", description: "SIZE:110X222.4X6MM-CUT LENGTH:949MM-HR", hsn: 73269070, quantity: 100, rate: 103, unit: "Nos.", amount: 10300 },
      { partNo: "Laser Cutting-MIT-EA021C281-05", description: "SIZE:110X125X6MM-CUT LENGTH:543MM-HR", hsn: 73269070, quantity: 10, rate: 58.4, unit: "Nos.", amount: 584 }
    ],
    total: 24630
  },
  {
    type: "services",
    logo: "T",
    company: "Turnpike Designs Co.",
    companyInfo: {
      address: "156 University Ave, Toronto",
      location: "ON, Canada, M5H 2H7",
      phone: "416-555-1212"
    },
    billTo: {
      name: "Jiro Doi",
      address: "1954 Bloor Street West",
      location: "Toronto, ON, M6P 3K9",
      country: "Canada",
      email: "j_doi@example.com",
      phone: "416-555-1212"
    },
    invoiceDetails: {
      number: "14",
      poNumber: "AD29094",
      date: "2018-09-25",
      paymentDue: "Upon receipt"
    },
    amountDue: "$2,608.20",
    services: [
      { description: "Platinum web hosting package\nDown 35mb, Up 100mb", quantity: 1, price: 65, amount: 65 },
      { description: "2 page website design\nIncludes basic wireframes, and responsive templates", quantity: 3, price: 2100, amount: 2100 },
      { description: "Mobile designs\nIncludes responsive navigation", quantity: 1, price: 250, amount: 250 }
    ],
    subtotal: 2145,
    tax: 193.2,
    totalUSD: 2608.2,
    totalCAD: 2608.2
  }
];

const MultipleInvoices = ({ extractedData }: { extractedData: any[] }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
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

  const generateDetailedExcelFile = (invoice: any) => {
    const workbook = XLSX.utils.book_new();
    
    const detailsData = [
      { 'Property': 'Invoice Number', 'Value': invoice.invoiceNumber },
      { 'Property': 'Date', 'Value': invoice.date },
      { 'Property': 'Material ID', 'Value': invoice.materialId },
      { 'Property': 'Total', 'Value': invoice.total }
    ];
    const detailsSheet = XLSX.utils.json_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(workbook, detailsSheet, "Invoice Details");
    
    if (invoice.items && invoice.items.length > 0) {
      const itemsSheet = XLSX.utils.json_to_sheet(invoice.items.map((item: any) => ({
        'Description': item.description,
        'Quantity': item.quantity,
        'Unit Price': item.unitPrice,
        'Total': item.total
      })));
      XLSX.utils.book_append_sheet(workbook, itemsSheet, "Invoice Items");
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

  const handleExportToExcel = () => {
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

  const viewInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {extractedData.length} Invoice{extractedData.length !== 1 && 's'} Processed
        </h3>
        <Button onClick={handleExportToExcel} className="gap-2">
          <Download className="h-4 w-4" />
          Export Summary
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Material ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extractedData.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.materialId}</TableCell>
                <TableCell>{invoice.total}</TableCell>
                <TableCell>{invoice.items?.length || 0}</TableCell>
                <TableCell>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => viewInvoiceDetails(invoice)}
                      >
                        Details <ChevronRight className="h-3 w-3" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Invoice Details</SheetTitle>
                        <SheetDescription>
                          {invoice.fileName || invoice.invoiceNumber}
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="py-4 space-y-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Invoice Information</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Invoice Number:</div>
                            <div>{invoice.invoiceNumber}</div>
                            <div className="text-muted-foreground">Date:</div>
                            <div>{invoice.date}</div>
                            <div className="text-muted-foreground">Total:</div>
                            <div>{invoice.total}</div>
                            <div className="text-muted-foreground">Material ID:</div>
                            <div>{invoice.materialId}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Items</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Description</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {invoice.items?.map((item: any, idx: number) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>${item.unitPrice}</TableCell>
                                  <TableCell>${item.total}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Export Options</h4>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <Button 
                              variant="outline" 
                              className="gap-2"
                              onClick={() => handleExportSingleInvoice(invoice, 0)}
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                              Construction
                            </Button>
                            <Button 
                              variant="outline" 
                              className="gap-2"
                              onClick={() => handleExportSingleInvoice(invoice, 1)}
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                              Manufacturing
                            </Button>
                            <Button 
                              variant="outline" 
                              className="gap-2"
                              onClick={() => handleExportSingleInvoice(invoice, 2)}
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                              Services
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          To export all invoice data, click the "Export Summary" button above
        </p>
      </div>
    </div>
  );
};

export default MultipleInvoices;
