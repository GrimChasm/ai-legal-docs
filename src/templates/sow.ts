export default function sowTemplate(values: {
  projectName: string
  clientName: string
  vendorName: string
  projectDescription: string
  deliverables: string
  timeline: string
  budget: string
  paymentTerms: string
  startDate: string
  endDate: string
  jurisdiction: string
}) {
  return `
Generate a professional **Statement of Work (SOW)** using the following information:

- Project Name: ${values.projectName}
- Client Name: ${values.clientName}
- Vendor/Service Provider Name: ${values.vendorName}
- Project Description: ${values.projectDescription}
- Deliverables: ${values.deliverables}
- Timeline: ${values.timeline}
- Budget: ${values.budget}
- Payment Terms: ${values.paymentTerms}
- Start Date: ${values.startDate}
- End Date: ${values.endDate}
- Governing State: ${values.jurisdiction}

Include sections:
- Project Overview
- Scope of Work
- Deliverables
- Timeline & Milestones
- Budget & Payment Terms
- Roles & Responsibilities
- Acceptance Criteria
- Change Management
- Term & Termination
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

