export default function acceptableUsePolicyTemplate(values: {
  companyName: string
  serviceDescription: string
  prohibitedUses: string
  contentRestrictions: string
  userResponsibilities: string
  enforcement: string
  contactEmail: string
}) {
  return `
  Generate a legally compliant **Acceptable Use Policy (AUP)** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Service Description: ${values.serviceDescription}
  - Prohibited Uses: ${values.prohibitedUses}
  - Content Restrictions: ${values.contentRestrictions}
  - User Responsibilities: ${values.userResponsibilities}
  - Enforcement: ${values.enforcement}
  - Contact Email: ${values.contactEmail}
  
  Requirements:
  - Use clear legal language
  - Include: Policy Overview, Acceptable Uses, Prohibited Uses, Content Restrictions, User Responsibilities, Violations & Enforcement, Termination, Limitation of Liability, Contact Information
  - Output in clean markdown formatting
  `
}

