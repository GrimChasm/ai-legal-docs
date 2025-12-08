export default function residentialLease(values: {
  landlordName: string
  tenantName: string
  propertyAddress: string
  leaseStart: string
  leaseEnd: string
  rentAmount: number
  securityDeposit: number
}) {
    return `
  Generate a legally structured **Residential Lease Agreement**.
  
  Inputs:
  - Landlord: ${values.landlordName}
  - Tenant: ${values.tenantName}
  - Property Address: ${values.propertyAddress}
  - Lease Start: ${values.leaseStart}
  - Lease End: ${values.leaseEnd}
  - Rent Amount: $${values.rentAmount}
  - Security Deposit: $${values.securityDeposit}
  
  Include sections:
  - Parties
  - Property
  - Term
  - Rent
  - Security Deposit
  - Utilities
  - Maintenance
  - Rules & Regulations
  - Default
  - Governing Law
  - Signatures
  
  Output in well‑formatted markdown.
  `
  }
  