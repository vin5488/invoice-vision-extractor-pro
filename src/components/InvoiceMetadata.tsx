
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InvoiceMetadataProps {
  metadata: { [key: string]: string };
}

const InvoiceMetadata: React.FC<InvoiceMetadataProps> = ({ metadata }) => {
  return (
    <Card className="animate-slide-up">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">{key}</span>
              <div className="flex items-center gap-2">
                {key.toLowerCase().includes('state') ? (
                  <Badge variant="outline" className="bg-green-50">
                    {value}
                  </Badge>
                ) : key.toLowerCase().includes('total') ? (
                  <Badge variant="outline" className="bg-blue-50 font-semibold">
                    {value}
                  </Badge>
                ) : (
                  <span className="text-sm font-medium">{value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceMetadata;
