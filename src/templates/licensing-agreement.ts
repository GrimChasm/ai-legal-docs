export default function licensingAgreementTemplate(values: {
  licensorName: string
  licenseeName: string
  licensedProperty: string
  licenseType: string
  territory: string
  term: string
  royalties: string
  restrictions: string
  jurisdiction: string
}) {
  return `
  Generate a legally compliant **Licensing Agreement** in professional formatting.
  
  Details:
  - Licensor Name: ${values.licensorName}
  - Licensee Name: ${values.licenseeName}
  - Licensed Property: ${values.licensedProperty}
  - License Type: ${values.licenseType}
  - Territory: ${values.territory}
  - Term: ${values.term}
  - Royalties: ${values.royalties}
  - Restrictions: ${values.restrictions}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Licensed Property, Grant of License, Territory, Term, Royalties, Quality Control, Restrictions, Termination, Governing Law, Signature Lines
  - Output in clean markdown formatting
  `
}

