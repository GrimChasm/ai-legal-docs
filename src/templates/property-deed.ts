export default function propertyDeedTemplate(values: {
  grantorName: string
  grantorAddress: string
  granteeName: string
  granteeAddress: string
  propertyAddress: string
  legalDescription: string
  consideration: string
  deedType: string
  recordingInfo: string
  jurisdiction: string
}) {
  return `
Generate a **Property Deed** using the following information:

- Grantor (Seller) Name: ${values.grantorName}
- Grantor Address: ${values.grantorAddress}
- Grantee (Buyer) Name: ${values.granteeName}
- Grantee Address: ${values.granteeAddress}
- Property Address: ${values.propertyAddress}
- Legal Description: ${values.legalDescription}
- Consideration: ${values.consideration}
- Deed Type: ${values.deedType}
- Recording Information: ${values.recordingInfo}
- Jurisdiction: ${values.jurisdiction}

Include:
- Granting clause
- Property legal description
- Consideration statement
- Warranty covenants (if applicable)
- Notarization requirements
- Recording information
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

