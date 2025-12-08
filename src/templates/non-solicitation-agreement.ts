export default function nonSolicitationAgreementTemplate(values: {
  companyName: string
  employeeName: string
  effectiveDate: string
  duration: string
  restrictedParties: string
  restrictedActivities: string
  jurisdiction: string
}) {
  return `
  Generate a legally compliant **Non-Solicitation Agreement** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Employee Name: ${values.employeeName}
  - Effective Date: ${values.effectiveDate}
  - Duration: ${values.duration}
  - Restricted Parties: ${values.restrictedParties}
  - Restricted Activities: ${values.restrictedActivities}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Consideration, Non-Solicitation of Customers, Non-Solicitation of Employees, Duration, Geographic Scope, Remedies, Governing Law, Signature Lines
  - Output in clean markdown formatting
  `
}

