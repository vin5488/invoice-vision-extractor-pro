
import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-2">
        <span className="gradient-text">InvoiceVision</span> Extractor
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Extract structured data from your invoices automatically using advanced OCR technology
      </p>
    </div>
  );
};

export default Header;
