
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ChevronRight, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MultipleInvoices = ({ extractedData }: { extractedData: any[] }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const { toast } = useToast();

  const handleExportToExcel = () => {
    // This is a simulated Excel export
    // In a real implementation, you would generate an actual Excel file
    toast({
      title: "Excel export initiated",
      description: `Exporting data for ${extractedData.length} invoice(s)`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Invoice data has been exported to Excel",
      });
    }, 1500);
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
                          onClick={() => {
                            toast({
                              title: "Invoice exported",
                              description: `${invoice.fileName} has been exported to Excel`,
                            });
                          }}
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
