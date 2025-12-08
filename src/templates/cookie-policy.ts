export default function cookiePolicy(values: {
  businessName: string
  cookieTypes: string
  purpose: string
  optOutMethod: string
  jurisdiction: string
}) {
    return `
  Generate a **Cookie Policy** for a website.
  
  Details:
  - Business/Website Name: ${values.businessName}
  - Types of Cookies: ${values.cookieTypes}
  - Purposes: ${values.purpose}
  - Opt-Out Instructions: ${values.optOutMethod}
  - Jurisdiction: ${values.jurisdiction}
  
  Include:
  - What Cookies Are
  - Types of Cookies We Use
  - Why We Use Cookies
  - Managing/Disabling Cookies
  - Third‑Party Cookies
  - Contact Information
  
  Use markdown formatting.
  `
  }
  