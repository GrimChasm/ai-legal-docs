export default function privacyPolicy(values: {
  businessName: string
  contactEmail: string
  companyLocation: string
  dataCollected: string
  usagePurpose: string
  thirdParties: string
}) {
    return `
  Generate a **Privacy Policy** for a website/business.
  
  Information:
  - Business Name: ${values.businessName}
  - Contact Email: ${values.contactEmail}
  - Location: ${values.companyLocation}
  - Data Collected: ${values.dataCollected}
  - How Data Is Used: ${values.usagePurpose}
  - Third Parties: ${values.thirdParties}
  
  Include sections required by modern privacy standards:
  - Information We Collect
  - How We Use Information
  - Cookies & Tracking
  - Sharing With Third Parties
  - Data Retention
  - Security
  - User Rights
  - Contact Information
  
  Make it written in simple legal English and formatted in markdown.
  `
  }
  