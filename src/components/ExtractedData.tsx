
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Copy, Check, Filter } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { extractMaterialIds } from "@/utils/dataExtraction";
import { Badge } from "@/components/ui/badge";

interface ExtractedDataProps {
  data: Array<Array<string>> | null;
  isLoading: boolean;
}

const ExtractedData: React.FC<ExtractedDataProps> = ({ data, isLoading }) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [materialIds, setMaterialIds] = useState<string[]>([]);
  const [showMaterialIds, setShowMaterialIds] = useState(false);
  
  useEffect(() => {
    if (data && data.length > 1) {
      const ids = extractMaterialIds(data);
      setMaterialIds(ids);
    }
  }, [data]);

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    
    // Create CSV content
    const csvContent = data.map(row => row.join(',')).join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice_data_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Your data has been exported to CSV",
    });
  };

  const copyToClipboard = () => {
    if (!data || data.length === 0) return;

    // Format as tab-separated values for better paste experience
    const tsvContent = data.map(row => row.join('\t')).join('\n');
    
    navigator.clipboard.writeText(tsvContent).then(
      () => {
        setIsCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Your data has been copied to the clipboard",
        });
        
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      },
      (err) => {
        toast({
          title: "Copy failed",
          description: "Could not copy data to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const toggleMaterialIds = () => {
    setShowMaterialIds(!showMaterialIds);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="shimmer h-6 w-48 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  {[...Array(6)].map((_, i) => (
                    <TableHead key={i}>
                      <div className="shimmer h-4 w-16 rounded"></div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(4)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(6)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="shimmer h-4 w-full rounded"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  const hasTableHeaders = data.length > 1;
  const headers = hasTableHeaders ? data[0] : Array(data[0].length).fill('').map((_, i) => `Column ${i + 1}`);
  const rows = hasTableHeaders ? data.slice(1) : data;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Extracted Data</span>
          <div className="flex gap-2">
            {materialIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMaterialIds}
                className="flex items-center gap-1 text-xs"
              >
                <Filter className="h-3 w-3" />
                {showMaterialIds ? "Hide" : "Show"} Material IDs
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs"
            >
              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="flex items-center gap-1 text-xs"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="table-container overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i} className="whitespace-nowrap">{header}</TableHead>
                ))}
                {showMaterialIds && <TableHead>Material ID</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">
                      {cellIndex === 1 && cell.includes("MIT-") ? (
                        <span className="font-medium">{cell}</span>
                      ) : cell}
                    </TableCell>
                  ))}
                  {showMaterialIds && (
                    <TableCell>
                      {materialIds[rowIndex] && (
                        <Badge variant="secondary" className="font-mono text-xs">
                          {materialIds[rowIndex]}
                        </Badge>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {rows.length} rows of data extracted
      </CardFooter>
    </Card>
  );
};

export default ExtractedData;
