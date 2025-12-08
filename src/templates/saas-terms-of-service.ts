export default function saasTermsOfServiceTemplate(values: {
  companyName: string
  serviceName: string
  contactEmail: string
  companyLocation: string
  subscriptionPlans: string
  cancellationPolicy: string
  dataHandling: string
  jurisdiction: string
}) {
  return `
Generate comprehensive **SaaS Terms of Service** using the following information:

- Company Name: ${values.companyName}
- Service Name: ${values.serviceName}
- Contact Email: ${values.contactEmail}
- Company Location: ${values.companyLocation}
- Subscription Plans: ${values.subscriptionPlans}
- Cancellation Policy: ${values.cancellationPolicy}
- Data Handling: ${values.dataHandling}
- Governing State: ${values.jurisdiction}

Include sections:
- Acceptance of Terms
- Service Description
- Account Registration
- Subscription Plans & Pricing
- Payment Terms
- User Obligations
- Acceptable Use Policy
- Intellectual Property
- Data Privacy & Security
- Service Availability
- Cancellation & Refunds
- Limitation of Liability
- Indemnification
- Termination
- Governing Law
- Contact Information

Output in clean markdown formatting with professional legal language.
`
}

