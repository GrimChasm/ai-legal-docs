export default function influencerAgreementTemplate(values: {
  brandName: string
  influencerName: string
  campaignDescription: string
  deliverables: string
  compensation: string
  paymentTerms: string
  campaignDates: string
  exclusivity: string
  contentApproval: string
  jurisdiction: string
}) {
  return `
Generate an **Influencer Agreement** using the following information:

- Brand/Company Name: ${values.brandName}
- Influencer Name: ${values.influencerName}
- Campaign Description: ${values.campaignDescription}
- Deliverables: ${values.deliverables}
- Compensation: ${values.compensation}
- Payment Terms: ${values.paymentTerms}
- Campaign Dates: ${values.campaignDates}
- Exclusivity Terms: ${values.exclusivity}
- Content Approval Process: ${values.contentApproval}
- Governing State: ${values.jurisdiction}

Include sections:
- Campaign Overview
- Deliverables
- Compensation & Payment
- Content Creation Guidelines
- Approval Process
- Usage Rights
- Exclusivity
- Disclosure Requirements (FTC compliance)
- Performance Metrics
- Termination
- Intellectual Property
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

