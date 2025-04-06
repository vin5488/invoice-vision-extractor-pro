
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-16 text-center text-sm text-gray-500">
      <p>InvoiceVision Extractor Pro &copy; {new Date().getFullYear()}</p>
      <p className="mt-1">Powered by advanced OCR and machine learning technologies</p>
    </footer>
  );
};

export default Footer;
