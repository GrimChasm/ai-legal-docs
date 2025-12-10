/**
 * Document Type-Specific Prompt Enhancements
 * 
 * Provides detailed, value-adding prompts for each specific legal document type.
 * These prompts enhance the base generation with document-specific requirements,
 * best practices, and important considerations.
 */

export interface DocumentTypePrompt {
  /** Document type identifier */
  type: string
  /** Detailed description of what this document should accomplish */
  purpose: string
  /** Required sections that must be included */
  requiredSections: string[]
  /** Important legal considerations specific to this document type */
  legalConsiderations: string[]
  /** Best practices for this document type */
  bestPractices: string[]
  /** Common clauses that should be included */
  commonClauses: string[]
  /** Formatting and structure requirements */
  formattingRequirements: string[]
}

/**
 * Document type-specific prompt configurations
 */
export const DOCUMENT_TYPE_PROMPTS: Record<string, DocumentTypePrompt> = {
  "Non-Disclosure Agreement": {
    type: "Non-Disclosure Agreement (NDA)",
    purpose: "A legally binding agreement that protects confidential information shared between parties. This document establishes the terms under which sensitive information can be shared and used, preventing unauthorized disclosure.",
    requiredSections: [
      "Definitions of Confidential Information",
      "Obligations of Receiving Party",
      "Exclusions from Confidentiality",
      "Term and Duration",
      "Return of Materials",
      "Remedies for Breach",
      "Governing Law and Jurisdiction",
      "Signatures"
    ],
    legalConsiderations: [
      "Clearly define what constitutes 'confidential information' - be specific about what is and isn't covered",
      "Include exclusions for information that is publicly available, independently developed, or required by law to disclose",
      "Specify the duration of confidentiality obligations - typically 2-5 years, but can be indefinite for trade secrets",
      "Include remedies for breach such as injunctive relief and monetary damages",
      "Specify governing law and jurisdiction for dispute resolution",
      "Ensure both parties have the authority to enter into the agreement"
    ],
    bestPractices: [
      "Use clear, unambiguous language to define confidential information",
      "Include specific examples of what is considered confidential",
      "Specify the purpose for which confidential information can be used",
      "Include provisions for return or destruction of confidential materials",
      "Consider including non-solicitation clauses if relevant",
      "Ensure the agreement is mutual if both parties will share confidential information"
    ],
    commonClauses: [
      "Definition of confidential information",
      "Permitted use and disclosure",
      "Exclusions (public domain, independently developed, required by law)",
      "Term and survival",
      "Return of materials",
      "Remedies and injunctive relief",
      "Governing law",
      "Severability",
      "Entire agreement"
    ],
    formattingRequirements: [
      "Clear section headers with numbered sections",
      "Bold key terms and definitions",
      "Proper paragraph breaks for readability",
      "Signature lines for all parties",
      "Date fields for effective date"
    ]
  },
  "Independent Contractor Agreement": {
    type: "Independent Contractor Agreement",
    purpose: "Establishes the terms of engagement between a company and an independent contractor. This document clarifies the contractor's status, scope of work, payment terms, and protects both parties' interests.",
    requiredSections: [
      "Engagement and Relationship",
      "Scope of Work and Deliverables",
      "Compensation and Payment Terms",
      "Independent Contractor Status",
      "Intellectual Property Rights",
      "Confidentiality",
      "Term and Termination",
      "Governing Law",
      "Signatures"
    ],
    legalConsiderations: [
      "Clearly establish that the contractor is an independent contractor, not an employee - this is critical for tax and liability purposes",
      "Specify the scope of work in detail to avoid scope creep and disputes",
      "Include payment terms, rates, and invoicing requirements",
      "Address intellectual property ownership - typically work product belongs to the hiring party",
      "Include confidentiality provisions to protect business information",
      "Specify termination conditions and notice requirements",
      "Include indemnification clauses where appropriate",
      "Ensure compliance with local labor laws regarding contractor classification"
    ],
    bestPractices: [
      "Be very specific about deliverables and deadlines",
      "Include provisions for revisions and change orders",
      "Specify how expenses will be handled",
      "Address ownership of work product and intellectual property upfront",
      "Include non-compete or non-solicitation clauses if appropriate",
      "Specify dispute resolution procedures",
      "Include insurance requirements if applicable",
      "Clarify that contractor is responsible for their own taxes"
    ],
    commonClauses: [
      "Independent contractor relationship (not employee)",
      "Scope of work and deliverables",
      "Compensation and payment schedule",
      "Intellectual property assignment",
      "Confidentiality obligations",
      "Term and termination",
      "Non-compete/non-solicitation (if applicable)",
      "Indemnification",
      "Governing law and dispute resolution"
    ],
    formattingRequirements: [
      "Numbered sections for easy reference",
      "Clear headings for each major section",
      "Bold important terms like 'Independent Contractor'",
      "Detailed scope of work section",
      "Signature blocks for both parties"
    ]
  },
  "Privacy Policy": {
    type: "Privacy Policy",
    purpose: "A legal document that explains how a website, app, or business collects, uses, stores, and protects user data. Required by law in many jurisdictions and essential for building user trust.",
    requiredSections: [
      "Information Collection",
      "How Information is Used",
      "Information Sharing and Disclosure",
      "Data Security",
      "User Rights and Choices",
      "Cookies and Tracking Technologies",
      "Third-Party Services",
      "Children's Privacy",
      "Changes to Privacy Policy",
      "Contact Information"
    ],
    legalConsiderations: [
      "Must comply with GDPR (EU), CCPA (California), and other applicable privacy laws",
      "Clearly state what data is collected and why",
      "Explain how data is used and who it's shared with",
      "Provide information about user rights (access, deletion, opt-out)",
      "Include information about cookies and tracking technologies",
      "Specify data retention periods",
      "Include contact information for privacy inquiries",
      "Address international data transfers if applicable"
    ],
    bestPractices: [
      "Use clear, plain language that users can understand",
      "Be specific about data collection practices",
      "Explain the legal basis for processing (consent, legitimate interest, etc.)",
      "Provide clear instructions for exercising user rights",
      "Include information about data security measures",
      "Specify how users will be notified of policy changes",
      "Address location-specific requirements (GDPR, CCPA, etc.)",
      "Include information about third-party services and integrations"
    ],
    commonClauses: [
      "Types of information collected",
      "Methods of collection",
      "Purpose of data processing",
      "Legal basis for processing",
      "Data sharing and third parties",
      "Data security measures",
      "User rights (access, rectification, deletion, portability)",
      "Cookie policy",
      "Data retention",
      "International transfers",
      "Children's privacy",
      "Policy updates"
    ],
    formattingRequirements: [
      "Clear section headers",
      "Bullet points for lists of data types",
      "Bold important terms and user rights",
      "Easy-to-scan format",
      "Contact information prominently displayed"
    ]
  },
  "Terms and Conditions": {
    type: "Terms and Conditions",
    purpose: "A legal agreement that sets forth the rules and guidelines for using a website, app, or service. Protects the business owner and informs users of their rights and obligations.",
    requiredSections: [
      "Acceptance of Terms",
      "Description of Service",
      "User Accounts and Registration",
      "User Conduct and Restrictions",
      "Intellectual Property Rights",
      "Payment Terms (if applicable)",
      "Limitation of Liability",
      "Indemnification",
      "Termination",
      "Dispute Resolution",
      "Governing Law",
      "Changes to Terms"
    ],
    legalConsiderations: [
      "Clearly state that use of the service constitutes acceptance of terms",
      "Include limitations of liability to protect the business",
      "Specify acceptable use policies and prohibited activities",
      "Address intellectual property ownership",
      "Include dispute resolution procedures (arbitration, jurisdiction)",
      "Specify governing law",
      "Include provisions for termination of accounts",
      "Address refund and cancellation policies if applicable"
    ],
    bestPractices: [
      "Use clear language while maintaining legal protection",
      "Include specific examples of prohibited uses",
      "Specify consequences for violations",
      "Address user-generated content and ownership",
      "Include force majeure clauses",
      "Specify how changes to terms will be communicated",
      "Include contact information for questions",
      "Address age restrictions if applicable"
    ],
    commonClauses: [
      "Acceptance of terms",
      "Service description",
      "User obligations",
      "Prohibited activities",
      "Intellectual property",
      "User-generated content",
      "Limitation of liability",
      "Indemnification",
      "Termination",
      "Dispute resolution",
      "Governing law",
      "Severability",
      "Entire agreement"
    ],
    formattingRequirements: [
      "Numbered sections",
      "Clear headings",
      "Bold important terms and restrictions",
      "Easy-to-navigate structure",
      "Date of last update"
    ]
  },
  "Residential Lease Agreement": {
    type: "Residential Lease Agreement",
    purpose: "A legally binding contract between a landlord and tenant that establishes the terms and conditions for renting a residential property. Protects both parties' rights and clearly defines responsibilities.",
    requiredSections: [
      "Parties and Property Description",
      "Lease Term and Rent",
      "Security Deposit",
      "Tenant Obligations",
      "Landlord Obligations",
      "Use of Property",
      "Maintenance and Repairs",
      "Utilities and Services",
      "Pets and Smoking Policies",
      "Default and Remedies",
      "Termination and Renewal",
      "Governing Law",
      "Signatures"
    ],
    legalConsiderations: [
      "Must comply with local landlord-tenant laws and regulations",
      "Clearly specify rent amount, due date, and payment method",
      "Include security deposit terms and conditions for return",
      "Specify who is responsible for utilities, maintenance, and repairs",
      "Include provisions for entry by landlord (with proper notice)",
      "Address subletting and assignment rights",
      "Specify conditions for termination and renewal",
      "Include required disclosures (lead paint, etc.) if applicable",
      "Comply with fair housing laws"
    ],
    bestPractices: [
      "Be very specific about property address and description",
      "Include detailed rules about use of property",
      "Specify pet policies clearly",
      "Include maintenance responsibilities for both parties",
      "Address parking, storage, and common areas",
      "Include provisions for early termination",
      "Specify notice requirements for various actions",
      "Include provisions for property inspections"
    ],
    commonClauses: [
      "Property description and address",
      "Lease term and rent amount",
      "Security deposit terms",
      "Tenant responsibilities",
      "Landlord responsibilities",
      "Use restrictions",
      "Maintenance and repairs",
      "Utilities",
      "Entry by landlord",
      "Default and remedies",
      "Termination",
      "Governing law"
    ],
    formattingRequirements: [
      "Clear section numbering",
      "Bold important terms (rent amount, dates)",
      "Signature lines for all parties",
      "Date fields",
      "Property address prominently displayed"
    ]
  },
  "Employment Contract": {
    type: "Employment Contract",
    purpose: "A legally binding agreement between an employer and employee that establishes the terms and conditions of employment, including compensation, benefits, duties, and termination provisions.",
    requiredSections: [
      "Parties and Effective Date",
      "Position and Job Duties",
      "Compensation and Benefits",
      "Work Schedule and Location",
      "Confidentiality and Non-Disclosure",
      "Intellectual Property",
      "Non-Compete and Non-Solicitation (if applicable)",
      "Termination Provisions",
      "Severance (if applicable)",
      "Governing Law",
      "Signatures"
    ],
    legalConsiderations: [
      "Clearly define the employment relationship (at-will vs. term employment)",
      "Specify compensation structure, payment schedule, and any bonuses or commissions",
      "Include comprehensive benefits package details",
      "Address intellectual property ownership - typically work product belongs to employer",
      "Include confidentiality and non-disclosure obligations",
      "Specify termination conditions, notice requirements, and severance terms",
      "Include non-compete and non-solicitation clauses if applicable (must be reasonable in scope and duration)",
      "Comply with local employment laws and regulations",
      "Address dispute resolution procedures"
    ],
    bestPractices: [
      "Be specific about job duties and responsibilities",
      "Clearly define compensation structure and payment terms",
      "Include detailed benefits information",
      "Specify work schedule, location, and remote work policies",
      "Address intellectual property ownership upfront",
      "Include provisions for performance reviews and evaluations",
      "Specify grounds for termination (with cause vs. without cause)",
      "Include severance provisions if applicable",
      "Address post-employment obligations"
    ],
    commonClauses: [
      "Employment relationship and term",
      "Position and duties",
      "Compensation and benefits",
      "Work schedule and location",
      "Confidentiality obligations",
      "Intellectual property assignment",
      "Non-compete/non-solicitation",
      "Termination provisions",
      "Severance",
      "Governing law"
    ],
    formattingRequirements: [
      "Clear section numbering",
      "Bold important terms (salary, dates, job title)",
      "Signature lines for both parties",
      "Date fields for effective date",
      "Detailed compensation section"
    ]
  },
  "Consulting Agreement": {
    type: "Consulting Agreement",
    purpose: "A contract between a consultant and client that defines the scope of consulting services, compensation, and terms of engagement. Establishes the consultant as an independent contractor.",
    requiredSections: [
      "Parties and Engagement",
      "Scope of Services",
      "Compensation and Payment Terms",
      "Expenses and Reimbursements",
      "Independent Contractor Status",
      "Intellectual Property Rights",
      "Confidentiality",
      "Term and Termination",
      "Limitation of Liability",
      "Governing Law",
      "Signatures"
    ],
    legalConsiderations: [
      "Clearly establish independent contractor relationship (not employee)",
      "Define scope of services in detail to prevent scope creep",
      "Specify compensation structure, rates, and payment schedule",
      "Address expense reimbursement policies",
      "Clarify intellectual property ownership of work product",
      "Include confidentiality provisions",
      "Specify termination conditions and notice requirements",
      "Include limitation of liability clauses",
      "Ensure compliance with contractor classification laws"
    ],
    bestPractices: [
      "Be very specific about deliverables and timelines",
      "Include provisions for change orders and scope modifications",
      "Specify how expenses will be handled and reimbursed",
      "Address ownership of work product and intellectual property clearly",
      "Include provisions for revisions and iterations",
      "Specify dispute resolution procedures",
      "Include insurance requirements if applicable",
      "Clarify that consultant is responsible for their own taxes"
    ],
    commonClauses: [
      "Engagement and relationship",
      "Scope of services",
      "Compensation and payment",
      "Expense reimbursement",
      "Intellectual property assignment",
      "Confidentiality",
      "Term and termination",
      "Limitation of liability",
      "Indemnification",
      "Governing law"
    ],
    formattingRequirements: [
      "Numbered sections",
      "Detailed scope of work section",
      "Bold compensation terms",
      "Signature blocks for both parties",
      "Clear payment terms"
    ]
  }
}

