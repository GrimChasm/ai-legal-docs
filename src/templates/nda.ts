export default function ndaTemplate(values: {
  clientName: string
  recipientName: string
  effectiveDate: string
  jurisdiction: string
  confidentialityTerm: number
  purpose: string
}) {
    return `
  Generate a legally compliant **Non‑Disclosure Agreement (NDA)** in professional formatting.
  
  Details:
  - Client Name: ${values.clientName}
  - Recipient Name: ${values.recipientName}
  - Effective Date: ${values.effectiveDate}
  - Jurisdiction: ${values.jurisdiction}
  - Confidentiality Term: ${values.confidentialityTerm} years
  - Purpose of Disclosure: ${values.purpose}
  
  Requirements:
  - Use clear legal language
  - Include: Definitions, Confidentiality Obligations, Exclusions, Term, Return of Materials, Remedies, Governing Law
  - Add signature lines for both parties
  - Output in clean markdown formatting
  `
  }
   
  