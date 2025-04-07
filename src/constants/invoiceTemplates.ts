
export const INVOICE_TEMPLATES = [
  {
    type: "construction",
    logo: "YOUR LOGO",
    title: "CONSTRUCTION BILLING INVOICE EXAMPLE TEMPLATE",
    invoiceNumber: "INV-2023-001",
    companyInfo: {
      name: "Company Name",
      address: "Street Address",
      city: "City, State ZIP",
      phone: "Phone",
      email: "Email",
      website: "Website"
    },
    clientInfo: {
      name: "Client Name",
      address: "Client Address",
      city: "Client City, State ZIP",
      phone: "Client Phone",
      email: "Client Email"
    },
    items: [
      { description: "Project Management", quantity: 1, rate: 2500, total: 2500 },
      { description: "Architecture and Design", quantity: 1, rate: 5000, total: 5000 },
      { description: "Construction Labor", quantity: 120, rate: 45, total: 5400 },
      { description: "Materials", quantity: 1, rate: 12000, total: 12000 },
      { description: "Equipment Rental", quantity: 1, rate: 3500, total: 3500 },
      { description: "Permits and Inspections", quantity: 1, rate: 1200, total: 1200 },
    ],
    subtotal: 29600,
    tax: 2368,
    total: 31968
  },
  {
    type: "manufacturing",
    title: "LASER CUTTING INVOICE",
    stateInfo: "Karnataka, Code: 29",
    termsOfDelivery: "30 days from invoice date",
    items: [
      { partNo: "Laser Cutting-MIT-EA012B014-04", description: "SIZE:147.4X179.7X6MM-CUT LENGTH:1207MM-HR", hsn: 73269070, quantity: 116, rate: 118.5, unit: "Nos.", amount: 13746 },
      { partNo: "Laser Cutting-MIT-EA015C294-02", description: "SIZE:110X222.4X6MM-CUT LENGTH:949MM-HR", hsn: 73269070, quantity: 100, rate: 103, unit: "Nos.", amount: 10300 },
      { partNo: "Laser Cutting-MIT-EA021C281-05", description: "SIZE:110X125X6MM-CUT LENGTH:543MM-HR", hsn: 73269070, quantity: 10, rate: 58.4, unit: "Nos.", amount: 584 }
    ],
    total: 24630
  },
  {
    type: "services",
    logo: "T",
    company: "Turnpike Designs Co.",
    companyInfo: {
      address: "156 University Ave, Toronto",
      location: "ON, Canada, M5H 2H7",
      phone: "416-555-1212"
    },
    billTo: {
      name: "Jiro Doi",
      address: "1954 Bloor Street West",
      location: "Toronto, ON, M6P 3K9",
      country: "Canada",
      email: "j_doi@example.com",
      phone: "416-555-1212"
    },
    invoiceDetails: {
      number: "14",
      poNumber: "AD29094",
      date: "2018-09-25",
      paymentDue: "Upon receipt"
    },
    amountDue: "$2,608.20",
    services: [
      { description: "Platinum web hosting package\nDown 35mb, Up 100mb", quantity: 1, price: 65, amount: 65 },
      { description: "2 page website design\nIncludes basic wireframes, and responsive templates", quantity: 3, price: 2100, amount: 2100 },
      { description: "Mobile designs\nIncludes responsive navigation", quantity: 1, price: 250, amount: 250 }
    ],
    subtotal: 2145,
    tax: 193.2,
    totalUSD: 2608.2,
    totalCAD: 2608.2
  }
];
