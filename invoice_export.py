
import os
import cv2
import pandas as pd
import numpy as np
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
        # Try to import pytesseract if available
        try:
            import pytesseract
            self.pytesseract = pytesseract
            self.ocr_available = True
        except ImportError:
            print("Warning: pytesseract not found. OCR functionality will be limited.")
            self.ocr_available = False

    @staticmethod
    def get_default_manufacturing_template_data() -> Dict[str, Any]:
        """Generate default manufacturing template data"""
        # ... keep existing code (default template data)

    def create_manufacturing_excel(self, data: Optional[Dict[str, Any]] = None) -> str:
        """
        Create a manufacturing invoice Excel file
        
        Args:
            data: Dictionary containing invoice data
            
        Returns:
            Path to the created Excel file
        """
        # ... keep existing code (Excel creation functionality)

    def extract_data_from_image(self, image_path: str) -> Dict[str, Any]:
        """
        Extract invoice data from an image using OpenCV and OCR
        
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

        # Determine image type/size
        height, width = image.shape[:2]
        print(f"Image dimensions: {width}x{height} pixels")
        
        # Apply different preprocessing based on image size
        # A4 is roughly 2480 x 3508 pixels at 300 DPI
        # A3 is roughly 3508 x 4961 pixels at 300 DPI
        if width > 3000 or height > 3000:
            print("Detected large format image (possibly A3)")
            # For large images, use a higher scaling factor and preprocessing
            image = self.preprocess_large_image(image)
        
        # Enhanced table detection and extraction
        extracted_data = self.detect_and_extract_table(image)
        
        # If extraction failed or no tables found, return placeholder data
        if not extracted_data or not extracted_data.get("items"):
            print("Warning: Could not extract tabular data properly, using advanced OCR method")
            extracted_data = self.advanced_ocr_extraction(image)
            
        return extracted_data

    def preprocess_large_image(self, image: np.ndarray) -> np.ndarray:
        """
        Specialized preprocessing for large format images like A3
        
        Args:
            image: OpenCV image object
            
        Returns:
            Preprocessed image
        """
        # Calculate scaling factor based on image size
        height, width = image.shape[:2]
        max_dimension = 3000  # Limit max dimension for better processing
        
        # Only scale if needed
        if height > max_dimension or width > max_dimension:
            scale_factor = max_dimension / max(height, width)
            new_width = int(width * scale_factor)
            new_height = int(height * scale_factor)
            image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
            print(f"Resized image to: {new_width}x{new_height} pixels")
            
        # Apply additional preprocessing specific to large format images
        # Enhance contrast
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        lab = cv2.merge((l, a, b))
        image = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
        
        return image

    def detect_and_extract_table(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Enhanced table detection and cell extraction from invoice image
        
        Args:
            image: OpenCV image object
            
        Returns:
            Dictionary containing extracted table data
        """
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive thresholding with optimized parameters
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                      cv2.THRESH_BINARY_INV, 15, 5)
        
        # Dilate to connect text in cells
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        dilated = cv2.dilate(thresh, kernel, iterations=2)
        
        # Find contours
        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter contours to get table cells (eliminate too small contours)
        min_cell_area = image.shape[0] * image.shape[1] / 400  # More adaptive threshold
        cells = []
        
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            area = w * h
            
            # Filter out noise and keep only cell-like rectangles
            # Adjusted thresholds for better detection on various paper sizes
            if area > min_cell_area and w > 20 and h > 15:
                # Add padding to make sure we capture entire cell content
                padding = 5  # Increased padding
                x_with_padding = max(0, x - padding)
                y_with_padding = max(0, y - padding)
                w_with_padding = min(image.shape[1] - x_with_padding, w + 2*padding)
                h_with_padding = min(image.shape[0] - y_with_padding, h + 2*padding)
                
                cells.append((x_with_padding, y_with_padding, w_with_padding, h_with_padding))
        
        # Sort cells by y-coordinate to group rows
        cells.sort(key=lambda c: c[1])
        
        # Group cells into rows based on y-position
        # Increased y_tolerance for better detection in various formats
        y_tolerance = image.shape[0] / 25
        rows = []
        current_row = []
        
        if cells:
            current_row = [cells[0]]
            prev_y = cells[0][1]
            
            for i in range(1, len(cells)):
                x, y, w, h = cells[i]
                
                # If this cell is on a new row
                if abs(y - prev_y) > y_tolerance:
                    # Sort current row by x-coordinate
                    current_row.sort(key=lambda c: c[0])
                    rows.append(current_row)
                    current_row = [cells[i]]
                    prev_y = y
                else:
                    current_row.append(cells[i])
            
            # Add the last row
            if current_row:
                current_row.sort(key=lambda c: c[0])
                rows.append(current_row)
        
        # Parse table content using OCR if available
        items = []
        headers = []
        
        # Extract text from each cell with enhanced preprocessing
        for i, row in enumerate(rows):
            row_data = []
            
            for j, (x, y, w, h) in enumerate(row):
                # Extract cell ROI
                cell_image = gray[y:y+h, x:x+w]
                
                # Preprocess cell for better OCR
                # Enhanced preprocessing for better OCR results
                cell_image = cv2.GaussianBlur(cell_image, (3, 3), 0)
                _, cell_binary = cv2.threshold(cell_image, 0, 255, 
                                              cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                
                # Noise removal
                kernel = np.ones((1, 1), np.uint8)
                cell_binary = cv2.morphologyEx(cell_binary, cv2.MORPH_OPEN, kernel)
                
                # Apply OCR to the cell with optimized config for tabular data
                if self.ocr_available:
                    config = r'--oem 3 --psm 6 -c tessedit_char_whitelist="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-=.,;:/%$()\'"'
                    text = self.pytesseract.image_to_string(cell_binary, config=config).strip()
                else:
                    # If OCR isn't available, use cell position as placeholder
                    text = f"Cell_{i}_{j}"
                
                row_data.append(text)
            
            if i == 0:  # First row is likely headers
                headers = row_data
            else:  # Other rows are data
                # Create item dictionary based on likely column meanings
                item = {}
                
                # Try to match data with common invoice fields
                for j, cell_text in enumerate(row_data):
                    col_name = f"col_{j}" if j >= len(headers) else headers[j]
                    
                    # Map to standard fields based on typical invoice structure
                    # Enhanced field detection logic
                    if j == 0:  # First column often contains part numbers or IDs
                        item["partNo"] = cell_text
                    elif j == 1:  # Second column typically has descriptions
                        item["description"] = cell_text
                    elif j == 2:  # Third column might be HSN code
                        item["hsn"] = cell_text
                    elif j == 3:  # Fourth column often has quantity
                        item["quantity"] = cell_text
                    elif j == 4:  # Fifth column might have rates/prices
                        item["rate"] = cell_text
                    elif j == 5:  # Sixth column might have unit (per)
                        item["per"] = cell_text
                    elif j == 6:  # Seventh column might have discount
                        item["discountPercentage"] = cell_text
                    elif j == 7:  # Eighth column might have amount/total
                        item["amount"] = cell_text
                    else:
                        item[f"field_{j}"] = cell_text
                
                if any(item.values()):  # Only add items that have some data
                    items.append(item)
        
        # Construct and return the extracted data
        return {
            "invoiceNumber": f"INV-{pd.Timestamp.now().strftime('%Y%m%d%H%M%S')}",
            "date": pd.Timestamp.now().strftime('%Y-%m-%d'),
            "stateName": "Extracted from Image",
            "termsOfDelivery": "Standard",
            "items": items
        }

    def advanced_ocr_extraction(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Advanced OCR extraction for images where table detection fails
        Uses full-page OCR and attempts to parse structured data
        
        Args:
            image: OpenCV image object
            
        Returns:
            Dictionary containing extracted data
        """
        if not self.ocr_available:
            print("Advanced OCR requires pytesseract")
            return {"items": []}
        
        # Preprocess image for better OCR
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive thresholding
        binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                    cv2.THRESH_BINARY, 11, 5)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(binary, None, 10, 7, 21)
        
        # Extract text using pytesseract in different modes for comparison
        config_line = r'--oem 3 --psm 6'  # Assume line-by-line text
        text_line = self.pytesseract.image_to_string(denoised, config=config_line)
        
        config_table = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'  # Better for tables
        text_table = self.pytesseract.image_to_string(denoised, config=config_table)
        
        # Attempt to parse the extracted text into structured data
        items = []
        
        # Split text into lines and look for patterns that resemble invoice items
        lines = text_line.split('\n')
        current_item = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Try to identify lines that contain item details
            if any(keyword in line.lower() for keyword in ['item', 'description', 'quantity', 'price', 'amount']):
                # This might be a header line, skip
                continue
                
            # Look for patterns like: ItemCode Description Qty Price Amount
            parts = line.split()
            if len(parts) >= 5:  # Assuming at least 5 parts for a valid item line
                try:
                    # Try to parse an item based on positional data
                    # This is a simplified approach; real invoices vary widely
                    item = {
                        "partNo": parts[0],
                        "description": ' '.join(parts[1:-3]),  # Middle parts are usually description
                        "hsn": "",
                        "quantity": parts[-3],  # Quantity often 3rd from end
                        "rate": parts[-2],      # Rate often 2nd from end
                        "per": "Nos.",
                        "discountPercentage": "",
                        "amount": parts[-1]     # Amount usually last
                    }
                    items.append(item)
                except Exception as e:
                    print(f"Error parsing line: {line}, {str(e)}")
        
        if not items:  # Fallback
            print("Basic parsing failed, using simplified extraction")
            # Find number patterns that might be prices
            import re
            price_pattern = r'\$?\d+[.,]\d{2}'  # e.g. $10.99 or 10.99 or 10,99
            prices = re.findall(price_pattern, text_line)
            
            if prices:
                items.append({
                    "partNo": "ITEM-1",
                    "description": "Extracted Item",
                    "hsn": "",
                    "quantity": "1",
                    "rate": prices[0] if len(prices) > 0 else "0.00",
                    "per": "Nos.",
                    "discountPercentage": "",
                    "amount": prices[-1] if len(prices) > 1 else prices[0] if prices else "0.00"
                })
        
        return {
            "invoiceNumber": f"OCR-{pd.Timestamp.now().strftime('%Y%m%d%H%M%S')}",
            "date": pd.Timestamp.now().strftime('%Y-%m-%d'),
            "stateName": "Extracted with Advanced OCR",
            "termsOfDelivery": "Standard",
            "items": items
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
    # ... keep existing code (file processing)

def main():
    # ... keep existing code (main function)

if __name__ == "__main__":
    main()
