export default function partnershipAgreementTemplate(values: {
  partnershipName: string
  partner1Name: string
  partner2Name: string
  businessPurpose: string
  capitalContributions: string
  profitSharing: string
  managementRoles: string
  decisionMaking: string
  withdrawalTerms: string
  jurisdiction: string
}) {
  return `
  Generate a legally compliant **Partnership Agreement** in professional formatting.
  
  Details:
  - Partnership Name: ${values.partnershipName}
  - Partner 1 Name: ${values.partner1Name}
  - Partner 2 Name: ${values.partner2Name}
  - Business Purpose: ${values.businessPurpose}
  - Capital Contributions: ${values.capitalContributions}
  - Profit Sharing: ${values.profitSharing}
  - Management Roles: ${values.managementRoles}
  - Decision Making: ${values.decisionMaking}
  - Withdrawal Terms: ${values.withdrawalTerms}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Business Purpose, Capital Contributions, Profit/Loss Sharing, Management, Decision Making, Withdrawal, Dissolution, Dispute Resolution, Governing Law, Signature Lines
  - Output in clean markdown formatting
  `
}

