export default function termsAndConditions(values: {
  businessName: string
  companyLocation: string
  servicesProvided: string
  paymentTerms: string
  refundPolicy: string
  prohibitedUses: string
}) {
    return `
  Create a formal **Terms & Conditions Agreement**.
  
  Details:
  - Business Name: ${values.businessName}
  - Location: ${values.companyLocation}
  - Services Provided: ${values.servicesProvided}
  - Payment Terms: ${values.paymentTerms}
  - Refund Policy: ${values.refundPolicy}
  - Prohibited Uses: ${values.prohibitedUses}
  
  Include sections:
  - Acceptance of Terms
  - Services
  - Accounts & Responsibilities
  - Payments & Billing
  - Refunds
  - Prohibited Activities
  - Limitation of Liability
  - Governing Law
  
  Format using clean markdown headings.
  `
  }
  