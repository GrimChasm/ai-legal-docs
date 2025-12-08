export default function purchaseAgreementTemplate(values: {
  buyerName: string
  sellerName: string
  propertyAddress: string
  purchasePrice: number
  earnestMoney: number
  closingDate: string
  contingencies: string
  propertyDescription: string
  jurisdiction: string
}) {
  return `
Generate a **Real Estate Purchase Agreement** using the following information:

- Buyer Name: ${values.buyerName}
- Seller Name: ${values.sellerName}
- Property Address: ${values.propertyAddress}
- Purchase Price: $${values.purchasePrice}
- Earnest Money Deposit: $${values.earnestMoney}
- Closing Date: ${values.closingDate}
- Contingencies: ${values.contingencies}
- Property Description: ${values.propertyDescription}
- Governing State: ${values.jurisdiction}

Include sections:
- Parties
- Property Description
- Purchase Price
- Earnest Money
- Financing Terms
- Contingencies
- Inspection Period
- Closing Date & Location
- Prorations & Adjustments
- Title & Deed
- Default & Remedies
- Disclosures
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

