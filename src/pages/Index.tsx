import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ArrowRight, ChevronRight, Download, X } from "lucide-react";
import MultipleInvoices from "@/components/MultipleInvoices";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { toast } = useToast();

  const handleFileUpload = useCallback((newFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    toast({
      title: `${newFiles.length} file(s) added`,
      description: "Files ready for processing",
    });
  }, [toast]);

  const removeFile = useCallback((indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  }, []);

  const removeAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const processFiles = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: "No files to process",
        description: "Please upload at least one invoice first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const processedData = await Promise.all(
        files.map(async (file) => {
          const mockData = {
            fileName: file.name,
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleDateString(),
            total: `$${(Math.random() * 1000).toFixed(2)}`,
            materialId: `MAT-${Math.floor(Math.random() * 100)}`,
            items: [
              {
                description: "Item 1",
                quantity: Math.floor(Math.random() * 10),
                unitPrice: (Math.random() * 100).toFixed(2),
                total: (Math.random() * 100).toFixed(2)
              },
              {
                description: "Item 2",
                quantity: Math.floor(Math.random() * 10),
                unitPrice: (Math.random() * 100).toFixed(2),
                total: (Math.random() * 100).toFixed(2)
              }
            ]
          };
          
          await new Promise(resolve => setTimeout(resolve, 500));
          return mockData;
        })
      );

      setExtractedData(processedData);
      setActiveTab("results");
      toast({
        title: "Processing complete",
        description: `Successfully processed ${files.length} invoice(s)`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing the invoices",
        variant: "destructive",
      });
      console.error("Error processing files:", error);
    } finally {
      setLoading(false);
    }
  }, [files, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="results" disabled={extractedData.length === 0}>
              Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <UploadTab 
              files={files}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
              onRemoveAllFiles={removeAllFiles}
              onProcessFiles={processFiles}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ResultsTab 
              extractedData={extractedData}
              onBack={() => setActiveTab("upload")}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

const Header = () => (
  <header className="bg-primary text-primary-foreground py-4 px-6">
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Invoice OCR Processor</h1>
      <p className="text-sm opacity-90">Upload multiple invoices to extract data and generate Excel reports</p>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-muted py-4 px-6 text-center text-sm text-muted-foreground">
    <div className="container mx-auto">
      <p>Invoice OCR Processor &copy; {new Date().getFullYear()}</p>
    </div>
  </footer>
);

const UploadTab = ({ 
  files, 
  onFileUpload, 
  onRemoveFile,
  onRemoveAllFiles,
  onProcessFiles,
  loading
}: {
  files: File[],
  onFileUpload: (files: File[]) => void,
  onRemoveFile: (index: number) => void,
  onRemoveAllFiles: () => void,
  onProcessFiles: () => void,
  loading: boolean
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const { files } = e.dataTransfer;
    handleFiles(Array.from(files));
  }, []);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  }, []);
  
  const handleFiles = useCallback((newFiles: File[]) => {
    setError(null);
    
    const invalidFiles = newFiles.filter(
      file => !file.type.includes('pdf') && !file.type.includes('image')
    );
    
    if (invalidFiles.length > 0) {
      setError("Only PDF and image files are accepted");
      return;
    }
    
    const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Files must be smaller than 10MB");
      return;
    }
    
    onFileUpload(newFiles);
  }, [onFileUpload]);

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <svg 
              className="h-6 w-6 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, JPG, PNG (max 10MB per file)
            </p>
          </div>
          <input
            type="file"
            id="file-upload"
            multiple
            accept="application/pdf, image/*"
            onChange={handleChange}
            className="hidden"
          />
          <Button variant="outline" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse files
            </label>
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Files ({files.length})</h3>
            <Button variant="ghost" size="sm" onClick={onRemoveAllFiles}>
              Remove all
            </Button>
          </div>
          
          <div className="border rounded-md divide-y">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="bg-muted rounded p-1.5">
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <span className="truncate max-w-xs">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemoveFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={onProcessFiles}
            disabled={loading || files.length === 0}
            className="w-full"
          >
            {loading ? 'Processing...' : `Process ${files.length} file${files.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
};

const ResultsTab = ({ extractedData, onBack }: { extractedData: any[], onBack: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Extracted Data</h2>
        <Button variant="outline" onClick={onBack}>
          Upload more files
        </Button>
      </div>

      <MultipleInvoices extractedData={extractedData} />
    </div>
  );
};

export default Index;
