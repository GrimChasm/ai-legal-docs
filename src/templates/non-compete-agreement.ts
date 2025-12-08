export default function nonCompeteAgreementTemplate(values: {
  companyName: string
  employeeName: string
  effectiveDate: string
  duration: string
  geographicScope: string
  restrictedActivities: string
  jurisdiction: string
}) {
  return `
  Generate a legally compliant **Non-Compete Agreement** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Employee Name: ${values.employeeName}
  - Effective Date: ${values.effectiveDate}
  - Duration: ${values.duration}
  - Geographic Scope: ${values.geographicScope}
  - Restricted Activities: ${values.restrictedActivities}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Consideration, Restricted Activities, Geographic Scope, Duration, Remedies, Severability, Governing Law, Signature Lines
  - Output in clean markdown formatting
  `
}

