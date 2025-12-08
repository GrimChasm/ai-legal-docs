export default function contractBreachNoticeTemplate(values: {
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
  contractDate: string
  breachDescription: string
  remedy: string
  deadline: string
  jurisdiction: string
}) {
  return `
  Generate a professional **Contract Breach Notice** in professional formatting.
  
  Details:
  - Sender Name: ${values.senderName}
  - Sender Address: ${values.senderAddress}
  - Recipient Name: ${values.recipientName}
  - Recipient Address: ${values.recipientAddress}
  - Contract Date: ${values.contractDate}
  - Breach Description: ${values.breachDescription}
  - Remedy: ${values.remedy}
  - Deadline: ${values.deadline}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Letterhead, Date, Contract Reference, Breach Description, Specific Violations, Remedy Required, Deadline, Consequences, Signature
  - Output in clean markdown formatting
  `
}

