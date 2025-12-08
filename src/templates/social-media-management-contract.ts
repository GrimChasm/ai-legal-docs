export default function socialMediaManagementContractTemplate(values: {
  clientName: string
  agencyName: string
  platforms: string
  services: string
  monthlyFee: string
  paymentTerms: string
  term: string
  contentApproval: string
  reporting: string
  jurisdiction: string
}) {
  return `
Generate a **Social Media Management Contract** using the following information:

- Client Name: ${values.clientName}
- Agency/Service Provider Name: ${values.agencyName}
- Platforms: ${values.platforms}
- Services Included: ${values.services}
- Monthly Fee: ${values.monthlyFee}
- Payment Terms: ${values.paymentTerms}
- Term: ${values.term}
- Content Approval Process: ${values.contentApproval}
- Reporting Requirements: ${values.reporting}
- Governing State: ${values.jurisdiction}

Include sections:
- Services Description
- Platforms Covered
- Monthly Services
- Fees & Payment
- Content Creation & Approval
- Account Access
- Reporting & Analytics
- Client Obligations
- Agency Obligations
- Intellectual Property
- Confidentiality
- Termination
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

