
/**
 * This file contains utilities for extracting data from images
 * In a real application, these would connect to backend services for OCR and data extraction
 */

// Mock function to simulate OCR text extraction
export async function extractTextFromImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    // In a real app, we'd use a service like Tesseract.js or a backend OCR API
    setTimeout(() => {
      // Mock OCR result
      const mockText = `
        Invoice #: 1234567
        Date: 2023-04-15
        
        Client: ABC Company
        Address: 123 Business St, City, State
        
        Item Description | Quantity | Unit Price | Total
        Widget A | 5 | $10.00 | $50.00
        Widget B | 3 | $15.00 | $45.00
        Service X | 2 | $25.00 | $50.00
        
        Subtotal: $145.00
        Tax (8%): $11.60
        Total: $156.60
      `;
      
      resolve(mockText);
    }, 2000);
  });
}

// Mock function to extract structured data from text
export async function extractStructuredData(text: string): Promise<Array<Array<string>>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Parse the text into a table structure
      // In a real app, this would use more sophisticated parsing
      
      // Mock data table
      const mockData = [
        ["Item Description", "Quantity", "Unit Price", "Total"],
        ["Widget A", "5", "$10.00", "$50.00"],
        ["Widget B", "3", "$15.00", "$45.00"],
        ["Service X", "2", "$25.00", "$50.00"],
        ["", "", "Subtotal", "$145.00"],
        ["", "", "Tax (8%)", "$11.60"],
        ["", "", "Total", "$156.60"]
      ];
      
      resolve(mockData);
    }, 1500);
  });
}

// Full processing pipeline
export async function processInvoice(file: File): Promise<{
  data: Array<Array<string>>;
  highlightAreas: Array<{x: number, y: number, width: number, height: number}>;
}> {
  // In a real app, this would be a proper pipeline connecting to backend services
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock table data - covering the full invoice content
      const mockData = [
        ["Invoice #", "1234567", "Date", "2023-04-15"],
        ["Client", "ABC Company", "", ""],
        ["Address", "123 Business St, City, State", "", ""],
        ["", "", "", ""],
        ["Item Description", "Quantity", "Unit Price", "Total"],
        ["Widget A", "5", "$10.00", "$50.00"],
        ["Widget B", "3", "$15.00", "$45.00"],
        ["Service X", "2", "$25.00", "$50.00"],
        ["", "", "Subtotal", "$145.00"],
        ["", "", "Tax (8%)", "$11.60"],
        ["", "", "Total", "$156.60"]
      ];
      
      // Highlight the entire document with specific sections highlighted
      const mockHighlights = [
        // Header section
        { x: 5, y: 5, width: 90, height: 15 },
        // Address section
        { x: 5, y: 20, width: 90, height: 10 },
        // Table section - covering the entire table area
        { x: 5, y: 35, width: 90, height: 60 }
      ];
      
      resolve({
        data: mockData,
        highlightAreas: mockHighlights
      });
    }, 4000);
  });
}
