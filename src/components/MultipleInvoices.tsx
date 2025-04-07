
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ChevronRight, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

const MultipleInvoices = ({ extractedData }: { extractedData: any[] }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const { toast } = useToast();

  const generateExcelFile = (data: any[]) => {
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(invoice => ({
        'Invoice Number': invoice.invoiceNumber,
        'Date': invoice.date,
        'Material ID': invoice.materialId,
        'Total': invoice.total,
        'Items Count': invoice.items?.length || 0
      }))
    );
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    
    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const generateDetailedExcelFile = (invoice: any) => {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add invoice details worksheet
    const detailsData = [
      { 'Property': 'Invoice Number', 'Value': invoice.invoiceNumber },
      { 'Property': 'Date', 'Value': invoice.date },
      { 'Property': 'Material ID', 'Value': invoice.materialId },
      { 'Property': 'Total', 'Value': invoice.total }
    ];
    const detailsSheet = XLSX.utils.json_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(workbook, detailsSheet, "Invoice Details");
    
    // Add items worksheet if items exist
    if (invoice.items && invoice.items.length > 0) {
      const itemsSheet = XLSX.utils.json_to_sheet(invoice.items.map((item: any) => ({
        'Description': item.description,
        'Quantity': item.quantity,
        'Unit Price': item.unitPrice,
        'Total': item.total
      })));
      XLSX.utils.book_append_sheet(workbook, itemsSheet, "Invoice Items");
    }
    
    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up the URL object
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

  const handleExportSingleInvoice = (invoice: any) => {
    try {
      const excelBlob = generateDetailedExcelFile(invoice);
      downloadBlob(excelBlob, `Invoice_${invoice.invoiceNumber}.xlsx`);
      
      toast({
        title: "Invoice exported",
        description: `${invoice.fileName} has been downloaded as an Excel file`,
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
          Export to Excel
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
                          {invoice.fileName}
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

                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          onClick={() => handleExportSingleInvoice(invoice)}
                        >
                          <Download className="h-4 w-4" />
                          Export this invoice
                        </Button>
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
          To export all invoice data, click the "Export to Excel" button above
        </p>
      </div>
    </div>
  );
};

export default MultipleInvoices;
