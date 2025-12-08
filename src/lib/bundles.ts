import { contractRegistry } from "./contracts"

export interface DocumentBundle {
  id: string
  name: string
  description: string
  category: string
  documentIds: string[]
  price?: number
  popular?: boolean
}

export const documentBundles: DocumentBundle[] = [
  {
    id: "startup-essentials",
    name: "Startup Essentials",
    description: "Essential legal documents for startups and new businesses",
    category: "Business",
    documentIds: [
      "founders-agreement",
      "equity-split-agreement",
      "cesa-safe",
      "nda",
      "partnership-agreement",
    ],
    popular: true,
  },
  {
    id: "freelancer-pack",
    name: "Freelancer Pack",
    description: "Complete set of contracts for freelancers and independent contractors",
    category: "Freelance",
    documentIds: [
      "contractor-agreement",
      "consulting-agreement",
      "nda",
      "invoice-template",
      "non-compete-agreement",
    ],
    popular: true,
  },
  {
    id: "real-estate",
    name: "Real Estate Bundle",
    description: "Comprehensive real estate documents for property transactions",
    category: "Real Estate",
    documentIds: [
      "residential-lease",
      "sublease-agreement",
      "purchase-agreement",
      "property-deed",
      "title-document",
      "rent-increase-notice",
      "eviction-notice",
      "lease-termination-letter",
    ],
    popular: false,
  },
  {
    id: "saas-business",
    name: "SaaS Business Bundle",
    description: "Legal documents for Software-as-a-Service businesses",
    category: "Technology",
    documentIds: [
      "saas-terms-of-service",
      "privacy-policy",
      "cookie-policy",
      "acceptable-use-policy",
      "terms-and-conditions",
    ],
    popular: false,
  },
  {
    id: "ecommerce",
    name: "E-commerce Bundle",
    description: "Essential legal documents for online stores and e-commerce businesses",
    category: "E-commerce",
    documentIds: [
      "terms-and-conditions",
      "privacy-policy",
      "return-refund-policy",
      "shipping-policy",
      "cookie-policy",
    ],
    popular: false,
  },
  {
    id: "influencer-marketing",
    name: "Influencer Marketing Bundle",
    description: "Contracts for influencer partnerships and brand deals",
    category: "Marketing",
    documentIds: [
      "influencer-agreement",
      "brand-deal-contract",
      "social-media-management-contract",
      "photo-video-release-form",
    ],
    popular: false,
  },
  {
    id: "employment",
    name: "Employment Bundle",
    description: "Complete set of employment-related documents",
    category: "Employment",
    documentIds: [
      "employment-contract",
      "offer-letter",
      "employee-handbook",
      "non-compete-agreement",
      "non-solicitation-agreement",
      "contractor-termination-letter",
    ],
    popular: false,
  },
]

export function getBundleById(id: string): DocumentBundle | undefined {
  return documentBundles.find((bundle) => bundle.id === id)
}

export function getBundlesByCategory(category: string): DocumentBundle[] {
  return documentBundles.filter((bundle) => bundle.category === category)
}

export function getDocumentsInBundle(bundleId: string) {
  const bundle = getBundleById(bundleId)
  if (!bundle) return []
  
  return bundle.documentIds
    .map((id) => contractRegistry[id])
    .filter(Boolean)
}

