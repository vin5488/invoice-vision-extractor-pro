
import os
import cv2
import pandas as pd
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl.styles import Font, Alignment, Border, Side
import argparse
from typing import Dict, List, Any, Optional
import json

class InvoiceExporter:
    """
    A class to export invoice data to Excel files in different formats,
    including laser cutting invoice format.
    """

    def __init__(self):
        """Initialize the InvoiceExporter"""
        pass

    @staticmethod
    def get_default_manufacturing_template_data() -> Dict[str, Any]:
        """Generate default manufacturing template data"""
        return {
            "stateName": "Karnataka, Code : 29",
            "termsOfDelivery": "As per terms",
            "items": [
                {
                    "partNo": "Laser Cutting-MIT-EA012B014-04",
                    "description": "SIZE:147.4X179.7X6MM-CUT LENGTH-1207MM-HR",
                    "hsn": "73269070",
                    "quantity": "116 Nos.",
                    "rate": "118.500",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "13,746.000"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA015C294-02",
                    "description": "SIZE:110X222.4X6MM-CUT LENGTH-949MM-HR",
                    "hsn": "73269070",
                    "quantity": "100 Nos.",
                    "rate": "103.000",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "10,300.000"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA021C281-05",
                    "description": "SIZE:110X125X6MM-CUT LENGTH-543MM-HR",
                    "hsn": "73269070",
                    "quantity": "10 Nos.",
                    "rate": "58.400",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "584.000"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA033C300-01",
                    "description": "SIZE:170X240X6MM-CUT LENGTH-1287MM-HR",
                    "hsn": "73269070",
                    "quantity": "20 Nos.",
                    "rate": "160.900",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "3,218.000"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA033C301-01",
                    "description": "SIZE:125X145X6MM-CUT LENGTH-768MM-HR",
                    "hsn": "73269070",
                    "quantity": "10 Nos.",
                    "rate": "78.900",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "789.000"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA111B538-04 REV 0",
                    "description": "SIZE:175X355X6MM- CUT LENGTH1384MM-HR",
                    "hsn": "73269070",
                    "quantity": "12 Nos.",
                    "rate": "223.300",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "2,679.600"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA131D685-01",
                    "description": "SIZE:32X32X6MM-CUT LENGTH -157MM-HR 2062",
                    "hsn": "73269070",
                    "quantity": "180 Nos.",
                    "rate": "8.800",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "1,584.000"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA175C796-01",
                    "description": "SIZE:115X255.4X6MM-CUT LENGTH-1322MM-HR",
                    "hsn": "73269070",
                    "quantity": "28 Nos.",
                    "rate": "130.800",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "3,662.400"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA179D554-01",
                    "description": "SIZE:100X110X6MM-CUT LENGTH-664MM-HR",
                    "hsn": "73269070",
                    "quantity": "10 Nos.",
                    "rate": "55.900",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "559.000"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA214C825-01LS1",
                    "description": "SIZE:50X1155X6MM-CUT LENGTH 2617MM-HR",
                    "hsn": "73269070",
                    "quantity": "6 Nos.",
                    "rate": "257.900",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "1,547.400"
                },
                {
                    "partNo": "Laser Cutting-MIT-EA214C825-01LS2",
                    "description": "SIZE:50X1230X6MM-CUT LENGTH 2767MM-HR",
                    "hsn": "73269070",
                    "quantity": "6 Nos.",
                    "rate": "273.900",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": "1,643.400"
                }
            ]
        }

    def create_manufacturing_excel(self, data: Optional[Dict[str, Any]] = None) -> str:
        """
        Create a manufacturing invoice Excel file
        
        Args:
            data: Dictionary containing invoice data
            
        Returns:
            Path to the created Excel file
        """
        # Use default data if none provided
        if data is None or not data:
            manufacturing_template = self.get_default_manufacturing_template_data()
        else:
            manufacturing_template = data.get('manufacturingTableData', self.get_default_manufacturing_template_data())
        
        # Create workbook and active worksheet
        wb = Workbook()
        ws = wb.active
        ws.title = "Manufacturing Invoice"
        
        # Add header information
        ws['A1'] = "State Name"
        ws['B1'] = ":"
        ws['C1'] = manufacturing_template.get("stateName", "")
        ws['G1'] = "Terms of Delivery"
        ws['H1'] = manufacturing_template.get("termsOfDelivery", "")
        
        # Add table headers - row 3 (row 2 is empty)
        headers = ["SI No.", "Part No", "Description of Goods", "HSN/SAC", 
                   "Quantity", "Rate", "per", "Disc. %", "Amount"]
        
        for col_idx, header in enumerate(headers, 1):  # Start at column 1 (A)
            ws.cell(row=3, column=col_idx, value=header).font = Font(bold=True)
        
        # Add items data
        items = manufacturing_template.get("items", [])
        for row_idx, item in enumerate(items, 4):  # Start at row 4
            ws.cell(row=row_idx, column=1, value=row_idx - 3)  # SI No.
            ws.cell(row=row_idx, column=2, value=item.get("partNo", ""))
            ws.cell(row=row_idx, column=3, value=item.get("description", ""))
            ws.cell(row=row_idx, column=4, value=item.get("hsn", ""))
            ws.cell(row=row_idx, column=5, value=item.get("quantity", ""))
            ws.cell(row=row_idx, column=6, value=item.get("rate", ""))
            ws.cell(row=row_idx, column=7, value=item.get("per", ""))
            ws.cell(row=row_idx, column=8, value=item.get("discountPercentage", ""))
            ws.cell(row=row_idx, column=9, value=item.get("amount", ""))
            
        # Set column widths
        column_widths = [5, 25, 30, 10, 10, 10, 5, 10, 15]
        for col_idx, width in enumerate(column_widths, 1):
            column_letter = ws.cell(row=1, column=col_idx).column_letter
            ws.column_dimensions[column_letter].width = width
        
        # Save workbook
        output_filename = f"Laser_Cutting_Invoice_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        wb.save(output_filename)
        print(f"Excel file saved as {output_filename}")
        
        return output_filename

    def extract_data_from_image(self, image_path: str) -> Dict[str, Any]:
        """
        Extract invoice data from an image using OpenCV
        
        Args:
            image_path: Path to the invoice image
            
        Returns:
            Dictionary containing extracted invoice data
        """
        print(f"Processing image: {image_path}")
        
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not read image file: {image_path}")
        
        # Convert to grayscale for OCR preparation
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to get binary image
        _, threshold = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
        
        # For now, return placeholder data
        # In a real implementation, you would use OCR libraries like pytesseract
        # to extract the text from the image and parse it into structured data
        
        print("Note: This is a placeholder for OCR functionality. For real OCR, integrate with pytesseract or other OCR libraries.")
        
        # Return mock data
        return {
            "invoiceNumber": f"INV-{os.path.basename(image_path).split('.')[0]}",
            "date": pd.Timestamp.now().strftime('%Y-%m-%d'),
            "materialId": f"MAT-{pd.Timestamp.now().strftime('%d%H%M')}",
            "items": [
                {
                    "description": "Laser Cut Item",
                    "quantity": 10,
                    "unitPrice": "100.00",
                    "total": "1000.00"
                }
            ]
        }

