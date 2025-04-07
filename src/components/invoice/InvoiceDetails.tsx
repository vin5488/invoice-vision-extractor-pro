
import React from 'react';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, ImageIcon } from 'lucide-react';
import ExportButtons from './ExportButtons';

interface InvoiceDetailsProps {
  invoice: any;
}

export const InvoiceDetails = ({ invoice }: InvoiceDetailsProps) => {
  return (
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

        <ExportButtons invoice={invoice} />
      </div>
    </SheetContent>
  );
};
