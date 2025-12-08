export default function subleaseAgreementTemplate(values: {
  originalTenantName: string
  subtenantName: string
  landlordName: string
  propertyAddress: string
  subleaseStartDate: string
  subleaseEndDate: string
  monthlyRent: number
  securityDeposit: number
  originalLeaseEndDate: string
  jurisdiction: string
}) {
  return `
Generate a **Sublease Agreement** using the following information:

- Original Tenant Name: ${values.originalTenantName}
- Subtenant Name: ${values.subtenantName}
- Landlord Name: ${values.landlordName}
- Property Address: ${values.propertyAddress}
- Sublease Start Date: ${values.subleaseStartDate}
- Sublease End Date: ${values.subleaseEndDate}
- Monthly Rent: $${values.monthlyRent}
- Security Deposit: $${values.securityDeposit}
- Original Lease End Date: ${values.originalLeaseEndDate}
- Governing State: ${values.jurisdiction}

Include sections:
- Parties
- Property Description
- Term
- Rent & Security Deposit
- Original Lease Terms
- Subtenant Obligations
- Original Tenant Obligations
- Landlord Consent
- Default & Remedies
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

