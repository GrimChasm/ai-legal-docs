export default function consultingAgreement(values: {
  consultantName: string
  clientName: string
  scopeOfWork: string
  rate: string
  startDate: string
  terminationTerms: string
  jurisdiction: string
}) {
    return `
  Write a detailed **Consulting Agreement**.
  
  Inputs:
  - Consultant Name: ${values.consultantName}
  - Client Name: ${values.clientName}
  - Scope of Work: ${values.scopeOfWork}
  - Rate: ${values.rate}
  - Start Date: ${values.startDate}
  - Termination Terms: ${values.terminationTerms}
  - Governing State: ${values.jurisdiction}
  
  Required sections:
  - Engagement
  - Services
  - Compensation
  - Expenses
  - Independent Contractor Status
  - Confidentiality
  - Termination
  - Governing Law
  - Signatures
  
  Use numbered sections and clear legal formatting.
  `
  }
  