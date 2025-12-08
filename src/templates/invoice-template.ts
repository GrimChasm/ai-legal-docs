export default function invoiceTemplateTemplate(values: {
  businessName: string
  businessAddress: string
  contactEmail: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  clientName: string
  clientAddress: string
  items: string
  paymentTerms: string
}) {
  return `
  Generate a professional **Invoice Template** in professional formatting.
  
  Details:
  - Business Name: ${values.businessName}
  - Business Address: ${values.businessAddress}
  - Contact Email: ${values.contactEmail}
  - Invoice Number: ${values.invoiceNumber}
  - Invoice Date: ${values.invoiceDate}
  - Due Date: ${values.dueDate}
  - Client Name: ${values.clientName}
  - Client Address: ${values.clientAddress}
  - Items: ${values.items}
  - Payment Terms: ${values.paymentTerms}
  
  Requirements:
  - Use clear professional formatting
  - Include: Invoice Header, Business Information, Client Information, Invoice Details, Itemized List, Totals, Payment Terms, Payment Methods, Contact Information
  - Output in clean markdown formatting
  `
}

