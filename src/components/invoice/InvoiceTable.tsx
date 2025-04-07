
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { ChevronRight } from 'lucide-react';
import { InvoiceDetails } from '@/components/invoice/InvoiceDetails';

interface InvoiceTableProps {
  extractedData: any[];
  onViewDetails: (invoice: any) => void;
}

const InvoiceTable = ({ extractedData, onViewDetails }: InvoiceTableProps) => {
  return (
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
                      onClick={() => onViewDetails(invoice)}
                    >
                      Details <ChevronRight className="h-3 w-3" />
                    </Button>
                  </SheetTrigger>
                  <InvoiceDetails invoice={invoice} />
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
