export default function roommateAgreementTemplate(values: {
  propertyAddress: string
  roommate1Name: string
  roommate2Name: string
  leaseStartDate: string
  leaseEndDate: string
  rentAmount: string
  rentSplit: string
  utilities: string
  houseRules: string
  guestPolicy: string
  terminationTerms: string
}) {
  return `
  Generate a legally compliant **Roommate Agreement** in professional formatting.
  
  Details:
  - Property Address: ${values.propertyAddress}
  - Roommate 1 Name: ${values.roommate1Name}
  - Roommate 2 Name: ${values.roommate2Name}
  - Lease Start Date: ${values.leaseStartDate}
  - Lease End Date: ${values.leaseEndDate}
  - Rent Amount: ${values.rentAmount}
  - Rent Split: ${values.rentSplit}
  - Utilities: ${values.utilities}
  - House Rules: ${values.houseRules}
  - Guest Policy: ${values.guestPolicy}
  - Termination Terms: ${values.terminationTerms}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Property Information, Rent & Utilities, Responsibilities, House Rules, Guest Policy, Dispute Resolution, Termination, Signature Lines
  - Output in clean markdown formatting
  `
}

