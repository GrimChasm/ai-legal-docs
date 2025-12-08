export default function equitySplitAgreementTemplate(values: {
  companyName: string
  founder1Name: string
  founder2Name: string
  founder3Name?: string
  equitySplit: string
  vestingSchedule: string
  cliffPeriod: string
  roles: string
  intellectualProperty: string
  jurisdiction: string
}) {
  return `
Generate a professional **Equity Split Agreement** using the following information:

- Company Name: ${values.companyName}
- Founder 1 Name: ${values.founder1Name}
- Founder 2 Name: ${values.founder2Name}
${values.founder3Name ? `- Founder 3 Name: ${values.founder3Name}` : ""}
- Equity Split: ${values.equitySplit}
- Vesting Schedule: ${values.vestingSchedule}
- Cliff Period: ${values.cliffPeriod}
- Roles & Responsibilities: ${values.roles}
- Intellectual Property Assignment: ${values.intellectualProperty}
- Governing State: ${values.jurisdiction}

Include sections:
- Equity Allocation
- Vesting Terms
- Cliff Period
- Roles & Responsibilities
- Intellectual Property Assignment
- Decision Making
- Transfer Restrictions
- Buyout Provisions
- Dispute Resolution
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

