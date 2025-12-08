// src/lib/contracts.ts

import ndaTemplate from "@/templates/nda"
import contractorAgreementTemplate from "@/templates/contractor-agreement"
import privacyPolicyTemplate from "@/templates/privacy-policy"
import termsAndConditionsTemplate from "@/templates/terms-and-conditions"
import consultingAgreementTemplate from "@/templates/consulting-agreement"
import cookiePolicyTemplate from "@/templates/cookie-policy"
import offerLetterTemplate from "@/templates/offer-letter"
import residentialLeaseTemplate from "@/templates/residential-lease"
import returnRefundPolicyTemplate from "@/templates/return-refund-policy"
import shippingPolicyTemplate from "@/templates/shipping-policy"
import employeeHandbookTemplate from "@/templates/employee-handbook"
import employmentContractTemplate from "@/templates/employment-contract"
import contractorTerminationLetterTemplate from "@/templates/contractor-termination-letter"
import nonCompeteAgreementTemplate from "@/templates/non-compete-agreement"
import nonSolicitationAgreementTemplate from "@/templates/non-solicitation-agreement"
import invoiceTemplateTemplate from "@/templates/invoice-template"
import affiliateProgramTermsTemplate from "@/templates/affiliate-program-terms"
import licensingAgreementTemplate from "@/templates/licensing-agreement"
import photoVideoReleaseFormTemplate from "@/templates/photo-video-release-form"
import partnershipAgreementTemplate from "@/templates/partnership-agreement"
import foundersAgreementTemplate from "@/templates/founders-agreement"
import acceptableUsePolicyTemplate from "@/templates/acceptable-use-policy"
import ceaseDesistLetterTemplate from "@/templates/cease-desist-letter"
import contractBreachNoticeTemplate from "@/templates/contract-breach-notice"
import leaseTerminationLetterTemplate from "@/templates/lease-termination-letter"
import roommateAgreementTemplate from "@/templates/roommate-agreement"
import sowTemplate from "@/templates/sow"
import serviceAgreementTemplate from "@/templates/service-agreement"
import equitySplitAgreementTemplate from "@/templates/equity-split-agreement"
import cesaSafeTemplate from "@/templates/cesa-safe"
import saasTermsOfServiceTemplate from "@/templates/saas-terms-of-service"
import subleaseAgreementTemplate from "@/templates/sublease-agreement"
import rentIncreaseNoticeTemplate from "@/templates/rent-increase-notice"
import evictionNoticeTemplate from "@/templates/eviction-notice"
import influencerAgreementTemplate from "@/templates/influencer-agreement"
import brandDealContractTemplate from "@/templates/brand-deal-contract"
import socialMediaManagementContractTemplate from "@/templates/social-media-management-contract"
import purchaseAgreementTemplate from "@/templates/purchase-agreement"
import propertyDeedTemplate from "@/templates/property-deed"
import titleDocumentTemplate from "@/templates/title-document"

// -----------------------------
// Types
// -----------------------------

export type FieldType = "text" | "textarea" | "date" | "number"

export interface FieldConfig {
  label: string
  type: FieldType
}

export type FormSchema = Record<string, FieldConfig>

export interface ContractTemplateFn {
  (values: Record<string, string | number>): string
}

// Type helper for template functions
export type TemplateFunction<T = Record<string, string | number>> = (values: T) => string

export interface ContractDefinition {
  id: string
  title: string
  description: string
  formSchema: FormSchema
  template: ContractTemplateFn | ((values: Record<string, string | number>) => string) | ((values: any) => string)
  industry?: string
  documentType?: string
  category?: string
}

export type ContractRegistry = Record<string, ContractDefinition>

// -----------------------------
// Contract Registry
// -----------------------------

