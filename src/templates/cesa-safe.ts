export default function cesaSafeTemplate(values: {
  companyName: string
  investorName: string
  investmentAmount: string
  valuationCap: string
  discountRate: string
  maturityDate: string
  jurisdiction: string
}) {
  return `
Generate a **CESA (Convertible Equity Security Agreement) / SAFE (Simple Agreement for Future Equity)** using the following information:

- Company Name: ${values.companyName}
- Investor Name: ${values.investorName}
- Investment Amount: ${values.investmentAmount}
- Valuation Cap: ${values.valuationCap}
- Discount Rate: ${values.discountRate}
- Maturity Date: ${values.maturityDate}
- Governing State: ${values.jurisdiction}

Include sections:
- Investment Amount
- Conversion Terms
- Valuation Cap
- Discount Rate
- Conversion Events
- Maturity Date
- Rights & Obligations
- Representations & Warranties
- Governing Law
- Signatures

Output in clean markdown formatting with professional legal language.
`
}

