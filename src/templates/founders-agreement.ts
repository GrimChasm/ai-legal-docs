export default function foundersAgreementTemplate(values: {
  companyName: string
  founder1Name: string
  founder2Name: string
  equitySplit: string
  roles: string
  vestingSchedule: string
  intellectualProperty: string
  decisionMaking: string
  exitTerms: string
  jurisdiction: string
}) {
  return `
  Generate a legally compliant **Founders' Agreement** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Founder 1 Name: ${values.founder1Name}
  - Founder 2 Name: ${values.founder2Name}
  - Equity Split: ${values.equitySplit}
  - Roles: ${values.roles}
  - Vesting Schedule: ${values.vestingSchedule}
  - Intellectual Property: ${values.intellectualProperty}
  - Decision Making: ${values.decisionMaking}
  - Exit Terms: ${values.exitTerms}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Company Formation, Equity Distribution, Roles & Responsibilities, Vesting, Intellectual Property, Decision Making, Exit Provisions, Dispute Resolution, Governing Law, Signature Lines
  - Output in clean markdown formatting
  `
}