export const contractRegistry: ContractRegistry = {
  // 1. NDA
  nda: {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    description:
      "A contract used to protect confidential information shared between two parties.",
    industry: "Business / Startup",
    documentType: "Agreement",
    category: "Legal Protection",
    formSchema: {
      clientName: { label: "Client Name", type: "text" },
      recipientName: { label: "Recipient Name", type: "text" },
      effectiveDate: { label: "Effective Date", type: "date" },
      jurisdiction: { label: "Jurisdiction (State)", type: "country/state" },
      confidentialityTerm: {
        label: "Confidentiality Term (Years)",
        type: "number",
      },
      purpose: {
        label: "Purpose of Disclosure",
        type: "textarea",
      },
    },
    template: ndaTemplate as ContractTemplateFn,
  },

  // 2. Independent Contractor Agreement
  "contractor-agreement": {
    id: "contractor-agreement",
    title: "Independent Contractor Agreement",
    description:
      "Defines scope, compensation, responsibilities, and terms for contractor work.",
    industry: "Business / Startup",
    documentType: "Agreement",
    category: "Employment",
    formSchema: {
      clientName: { label: "Client/Company Name", type: "text" },
      contractorName: { label: "Contractor Name", type: "text" },
      services: { label: "Services Description", type: "textarea" },
      compensation: { label: "Compensation Terms", type: "textarea" },
      startDate: { label: "Start Date", type: "date" },
      endDate: { label: "End Date (Optional)", type: "date" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: contractorAgreementTemplate as ContractTemplateFn,
  },

  // 3. Privacy Policy
  "privacy-policy": {
    id: "privacy-policy",
    title: "Privacy Policy",
    description:
      "Explains how your website or business collects, uses, and protects customer data.",
    industry: "E-Commerce / Online Business",
    documentType: "Policy",
    category: "Legal Compliance",
    formSchema: {
      businessName: { label: "Business or Website Name", type: "text" },
      contactEmail: { label: "Contact Email", type: "text" },
      companyLocation: {
        label: "Business Location (City, State)",
        type: "text",
      },
      dataCollected: {
        label: "Types of Data Collected",
        type: "textarea",
      },
      usagePurpose: {
        label: "How You Use Customer Data",
        type: "textarea",
      },
      thirdParties: {
        label: "Third Parties (if applicable)",
        type: "textarea",
      },
    },
    template: privacyPolicyTemplate as ContractTemplateFn,
  },

  // 4. Terms & Conditions
  "terms-and-conditions": {
    id: "terms-and-conditions",
    title: "Terms & Conditions",
    description:
      "A legal agreement outlining rules, responsibilities, and acceptable use for your service or website.",
    industry: "E-Commerce / Online Business",
    documentType: "Agreement",
    category: "Legal Compliance",
    formSchema: {
      businessName: { label: "Business or Website Name", type: "text" },
      companyLocation: {
        label: "Business Location (City, State)",
        type: "text",
      },
      servicesProvided: {
        label: "Description of Services or Products",
        type: "textarea",
      },
      paymentTerms: { label: "Payment / Billing Terms", type: "textarea" },
      refundPolicy: { label: "Refund Policy", type: "textarea" },
      prohibitedUses: { label: "Prohibited Uses", type: "textarea" },
    },
    template: termsAndConditionsTemplate as ContractTemplateFn,
  },

  // 5. Consulting Agreement
  "consulting-agreement": {
    id: "consulting-agreement",
    title: "Consulting Agreement",
    description:
      "An agreement defining services, compensation, duties, and legal terms for hiring a consultant.",
    industry: "Business / Startup",
    documentType: "Agreement",
    category: "Service Contract",
    formSchema: {
      consultantName: { label: "Consultant Name", type: "text" },
      clientName: { label: "Client Name", type: "text" },
      scopeOfWork: { label: "Scope of Work", type: "textarea" },
      rate: { label: "Rate / Compensation", type: "text" },
      startDate: { label: "Start Date", type: "date" },
      terminationTerms: {
        label: "Termination Terms",
        type: "textarea",
      },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: consultingAgreementTemplate as ContractTemplateFn,
  },

  // 6. Cookie Policy
  "cookie-policy": {
    id: "cookie-policy",
    title: "Cookie Policy",
    description:
      "Explains how your website uses cookies and provides disclosure required by privacy laws.",
    industry: "E-Commerce / Online Business",
    documentType: "Policy",
    category: "Legal Compliance",
    formSchema: {
      businessName: { label: "Business or Website Name", type: "text" },
      cookieTypes: { label: "Types of Cookies Used", type: "textarea" },
      purpose: {
        label: "Purpose of Each Cookie Type",
        type: "textarea",
      },
      optOutMethod: {
        label: "Opt-Out Instructions",
        type: "textarea",
      },
      jurisdiction: { label: "Jurisdiction (If Required)", type: "country/state" },
    },
    template: cookiePolicyTemplate as ContractTemplateFn,
  },

  // 7. Employment Offer Letter
  "offer-letter": {
    id: "offer-letter",
    title: "Employment Offer Letter",
    description:
      "A formal job offer including role, salary, start date, and employment conditions.",
    industry: "HR / Employment",
    documentType: "Letter",
    category: "Employment",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      employeeName: { label: "Employee Full Name", type: "text" },
      jobTitle: { label: "Job Title", type: "text" },
      startDate: { label: "Start Date", type: "date" },
      salary: { label: "Salary or Hourly Pay", type: "text" },
      workLocation: {
        label: "Work Location (Remote/Office)",
        type: "text",
      },
      benefits: { label: "Benefits (Optional)", type: "textarea" },
    },
    template: offerLetterTemplate as ContractTemplateFn,
  },

  // 8. Residential Lease
  "residential-lease": {
    id: "residential-lease",
    title: "Residential Lease Agreement",
    description:
      "A contract outlining the rental terms between a landlord and tenant.",
    industry: "Real Estate",
    documentType: "Agreement",
    category: "Lease",
    formSchema: {
      landlordName: { label: "Landlord Name", type: "text" },
      tenantName: { label: "Tenant Name", type: "text" },
      propertyAddress: { label: "Property Address", type: "text" },
      leaseStart: { label: "Lease Start Date", type: "date" },
      leaseEnd: { label: "Lease End Date", type: "date" },
      rentAmount: { label: "Monthly Rent Amount", type: "number" },
      securityDeposit: { label: "Security Deposit", type: "number" },
    },
    template: residentialLeaseTemplate as ContractTemplateFn,
  },

  // 9. Return & Refund Policy
  "return-refund-policy": {
    id: "return-refund-policy",
    title: "Return & Refund Policy",
    description:
      "Outlines your business's return and refund procedures for customers.",
    industry: "E-Commerce / Online Business",
    documentType: "Policy",
    category: "Customer Service",
    formSchema: {
      businessName: { label: "Business Name", type: "text" },
      contactEmail: { label: "Contact Email", type: "text" },
      companyLocation: { label: "Company Location", type: "text" },
      returnWindow: { label: "Return Window (e.g., 30 days)", type: "text" },
      refundMethod: { label: "Refund Method", type: "text" },
      returnConditions: { label: "Return Conditions", type: "textarea" },
      shippingCosts: { label: "Shipping Costs Policy", type: "textarea" },
    },
    template: returnRefundPolicyTemplate as ContractTemplateFn,
  },

  // 10. Shipping Policy
  "shipping-policy": {
    id: "shipping-policy",
    title: "Shipping Policy",
    description:
      "Details your shipping methods, rates, and delivery timeframes for customers.",
    industry: "E-Commerce / Online Business",
    documentType: "Policy",
    category: "Customer Service",
    formSchema: {
      businessName: { label: "Business Name", type: "text" },
      contactEmail: { label: "Contact Email", type: "text" },
      shippingMethods: { label: "Shipping Methods Available", type: "textarea" },
      processingTime: { label: "Processing Time", type: "text" },
      shippingRates: { label: "Shipping Rates", type: "textarea" },
      internationalShipping: { label: "International Shipping Policy", type: "textarea" },
      deliveryTimeframes: { label: "Delivery Timeframes", type: "textarea" },
    },
    template: shippingPolicyTemplate as ContractTemplateFn,
  },

  // 11. Employee Handbook
  "employee-handbook": {
    id: "employee-handbook",
    title: "Employee Handbook",
    description:
      "A comprehensive guide covering company policies, procedures, and expectations for employees.",
    industry: "HR / Employment",
    documentType: "Policy",
    category: "HR Documentation",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      effectiveDate: { label: "Effective Date", type: "date" },
      workLocation: { label: "Work Location", type: "text" },
      workSchedule: { label: "Work Schedule", type: "text" },
      benefits: { label: "Benefits Overview", type: "textarea" },
      codeOfConduct: { label: "Code of Conduct", type: "textarea" },
      policies: { label: "Key Policies", type: "textarea" },
    },
    template: employeeHandbookTemplate as ContractTemplateFn,
  },

  // 12. Employment Contract
  "employment-contract": {
    id: "employment-contract",
    title: "Employment Contract",
    description:
      "A formal employment agreement defining terms, compensation, and conditions of employment.",
    industry: "HR / Employment",
    documentType: "Agreement",
    category: "Employment",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      employeeName: { label: "Employee Name", type: "text" },
      jobTitle: { label: "Job Title", type: "text" },
      startDate: { label: "Start Date", type: "date" },
      salary: { label: "Salary/Compensation", type: "text" },
      workLocation: { label: "Work Location", type: "text" },
      workSchedule: { label: "Work Schedule", type: "text" },
      benefits: { label: "Benefits", type: "textarea" },
      terminationTerms: { label: "Termination Terms", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: employmentContractTemplate as ContractTemplateFn,
  },

  // 13. Contractor Termination Letter
  "contractor-termination-letter": {
    id: "contractor-termination-letter",
    title: "Contractor Termination Letter",
    description:
      "A formal letter terminating an independent contractor agreement.",
    industry: "HR / Employment",
    documentType: "Letter",
    category: "Termination",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      contractorName: { label: "Contractor Name", type: "text" },
      contractStartDate: { label: "Contract Start Date", type: "date" },
      terminationDate: { label: "Termination Date", type: "date" },
      reason: { label: "Reason for Termination (Optional)", type: "textarea" },
      finalPayment: { label: "Final Payment Terms", type: "textarea" },
      returnOfProperty: { label: "Return of Property Requirements", type: "textarea" },
    },
    template: contractorTerminationLetterTemplate as ContractTemplateFn,
  },

  // 14. Non-Compete Agreement
  "non-compete-agreement": {
    id: "non-compete-agreement",
    title: "Non-Compete Agreement",
    description:
      "An agreement restricting an employee or contractor from competing with your business.",
    industry: "HR / Employment",
    documentType: "Agreement",
    category: "Legal Protection",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      employeeName: { label: "Employee/Contractor Name", type: "text" },
      effectiveDate: { label: "Effective Date", type: "date" },
      duration: { label: "Duration (e.g., 1 year)", type: "text" },
      geographicScope: { label: "Geographic Scope", type: "text" },
      restrictedActivities: { label: "Restricted Activities", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: nonCompeteAgreementTemplate as ContractTemplateFn,
  },

  // 15. Non-Solicitation Agreement
  "non-solicitation-agreement": {
    id: "non-solicitation-agreement",
    title: "Non-Solicitation Agreement",
    description:
      "An agreement preventing solicitation of customers, employees, or business partners.",
    industry: "HR / Employment",
    documentType: "Agreement",
    category: "Legal Protection",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      employeeName: { label: "Employee Name", type: "text" },
      effectiveDate: { label: "Effective Date", type: "date" },
      duration: { label: "Duration", type: "text" },
      restrictedParties: { label: "Restricted Parties (customers, employees, etc.)", type: "textarea" },
      restrictedActivities: { label: "Restricted Activities", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: nonSolicitationAgreementTemplate as ContractTemplateFn,
  },

  // 16. Invoice Template
  "invoice-template": {
    id: "invoice-template",
    title: "Invoice Template",
    description:
      "A professional invoice template for billing clients and customers.",
    industry: "Business / Startup",
    documentType: "Document",
    category: "Billing",
    formSchema: {
      businessName: { label: "Business Name", type: "text" },
      businessAddress: { label: "Business Address", type: "textarea" },
      contactEmail: { label: "Contact Email", type: "text" },
      invoiceNumber: { label: "Invoice Number", type: "text" },
      invoiceDate: { label: "Invoice Date", type: "date" },
      dueDate: { label: "Due Date", type: "date" },
      clientName: { label: "Client Name", type: "text" },
      clientAddress: { label: "Client Address", type: "textarea" },
      items: { label: "Items/Services (description, quantity, price)", type: "textarea" },
      paymentTerms: { label: "Payment Terms", type: "textarea" },
    },
    template: invoiceTemplateTemplate as ContractTemplateFn,
  },

  // 17. Affiliate Program Terms
  "affiliate-program-terms": {
    id: "affiliate-program-terms",
    title: "Affiliate Program Terms",
    description:
      "Terms and conditions for your affiliate or referral program.",
    industry: "E-Commerce / Online Business",
    documentType: "Agreement",
    category: "Business Terms",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      contactEmail: { label: "Contact Email", type: "text" },
      commissionStructure: { label: "Commission Structure", type: "textarea" },
      paymentTerms: { label: "Payment Terms", type: "textarea" },
      programRules: { label: "Program Rules", type: "textarea" },
      prohibitedActivities: { label: "Prohibited Activities", type: "textarea" },
      terminationTerms: { label: "Termination Terms", type: "textarea" },
    },
    template: affiliateProgramTermsTemplate as ContractTemplateFn,
  },

  // 18. Licensing Agreement
  "licensing-agreement": {
    id: "licensing-agreement",
    title: "Licensing Agreement",
    description:
      "An agreement granting rights to use intellectual property, trademarks, or other assets.",
    industry: "Freelancers / Creators",
    documentType: "Agreement",
    category: "Intellectual Property",
    formSchema: {
      licensorName: { label: "Licensor Name", type: "text" },
      licenseeName: { label: "Licensee Name", type: "text" },
      licensedProperty: { label: "Licensed Property/Asset", type: "textarea" },
      licenseType: { label: "License Type (exclusive, non-exclusive, etc.)", type: "text" },
      territory: { label: "Territory", type: "text" },
      term: { label: "Term/Duration", type: "text" },
      royalties: { label: "Royalties/Payment Terms", type: "textarea" },
      restrictions: { label: "Restrictions", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: licensingAgreementTemplate as ContractTemplateFn,
  },

  // 19. Photo/Video Release Form
  "photo-video-release-form": {
    id: "photo-video-release-form",
    title: "Photo/Video Release Form",
    description:
      "A release form granting permission to use someone's image or likeness in media.",
    industry: "Freelancers / Creators",
    documentType: "Form",
    category: "Content Creation",
    formSchema: {
      companyName: { label: "Company/Organization Name", type: "text" },
      participantName: { label: "Participant Name", type: "text" },
      participantAge: { label: "Participant Age", type: "text" },
      eventDate: { label: "Event/Shoot Date", type: "date" },
      mediaType: { label: "Media Type (photos, video, audio, etc.)", type: "text" },
      usagePurpose: { label: "Usage Purpose", type: "textarea" },
      duration: { label: "Duration of Use", type: "text" },
      compensation: { label: "Compensation (if any)", type: "text" },
    },
    template: photoVideoReleaseFormTemplate as ContractTemplateFn,
  },

  // 20. Partnership Agreement
  "partnership-agreement": {
    id: "partnership-agreement",
    title: "Partnership Agreement",
    description:
      "A legal agreement defining the terms and structure of a business partnership.",
    industry: "Business / Startup",
    documentType: "Agreement",
    category: "Business Formation",
    formSchema: {
      partnershipName: { label: "Partnership Name", type: "text" },
      partner1Name: { label: "Partner 1 Name", type: "text" },
      partner2Name: { label: "Partner 2 Name", type: "text" },
      businessPurpose: { label: "Business Purpose", type: "textarea" },
      capitalContributions: { label: "Capital Contributions", type: "textarea" },
      profitSharing: { label: "Profit/Loss Sharing", type: "textarea" },
      managementRoles: { label: "Management Roles & Responsibilities", type: "textarea" },
      decisionMaking: { label: "Decision Making Process", type: "textarea" },
      withdrawalTerms: { label: "Withdrawal/Termination Terms", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: partnershipAgreementTemplate as ContractTemplateFn,
  },

  // 21. Founders' Agreement
  "founders-agreement": {
    id: "founders-agreement",
    title: "Founders' Agreement",
    description:
      "An agreement between co-founders defining equity, roles, and company structure.",
    industry: "Business / Startup",
    documentType: "Agreement",
    category: "Business Formation",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      founder1Name: { label: "Founder 1 Name", type: "text" },
      founder2Name: { label: "Founder 2 Name", type: "text" },
      equitySplit: { label: "Equity Split (e.g., 50/50, 60/40)", type: "text" },
      roles: { label: "Roles & Responsibilities", type: "textarea" },
      vestingSchedule: { label: "Vesting Schedule", type: "textarea" },
      intellectualProperty: { label: "Intellectual Property Assignment", type: "textarea" },
      decisionMaking: { label: "Decision Making Process", type: "textarea" },
      exitTerms: { label: "Exit/Termination Terms", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: foundersAgreementTemplate as ContractTemplateFn,
  },

  // 22. Acceptable Use Policy (AUP)
  "acceptable-use-policy": {
    id: "acceptable-use-policy",
    title: "Acceptable Use Policy (AUP)",
    description:
      "A policy defining acceptable and prohibited uses of your service or platform.",
    industry: "E-Commerce / Online Business",
    documentType: "Policy",
    category: "Legal Compliance",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      serviceDescription: { label: "Service/Platform Description", type: "textarea" },
      prohibitedUses: { label: "Prohibited Uses", type: "textarea" },
      contentRestrictions: { label: "Content Restrictions", type: "textarea" },
      userResponsibilities: { label: "User Responsibilities", type: "textarea" },
      enforcement: { label: "Enforcement & Violations", type: "textarea" },
      contactEmail: { label: "Contact Email", type: "text" },
    },
    template: acceptableUsePolicyTemplate as ContractTemplateFn,
  },

  // 23. Cease & Desist Letter
  "cease-desist-letter": {
    id: "cease-desist-letter",
    title: "Cease & Desist Letter",
    description:
      "A formal letter demanding that someone stop engaging in illegal or harmful activities.",
    industry: "Business / Startup",
    documentType: "Letter",
    category: "Legal Action",
    formSchema: {
      senderName: { label: "Sender Name/Company", type: "text" },
      senderAddress: { label: "Sender Address", type: "textarea" },
      recipientName: { label: "Recipient Name/Company", type: "text" },
      recipientAddress: { label: "Recipient Address", type: "textarea" },
      violationDescription: { label: "Violation Description", type: "textarea" },
      legalBasis: { label: "Legal Basis", type: "textarea" },
      demand: { label: "Demand/Required Action", type: "textarea" },
      deadline: { label: "Deadline/Response Date", type: "date" },
      jurisdiction: { label: "Jurisdiction", type: "country/state" },
    },
    template: ceaseDesistLetterTemplate as ContractTemplateFn,
  },

  // 24. Contract Breach Notice
  "contract-breach-notice": {
    id: "contract-breach-notice",
    title: "Contract Breach Notice",
    description:
      "A formal notice informing a party that they have breached a contract and must remedy the situation.",
    industry: "Business / Startup",
    documentType: "Letter",
    category: "Legal Action",
    formSchema: {
      senderName: { label: "Sender Name/Company", type: "text" },
      senderAddress: { label: "Sender Address", type: "textarea" },
      recipientName: { label: "Recipient Name/Company", type: "text" },
      recipientAddress: { label: "Recipient Address", type: "textarea" },
      contractDate: { label: "Original Contract Date", type: "date" },
      breachDescription: { label: "Breach Description", type: "textarea" },
      remedy: { label: "Required Remedy", type: "textarea" },
      deadline: { label: "Remedy Deadline", type: "date" },
      jurisdiction: { label: "Jurisdiction", type: "country/state" },
    },
    template: contractBreachNoticeTemplate as ContractTemplateFn,
  },

  // 25. Lease Termination Letter
  "lease-termination-letter": {
    id: "lease-termination-letter",
    title: "Lease Termination Letter",
    description:
      "A formal letter terminating a lease agreement between landlord and tenant.",
    industry: "Real Estate",
    documentType: "Letter",
    category: "Termination",
    formSchema: {
      landlordName: { label: "Landlord Name", type: "text" },
      tenantName: { label: "Tenant Name", type: "text" },
      propertyAddress: { label: "Property Address", type: "textarea" },
      leaseStartDate: { label: "Lease Start Date", type: "date" },
      terminationDate: { label: "Termination Date", type: "date" },
      reason: { label: "Reason for Termination", type: "textarea" },
      moveOutRequirements: { label: "Move-Out Requirements", type: "textarea" },
      finalInspection: { label: "Final Inspection Details", type: "textarea" },
    },
    template: leaseTerminationLetterTemplate as ContractTemplateFn,
  },

  // 26. Roommate Agreement
  "roommate-agreement": {
    id: "roommate-agreement",
    title: "Roommate Agreement",
    description:
      "An agreement between roommates outlining rent, utilities, rules, and responsibilities.",
    industry: "Real Estate",
    documentType: "Agreement",
    category: "Lease",
    formSchema: {
      propertyAddress: { label: "Property Address", type: "textarea" },
      roommate1Name: { label: "Roommate 1 Name", type: "text" },
      roommate2Name: { label: "Roommate 2 Name", type: "text" },
      leaseStartDate: { label: "Lease Start Date", type: "date" },
      leaseEndDate: { label: "Lease End Date", type: "date" },
      rentAmount: { label: "Total Monthly Rent", type: "number" },
      rentSplit: { label: "Rent Split (e.g., 50/50, 60/40)", type: "text" },
      utilities: { label: "Utilities Arrangement", type: "textarea" },
      houseRules: { label: "House Rules", type: "textarea" },
      guestPolicy: { label: "Guest Policy", type: "textarea" },
      terminationTerms: { label: "Termination Terms", type: "textarea" },
    },
    template: roommateAgreementTemplate as ContractTemplateFn,
  },

  // 27. Statement of Work
  "sow": {
    id: "sow",
    title: "Statement of Work (SOW)",
    description: "A detailed document outlining project scope, deliverables, timeline, and terms for a specific project.",
    industry: "Freelancers / Creators",
    documentType: "Agreement",
    category: "Service Contract",
    formSchema: {
      projectName: { label: "Project Name", type: "text" },
      clientName: { label: "Client Name", type: "text" },
      vendorName: { label: "Vendor/Service Provider Name", type: "text" },
      projectDescription: { label: "Project Description", type: "textarea" },
      deliverables: { label: "Deliverables", type: "textarea" },
      timeline: { label: "Timeline", type: "text" },
      budget: { label: "Budget", type: "text" },
      paymentTerms: { label: "Payment Terms", type: "textarea" },
      startDate: { label: "Start Date", type: "date" },
      endDate: { label: "End Date", type: "date" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: sowTemplate as ContractTemplateFn,
  },

  // 28. Service Agreement
  "service-agreement": {
    id: "service-agreement",
    title: "Service Agreement",
    description: "A contract defining services to be provided, fees, terms, and conditions between a service provider and client.",
    industry: "Freelancers / Creators",
    documentType: "Agreement",
    category: "Service Contract",
    formSchema: {
      serviceProviderName: { label: "Service Provider Name", type: "text" },
      clientName: { label: "Client Name", type: "text" },
      servicesDescription: { label: "Services Description", type: "textarea" },
      serviceFee: { label: "Service Fee", type: "text" },
      paymentSchedule: { label: "Payment Schedule", type: "text" },
      term: { label: "Term/Duration", type: "text" },
      startDate: { label: "Start Date", type: "date" },
      terminationTerms: { label: "Termination Terms", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: serviceAgreementTemplate as ContractTemplateFn,
  },

  // 29. Equity Split Agreement
  "equity-split-agreement": {
    id: "equity-split-agreement",
    title: "Equity Split Agreement",
    description: "An agreement defining equity distribution, vesting, and roles among co-founders or partners.",
    industry: "Business / Startup",
    documentType: "Agreement",
    category: "Business Formation",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      founder1Name: { label: "Founder 1 Name", type: "text" },
      founder2Name: { label: "Founder 2 Name", type: "text" },
      founder3Name: { label: "Founder 3 Name (Optional)", type: "text" },
      equitySplit: { label: "Equity Split", type: "text" },
      vestingSchedule: { label: "Vesting Schedule", type: "textarea" },
      cliffPeriod: { label: "Cliff Period", type: "text" },
      roles: { label: "Roles & Responsibilities", type: "textarea" },
      intellectualProperty: { label: "Intellectual Property Assignment", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: equitySplitAgreementTemplate as ContractTemplateFn,
  },

  // 30. CESA/SAFE Agreement
  "cesa-safe": {
    id: "cesa-safe",
    title: "CESA/SAFE Agreement",
    description: "A Convertible Equity Security Agreement or Simple Agreement for Future Equity for early-stage investments.",
    industry: "Business / Startup",
    documentType: "Agreement",
    category: "Investment",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      investorName: { label: "Investor Name", type: "text" },
      investmentAmount: { label: "Investment Amount", type: "text" },
      valuationCap: { label: "Valuation Cap", type: "text" },
      discountRate: { label: "Discount Rate", type: "text" },
      maturityDate: { label: "Maturity Date", type: "date" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: cesaSafeTemplate as ContractTemplateFn,
  },

  // 31. SaaS Terms of Service
  "saas-terms-of-service": {
    id: "saas-terms-of-service",
    title: "SaaS Terms of Service",
    description: "Terms and conditions for a Software-as-a-Service platform, including subscription terms, usage rights, and limitations.",
    industry: "E-Commerce / Online Business",
    documentType: "Agreement",
    category: "Legal Compliance",
    formSchema: {
      companyName: { label: "Company Name", type: "text" },
      serviceName: { label: "Service Name", type: "text" },
      contactEmail: { label: "Contact Email", type: "text" },
      companyLocation: { label: "Company Location", type: "text" },
      subscriptionPlans: { label: "Subscription Plans", type: "textarea" },
      cancellationPolicy: { label: "Cancellation Policy", type: "textarea" },
      dataHandling: { label: "Data Handling & Privacy", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: saasTermsOfServiceTemplate as ContractTemplateFn,
  },

  // 32. Sublease Agreement
  "sublease-agreement": {
    id: "sublease-agreement",
    title: "Sublease Agreement",
    description: "An agreement allowing a tenant to sublet their rental property to another party.",
    industry: "Real Estate",
    documentType: "Agreement",
    category: "Lease",
    formSchema: {
      originalTenantName: { label: "Original Tenant Name", type: "text" },
      subtenantName: { label: "Subtenant Name", type: "text" },
      landlordName: { label: "Landlord Name", type: "text" },
      propertyAddress: { label: "Property Address", type: "textarea" },
      subleaseStartDate: { label: "Sublease Start Date", type: "date" },
      subleaseEndDate: { label: "Sublease End Date", type: "date" },
      monthlyRent: { label: "Monthly Rent", type: "number" },
      securityDeposit: { label: "Security Deposit", type: "number" },
      originalLeaseEndDate: { label: "Original Lease End Date", type: "date" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: subleaseAgreementTemplate as ContractTemplateFn,
  },

  // 33. Rent Increase Notice
  "rent-increase-notice": {
    id: "rent-increase-notice",
    title: "Rent Increase Notice",
    description: "A formal notice informing a tenant of an upcoming rent increase.",
    industry: "Real Estate",
    documentType: "Letter",
    category: "Notice",
    formSchema: {
      landlordName: { label: "Landlord Name", type: "text" },
      landlordAddress: { label: "Landlord Address", type: "textarea" },
      tenantName: { label: "Tenant Name", type: "text" },
      tenantAddress: { label: "Tenant Address", type: "textarea" },
      propertyAddress: { label: "Property Address", type: "textarea" },
      currentRent: { label: "Current Rent", type: "number" },
      newRent: { label: "New Rent", type: "number" },
      effectiveDate: { label: "Effective Date", type: "date" },
      noticeDate: { label: "Notice Date", type: "date" },
      jurisdiction: { label: "Jurisdiction", type: "country/state" },
    },
    template: rentIncreaseNoticeTemplate as ContractTemplateFn,
  },

  // 34. Eviction Notice
  "eviction-notice": {
    id: "eviction-notice",
    title: "Eviction Notice",
    description: "A formal notice to a tenant to vacate the property due to lease violations or other legal reasons.",
    industry: "Real Estate",
    documentType: "Letter",
    category: "Legal Action",
    formSchema: {
      landlordName: { label: "Landlord Name", type: "text" },
      landlordAddress: { label: "Landlord Address", type: "textarea" },
      tenantName: { label: "Tenant Name", type: "text" },
      tenantAddress: { label: "Tenant Address", type: "textarea" },
      propertyAddress: { label: "Property Address", type: "textarea" },
      reason: { label: "Reason for Eviction", type: "textarea" },
      noticeDate: { label: "Notice Date", type: "date" },
      complianceDate: { label: "Compliance Date", type: "date" },
      jurisdiction: { label: "Jurisdiction", type: "country/state" },
    },
    template: evictionNoticeTemplate as ContractTemplateFn,
  },

  // 35. Influencer Agreement
  "influencer-agreement": {
    id: "influencer-agreement",
    title: "Influencer Agreement",
    description: "A contract between a brand and influencer for sponsored content and marketing campaigns.",
    industry: "Freelancers / Creators",
    documentType: "Agreement",
    category: "Content Creation",
    formSchema: {
      brandName: { label: "Brand/Company Name", type: "text" },
      influencerName: { label: "Influencer Name", type: "text" },
      campaignDescription: { label: "Campaign Description", type: "textarea" },
      deliverables: { label: "Deliverables", type: "textarea" },
      compensation: { label: "Compensation", type: "text" },
      paymentTerms: { label: "Payment Terms", type: "textarea" },
      campaignDates: { label: "Campaign Dates", type: "text" },
      exclusivity: { label: "Exclusivity Terms", type: "textarea" },
      contentApproval: { label: "Content Approval Process", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: influencerAgreementTemplate as ContractTemplateFn,
  },

  // 36. Brand Deal Contract
  "brand-deal-contract": {
    id: "brand-deal-contract",
    title: "Brand Deal Contract",
    description: "A comprehensive contract for brand partnerships and influencer marketing campaigns.",
    industry: "Freelancers / Creators",
    documentType: "Agreement",
    category: "Content Creation",
    formSchema: {
      brandName: { label: "Brand Name", type: "text" },
      creatorName: { label: "Creator/Influencer Name", type: "text" },
      partnershipType: { label: "Partnership Type", type: "text" },
      deliverables: { label: "Deliverables", type: "textarea" },
      compensation: { label: "Compensation", type: "text" },
      paymentSchedule: { label: "Payment Schedule", type: "textarea" },
      term: { label: "Term/Duration", type: "text" },
      exclusivity: { label: "Exclusivity Terms", type: "textarea" },
      contentGuidelines: { label: "Content Guidelines", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: brandDealContractTemplate as ContractTemplateFn,
  },

  // 37. Social Media Management Contract
  "social-media-management-contract": {
    id: "social-media-management-contract",
    title: "Social Media Management Contract",
    description: "An agreement for social media management services, including content creation, posting, and analytics.",
    industry: "Freelancers / Creators",
    documentType: "Agreement",
    category: "Service Contract",
    formSchema: {
      clientName: { label: "Client Name", type: "text" },
      agencyName: { label: "Agency/Service Provider Name", type: "text" },
      platforms: { label: "Social Media Platforms", type: "text" },
      services: { label: "Services Included", type: "textarea" },
      monthlyFee: { label: "Monthly Fee", type: "text" },
      paymentTerms: { label: "Payment Terms", type: "textarea" },
      term: { label: "Term/Duration", type: "text" },
      contentApproval: { label: "Content Approval Process", type: "textarea" },
      reporting: { label: "Reporting Requirements", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: socialMediaManagementContractTemplate as ContractTemplateFn,
  },

  // 38. Purchase Agreement (Real Estate)
  "purchase-agreement": {
    id: "purchase-agreement",
    title: "Real Estate Purchase Agreement",
    description: "A contract for the sale and purchase of real estate property.",
    industry: "Real Estate",
    documentType: "Agreement",
    category: "Purchase",
    formSchema: {
      buyerName: { label: "Buyer Name", type: "text" },
      sellerName: { label: "Seller Name", type: "text" },
      propertyAddress: { label: "Property Address", type: "textarea" },
      purchasePrice: { label: "Purchase Price", type: "number" },
      earnestMoney: { label: "Earnest Money Deposit", type: "number" },
      closingDate: { label: "Closing Date", type: "date" },
      contingencies: { label: "Contingencies", type: "textarea" },
      propertyDescription: { label: "Property Description", type: "textarea" },
      jurisdiction: { label: "Governing State", type: "country/state" },
    },
    template: purchaseAgreementTemplate as ContractTemplateFn,
  },

  // 39. Property Deed
  "property-deed": {
    id: "property-deed",
    title: "Property Deed",
    description: "A legal document transferring ownership of real property from one party to another.",
    industry: "Real Estate",
    documentType: "Document",
    category: "Title Transfer",
    formSchema: {
      grantorName: { label: "Grantor (Seller) Name", type: "text" },
      grantorAddress: { label: "Grantor Address", type: "textarea" },
      granteeName: { label: "Grantee (Buyer) Name", type: "text" },
      granteeAddress: { label: "Grantee Address", type: "textarea" },
      propertyAddress: { label: "Property Address", type: "textarea" },
      legalDescription: { label: "Legal Description", type: "textarea" },
      consideration: { label: "Consideration", type: "text" },
      deedType: { label: "Deed Type", type: "text" },
      recordingInfo: { label: "Recording Information", type: "textarea" },
      jurisdiction: { label: "Jurisdiction", type: "country/state" },
    },
    template: propertyDeedTemplate as ContractTemplateFn,
  },

  // 40. Title Document
  "title-document": {
    id: "title-document",
    title: "Title Document",
    description: "A document establishing ownership and title status of real property.",
    industry: "Real Estate",
    documentType: "Document",
    category: "Title Transfer",
    formSchema: {
      propertyAddress: { label: "Property Address", type: "textarea" },
      ownerName: { label: "Owner Name", type: "text" },
      legalDescription: { label: "Legal Description", type: "textarea" },
      lotNumber: { label: "Lot Number", type: "text" },
      blockNumber: { label: "Block Number", type: "text" },
      subdivision: { label: "Subdivision", type: "text" },
      county: { label: "County", type: "text" },
      state: { label: "State", type: "text" },
      recordingDate: { label: "Recording Date", type: "date" },
      documentNumber: { label: "Document Number", type: "text" },
    },
    template: titleDocumentTemplate as ContractTemplateFn,
  },
}

  