def process_file(file_path: str, exporter: InvoiceExporter) -> Dict[str, Any]:
    """
    Process a file (image or PDF) and extract invoice data
    
    Args:
        file_path: Path to the file
        exporter: InvoiceExporter instance
        
    Returns:
        Dictionary containing extracted data
    """
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    
    if ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']:
        return exporter.extract_data_from_image(file_path)
    elif ext == '.pdf':
        print("PDF processing not implemented yet. Returning placeholder data.")
        return {
            "invoiceNumber": f"INV-{os.path.basename(file_path).split('.')[0]}",
            "date": pd.Timestamp.now().strftime('%Y-%m-%d'),
            "total": "$1,234.56"
        }
    elif ext in ['.json']:
        with open(file_path, 'r') as f:
            return json.load(f)
    else:
        print(f"Unsupported file type: {ext}")
        return {}

def main():
    parser = argparse.ArgumentParser(description='Invoice OCR and Export Tool')
    parser.add_argument('--input', '-i', help='Input directory or file path', default='.')
    parser.add_argument('--output', '-o', help='Output directory', default='.')
    parser.add_argument('--export-only', action='store_true', help='Skip OCR and only export sample data')
    args = parser.parse_args()
    
    exporter = InvoiceExporter()
    
    if args.export_only:
        print("Exporting sample invoice...")
        output_file = exporter.create_manufacturing_excel(None)
        print(f"Sample invoice exported to: {output_file}")
        return
    
    # Process input files
    input_path = args.input
    all_data = []
    
    if os.path.isdir(input_path):
        for file_name in os.listdir(input_path):
            file_path = os.path.join(input_path, file_name)
            if os.path.isfile(file_path):
                try:
                    data = process_file(file_path, exporter)
                    if data:
                        all_data.append(data)
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    elif os.path.isfile(input_path):
        try:
            data = process_file(input_path, exporter)
            if data:
                all_data.append(data)
        except Exception as e:
            print(f"Error processing {input_path}: {e}")
    
    if all_data:
        # Export data to Excel
        output_file = exporter.create_manufacturing_excel({"manufacturingTableData": all_data})
        print(f"Data exported to: {output_file}")
    else:
        print("No data to export.")

if __name__ == "__main__":
    main()
