export default function returnRefundPolicyTemplate(values: {
  businessName: string
  contactEmail: string
  companyLocation: string
  returnWindow: string
  refundMethod: string
  returnConditions: string
  shippingCosts: string
}) {
  return `
  Generate a legally compliant **Return & Refund Policy** in professional formatting.
  
  Details:
  - Business Name: ${values.businessName}
  - Contact Email: ${values.contactEmail}
  - Company Location: ${values.companyLocation}
  - Return Window: ${values.returnWindow}
  - Refund Method: ${values.refundMethod}
  - Return Conditions: ${values.returnConditions}
  - Shipping Costs: ${values.shippingCosts}
  
  Requirements:
  - Use clear legal language
  - Include: Return Eligibility, Time Limits, Condition Requirements, Refund Process, Shipping Costs, Exceptions, Contact Information
  - Output in clean markdown formatting
  `
}

