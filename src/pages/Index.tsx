
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, Wand2, Table, ArrowRight } from 'lucide-react';

import FileUpload from '@/components/FileUpload';
import ImagePreview from '@/components/ImagePreview';
import ExtractedData from '@/components/ExtractedData';
import ProcessingOverlay from '@/components/ProcessingOverlay';

import { processInvoice } from '@/utils/dataExtraction';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Array<Array<string>> | null>(null);
  const [highlightAreas, setHighlightAreas] = useState<Array<{x: number, y: number, width: number, height: number}>>([]);
  const [processingStage, setProcessingStage] = useState("Initializing...");
  
  const { toast } = useToast();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setProcessedImageUrl(null);
    setExtractedData(null);
    setHighlightAreas([]);
  };

  const handleProcess = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an invoice image first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStage("Preprocessing image...");
      
      // Process in stages to show progress
      setTimeout(() => setProcessingStage("Detecting document elements..."), 1000);
      setTimeout(() => setProcessingStage("Performing OCR analysis..."), 2500);
      setTimeout(() => setProcessingStage("Extracting structured data..."), 4000);
      
      // Process the invoice
      const result = await processInvoice(file);
      
      // Set the extracted data
      setExtractedData(result.data);
      setHighlightAreas(result.highlightAreas);
      
      // Create a URL for the processed image
      const imageUrl = URL.createObjectURL(file);
      setProcessedImageUrl(imageUrl);
      
      // Switch to the results tab
      setActiveTab("results");
      
      toast({
        title: "Processing complete",
        description: "Successfully extracted data from your invoice",
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing error",
        description: "Failed to process the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">InvoiceVision</span> Extractor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract structured data from your invoices automatically using advanced OCR technology
          </p>
        </div>
        
        {/* Main content */}
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle>Invoice Data Extraction</CardTitle>
            <CardDescription>
              Upload an invoice image, and we'll automatically extract the tabular data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upload" disabled={isProcessing}>
                  <FileUp className="mr-2 h-4 w-4" /> Upload
                </TabsTrigger>
                <TabsTrigger value="results" disabled={!extractedData}>
                  <Table className="mr-2 h-4 w-4" /> Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-6">
                <FileUpload 
                  onFileSelected={handleFileUpload} 
                  isProcessing={isProcessing}
                />
                
                {file && !isProcessing && (
                  <div className="mt-6">
                    <Separator className="my-6" />
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Preview</h3>
                      <Button 
                        onClick={handleProcess}
                        disabled={isProcessing || !file}
                        className="bg-gradient-blue hover:opacity-90"
                      >
                        <Wand2 className="mr-2 h-4 w-4" /> Process Invoice
                      </Button>
                    </div>
                    <ImagePreview file={file} processedImageUrl={null} />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="results" className="space-y-8">
                {extractedData && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Processed Image</h3>
                        <ImagePreview 
                          file={file} 
                          processedImageUrl={processedImageUrl} 
                          highlightedAreas={highlightAreas}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Extracted Data</h3>
                        <ExtractedData 
                          data={extractedData} 
                          isLoading={false} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <Button 
                        onClick={() => {
                          setActiveTab("upload");
                          setFile(null);
                          setExtractedData(null);
                          setProcessedImageUrl(null);
                        }}
                        variant="outline"
                        className="mr-4"
                      >
                        Upload New Invoice
                      </Button>
                      <Button className="bg-gradient-blue hover:opacity-90">
                        Process Another Section <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>InvoiceVision Extractor Pro &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Powered by advanced OCR and machine learning technologies</p>
        </footer>
      </div>
      
      {/* Processing overlay */}
      <ProcessingOverlay 
        isActive={isProcessing} 
        currentStage={processingStage} 
      />
    </div>
  );
};

export default Index;
