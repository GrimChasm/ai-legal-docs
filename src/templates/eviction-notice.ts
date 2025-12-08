export default function evictionNoticeTemplate(values: {
  landlordName: string
  landlordAddress: string
  tenantName: string
  tenantAddress: string
  propertyAddress: string
  reason: string
  noticeDate: string
  complianceDate: string
  jurisdiction: string
}) {
  return `
Generate a formal **Eviction Notice** using the following information:

- Landlord Name: ${values.landlordName}
- Landlord Address: ${values.landlordAddress}
- Tenant Name: ${values.tenantName}
- Tenant Address: ${values.tenantAddress}
- Property Address: ${values.propertyAddress}
- Reason for Eviction: ${values.reason}
- Notice Date: ${values.noticeDate}
- Compliance Date: ${values.complianceDate}
- Jurisdiction: ${values.jurisdiction}

Include:
- Formal notice language
- Property description
- Reason for eviction
- Required compliance date
- Legal rights of tenant
- Consequences of non-compliance
- Contact information
- Legal compliance with state/local laws

Output in clean markdown formatting with professional legal language.
`
}