/**
 * Gets document-type-specific prompt enhancement
 */
export function getDocumentTypePrompt(documentType: string): DocumentTypePrompt | null {
  // Try exact match first
  if (DOCUMENT_TYPE_PROMPTS[documentType]) {
    return DOCUMENT_TYPE_PROMPTS[documentType]
  }

  // Try case-insensitive match
  const lowerType = documentType.toLowerCase()
  for (const [key, value] of Object.entries(DOCUMENT_TYPE_PROMPTS)) {
    if (key.toLowerCase() === lowerType) {
      return value
    }
  }

  // Try partial match (e.g., "NDA" matches "Non-Disclosure Agreement")
  for (const [key, value] of Object.entries(DOCUMENT_TYPE_PROMPTS)) {
    if (lowerType.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerType)) {
      return value
    }
  }

  return null
}

/**
 * Builds enhanced prompt text for a specific document type
 */
export function buildDocumentTypePromptEnhancement(documentType: string): string {
  const typePrompt = getDocumentTypePrompt(documentType)
  
  if (!typePrompt) {
    return ""
  }

  let enhancement = `\n## Document-Specific Requirements for ${typePrompt.type}

### Purpose
${typePrompt.purpose}

### Required Sections
The document MUST include the following sections:
${typePrompt.requiredSections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### Legal Considerations
When drafting this document, pay special attention to:
${typePrompt.legalConsiderations.map((c, i) => `- ${c}`).join("\n")}

### Best Practices
Follow these best practices for this document type:
${typePrompt.bestPractices.map((p, i) => `- ${p}`).join("\n")}

### Common Clauses to Include
Ensure the document includes these standard clauses:
${typePrompt.commonClauses.map((c, i) => `- ${c}`).join("\n")}

### Formatting Requirements
${typePrompt.formattingRequirements.map((r, i) => `- ${r}`).join("\n")}

`

  return enhancement
}

