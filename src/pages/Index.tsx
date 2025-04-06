
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, Table } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadTab from '@/components/UploadTab';
import ResultsTab from '@/components/ResultsTab';
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

  const handleReset = () => {
    setActiveTab("upload");
    setFile(null);
    setExtractedData(null);
    setProcessedImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 max-w-5xl">
        <Header />
        
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
              
              <TabsContent value="upload">
                <UploadTab
                  file={file}
                  isProcessing={isProcessing}
                  onFileSelected={handleFileUpload}
                  onProcess={handleProcess}
                />
              </TabsContent>
              
              <TabsContent value="results">
                <ResultsTab
                  file={file}
                  processedImageUrl={processedImageUrl}
                  extractedData={extractedData}
                  highlightAreas={highlightAreas}
                  onReset={handleReset}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Footer />
      </div>
      
      <ProcessingOverlay 
        isActive={isProcessing} 
        currentStage={processingStage} 
      />
    </div>
  );
};

export default Index;
