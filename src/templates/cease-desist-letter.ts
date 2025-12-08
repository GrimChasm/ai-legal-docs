export default function ceaseDesistLetterTemplate(values: {
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
  violationDescription: string
  legalBasis: string
  demand: string
  deadline: string
  jurisdiction: string
}) {
  return `
  Generate a professional **Cease & Desist Letter** in professional formatting.
  
  Details:
  - Sender Name: ${values.senderName}
  - Sender Address: ${values.senderAddress}
  - Recipient Name: ${values.recipientName}
  - Recipient Address: ${values.recipientAddress}
  - Violation Description: ${values.violationDescription}
  - Legal Basis: ${values.legalBasis}
  - Demand: ${values.demand}
  - Deadline: ${values.deadline}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Letterhead, Date, Recipient Information, Violation Description, Legal Basis, Demand for Cessation, Deadline, Consequences, Signature
  - Output in clean markdown formatting
  `
}

