export default function contractorTerminationLetterTemplate(values: {
  companyName: string
  contractorName: string
  contractStartDate: string
  terminationDate: string
  reason: string
  finalPayment: string
  returnOfProperty: string
}) {
  return `
  Generate a professional **Contractor Termination Letter** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Contractor Name: ${values.contractorName}
  - Contract Start Date: ${values.contractStartDate}
  - Termination Date: ${values.terminationDate}
  - Reason: ${values.reason}
  - Final Payment: ${values.finalPayment}
  - Return of Property: ${values.returnOfProperty}
  
  Requirements:
  - Use clear legal language
  - Include: Termination Notice, Effective Date, Reason (if applicable), Final Payment Terms, Return of Property, Confidentiality Obligations, Signature
  - Output in clean markdown formatting
  `
}

