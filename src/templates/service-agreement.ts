export default function serviceAgreementTemplate(values: {
  serviceProviderName: string
  clientName: string
  servicesDescription: string
  serviceFee: string
  paymentSchedule: string
  term: string
  startDate: string
  terminationTerms: string
  jurisdiction: string
}) {
  return `
Generate a comprehensive **Service Agreement** using the following information:

- Service Provider Name: ${values.serviceProviderName}
- Client Name: ${values.clientName}
- Services Description: ${values.servicesDescription}
- Service Fee: ${values.serviceFee}
- Payment Schedule: ${values.paymentSchedule}
- Term: ${values.term}
- Start Date: ${values.startDate}
- Termination Terms: ${values.terminationTerms}
- Governing State: ${values.jurisdiction}

Include sections:
- Services to be Provided
- Service Fees & Payment Terms
- Term & Duration
- Performance Standards
- Client Obligations
- Service Provider Obligations
- Intellectual Property
- Confidentiality
- Limitation of Liability
- Termination
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

