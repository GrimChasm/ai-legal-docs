export default function brandDealContractTemplate(values: {
  brandName: string
  creatorName: string
  partnershipType: string
  deliverables: string
  compensation: string
  paymentSchedule: string
  term: string
  exclusivity: string
  contentGuidelines: string
  jurisdiction: string
}) {
  return `
Generate a **Brand Deal Contract** using the following information:

- Brand Name: ${values.brandName}
- Creator/Influencer Name: ${values.creatorName}
- Partnership Type: ${values.partnershipType}
- Deliverables: ${values.deliverables}
- Compensation: ${values.compensation}
- Payment Schedule: ${values.paymentSchedule}
- Term: ${values.term}
- Exclusivity: ${values.exclusivity}
- Content Guidelines: ${values.contentGuidelines}
- Governing State: ${values.jurisdiction}

Include sections:
- Partnership Description
- Deliverables & Timeline
- Compensation Terms
- Content Creation Guidelines
- Usage Rights & Licensing
- Exclusivity Terms
- Disclosure Requirements
- Performance Metrics
- Approval Process
- Termination
- Intellectual Property
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

