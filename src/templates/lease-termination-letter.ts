export default function leaseTerminationLetterTemplate(values: {
  landlordName: string
  tenantName: string
  propertyAddress: string
  leaseStartDate: string
  terminationDate: string
  reason: string
  moveOutRequirements: string
  finalInspection: string
}) {
  return `
  Generate a professional **Lease Termination Letter** in professional formatting.
  
  Details:
  - Landlord Name: ${values.landlordName}
  - Tenant Name: ${values.tenantName}
  - Property Address: ${values.propertyAddress}
  - Lease Start Date: ${values.leaseStartDate}
  - Termination Date: ${values.terminationDate}
  - Reason: ${values.reason}
  - Move-Out Requirements: ${values.moveOutRequirements}
  - Final Inspection: ${values.finalInspection}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Property Information, Termination Date, Reason, Move-Out Requirements, Final Inspection, Security Deposit, Return of Keys, Signature
  - Output in clean markdown formatting
  `
}

