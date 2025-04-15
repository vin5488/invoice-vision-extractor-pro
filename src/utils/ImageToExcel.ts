
import * as XLSX from 'xlsx';
import { createWorker } from 'tesseract.js';

export class ImageToExcel {
  static async processImage(imageFile: File): Promise<Blob> {
    try {
      // Create a worker for OCR processing
      const worker = await createWorker('eng');
      
      // Read the image file
      const imageData = await this.readFileAsDataURL(imageFile);
      
      // Recognize text from image
      const { data } = await worker.recognize(imageData);
      
      // Extract table data
      const tableData = this.extractTableFromText(data.text);
      
      // Convert to Excel
      const excelBlob = this.convertToExcel(tableData, imageFile.name);
      
      // Terminate worker
      await worker.terminate();
      
      return excelBlob;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }
  
  static extractTableFromText(text: string): any[][] {
    // Split text into lines
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Process each line into columns (this is a simple implementation)
    // In a real application, you might need more sophisticated parsing
    const tableData = lines.map(line => {
      // Split by multiple spaces or tabs
      return line.split(/\s{2,}|\t/).filter(cell => cell.trim().length > 0);
    });
    
    return tableData;
  }
  
  static convertToExcel(data: any[][], fileName: string): Blob {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Extracted Data");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Convert to Blob
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  static readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  static async processPDF(pdfFile: File): Promise<Blob> {
    // PDF processing would be implemented here
    // This is a placeholder for now
    throw new Error('PDF processing is not implemented yet');
  }
}
