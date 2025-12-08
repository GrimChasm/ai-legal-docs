export default function contractorAgreement(values: {
  clientName: string
  contractorName: string
  services: string
  compensation: string
  startDate: string
  endDate: string
  jurisdiction: string
}) {
    return `
  Generate an **Independent Contractor Agreement** using the following information:
  
  - Client/Company Name: ${values.clientName}
  - Contractor Name: ${values.contractorName}
  - Services Description: ${values.services}
  - Compensation Terms: ${values.compensation}
  - Start Date: ${values.startDate}
  - End Date: ${values.endDate || "Not specified"}
  - Governing State: ${values.jurisdiction}
  
  Include sections:
  - Engagement
  - Scope of Work
  - Payment Terms
  - Independent Contractor Status
  - Confidentiality
  - Intellectual Property
  - Term & Termination
  - Governing Law
  - Signatures
  
  Format cleanly in markdown.
  `
  }
  