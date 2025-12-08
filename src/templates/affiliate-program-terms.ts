export default function affiliateProgramTermsTemplate(values: {
  companyName: string
  contactEmail: string
  commissionStructure: string
  paymentTerms: string
  programRules: string
  prohibitedActivities: string
  terminationTerms: string
}) {
  return `
  Generate a legally compliant **Affiliate Program Terms** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Contact Email: ${values.contactEmail}
  - Commission Structure: ${values.commissionStructure}
  - Payment Terms: ${values.paymentTerms}
  - Program Rules: ${values.programRules}
  - Prohibited Activities: ${values.prohibitedActivities}
  - Termination Terms: ${values.terminationTerms}
  
  Requirements:
  - Use clear legal language
  - Include: Program Overview, Eligibility, Commission Structure, Payment Terms, Program Rules, Prohibited Activities, Intellectual Property, Termination, Limitation of Liability, Governing Law
  - Output in clean markdown formatting
  `
}

