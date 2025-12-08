export default function titleDocumentTemplate(values: {
  propertyAddress: string
  ownerName: string
  legalDescription: string
  lotNumber: string
  blockNumber: string
  subdivision: string
  county: string
  state: string
  recordingDate: string
  documentNumber: string
}) {
  return `
Generate a **Title Document** using the following information:

- Property Address: ${values.propertyAddress}
- Owner Name: ${values.ownerName}
- Legal Description: ${values.legalDescription}
- Lot Number: ${values.lotNumber}
- Block Number: ${values.blockNumber}
- Subdivision: ${values.subdivision}
- County: ${values.county}
- State: ${values.state}
- Recording Date: ${values.recordingDate}
- Document Number: ${values.documentNumber}

Include:
- Property identification
- Legal description
- Ownership information
- Recording information
- Title status
- Encumbrances (if any)
- Legal format requirements

Output in clean markdown formatting with professional legal language.
`
}

