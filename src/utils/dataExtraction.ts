
/**
 * This file contains utilities for extracting data from images
 * In a real application, these would connect to backend services for OCR and data extraction
 */

// Mock function to simulate OCR text extraction
export async function extractTextFromImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    // In a real app, we'd use a service like Tesseract.js or a backend OCR API
    setTimeout(() => {
      // Mock OCR result based on the example invoice
      const mockText = `
        State Name: Karnataka, Code: 29
        Terms of Delivery
        
        SI No. | Part No | Description of Goods | HSN/SAC | Quantity | Rate | per | Disc % | Amount
        1 | Laser Cutting-MIT-EA012B014-04 | SIZE:147.4X179.7X6MM-CUT LENGTH-1207MM-HR | 73269070 | 116 Nos. | 118.500 | Nos. |  | 13,746.000
        2 | Laser Cutting-MIT-EA015C294-02 | SIZE:110X222.4X6MM-CUT LENGTH-949MM-HR | 73269070 | 100 Nos. | 103.000 | Nos. |  | 10,300.000
        3 | Laser Cutting-MIT-EA021C281-05 | SIZE:110X125X6MM-CUT LENGTH-543MM-HR | 73269070 | 10 Nos. | 58.400 | Nos. |  | 584.000
        4 | Laser Cutting-MIT-EA033C300-01 | SIZE:170X240X6MM-CUT LENGTH-1287MM-HR | 73269070 | 20 Nos. | 160.900 | Nos. |  | 3,218.000
        5 | Laser Cutting-MIT-EA033C301-01 | SIZE:125X145X6MM-CUT LENGTH-768MM-HR | 73269070 | 10 Nos. | 78.900 | Nos. |  | 789.000
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
      
      // Mock data table based on the example
      const mockData = [
        ["SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc %", "Amount"],
        ["1", "Laser Cutting-MIT-EA012B014-04", "SIZE:147.4X179.7X6MM-CUT LENGTH-1207MM-HR", "73269070", "116 Nos.", "118.500", "Nos.", "", "13,746.000"],
        ["2", "Laser Cutting-MIT-EA015C294-02", "SIZE:110X222.4X6MM-CUT LENGTH-949MM-HR", "73269070", "100 Nos.", "103.000", "Nos.", "", "10,300.000"],
        ["3", "Laser Cutting-MIT-EA021C281-05", "SIZE:110X125X6MM-CUT LENGTH-543MM-HR", "73269070", "10 Nos.", "58.400", "Nos.", "", "584.000"],
        ["4", "Laser Cutting-MIT-EA033C300-01", "SIZE:170X240X6MM-CUT LENGTH-1287MM-HR", "73269070", "20 Nos.", "160.900", "Nos.", "", "3,218.000"],
        ["5", "Laser Cutting-MIT-EA033C301-01", "SIZE:125X145X6MM-CUT LENGTH-768MM-HR", "73269070", "10 Nos.", "78.900", "Nos.", "", "789.000"]
      ];
      
      resolve(mockData);
    }, 1500);
  });
}

// Full processing pipeline
export async function processInvoice(file: File): Promise<{
  data: Array<Array<string>>;
  highlightAreas: Array<{x: number, y: number, width: number, height: number}>;
  metadata: { [key: string]: string };
}> {
  // In a real app, this would be a proper pipeline connecting to backend services
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock table data based on the example invoice
      const mockData = [
        ["SI No.", "Part No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Disc %", "Amount"],
        ["1", "Laser Cutting-MIT-EA012B014-04", "SIZE:147.4X179.7X6MM-CUT LENGTH-1207MM-HR", "73269070", "116 Nos.", "118.500", "Nos.", "", "13,746.000"],
        ["2", "Laser Cutting-MIT-EA015C294-02", "SIZE:110X222.4X6MM-CUT LENGTH-949MM-HR", "73269070", "100 Nos.", "103.000", "Nos.", "", "10,300.000"],
        ["3", "Laser Cutting-MIT-EA021C281-05", "SIZE:110X125X6MM-CUT LENGTH-543MM-HR", "73269070", "10 Nos.", "58.400", "Nos.", "", "584.000"],
        ["4", "Laser Cutting-MIT-EA033C300-01", "SIZE:170X240X6MM-CUT LENGTH-1287MM-HR", "73269070", "20 Nos.", "160.900", "Nos.", "", "3,218.000"],
        ["5", "Laser Cutting-MIT-EA033C301-01", "SIZE:125X145X6MM-CUT LENGTH-768MM-HR", "73269070", "10 Nos.", "78.900", "Nos.", "", "789.000"],
        ["6", "Laser Cutting-MIT-EA111B538-04 REV 0", "SIZE:175X355X6MM- CUT LENGTH1384MM-HR", "73269070", "12 Nos.", "223.300", "Nos.", "", "2,679.600"],
        ["7", "Laser Cutting-MIT-EA131D885-01", "SIZE:32X32X6MM-CUT LENGTH -157MM-HR 2062", "73269070", "180 Nos.", "8.800", "Nos.", "", "1,584.000"],
        ["8", "Laser Cutting-MIT-EA175C796-01", "SIZE:115X255.4X6MM-CUT LENGTH-1322MM-HR", "73269070", "28 Nos.", "130.800", "Nos.", "", "3,662.400"],
        ["9", "Laser Cutting-MIT-EA179D554-01", "SIZE:100X110X6MM-CUT LENGTH-664MM-HR", "73269070", "10 Nos.", "55.900", "Nos.", "", "559.000"],
        ["10", "Laser Cutting-MIT-EA214C825-01L51", "SIZE:50X1155X6MM-CUT LENGTH 2617MM-HR", "73269070", "6 Nos.", "257.900", "Nos.", "", "1,547.400"],
        ["11", "Laser Cutting-MIT-EA214C825-01L52", "SIZE:50X1230X6MM-CUT LENGTH 2767MM-HR", "73269070", "6 Nos.", "273.900", "Nos.", "", "1,643.400"]
      ];
      
      // Mock metadata extracted from the invoice header
      const mockMetadata = {
        "State Name": "Karnataka",
        "State Code": "29",
        "Terms of Delivery": "Standard",
        "Total Items": "11",
        "Total Quantity": "498 Nos.",
        "Total Amount": "38,313.800"
      };
      
      // Highlight the entire document with specific sections highlighted
      // These coordinates represent percentages of the image dimensions
      const mockHighlights = [
        // Header section (State Name, etc.)
        { x: 2, y: 1, width: 96, height: 8 },
        // Table header row
        { x: 2, y: 10, width: 96, height: 5 },
        // Table data rows (covering all rows in the table)
        { x: 2, y: 15, width: 96, height: 80 }
      ];
      
      resolve({
        data: mockData,
        highlightAreas: mockHighlights,
        metadata: mockMetadata
      });
    }, 4000);
  });
}

/**
 * Extract material IDs from part numbers
 * In a real app, this would use regex patterns or ML to identify material codes
 */
export function extractMaterialIds(data: Array<Array<string>>): string[] {
  const materialIds: string[] = [];
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length >= 2) { // Ensure part number column exists
      // Extract material ID from part number using pattern matching
      // Example: "Laser Cutting-MIT-EA012B014-04" -> "MIT-EA012B014-04"
      const partNumber = row[1];
      const matches = partNumber.match(/MIT-([A-Z0-9-]+)/);
      if (matches && matches[1]) {
        materialIds.push(matches[1]);
      } else {
        materialIds.push("");
      }
    }
  }
  
  return materialIds;
}
