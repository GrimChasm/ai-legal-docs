export default function rentIncreaseNoticeTemplate(values: {
  landlordName: string
  landlordAddress: string
  tenantName: string
  tenantAddress: string
  propertyAddress: string
  currentRent: number
  newRent: number
  effectiveDate: string
  noticeDate: string
  jurisdiction: string
}) {
  return `
Generate a formal **Rent Increase Notice** using the following information:

- Landlord Name: ${values.landlordName}
- Landlord Address: ${values.landlordAddress}
- Tenant Name: ${values.tenantName}
- Tenant Address: ${values.tenantAddress}
- Property Address: ${values.propertyAddress}
- Current Rent: $${values.currentRent}
- New Rent: $${values.newRent}
- Effective Date: ${values.effectiveDate}
- Notice Date: ${values.noticeDate}
- Jurisdiction: ${values.jurisdiction}

Include:
- Formal notice language
- Current rent amount
- New rent amount
- Effective date
- Required notice period compliance
- Payment instructions
- Contact information
- Legal compliance statements

Output in clean markdown formatting with professional legal language.
`
}

