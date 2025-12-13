/**
 * Document Type-Specific Prompt Enhancements
 * 
 * Provides comprehensive, holistic, attorney-level prompts for each specific legal document type.
 * These prompts enhance the base generation with:
 * - Document-specific requirements and best practices
 * - Legal risk mitigation strategies
 * - Compliance requirements (federal, state, industry-specific)
 * - Enforcement mechanisms and dispute resolution
 * - Quality assurance checklists
 * - Professional standards and attorney-level requirements
 * 
 * This system is designed to minimize legal risk by:
 * - Ensuring comprehensive coverage of all material terms
 * - Including appropriate risk mitigation provisions
 * - Complying with applicable laws and regulations
 * - Using tested, enforceable language
 * - Addressing edge cases and potential disputes proactively
 * - Following professional legal document standards
 * 
 * IMPORTANT LEGAL NOTICE:
 * These prompts are designed to guide AI generation of legal documents. However:
 * - All generated documents should be reviewed by qualified legal counsel
 * - These prompts do not constitute legal advice
 * - Laws vary by jurisdiction and change over time
 * - No guarantee is made as to the enforceability or suitability of generated documents
 * - Users are solely responsible for ensuring compliance with applicable laws
 * - This system provides templates that may require customization for specific circumstances
 */

export interface DocumentTypePrompt {
  /** Document type identifier */
  type: string
  /** Detailed description of what this document should accomplish */
  purpose: string
  /** Professional description similar to LegalZoom's attorney-drafted templates */
  professionalDescription: string
  /** Required sections that must be included */
  requiredSections: string[]
  /** Detailed section descriptions - what each section should contain */
  sectionDetails: Record<string, string>
  /** Important legal considerations specific to this document type */
  legalConsiderations: string[]
  /** Critical legal protections that must be included */
  legalProtections: string[]
  /** Risk mitigation strategies specific to this document type */
  riskMitigation?: string[]
  /** Compliance requirements (federal, state, industry-specific) */
  complianceRequirements?: string[]
  /** Enforcement mechanisms and dispute resolution */
  enforcementProvisions?: string[]
  /** Best practices for this document type */
  bestPractices: string[]
  /** Common clauses that should be included with detailed descriptions */
  commonClauses: Record<string, string>
  /** Specific language requirements and legal terminology */
  languageRequirements: string[]
  /** Formatting and structure requirements */
  formattingRequirements: string[]
  /** Additional clauses that may be relevant */
  optionalClauses?: string[]
  /** Jurisdiction-specific considerations */
  jurisdictionConsiderations?: string[]
  /** Quality assurance checklist */
  qualityChecklist?: string[]
  /** Professional standards and attorney-level requirements */
  professionalStandards?: string[]
}

/**
 * Document type-specific prompt configurations
 */
export const DOCUMENT_TYPE_PROMPTS: Record<string, DocumentTypePrompt> = {
  "Non-Disclosure Agreement": {
    type: "Non-Disclosure Agreement (NDA)",
    purpose: "A legally binding agreement that protects confidential information shared between parties. This document establishes the terms under which sensitive information can be shared and used, preventing unauthorized disclosure.",
    professionalDescription: "Safeguard your proprietary information and maintain privacy when sharing sensitive business information with third parties. This comprehensive NDA establishes clear boundaries, defines what constitutes confidential information, and provides legal remedies in case of unauthorized disclosure. Essential for protecting trade secrets, business strategies, customer lists, financial information, and other valuable proprietary data during business negotiations, partnerships, or collaborations.",
    requiredSections: [
      "Preamble and Parties (with full legal names and addresses)",
      "Recitals (purpose and context of the agreement)",
      "Definitions Section (comprehensive definition of 'Confidential Information')",
      "Scope of Confidential Information (detailed description of what is covered)",
      "Obligations of Receiving Party (duty to maintain confidentiality)",
      "Permitted Disclosures (exceptions and authorized disclosures)",
      "Exclusions from Confidentiality (public domain, independently developed, required by law)",
      "Term and Duration (effective date and duration of obligations)",
      "Survival of Obligations (how long obligations continue after termination)",
      "Return or Destruction of Materials (procedures for handling confidential materials)",
      "Remedies for Breach (injunctive relief, monetary damages, attorney fees)",
      "No License Granted (clarification that NDA doesn't grant rights)",
      "Governing Law and Jurisdiction (choice of law and venue)",
      "Severability (provision that invalid clauses don't void entire agreement)",
      "Entire Agreement (merger clause)",
      "Modifications (how agreement can be amended)",
      "Notices (how parties communicate under the agreement)"
    ],
    sectionDetails: {
      "Definitions Section": "Must include a comprehensive definition of 'Confidential Information' that covers: (1) all non-public, proprietary, or confidential information disclosed, (2) information marked or designated as confidential, (3) information that should reasonably be understood as confidential given the circumstances, (4) all notes, analyses, compilations, studies, or other documents prepared by the receiving party that contain or reflect confidential information. Include specific examples relevant to the business context.",
      "Obligations of Receiving Party": "Must clearly state: (1) the receiving party shall hold and maintain all Confidential Information in strict confidence, (2) shall not disclose any Confidential Information to any third party without prior written consent, (3) shall use Confidential Information solely for the stated purpose, (4) shall take all reasonable precautions to protect the confidentiality of the information, (5) shall immediately notify the disclosing party of any unauthorized disclosure, and (6) shall restrict access to only those employees, agents, or representatives who need to know and who are bound by similar confidentiality obligations.",
      "Exclusions from Confidentiality": "Must explicitly exclude: (1) information that is or becomes publicly available through no breach of this agreement, (2) information that was rightfully known by the receiving party prior to disclosure, (3) information that was independently developed by the receiving party without use of or reference to the Confidential Information, (4) information that is rightfully received from a third party without breach of any confidentiality obligation, and (5) information that is required to be disclosed by law, court order, or governmental regulation (with prior notice to disclosing party if legally permissible).",
      "Remedies for Breach": "Must include: (1) acknowledgment that monetary damages may be inadequate and that the disclosing party is entitled to seek injunctive relief and specific performance, (2) the right to recover actual damages, (3) the right to recover reasonable attorney fees and costs, (4) the right to seek both legal and equitable remedies, and (5) acknowledgment that breach may cause irreparable harm."
    },
    legalConsiderations: [
      "The definition of 'Confidential Information' must be comprehensive yet specific enough to be enforceable. Vague or overly broad definitions may be struck down by courts. Include specific examples relevant to the business context to strengthen enforceability.",
      "The duration of confidentiality obligations must be reasonable. While trade secrets can be protected indefinitely, general business information typically has a 2-5 year term. Courts may invalidate unreasonably long terms as against public policy.",
      "Exclusions must be clearly stated to prevent disputes. The 'independently developed' exclusion is particularly important for protecting the receiving party's right to develop similar products or services without using confidential information.",
      "Remedies provisions must be carefully drafted. While injunctive relief is typically available, liquidated damages clauses must be reasonable and not punitive. Unreasonable liquidated damages may be unenforceable.",
      "Governing law selection is critical. Choose the jurisdiction most favorable to your interests and where enforcement is most likely. Consider the location of parties, assets, and courts with expertise in the subject matter.",
      "The agreement must clearly distinguish between unilateral (one-way) and mutual (two-way) NDAs. Use appropriate language based on whether both parties are disclosing confidential information.",
      "Consider including a 'residuals' clause if the receiving party may develop similar products independently, but be aware that some jurisdictions (like California) restrict such clauses. Consult jurisdiction-specific laws.",
      "Include comprehensive provisions for handling confidential information after the agreement terminates, including return or destruction requirements with certification procedures.",
      "Ensure the agreement complies with applicable state and federal laws, including any restrictions on non-compete or non-solicitation provisions if included. Some states heavily restrict or prohibit such provisions.",
      "Address electronic and digital information security requirements, including encryption, secure storage, and access controls to demonstrate reasonable efforts to protect confidential information.",
      "Consider including dispute resolution provisions (arbitration or mediation) to reduce costs and maintain confidentiality, but ensure the process is fair and enforceable under applicable law.",
      "Include provisions addressing what happens if the receiving party receives conflicting obligations (e.g., court order vs. NDA obligations), including notice requirements and cooperation in seeking protective orders.",
      "Address international considerations if parties are in different countries, including cross-border data transfer restrictions (GDPR, etc.) and enforceability across jurisdictions."
    ],
    riskMitigation: [
      "Define 'Confidential Information' comprehensively but with specific examples to reduce disputes about what is covered and strengthen enforceability in court.",
      "Include multiple layers of protection: contractual obligations, acknowledgment of trade secret status, and reference to statutory protections (Defend Trade Secrets Act, Uniform Trade Secrets Act).",
      "Require immediate notification of unauthorized disclosure to enable swift response and damage mitigation, including details of the breach and remedial actions taken.",
      "Include attorney fee-shifting provisions to deter breaches and ensure that prevailing party can recover costs, making enforcement economically viable.",
      "Specify exact procedures for return/destruction with certification requirements to ensure compliance and create evidence trail if dispute arises.",
      "Include 'no license granted' provisions to prevent receiving party from claiming any rights to confidential information or intellectual property.",
      "Address third-party access comprehensively, requiring confidentiality agreements from all third parties and limiting access to 'need to know' basis only.",
      "Include survival provisions ensuring confidentiality obligations continue even after termination of underlying business relationship, with clear duration specified.",
      "Address potential conflicts between NDA obligations and legal requirements (subpoenas, regulatory requests) with procedures for handling such situations.",
      "Include provisions allowing disclosure of confidential information to legal, financial, and other advisors bound by professional confidentiality obligations, with restrictions on use.",
      "Address potential corporate transactions (mergers, acquisitions) and whether confidential information may be disclosed in connection with due diligence, with appropriate safeguards."
    ],
    complianceRequirements: [
      "Comply with the Defend Trade Secrets Act (DTSA) if trade secrets are involved, including providing notice of immunity for whistleblower disclosures in confidential reporting to government officials or attorneys.",
      "Comply with applicable state trade secret laws (Uniform Trade Secrets Act in most states) and ensure definitions align with statutory definitions where beneficial.",
      "Ensure any non-compete or non-solicitation provisions comply with applicable state laws (some states like California prohibit non-compete agreements except in limited circumstances).",
      "Comply with data protection laws (GDPR, CCPA, etc.) if personal information is included in confidential information, including data subject rights and breach notification requirements.",
      "Ensure compliance with securities laws if confidential information relates to publicly traded companies or securities offerings (insider trading restrictions, etc.).",
      "Comply with export control laws if confidential information relates to controlled technologies or information subject to export regulations.",
      "Ensure compliance with antitrust laws - confidentiality agreements must not be used to facilitate anticompetitive behavior or market allocation.",
      "Address employment law considerations if employees are involved, including restrictions on post-employment confidentiality obligations and compliance with state-specific employee rights."
    ],
    enforcementProvisions: [
      "Include comprehensive remedies: injunctive relief (temporary and permanent), monetary damages (actual and consequential), attorney fees and costs, and acknowledgment of irreparable harm making equitable relief appropriate.",
      "Specify that injunctive relief is available without bond or with minimal bond to reduce barriers to obtaining emergency relief for breaches.",
      "Include provisions allowing for expedited discovery and evidentiary procedures to enable swift enforcement actions.",
      "Specify governing law and exclusive jurisdiction or venue for disputes, choosing jurisdiction favorable to enforcement (typically where disclosing party is located or where harm occurs).",
      "Include dispute resolution mechanisms appropriate for the parties and circumstances: litigation for maximum protection, arbitration for speed and confidentiality, or mediation for relationship preservation.",
      "Include provisions for recovery of investigation costs and expenses incurred in detecting and responding to breaches.",
      "Specify that breach of confidentiality obligations constitutes material breach allowing for termination of any underlying agreements.",
      "Include provisions for liquidated damages if breach results in quantifiable harm, but ensure amounts are reasonable and not punitive to avoid unenforceability.",
      "Address remedies for inadvertent disclosure, including immediate notification requirements and obligations to cooperate in remediation efforts."
    ],
    qualityChecklist: [
      "All required sections are present and fully developed with comprehensive detail",
      "Definition of 'Confidential Information' is comprehensive, specific, and includes relevant examples",
      "All exclusions are clearly stated and comprehensive (public domain, prior knowledge, independent development, third-party receipt, legal requirements)",
      "Obligations of receiving party are clearly specified with mandatory language ('shall', 'must')",
      "Remedies provisions are comprehensive and include injunctive relief, damages, and attorney fees",
      "Survival provisions clearly specify duration of confidentiality obligations after termination",
      "Return/destruction procedures are detailed with certification requirements",
      "Governing law and jurisdiction are specified and appropriate for the parties",
      "All defined terms are capitalized consistently throughout the document",
      "Cross-references between sections are accurate and helpful",
      "The agreement clearly states whether it is unilateral or mutual",
      "Provisions are reasonable and likely to be enforceable in applicable jurisdiction",
      "Language is precise, unambiguous, and uses professional legal terminology",
      "The document addresses electronic/digital information security requirements",
      "The document includes appropriate risk mitigation and enforcement mechanisms"
    ],
    professionalStandards: [
      "Use precise, tested legal language that has been upheld in court cases involving similar agreements. Avoid innovative language that may create ambiguity or enforcement issues.",
      "Structure the document logically with clear section headers and subsections, making it easy to navigate and reference specific provisions during negotiations or disputes.",
      "Include comprehensive provisions addressing not only the primary obligations but also edge cases, potential disputes, and exceptional circumstances (regulatory requests, corporate transactions, etc.).",
      "Ensure all provisions are reasonable and balanced to maximize enforceability - overly one-sided agreements may be challenged or partially invalidated by courts.",
      "Use mandatory language ('shall', 'must', 'will') for obligations and permissive language ('may') only for rights or discretionary actions.",
      "Include appropriate qualifiers ('reasonable', 'material', 'substantial') to provide flexibility while maintaining enforceability - but avoid over-qualification that weakens protections.",
      "Cross-reference related provisions to create a cohesive document where sections support and reinforce each other, avoiding contradictions or gaps.",
      "Follow standard legal document conventions: formal preamble, recitals, defined terms section, numbered sections with lettered subsections, and proper execution language.",
      "Ensure the document can stand alone and be understood without reference to external documents (except for defined agreements that are incorporated by reference).",
      "Include appropriate legal protections for both parties while ensuring the document achieves its primary purpose of protecting confidential information.",
      "Address jurisdiction-specific requirements and restrictions (e.g., California's restrictions on residuals clauses) to ensure enforceability.",
      "Use consistent terminology throughout - once a term is defined, use it consistently rather than using synonyms that could create ambiguity."
    ],
    legalProtections: [
      "Protection against unauthorized disclosure of proprietary information",
      "Legal right to seek injunctive relief to prevent further disclosure",
      "Right to recover monetary damages for breach",
      "Protection of trade secrets under both contract law and trade secret statutes",
      "Ability to recover attorney fees and costs in case of breach",
      "Protection against reverse engineering or independent development using confidential information",
      "Clear legal framework for handling confidential information in business relationships"
    ],
    bestPractices: [
      "Use precise, unambiguous legal language that has been tested in court. Avoid vague terms that could be interpreted multiple ways.",
      "Include specific examples of confidential information relevant to the particular business context (e.g., 'customer lists, pricing strategies, marketing plans, technical specifications').",
      "Specify the exact purpose for which confidential information can be used. This limits the receiving party's use and provides clear boundaries.",
      "Include detailed procedures for return or destruction of confidential materials, including timelines and methods of destruction (e.g., 'shredded, burned, or permanently deleted').",
      "Consider including non-solicitation clauses if the parties may have access to each other's employees or customers, but ensure such clauses are reasonable in scope and duration.",
      "If the agreement is mutual, clearly distinguish between each party's confidential information and ensure both parties have equal obligations.",
      "Include provisions for handling electronic and digital confidential information, including requirements for secure storage and transmission.",
      "Specify notice requirements for any disclosures required by law, including the obligation to provide advance notice when legally permissible.",
      "Consider including dispute resolution provisions (arbitration or mediation) to avoid costly litigation, but ensure the choice aligns with your strategic interests.",
      "Include a 'no license granted' provision to clarify that the NDA does not grant any intellectual property rights or licenses."
    ],
    commonClauses: {
      "Definition of Confidential Information": "A comprehensive definition that includes all non-public, proprietary information, whether oral, written, or electronic, including but not limited to business plans, financial information, customer lists, technical data, marketing strategies, and any information marked or designated as confidential.",
      "Permitted Use": "A clause limiting the receiving party's use of Confidential Information solely to the stated purpose and prohibiting any other use without express written consent.",
      "Permitted Disclosures": "Provisions allowing disclosure to employees, agents, or representatives who need to know and who are bound by confidentiality obligations, and disclosure required by law (with notice when possible).",
      "Exclusions": "Clear exclusions for information that is publicly available, previously known, independently developed, or received from third parties without breach.",
      "Term and Survival": "Specification of the effective date, duration of the agreement, and how long confidentiality obligations survive after termination (typically 2-5 years, or indefinitely for trade secrets).",
      "Return or Destruction": "Detailed procedures requiring the receiving party to return or destroy all Confidential Information upon request or termination, with certification of destruction.",
      "Remedies": "Comprehensive remedies including injunctive relief, monetary damages, attorney fees, and acknowledgment of irreparable harm.",
      "No License Granted": "Clarification that the NDA does not grant any intellectual property rights, licenses, or ownership interests.",
      "Governing Law": "Selection of applicable state law and jurisdiction for disputes, typically the state where the disclosing party is located.",
      "Severability": "Provision that if any clause is found invalid, the remainder of the agreement remains in effect.",
      "Entire Agreement": "Merger clause stating that the written agreement constitutes the entire understanding and supersedes all prior agreements.",
      "Modifications": "Requirement that any modifications must be in writing and signed by both parties.",
      "Notices": "Specification of how formal notices under the agreement must be delivered (e.g., certified mail, email with confirmation)."
    },
    languageRequirements: [
      "Use formal, professional legal language appropriate for business contracts",
      "Employ precise terminology - use 'Confidential Information' consistently throughout, not variations like 'confidential data' or 'proprietary information'",
      "Include standard legal phrases such as 'WHEREAS', 'NOW, THEREFORE', 'IN WITNESS WHEREOF' in the preamble and conclusion",
      "Use mandatory language ('shall', 'must', 'will') rather than permissive language ('may', 'can') for obligations",
      "Include qualifiers like 'reasonable', 'material', 'substantial' where appropriate to provide flexibility while maintaining enforceability",
      "Use defined terms consistently - capitalize defined terms throughout the document after first definition",
      "Include cross-references between sections where clauses relate to each other",
      "Use active voice for clarity (e.g., 'The Receiving Party shall maintain' rather than 'Confidentiality shall be maintained by')"
    ],
    formattingRequirements: [
      "Begin with a formal preamble identifying the parties with full legal names and addresses",
      "Include recitals (WHEREAS clauses) explaining the purpose and context of the agreement",
      "Use clear section headers with numbered sections (1., 2., 3.) and lettered subsections (a., b., c.)",
      "Bold all defined terms on first use and in section headers",
      "Use proper paragraph breaks - each major concept should be in its own paragraph",
      "Add an effective date field at the top of the document",
      "DO NOT include signature blocks - signatures are handled separately via the signature feature",
      "Use consistent formatting for lists and bullet points",
      "Include a table of contents for longer agreements (if document exceeds 5 pages)"
    ],
    optionalClauses: [
      "Non-solicitation of employees clause",
      "Non-solicitation of customers clause",
      "Residuals clause (with jurisdiction-specific limitations)",
      "Dispute resolution (arbitration or mediation)",
      "Force majeure clause",
      "Assignment and delegation restrictions",
      "Waiver of jury trial (where permitted by law)",
      "Counterparts clause (allowing execution in multiple copies)"
    ],
    jurisdictionConsiderations: [
      "California: Be aware of restrictions on 'residuals' clauses and non-compete provisions",
      "New York: Consider choice of law provisions carefully - New York law is often preferred for business agreements",
      "Delaware: Delaware law is commonly chosen for corporate agreements due to well-developed corporate law",
      "Federal: Consider applicability of the Defend Trade Secrets Act (DTSA) for trade secret protection",
      "International: If parties are in different countries, consider international dispute resolution mechanisms"
    ]
  },
  "Independent Contractor Agreement": {
    type: "Independent Contractor Agreement",
    purpose: "Establishes the terms of engagement between a company and an independent contractor. This document clarifies the contractor's status, scope of work, payment terms, and protects both parties' interests.",
    professionalDescription: "Clearly define project terms, responsibilities, and legal protections when hiring independent contractors for your company. This comprehensive agreement helps lay out work schedules, payment terms, deliverables, and other essential details while establishing that the contractor is an independent business entity, not an employee. Critical for protecting your business from misclassification risks, ensuring clear expectations, and safeguarding your intellectual property and confidential information. Essential for freelancers, consultants, service providers, and any non-employee workers.",
    requiredSections: [
      "Preamble and Parties (full legal names, business addresses, and entity types)",
      "Recitals (purpose and nature of the engagement)",
      "Engagement and Independent Contractor Relationship (explicit statement of contractor status)",
      "Scope of Work and Deliverables (detailed description of services and expected outcomes)",
      "Performance Standards and Quality Requirements",
      "Compensation and Payment Terms (rates, payment schedule, invoicing requirements)",
      "Expenses and Reimbursements (what expenses are covered and how)",
      "Term and Duration (start date, end date, or ongoing basis)",
      "Independent Contractor Status (detailed provisions establishing non-employee relationship)",
      "Tax Obligations (clarification that contractor is responsible for own taxes)",
      "Intellectual Property Rights (ownership of work product and pre-existing IP)",
      "Confidentiality and Non-Disclosure",
      "Non-Competition and Non-Solicitation (if applicable, with reasonableness requirements)",
      "Termination Provisions (grounds for termination, notice requirements, effect of termination)",
      "Indemnification and Liability",
      "Insurance Requirements (if applicable)",
      "Dispute Resolution",
      "Governing Law and Jurisdiction",
      "Severability and Entire Agreement"
    ],
    sectionDetails: {
      "Independent Contractor Status": "Must explicitly state: (1) Contractor is an independent contractor, not an employee, agent, or partner, (2) Contractor has no authority to bind Company, (3) Contractor is responsible for their own taxes, insurance, and benefits, (4) Contractor may work for other clients, (5) Company will not withhold taxes or provide benefits, (6) Contractor is responsible for compliance with all applicable laws and regulations, and (7) The relationship is that of principal and independent contractor, not employer-employee. Include factors demonstrating independence (control over methods, use of own tools, etc.).",
      "Scope of Work and Deliverables": "Must include: (1) detailed description of services to be performed, (2) specific deliverables with acceptance criteria, (3) timelines and milestones, (4) performance standards and quality requirements, (5) reporting requirements, (6) location of work (remote, on-site, or hybrid), (7) equipment and resources to be provided by each party, and (8) procedures for change orders or scope modifications.",
      "Intellectual Property Rights": "Must clearly state: (1) all work product created under the agreement is 'work made for hire' and owned by Company, (2) if work is not considered work made for hire, Contractor assigns all rights to Company, (3) Contractor retains rights to pre-existing intellectual property, (4) Contractor grants Company a license to use pre-existing IP incorporated into work product, (5) Contractor warrants that work product does not infringe third-party rights, and (6) Contractor will execute any additional documents needed to perfect Company's ownership.",
      "Termination Provisions": "Must include: (1) grounds for termination (with cause, without cause, convenience), (2) notice requirements for each type of termination, (3) effect of termination on payment obligations, (4) return of Company property and materials, (5) survival of certain provisions (confidentiality, IP, indemnification), (6) payment for work completed prior to termination, and (7) procedures for transition of work."
    },
    legalConsiderations: [
      "The independent contractor classification is critical for tax and liability purposes. The agreement must clearly establish factors demonstrating independence to avoid misclassification risks, which can result in significant penalties, back taxes, and liability for employee benefits. Include explicit statements about contractor status, tax obligations, benefits, and control over work methods.",
      "The scope of work must be detailed enough to prevent scope creep and disputes, but flexible enough to allow for reasonable modifications. Include clear procedures for change orders with pricing adjustments.",
      "Intellectual property ownership must be explicitly addressed. Under copyright law, work made for hire belongs to the hiring party, but this only applies in specific circumstances. Include both work-made-for-hire language and assignment provisions as backup to ensure comprehensive IP protection.",
      "Payment terms must be clear and comply with applicable laws. Some jurisdictions require prompt payment for contractor services. Specify invoicing requirements, payment deadlines, late payment consequences, and currency if applicable.",
      "Confidentiality provisions are essential to protect business information. Ensure they are reasonable in scope and duration to be enforceable. Consider including return/destruction requirements upon termination.",
      "Non-compete and non-solicitation clauses must be reasonable in geographic scope, duration, and scope of restricted activities. Overly broad restrictions may be unenforceable, especially in states like California where non-compete clauses are generally prohibited except in limited circumstances.",
      "Termination provisions must balance flexibility with protection. Include provisions for termination with cause (breach, failure to perform) and without cause (convenience), with appropriate notice requirements and payment for completed work.",
      "Indemnification clauses should be carefully drafted. Consider mutual indemnification for breaches of the agreement, but be cautious of overly broad indemnification that could expose the contractor to unlimited liability. Include reasonable limitations on liability.",
      "Ensure compliance with applicable labor laws, including worker classification tests (IRS 20-factor test, ABC test in some states, economic realities test). The agreement should support proper classification with explicit provisions demonstrating independence.",
      "Consider including dispute resolution provisions (arbitration or mediation) to avoid costly litigation, but ensure the contractor has a fair process and the choice aligns with strategic interests.",
      "Address insurance requirements if applicable (general liability, professional liability, workers' compensation) to protect both parties and ensure contractor has appropriate coverage.",
      "Include provisions addressing subcontracting, if permitted, including approval requirements and ensuring subcontractors are bound by similar obligations.",
      "Address work location, schedule, and methods - while contractors typically control methods, you may specify deliverables, deadlines, and quality standards without creating employment relationship."
    ],
    riskMitigation: [
      "Include explicit 'Independent Contractor Relationship' section with comprehensive statements about non-employee status, tax obligations, benefits, and control over work methods to minimize misclassification risk.",
      "Address intellectual property comprehensively with both 'work made for hire' provisions and assignment language to ensure complete IP ownership protection regardless of copyright law applicability.",
      "Include detailed scope of work with acceptance criteria, milestones, and change order procedures to prevent scope creep and disputes about deliverables.",
      "Specify comprehensive payment terms including rates, schedule, invoicing requirements, and late payment consequences to ensure timely payment and reduce payment disputes.",
      "Include reasonable confidentiality provisions to protect business information while ensuring enforceability - overly broad restrictions may be invalidated.",
      "If including non-compete or non-solicitation provisions, ensure they are reasonable in scope, duration, and geography to maximize enforceability and avoid invalidation by courts.",
      "Include comprehensive termination provisions addressing multiple scenarios (with cause, without cause, convenience) with appropriate notice and payment requirements to provide flexibility while protecting interests.",
      "Include indemnification provisions that protect Company from claims arising from Contractor's work, but ensure limitations are reasonable to avoid contractor exposure to unlimited liability.",
      "Address insurance requirements if the nature of work creates liability exposure, ensuring Contractor maintains appropriate coverage to protect both parties.",
      "Include dispute resolution provisions (arbitration or mediation) to reduce costs and maintain business relationships, but ensure the process is fair and enforceable.",
      "Specify governing law and jurisdiction favorable to enforcement, typically where Company is located or where services are performed.",
      "Include 'no employment relationship' acknowledgment and factors demonstrating independence (use of own tools, control over methods, ability to work for others) to strengthen classification."
    ],
    complianceRequirements: [
      "Comply with IRS worker classification guidelines (20-factor test) - the agreement should support factors indicating contractor independence, not employee status.",
      "Comply with state-specific worker classification tests (ABC test in California, Massachusetts, New Jersey; economic realities test used by DOL and some states).",
      "Ensure compliance with state prompt payment laws for contractor services - some states require payment within specific timeframes (e.g., 30-45 days).",
      "Comply with state restrictions on non-compete clauses - many states restrict or prohibit non-compete agreements for independent contractors (especially California).",
      "Ensure compliance with employment tax requirements - verify that agreement properly establishes contractor status to avoid employer tax obligations.",
      "Comply with applicable labor laws and regulations, including minimum wage and overtime requirements if contractor classification is challenged.",
      "If services involve regulated industries (healthcare, finance, etc.), ensure compliance with industry-specific licensing and regulatory requirements.",
      "Comply with data protection laws (GDPR, CCPA, etc.) if Contractor has access to personal information or customer data.",
      "Ensure compliance with export control laws if services involve controlled technologies or information subject to export regulations.",
      "Address workers' compensation requirements - contractors are typically not covered, but verify state-specific requirements."
    ],
    enforcementProvisions: [
      "Include comprehensive remedies for breach: monetary damages, injunctive relief for IP/confidentiality breaches, termination rights, and recovery of attorney fees and costs.",
      "Specify that breach of material provisions (confidentiality, IP, non-compete) constitutes material breach allowing immediate termination and enforcement action.",
      "Include provisions for recovery of damages including lost profits, costs of replacement services, investigation costs, and other consequential damages (subject to reasonable limitations).",
      "Specify governing law and exclusive jurisdiction or venue for disputes, choosing jurisdiction favorable to enforcement (typically where Company is located).",
      "Include dispute resolution mechanisms: litigation for maximum protection and precedent, arbitration for speed and confidentiality, or mediation for relationship preservation.",
      "Include attorney fee-shifting provisions to enable recovery of costs in enforcement actions and deter breaches.",
      "Address IP enforcement specifically - include provisions for immediate injunctive relief for IP breaches and require Contractor to assist in enforcement.",
      "Include provisions allowing for expedited discovery and evidentiary procedures for IP and confidentiality breaches.",
      "Specify that termination does not affect survival of key provisions (confidentiality, IP, indemnification, non-compete) to ensure ongoing protection."
    ],
    qualityChecklist: [
      "Independent contractor relationship section is comprehensive and explicitly states non-employee status with supporting factors",
      "Scope of work is detailed with specific deliverables, acceptance criteria, timelines, and performance standards",
      "Intellectual property provisions include both 'work made for hire' and assignment language for complete protection",
      "Payment terms are clear and specific: rates, schedule, invoicing requirements, payment method, and late payment consequences",
      "Confidentiality provisions are comprehensive yet reasonable to ensure enforceability",
      "Termination provisions address multiple scenarios (with cause, without cause, convenience) with appropriate notice and payment requirements",
      "Indemnification provisions are reasonable and include appropriate limitations on liability",
      "Non-compete/non-solicitation provisions (if included) are reasonable in scope, duration, and geography",
      "All defined terms are capitalized consistently throughout the document",
      "Cross-references between sections are accurate (e.g., termination provisions reference survival clauses)",
      "The agreement supports proper worker classification with explicit statements and factors demonstrating independence",
      "Governing law and jurisdiction are specified and appropriate for the parties",
      "Dispute resolution mechanisms are appropriate for the parties and circumstances",
      "The document complies with applicable state and federal worker classification requirements",
      "Language is precise, unambiguous, and uses professional legal terminology throughout"
    ],
    professionalStandards: [
      "Use precise, tested legal language for independent contractor agreements that has been upheld in court cases and supports proper classification.",
      "Structure the document logically with clear sections addressing relationship status, scope, payment, IP, confidentiality, termination, and enforcement.",
      "Include comprehensive provisions addressing worker classification factors explicitly to minimize misclassification risk and support proper tax treatment.",
      "Ensure all provisions are reasonable and balanced - overly one-sided agreements may be challenged as employment contracts in disguise.",
      "Use mandatory language ('shall', 'must', 'will') for obligations, permissive language ('may') only for rights or discretionary actions.",
      "Include appropriate qualifiers ('reasonable', 'material') to provide flexibility while maintaining enforceability, but avoid over-qualification.",
      "Cross-reference related provisions to create cohesive document (e.g., termination references IP/confidentiality survival provisions).",
      "Follow standard legal document conventions: formal preamble, recitals, defined terms, numbered sections with subsections.",
      "Ensure the agreement clearly distinguishes contractor relationship from employment relationship with explicit statements and supporting factors.",
      "Address edge cases and potential disputes proactively (scope changes, IP ownership, payment disputes, termination scenarios).",
      "Include appropriate legal protections for both parties while ensuring the document achieves its primary purpose of establishing contractor relationship and protecting Company interests.",
      "Use consistent terminology throughout - use 'Contractor' and 'Company' consistently, capitalize defined terms, avoid synonyms that create ambiguity."
    ],
    legalProtections: [
      "Protection against worker misclassification claims and associated tax and liability exposure",
      "Clear ownership of intellectual property and work product",
      "Protection of confidential business information",
      "Ability to terminate the relationship with appropriate notice",
      "Protection against contractor competing or soliciting during and after the engagement",
      "Right to seek damages for breach of contract",
      "Protection against claims arising from contractor's work through indemnification"
    ],
    bestPractices: [
      "Be extremely specific about deliverables, acceptance criteria, and quality standards. Vague descriptions lead to disputes and scope creep.",
      "Include detailed payment terms: rates (hourly, fixed fee, or milestone-based), payment schedule, invoicing requirements, late payment fees, and currency if applicable.",
      "Specify expense reimbursement policies clearly: what expenses are covered, maximum amounts, required documentation, and approval processes.",
      "Address intellectual property comprehensively: work product ownership, pre-existing IP rights, licenses granted, and assignment requirements.",
      "Include detailed confidentiality provisions that protect your business information while being reasonable enough to be enforceable.",
      "Specify work location, schedule, and methods. While contractors typically control their methods, you may specify deliverables, deadlines, and quality standards.",
      "Include provisions for revisions, change orders, and scope modifications with clear procedures and pricing adjustments.",
      "Address termination comprehensively: grounds for termination, notice requirements, payment for completed work, return of materials, and survival of key provisions.",
      "Consider including insurance requirements (general liability, professional liability, workers' compensation) depending on the nature of the work.",
      "Include dispute resolution provisions (arbitration or mediation) to avoid costly litigation, but ensure the process is fair to both parties.",
      "Specify governing law and jurisdiction. Consider the contractor's location, your location, and which jurisdiction's laws are most favorable.",
      "Include a 'no employment relationship' acknowledgment signed by the contractor to strengthen the independent contractor classification."
    ],
    commonClauses: {
      "Engagement": "Clause establishing that Company engages Contractor to perform specified services as an independent contractor, not as an employee.",
      "Independent Contractor Relationship": "Comprehensive clause establishing the non-employee relationship, including statements about tax obligations, benefits, authority, and control over work methods.",
      "Scope of Work": "Detailed description of services, deliverables, timelines, performance standards, and acceptance criteria.",
      "Compensation": "Clear specification of payment rates, payment schedule, invoicing requirements, and payment method.",
      "Expenses": "Provisions for expense reimbursement, including what expenses are covered, documentation requirements, and approval processes.",
      "Intellectual Property Assignment": "Clause establishing that all work product is work made for hire or assigned to Company, with provisions for pre-existing IP.",
      "Confidentiality": "Comprehensive confidentiality obligations protecting Company's business information, customer data, and proprietary information.",
      "Non-Competition": "Reasonable restrictions on Contractor's ability to compete with Company during and after the engagement (must be reasonable in scope, duration, and geography).",
      "Non-Solicitation": "Restrictions on soliciting Company's employees, customers, or business partners (typically more enforceable than non-compete clauses).",
      "Term and Termination": "Specification of the engagement term, grounds for termination, notice requirements, and effect of termination.",
      "Indemnification": "Provisions requiring Contractor to indemnify Company for claims arising from Contractor's work, breach of agreement, or violation of laws.",
      "Limitation of Liability": "Reasonable limitations on Contractor's liability, typically excluding indirect, consequential, or punitive damages.",
      "Governing Law": "Selection of applicable state law and jurisdiction for disputes.",
      "Severability": "Provision that invalid clauses don't void the entire agreement.",
      "Entire Agreement": "Merger clause stating the written agreement is the complete understanding."
    },
    languageRequirements: [
      "Use formal, professional legal language appropriate for business contracts",
      "Employ precise terminology - consistently use 'Independent Contractor' and 'Company' as defined terms",
      "Use mandatory language ('shall', 'must', 'will') for obligations, permissive language ('may') only for rights",
      "Include standard legal phrases and structure (WHEREAS clauses, NOW THEREFORE, etc.)",
      "Capitalize all defined terms consistently throughout the document",
      "Use active voice for clarity and enforceability",
      "Include cross-references between related sections",
      "Use qualifiers like 'reasonable', 'material', 'substantial' where appropriate"
    ],
    formattingRequirements: [
      "Begin with formal preamble identifying parties with full legal names and addresses",
      "Include recitals explaining the nature and purpose of the engagement",
      "Use numbered sections with lettered subsections for complex provisions",
      "Bold all defined terms on first use and in section headers",
      "Include detailed scope of work section with clear subsections",
      "Use tables or lists for deliverables, milestones, or payment schedules when helpful",
      "Add effective date and term clearly at the top",
      "DO NOT include signature blocks - signatures are handled separately via the signature feature",
      "Use consistent formatting for all sections"
    ],
    optionalClauses: [
      "Background check or credential verification requirements",
      "Subcontracting restrictions or approval requirements",
      "Exclusivity provisions (if Contractor cannot work for competitors)",
      "Most favored nation pricing (if Contractor provides services to multiple clients)",
      "Audit rights (Company's right to review Contractor's records)",
      "Force majeure clause",
      "Assignment restrictions",
      "Dispute resolution (arbitration, mediation, or litigation)"
    ],
    jurisdictionConsiderations: [
      "California: Very strict on independent contractor classification (ABC test). Non-compete clauses are generally unenforceable except in limited circumstances.",
      "New York: Has specific requirements for independent contractor agreements. Consider New York law for enforceability.",
      "Massachusetts: Has strict independent contractor classification requirements similar to California.",
      "Federal: IRS uses a 20-factor test. The agreement should support factors indicating independence.",
      "DOL: Department of Labor uses an 'economic realities' test focusing on whether the worker is economically dependent on the employer."
    ]
  },
  "Privacy Policy": {
    type: "Privacy Policy",
    purpose: "A legal document that explains how a website, app, or business collects, uses, stores, and protects user data. Required by law in many jurisdictions and essential for building user trust.",
    professionalDescription: "Explain how your website, app, or business collects, uses, stores, and protects customer data. This comprehensive privacy policy is required by law in many jurisdictions (GDPR, CCPA, PIPEDA, etc.) and is essential for building user trust and legal compliance. A well-drafted privacy policy clearly communicates your data practices, informs users of their rights, and protects your business from privacy-related legal issues. Essential for any business that collects personal information, whether through websites, mobile apps, customer interactions, or marketing activities.",
    requiredSections: [
      "Introduction and Effective Date",
      "Information We Collect (comprehensive categories)",
      "How We Collect Information (methods and sources)",
      "How We Use Your Information (purposes and legal basis)",
      "Legal Basis for Processing (GDPR compliance)",
      "Information Sharing and Disclosure (third parties and circumstances)",
      "Data Security Measures (technical and organizational safeguards)",
      "Data Retention (how long information is kept)",
      "Your Rights and Choices (comprehensive user rights)",
      "Cookies and Tracking Technologies (detailed cookie policy)",
      "Third-Party Services and Links",
      "International Data Transfers (if applicable)",
      "Children's Privacy (COPPA compliance)",
      "Do Not Track Signals",
      "California Privacy Rights (CCPA/CPRA compliance)",
      "European Privacy Rights (GDPR compliance)",
      "Changes to This Privacy Policy",
      "Contact Information and Privacy Inquiries"
    ],
    sectionDetails: {
      "Information We Collect": "Must comprehensively list ALL categories of information collected, including: (1) Personal Identifiable Information (name, email, phone, address), (2) Payment Information (credit card, billing address), (3) Account Information (username, password, profile data), (4) Usage Data (IP address, browser type, device information, pages visited), (5) Location Data (if collected), (6) Cookies and Tracking Data, (7) Communications (emails, messages, customer service interactions), (8) Social Media Information (if integrated), (9) Marketing Preferences, and (10) Any other information voluntarily provided. Be specific and comprehensive.",
      "How We Use Your Information": "Must clearly explain each purpose for which information is used, including: (1) providing and improving services, (2) processing transactions and payments, (3) communicating with users, (4) marketing and advertising (with opt-out options), (5) legal compliance and enforcement, (6) fraud prevention and security, (7) analytics and research, (8) personalization, and (9) any other specific business purposes. Link each use to a legal basis where required (GDPR).",
      "Your Rights and Choices": "Must comprehensively list ALL applicable user rights, including: (1) Right to Access (request copies of personal data), (2) Right to Rectification (correct inaccurate data), (3) Right to Erasure/Deletion (request deletion under certain circumstances), (4) Right to Restrict Processing, (5) Right to Data Portability, (6) Right to Object to Processing, (7) Right to Opt-Out of Sale (CCPA), (8) Right to Non-Discrimination (CCPA), (9) Right to Withdraw Consent, and (10) How to exercise these rights with clear instructions and contact information."
    },
    legalConsiderations: [
      "GDPR Compliance (EU): Must include legal basis for each type of processing, comprehensive user rights, data protection officer contact if required, and information about international transfers. Applies to EU residents regardless of business location.",
      "CCPA/CPRA Compliance (California): Must include right to know what personal information is collected, right to delete, right to opt-out of sale, right to non-discrimination, and specific disclosure requirements. Applies to businesses meeting certain thresholds.",
      "COPPA Compliance (Children): If collecting information from children under 13, must comply with Children's Online Privacy Protection Act, including parental consent requirements and special protections.",
      "State-Specific Laws: Many states have their own privacy laws (Virginia, Colorado, Connecticut, Utah, etc.). Consider multi-state compliance approach.",
      "Data Minimization: Only collect information necessary for stated purposes. Over-collection can create legal and security risks.",
      "Consent Requirements: Understand when explicit consent is required vs. legitimate interest or contractual necessity as legal basis for processing.",
      "Third-Party Disclosures: Must clearly disclose all third parties who receive data, including service providers, business partners, advertisers, and analytics companies.",
      "International Transfers: If transferring data internationally, must comply with applicable transfer mechanisms (Standard Contractual Clauses, Privacy Shield, etc.).",
      "Security Breach Notification: Must comply with breach notification laws (varies by jurisdiction - typically 72 hours for GDPR, varies by state in US).",
      "Cookie Consent: Many jurisdictions require explicit consent for non-essential cookies. Include detailed cookie policy and consent mechanisms."
    ],
    legalProtections: [
      "Legal compliance with applicable privacy laws (GDPR, CCPA, state laws)",
      "Protection against privacy-related lawsuits and regulatory enforcement",
      "Clear documentation of data practices for regulatory audits",
      "User trust and transparency in data handling",
      "Protection of business interests while respecting user privacy",
      "Compliance with industry-specific regulations (HIPAA, GLBA, etc. if applicable)"
    ],
    bestPractices: [
      "Use clear, plain language that users can understand while maintaining legal accuracy. Avoid overly technical jargon, but don't oversimplify legal requirements.",
      "Be comprehensive and specific about data collection. Vague or incomplete disclosures can lead to legal issues and user mistrust.",
      "Explain the legal basis for each type of processing (consent, legitimate interest, contractual necessity, legal obligation, vital interests, public task) as required by GDPR.",
      "Provide clear, actionable instructions for exercising user rights. Include specific contact information, response timeframes, and any required verification procedures.",
      "Include detailed information about cookies and tracking technologies: what cookies are used, their purpose, duration, and how users can manage them.",
      "Specify data retention periods for different categories of information. Explain the criteria used to determine retention periods.",
      "Clearly explain data security measures in place, but avoid being so specific that it creates security vulnerabilities.",
      "Include information about third-party services and integrations, including links to their privacy policies where applicable.",
      "Address international data transfers if applicable, including the legal mechanisms used to ensure adequate protection.",
      "Include a 'Do Not Track' section explaining how the business responds to DNT signals (though DNT is not legally required in most jurisdictions).",
      "Specify how users will be notified of policy changes (email, website notice, etc.) and how material changes will be highlighted.",
      "Make the policy easily accessible and searchable. Consider including a table of contents for longer policies.",
      "Regularly review and update the policy to reflect changes in data practices, laws, and regulations."
    ],
    commonClauses: {
      "Introduction": "Opening section explaining the purpose of the policy, who it applies to, the effective date, and how to contact the business with privacy questions.",
      "Information Collection": "Comprehensive list of all categories of information collected, organized by type (personal information, usage data, cookies, etc.) with specific examples.",
      "Collection Methods": "Explanation of how information is collected: directly from users, automatically through technology, from third parties, through cookies, etc.",
      "Use of Information": "Detailed explanation of each purpose for which information is used, linked to legal basis where required (GDPR).",
      "Legal Basis for Processing": "For GDPR compliance, explicit statement of legal basis for each type of processing (consent, legitimate interest, etc.).",
      "Information Sharing": "Comprehensive disclosure of when and with whom information is shared: service providers, business partners, legal requirements, business transfers, etc.",
      "Data Security": "Description of technical and organizational measures taken to protect information, including encryption, access controls, security training, etc.",
      "Data Retention": "Explanation of how long different categories of information are retained and the criteria used to determine retention periods.",
      "User Rights": "Comprehensive list of all applicable user rights with clear explanations and instructions for exercising them.",
      "Cookies and Tracking": "Detailed cookie policy explaining what cookies are used, their purpose, duration, and how users can manage or disable them.",
      "Third-Party Services": "Information about third-party services integrated into the business (payment processors, analytics, advertising networks) with links to their privacy policies.",
      "International Transfers": "If applicable, explanation of international data transfers and the legal mechanisms used to ensure adequate protection (SCCs, adequacy decisions, etc.).",
      "Children's Privacy": "COPPA compliance section if the business may collect information from children, including parental consent requirements and special protections.",
      "California Privacy Rights": "CCPA/CPRA specific section detailing California residents' rights and how to exercise them, including opt-out of sale and non-discrimination rights.",
      "European Privacy Rights": "GDPR specific section for EU residents detailing their rights under GDPR and how to exercise them, including contact information for data protection authority.",
      "Policy Updates": "Explanation of how the policy may be updated, how users will be notified of changes, and how to review the current version.",
      "Contact Information": "Clear contact information for privacy inquiries, including email, mailing address, and phone number, and information about data protection officer if applicable."
    },
    languageRequirements: [
      "Use clear, accessible language that users can understand while maintaining legal accuracy",
      "Balance plain language with legal precision - avoid overly technical jargon but don't sacrifice legal requirements",
      "Use consistent terminology throughout - define key terms (Personal Information, Processing, etc.) and use them consistently",
      "Include specific examples to illustrate abstract concepts (e.g., 'Personal Information includes your name, email address, and phone number')",
      "Use active voice where possible for clarity",
      "Include disclaimers where appropriate (e.g., 'This policy does not apply to third-party websites linked from our site')",
      "Use formatting (bold, headers, lists) to make the policy scannable and easy to navigate"
    ],
    formattingRequirements: [
      "Begin with a clear introduction and effective date",
      "Use numbered or lettered sections with descriptive headers",
      "Include a table of contents for longer policies (if policy exceeds 3,000 words)",
      "Use bullet points or numbered lists for categories of information and user rights",
      "Bold important terms, user rights, and key contact information",
      "Include clear section breaks and white space for readability",
      "Make contact information prominently displayed, ideally in multiple locations",
      "Use consistent formatting throughout (same style for all sections, lists, etc.)",
      "Include 'Last Updated' date prominently at the top"
    ],
    optionalClauses: [
      "Biometric information policy (if collecting biometric data)",
      "Financial information specific protections (if applicable)",
      "Health information policy (if collecting health data, may trigger HIPAA considerations)",
      "Employment information policy (if collecting employee data)",
      "Marketing and advertising preferences management",
      "Social media integration and data sharing",
      "User-generated content and public information",
      "Data processing agreements with service providers"
    ],
    jurisdictionConsiderations: [
      "GDPR (EU): Applies to EU residents. Requires legal basis for processing, comprehensive rights, data protection officer if required, and specific breach notification requirements.",
      "CCPA/CPRA (California): Applies to businesses meeting revenue, data, or business model thresholds. Requires specific disclosures and user rights.",
      "PIPEDA (Canada): Applies to Canadian businesses. Requires consent for collection, use, and disclosure of personal information.",
      "State Laws (US): Many states have their own privacy laws (Virginia VCDPA, Colorado CPA, Connecticut CTDPA, Utah UCPA, etc.) with varying requirements.",
      "Industry-Specific: HIPAA (healthcare), GLBA (financial services), FERPA (education) may apply in addition to general privacy laws."
    ]
  },
  "Terms and Conditions": {
    type: "Terms and Conditions",
    purpose: "A legal agreement that sets forth the rules and guidelines for using a website, app, or service. Protects the business owner and informs users of their rights and obligations.",
    professionalDescription: "A legal agreement outlining rules, responsibilities, and acceptable use for your service or website. This comprehensive terms of service protects your business from liability, establishes user expectations, and provides a legal framework for your platform. Essential for any online business, SaaS platform, mobile app, or digital service. A well-drafted terms of service clearly defines acceptable use, protects intellectual property, limits liability, and provides mechanisms for dispute resolution. Critical for protecting your business from user claims, establishing ownership of content, and ensuring compliance with applicable laws.",
    requiredSections: [
      "Introduction and Acceptance of Terms",
      "Description of Service (comprehensive service overview)",
      "Eligibility and Age Restrictions",
      "User Accounts and Registration (account creation, security, responsibilities)",
      "Acceptable Use Policy (detailed permitted and prohibited uses)",
      "User Conduct and Restrictions (behavioral expectations)",
      "Prohibited Activities (comprehensive list with examples)",
      "Intellectual Property Rights (ownership, licenses, user content)",
      "User-Generated Content (rights, responsibilities, moderation)",
      "Payment Terms and Billing (if applicable - fees, billing cycles, refunds)",
      "Subscription Terms (if applicable - renewal, cancellation, pricing changes)",
      "Refund and Cancellation Policy",
      "Service Availability and Modifications",
      "Third-Party Services and Links",
      "Limitation of Liability (comprehensive liability limitations)",
      "Indemnification (user's obligation to defend business)",
      "Termination (grounds for termination, effect of termination)",
      "Dispute Resolution (arbitration, mediation, or litigation procedures)",
      "Governing Law and Jurisdiction",
      "Class Action Waiver (if arbitration is included)",
      "Severability and Waiver",
      "Entire Agreement and Modifications",
      "Contact Information"
    ],
    sectionDetails: {
      "Acceptance of Terms": "Must clearly state: (1) by accessing or using the service, users agree to be bound by these terms, (2) if users do not agree, they must not use the service, (3) the terms constitute a legally binding agreement, (4) users must be of legal age to enter into contracts (or have parental consent), (5) continued use after changes constitutes acceptance of modified terms, and (6) the business reserves the right to modify terms at any time with appropriate notice.",
      "Limitation of Liability": "Must include comprehensive limitations: (1) service is provided 'as is' without warranties, (2) business disclaims all warranties (express, implied, statutory), (3) limitation of liability for direct, indirect, incidental, consequential, or punitive damages, (4) maximum liability cap (often limited to fees paid in past 12 months), (5) exclusions for damages that cannot be limited by law, (6) limitations on liability for third-party content or services, and (7) user's acknowledgment of risk assumption. Must comply with applicable consumer protection laws.",
      "Intellectual Property Rights": "Must clearly establish: (1) all content, features, and functionality are owned by the business or its licensors, (2) users are granted a limited, non-exclusive, non-transferable license to use the service, (3) users retain ownership of their user-generated content but grant the business a broad license to use it, (4) the business's trademarks, logos, and brand names are protected, (5) users may not copy, modify, distribute, or create derivative works, (6) DMCA takedown procedures if applicable, and (7) procedures for reporting intellectual property infringement."
    },
    legalConsiderations: [
      "The 'browsewrap' vs 'clickwrap' distinction matters for enforceability. Clickwrap (explicit acceptance) is more enforceable than browsewrap (terms on website). Consider requiring explicit acceptance for important terms.",
      "Limitation of liability clauses must comply with consumer protection laws. Some jurisdictions prohibit certain limitations, especially for consumer transactions. Business-to-business agreements can have broader limitations.",
      "Arbitration clauses must be carefully drafted. Include clear procedures, selection of arbitral institution, location, and rules. Class action waivers must be explicit and may be unenforceable in some jurisdictions.",
      "User-generated content provisions must balance business needs with user rights. The license granted should be broad enough for business purposes but not so broad as to be unconscionable.",
      "Termination provisions must be fair and provide appropriate notice. Automatic termination for minor breaches may be unenforceable. Include cure periods for material breaches.",
      "Refund and cancellation policies must comply with applicable consumer protection laws, including cooling-off periods, automatic renewal disclosure requirements, and cancellation rights.",
      "Age restrictions must be clearly stated and enforced. COPPA compliance is required if the service is directed to children under 13.",
      "International users may be subject to different laws. Consider including choice of law and jurisdiction provisions, but be aware that some jurisdictions may not honor such provisions for consumer transactions.",
      "Force majeure clauses protect against liability for events beyond control, but must be reasonable and not overly broad.",
      "Data protection and privacy must be addressed, either directly in terms or by reference to a separate privacy policy."
    ],
    legalProtections: [
      "Protection against user claims and lawsuits through limitation of liability and indemnification",
      "Clear ownership of intellectual property and platform content",
      "Right to terminate user accounts for violations",
      "Protection against unauthorized use, copying, or distribution of the service",
      "Legal framework for handling user-generated content and disputes",
      "Protection of business interests while providing service to users",
      "Compliance with applicable laws and regulations"
    ],
    bestPractices: [
      "Use clear, accessible language while maintaining legal protection. Balance readability with legal precision.",
      "Include specific, detailed examples of prohibited activities. Vague prohibitions are harder to enforce and may be struck down as unconscionable.",
      "Specify clear consequences for violations: warnings, suspension, termination, legal action. Progressive enforcement is often more enforceable.",
      "Address user-generated content comprehensively: ownership, license granted to business, user's responsibility for content, moderation rights, and removal procedures.",
      "Include detailed payment and billing terms if applicable: fees, billing cycles, payment methods, late fees, chargeback policies, and refund procedures.",
      "Specify subscription terms clearly if applicable: auto-renewal, cancellation procedures, pricing changes, and how users will be notified of changes.",
      "Include comprehensive dispute resolution procedures: whether disputes go to arbitration or court, location, applicable rules, and class action waivers if applicable.",
      "Address service modifications and availability: right to modify or discontinue service, maintenance windows, uptime disclaimers, and data backup responsibilities.",
      "Include force majeure provisions to protect against liability for events beyond control (natural disasters, pandemics, etc.), but ensure they're reasonable.",
      "Specify how terms will be updated and how users will be notified. Material changes typically require more prominent notice.",
      "Include contact information prominently for questions, complaints, and legal notices.",
      "Consider including a table of contents for longer terms of service to improve usability.",
      "Regularly review and update terms to reflect changes in service, laws, and business practices."
    ],
    commonClauses: {
      "Acceptance of Terms": "Clause establishing that use of the service constitutes acceptance of the terms and that users must agree to be bound by them.",
      "Service Description": "Comprehensive description of the service, features, functionality, and any limitations or restrictions.",
      "Eligibility": "Requirements for using the service, including age restrictions, geographic restrictions, and any other eligibility criteria.",
      "User Accounts": "Provisions regarding account creation, security responsibilities, account suspension or termination, and user's responsibility for account activity.",
      "Acceptable Use": "Detailed description of permitted uses of the service, including any restrictions or limitations.",
      "Prohibited Activities": "Comprehensive list of prohibited activities with specific examples, including illegal activities, harassment, spam, unauthorized access, etc.",
      "Intellectual Property": "Clear statement of ownership of the service and content, licenses granted to users, and restrictions on use.",
      "User-Generated Content": "Provisions regarding user content: ownership, license granted to business, user's responsibility, moderation rights, and removal procedures.",
      "Payment Terms": "If applicable, detailed payment terms including fees, billing cycles, payment methods, late fees, and refund policies.",
      "Limitation of Liability": "Comprehensive limitations on business's liability, including disclaimers of warranties, limitation of damages, and liability caps.",
      "Indemnification": "User's obligation to indemnify and defend the business against claims arising from user's use of the service, violation of terms, or infringement of rights.",
      "Termination": "Grounds for termination by either party, notice requirements, effect of termination, and survival of certain provisions.",
      "Dispute Resolution": "Procedures for resolving disputes, including whether disputes go to arbitration or court, location, applicable rules, and class action waivers.",
      "Governing Law": "Selection of applicable law and jurisdiction for disputes, with consideration of consumer protection laws.",
      "Modifications": "Procedures for modifying the terms, notice requirements, and user's continued use after modifications.",
      "Severability": "Provision that if any clause is found invalid, the remainder of the terms remain in effect.",
      "Entire Agreement": "Merger clause stating that the terms constitute the entire agreement and supersede all prior agreements."
    },
    languageRequirements: [
      "Use clear, accessible language that users can understand while maintaining legal precision",
      "Balance plain language with legal protection - avoid overly technical jargon but don't sacrifice legal requirements",
      "Use consistent terminology throughout - define key terms and use them consistently",
      "Include specific examples to illustrate abstract concepts (e.g., 'Prohibited activities include spamming, hacking, or distributing malware')",
      "Use mandatory language ('must', 'shall', 'will') for obligations, permissive language ('may') for rights",
      "Include disclaimers and limitations clearly and prominently",
      "Use formatting (bold, headers, lists) to make terms scannable and highlight important provisions"
    ],
    formattingRequirements: [
      "Begin with a clear introduction and acceptance provision",
      "Use numbered sections with descriptive headers",
      "Include a table of contents for longer terms (if exceeding 2,000 words)",
      "Use bullet points or numbered lists for prohibited activities, user rights, and other lists",
      "Bold important terms, restrictions, limitations of liability, and key contact information",
      "Include clear section breaks and white space for readability",
      "Make contact information prominently displayed",
      "Include 'Last Updated' date prominently at the top",
      "Use consistent formatting throughout",
      "DO NOT include signature sections - signatures are handled separately via the signature feature"
    ],
    optionalClauses: [
      "Beta or pre-release service disclaimers",
      "Geographic restrictions or availability limitations",
      "Export control and international use restrictions",
      "DMCA takedown procedures and counter-notification",
      "Trademark usage guidelines",
      "Affiliate or referral program terms",
      "API usage terms (if applicable)",
      "Mobile app specific terms (if applicable)",
      "International data transfer provisions"
    ],
    jurisdictionConsiderations: [
      "Consumer Protection Laws: Many jurisdictions have specific requirements for consumer contracts, including mandatory disclosures, cancellation rights, and limitations on certain contract terms.",
      "EU: GDPR and ePrivacy Directive requirements, mandatory consumer protection laws, and restrictions on certain contract terms.",
      "California: CCPA/CPRA requirements, automatic renewal disclosure requirements, and specific consumer protection laws.",
      "Arbitration: Federal Arbitration Act generally favors arbitration, but some states have restrictions, especially for consumer contracts.",
      "Class Action Waivers: Enforceability varies by jurisdiction. Generally more enforceable in business-to-business contracts than consumer contracts."
    ]
  },
  "Residential Lease Agreement": {
    type: "Residential Lease Agreement",
    purpose: "A legally binding contract between a landlord and tenant that establishes the terms and conditions for renting a residential property. Protects both parties' rights and clearly defines responsibilities.",
    professionalDescription: "A contract outlining the rental terms between a landlord and tenant. This comprehensive residential lease agreement establishes clear expectations, protects both parties' rights, and ensures compliance with local landlord-tenant laws. Essential for any residential rental arrangement, whether for apartments, houses, condos, or other residential properties. A well-drafted lease clearly defines rent, security deposits, maintenance responsibilities, use restrictions, and termination procedures, helping prevent disputes and protect both landlord and tenant interests.",
    requiredSections: [
      "Preamble and Parties (full legal names, addresses, contact information)",
      "Property Description (complete address, unit number, square footage, amenities)",
      "Lease Term (start date, end date, renewal options)",
      "Rent Amount and Payment Terms (monthly rent, due date, payment method, late fees)",
      "Security Deposit (amount, conditions for return, deductions allowed)",
      "Tenant Obligations (maintenance, repairs, utilities, insurance)",
      "Landlord Obligations (habitability, repairs, access rights)",
      "Use of Property (residential use only, occupancy limits, restrictions)",
      "Maintenance and Repairs (responsibilities, procedures, emergency repairs)",
      "Utilities and Services (who pays for what, service interruptions)",
      "Pets and Animals Policy (allowed pets, restrictions, pet deposits)",
      "Smoking Policy",
      "Parking and Storage (assigned spaces, restrictions, fees)",
      "Entry by Landlord (notice requirements, emergency access, inspections)",
      "Alterations and Improvements (tenant modifications, approval requirements)",
      "Subletting and Assignment (prohibited or allowed with conditions)",
      "Default and Remedies (breach of lease, cure periods, eviction procedures)",
      "Termination and Renewal (end of term, early termination, holdover)",
      "Required Disclosures (lead paint, mold, bedbugs, etc. as required by law)",
      "Governing Law and Jurisdiction",
      "Severability and Entire Agreement"
    ],
    sectionDetails: {
      "Rent Amount and Payment Terms": "Must specify: (1) exact monthly rent amount in numbers and words, (2) due date (typically 1st of month), (3) payment methods accepted (check, electronic transfer, etc.), (4) late fee amount and when it applies (typically after 5-day grace period), (5) returned check fees, (6) rent increases (if applicable during lease term), and (7) consequences of non-payment. Must comply with local rent control laws if applicable.",
      "Security Deposit": "Must clearly state: (1) exact deposit amount, (2) where deposit will be held (escrow account, etc.), (3) conditions under which deductions can be made (damage beyond normal wear, unpaid rent, cleaning, etc.), (4) timeline for return after lease ends (typically 14-30 days depending on jurisdiction), (5) itemized list requirement for deductions, (6) interest on deposit if required by law, and (7) procedures for inspection and dispute resolution. Must comply with state and local security deposit laws.",
      "Entry by Landlord": "Must specify: (1) notice requirements for non-emergency entry (typically 24-48 hours), (2) permitted purposes for entry (repairs, inspections, showing to prospective tenants, etc.), (3) emergency entry rights (no notice required for emergencies), (4) reasonable hours for entry (typically business hours), (5) tenant's right to be present during entry, and (6) procedures for scheduled maintenance. Must comply with state laws regarding landlord entry rights."
    },
    legalConsiderations: [
      "Must comply with all applicable local, state, and federal landlord-tenant laws. These vary significantly by jurisdiction and include rent control, security deposit limits, habitability requirements, and eviction procedures.",
      "Security deposit laws vary by state. Some states limit deposit amounts (e.g., California limits to 2 months' rent for unfurnished), require interest payments, specify return timelines, and require itemized deductions.",
      "Habitability requirements (implied warranty of habitability) are mandatory in most jurisdictions. The lease cannot waive these requirements, which include working plumbing, heating, electrical, and structural safety.",
      "Fair housing laws (federal Fair Housing Act, state and local laws) prohibit discrimination based on protected classes. Lease terms must be applied equally to all tenants.",
      "Entry rights are regulated by state law. Most states require 24-48 hours notice for non-emergency entry, except in emergencies. Violations can result in liability.",
      "Eviction procedures are strictly regulated. Self-help evictions (changing locks, removing belongings) are illegal in all states. Must follow proper court procedures.",
      "Required disclosures vary by jurisdiction but commonly include: lead-based paint (federal requirement), mold, bedbugs, sex offenders registry, and local hazards.",
      "Rent control and rent stabilization laws apply in certain jurisdictions (New York City, San Francisco, etc.). Lease terms must comply with applicable rent control regulations.",
      "Early termination provisions must be fair and comply with applicable laws. Some states require specific notice periods and may limit penalties.",
      "Pet policies must comply with fair housing laws regarding service animals and emotional support animals, which cannot be restricted even if pets are generally prohibited."
    ],
    legalProtections: [
      "Protection of landlord's property rights and rental income",
      "Clear documentation of tenant obligations and responsibilities",
      "Legal framework for handling disputes and defaults",
      "Protection against tenant damage and unauthorized use",
      "Clear procedures for entry, repairs, and property management",
      "Protection of tenant's right to quiet enjoyment and habitability",
      "Compliance with applicable landlord-tenant laws and regulations"
    ],
    bestPractices: [
      "Be extremely specific about property description: full address, unit number, square footage, included appliances, parking spaces, storage areas, and any amenities.",
      "Clearly define all financial obligations: rent amount, security deposit, pet deposits, parking fees, utilities, and any other charges.",
      "Specify maintenance responsibilities in detail: what tenant must maintain (minor repairs, yard work, etc.) vs. landlord responsibilities (major repairs, structural issues, appliances).",
      "Include detailed use restrictions: maximum occupancy, residential use only, noise restrictions, guest policies, and prohibited activities.",
      "Address utilities comprehensively: which utilities are included in rent, which tenant pays separately, and procedures for service interruptions.",
      "Include clear pet policies: whether pets are allowed, size/breed restrictions, pet deposits or fees, and requirements for pet registration or insurance.",
      "Specify entry procedures clearly: notice requirements, permitted purposes, emergency access, and tenant's rights during entry.",
      "Address subletting and assignment: whether allowed, conditions, approval requirements, and procedures.",
      "Include comprehensive default and remedies section: what constitutes default, cure periods, notice requirements, and eviction procedures.",
      "Specify termination procedures: end of term, early termination options, notice requirements, and holdover tenancy provisions.",
      "Include all required disclosures for your jurisdiction: lead paint, mold, bedbugs, sex offenders, local hazards, etc.",
      "Address parking, storage, and common areas: assigned spaces, restrictions, fees, and rules for use.",
      "Consider including provisions for property inspections, move-in/move-out procedures, and condition reports."
    ],
    commonClauses: {
      "Parties and Property": "Identification of landlord and tenant with full legal names and addresses, and complete property description including address, unit, and included amenities.",
      "Lease Term": "Specification of lease start date, end date, renewal options, and procedures for extending or renewing the lease.",
      "Rent": "Exact rent amount, due date, payment methods, late fees, returned check fees, and consequences of non-payment.",
      "Security Deposit": "Deposit amount, holding requirements, conditions for deductions, return timeline, and dispute procedures.",
      "Tenant Obligations": "Comprehensive list of tenant responsibilities including maintenance, repairs, utilities, insurance, compliance with rules, and property care.",
      "Landlord Obligations": "Landlord's responsibilities including habitability, major repairs, compliance with building codes, and providing essential services.",
      "Use Restrictions": "Limitations on use including residential use only, occupancy limits, noise restrictions, guest policies, and prohibited activities.",
      "Maintenance and Repairs": "Detailed allocation of maintenance and repair responsibilities between landlord and tenant, procedures for requesting repairs, and emergency repair procedures.",
      "Entry Rights": "Landlord's right to enter with proper notice, purposes for entry, emergency access, and tenant's rights during entry.",
      "Default and Remedies": "Definition of default, cure periods, notice requirements, and remedies available to landlord including eviction procedures.",
      "Termination": "Procedures for termination at end of term, early termination options, notice requirements, and holdover tenancy.",
      "Required Disclosures": "All disclosures required by law including lead paint, mold, bedbugs, and local hazard disclosures."
    },
    languageRequirements: [
      "Use formal, professional legal language appropriate for real estate contracts",
      "Employ precise terminology - use defined terms consistently (Landlord, Tenant, Premises, etc.)",
      "Use mandatory language ('shall', 'must', 'will') for obligations",
      "Include standard legal phrases and structure appropriate for lease agreements",
      "Capitalize all defined terms consistently throughout",
      "Use active voice for clarity",
      "Include cross-references between related sections",
      "Use qualifiers like 'reasonable', 'material' where appropriate"
    ],
    formattingRequirements: [
      "Begin with formal preamble identifying parties with full legal names and addresses",
      "Include complete property description with address, unit number, and included amenities",
      "Use numbered sections with lettered subsections for complex provisions",
      "Bold all defined terms on first use and important financial terms (rent amount, deposit)",
      "Add effective date and lease term clearly at the top",
      "DO NOT include signature blocks - signatures are handled separately via the signature feature",
      "Use tables or lists for financial obligations, utilities, or responsibilities when helpful",
      "Include space for initials on each page if required by local law"
    ],
    optionalClauses: [
      "Renewal options and procedures",
      "Early termination options and penalties",
      "Rent increase provisions (if allowed during lease term)",
      "Right of first refusal for purchase",
      "Option to purchase",
      "Furniture or appliance inventory",
      "Move-in/move-out inspection procedures",
      "Dispute resolution (mediation or arbitration)"
    ],
    jurisdictionConsiderations: [
      "State-Specific: Each state has different landlord-tenant laws regarding security deposits, notice requirements, habitability, and eviction procedures. Must comply with state-specific requirements.",
      "Local Ordinances: Many cities and counties have additional requirements including rent control, just cause eviction, relocation assistance, and specific disclosure requirements.",
      "Federal: Lead-based paint disclosure is required federally for properties built before 1978. Fair Housing Act applies to all residential leases.",
      "Rent Control: Some jurisdictions (New York City, San Francisco, Los Angeles, etc.) have rent control or rent stabilization laws that limit rent increases and provide additional tenant protections."
    ]
  },
  "Employment Contract": {
    type: "Employment Contract",
    purpose: "A legally binding agreement between an employer and employee that establishes the terms and conditions of employment, including compensation, benefits, duties, and termination provisions.",
    professionalDescription: "A formal employment agreement defining terms, compensation, and conditions of employment. This comprehensive employment contract establishes clear expectations for both employer and employee, protects business interests, and ensures compliance with employment laws. Essential for key employees, executives, or any employment relationship where specific terms need to be documented. A well-drafted employment contract clearly defines job duties, compensation structure, benefits, work arrangements, intellectual property ownership, confidentiality obligations, and termination procedures, helping prevent disputes and protect both parties' interests.",
    requiredSections: [
      "Preamble and Parties (full legal names, addresses, entity types)",
      "Recitals (nature of employment relationship)",
      "Employment Relationship and Term (at-will vs. term employment, start date)",
      "Position and Job Duties (title, department, reporting structure, responsibilities)",
      "Compensation (base salary, payment schedule, bonuses, commissions, equity)",
      "Benefits Package (health insurance, retirement, vacation, sick leave, other benefits)",
      "Work Schedule and Location (hours, days, location, remote work policies)",
      "Confidentiality and Non-Disclosure (comprehensive confidentiality obligations)",
      "Intellectual Property (work product ownership, assignment, pre-existing IP)",
      "Non-Competition (if applicable - restrictions on competing during and after employment)",
      "Non-Solicitation (restrictions on soliciting employees, customers, vendors)",
      "Termination Provisions (with cause, without cause, notice requirements, effect)",
      "Severance and Post-Termination Benefits (if applicable)",
      "Post-Employment Obligations (return of property, cooperation, non-disparagement)",
      "Dispute Resolution (arbitration, mediation, or litigation procedures)",
      "Governing Law and Jurisdiction",
      "Severability and Entire Agreement"
    ],
    sectionDetails: {
      "Employment Relationship and Term": "Must clearly specify: (1) whether employment is 'at-will' (terminable by either party at any time) or for a specific term, (2) start date of employment, (3) if term employment, the end date and renewal provisions, (4) probationary period if applicable, and (5) acknowledgment that employment is subject to the terms of the contract. At-will employment is the default in most states unless explicitly modified.",
      "Intellectual Property": "Must clearly establish: (1) all work product, inventions, and intellectual property created during employment belong to the employer, (2) employee assigns all rights to employer, (3) employee will execute any documents needed to perfect employer's ownership, (4) employee retains rights to pre-existing IP but grants employer a license, (5) employee warrants that work product doesn't infringe third-party rights, and (6) disclosure requirements for inventions created during employment (even if outside work hours).",
      "Termination Provisions": "Must comprehensively address: (1) termination with cause (definition of cause: breach, misconduct, performance issues, etc.), (2) termination without cause (by employer or employee), (3) notice requirements for each type of termination, (4) effect of termination on compensation, benefits, and obligations, (5) payment for accrued but unused vacation, (6) survival of certain provisions (confidentiality, non-compete, IP assignment), and (7) procedures for return of company property."
    },
    legalConsiderations: [
      "At-will employment is the default in most states (except Montana). If you want term employment, it must be explicitly stated. At-will can be modified by contract but requires clear language.",
      "Non-compete clauses are heavily regulated and vary significantly by state. California generally prohibits non-competes except in limited circumstances (sale of business). Other states require reasonableness in scope, duration, and geography.",
      "Non-solicitation clauses are generally more enforceable than non-compete clauses. They restrict soliciting employees, customers, or vendors but don't prevent general competition.",
      "Intellectual property ownership must be explicitly addressed. Under 'work made for hire' doctrine, employer owns IP created within scope of employment, but this should be explicitly stated and backed up with assignment provisions.",
      "Confidentiality obligations are generally enforceable and can survive termination. They must be reasonable in scope but can be broader than non-compete clauses.",
      "Severance provisions are not required by law (except in certain circumstances like WARN Act layoffs) but can be negotiated. Include clear conditions for receiving severance.",
      "Termination provisions must comply with applicable employment laws. 'Cause' must be clearly defined. Some states have restrictions on what can constitute cause.",
      "Benefits must comply with ERISA (if applicable), COBRA requirements, and other applicable laws. Cannot waive certain statutory rights.",
      "Dispute resolution provisions (arbitration) are generally enforceable but must be fair. Some states have restrictions on mandatory arbitration for employment disputes.",
      "The contract cannot waive statutory rights (minimum wage, overtime, anti-discrimination laws, etc.). Any such waivers are unenforceable."
    ],
    legalProtections: [
      "Protection of employer's confidential information and trade secrets",
      "Clear ownership of intellectual property and work product",
      "Protection against employee competition and solicitation",
      "Clear documentation of employment terms and expectations",
      "Legal framework for handling termination and disputes",
      "Protection of employee's rights to compensation and benefits",
      "Compliance with applicable employment laws and regulations"
    ],
    bestPractices: [
      "Be extremely specific about job duties and responsibilities. Vague descriptions can lead to disputes and make it harder to establish 'cause' for termination.",
      "Clearly define compensation structure: base salary, payment schedule, bonus eligibility and calculation, commission structure, equity grants, and any other compensation.",
      "Include comprehensive benefits information: health insurance (employer contribution, plan details), retirement plans (401k, matching), vacation and sick leave accrual, and any other benefits.",
      "Specify work arrangements clearly: standard hours, work days, location (office, remote, hybrid), travel requirements, and flexibility policies.",
      "Address intellectual property comprehensively: work product ownership, assignment requirements, disclosure obligations, and procedures for perfecting ownership.",
      "Include detailed confidentiality provisions: what constitutes confidential information, duration of obligations, exceptions, and remedies for breach.",
      "If including non-compete or non-solicitation clauses, ensure they are reasonable: limited geographic scope, limited duration (typically 6 months to 2 years), and limited to legitimate business interests.",
      "Specify termination procedures clearly: grounds for termination with cause, notice requirements, severance eligibility, and survival of post-employment obligations.",
      "Include provisions for performance reviews, evaluations, and development opportunities to support both employee growth and documentation for potential termination decisions.",
      "Address post-employment obligations: return of company property, cooperation with transition, non-disparagement, and continued confidentiality.",
      "Consider including dispute resolution provisions (arbitration) to avoid costly litigation, but ensure the process is fair and doesn't disadvantage the employee.",
      "Specify governing law and jurisdiction. Consider the employee's location, employer's location, and which jurisdiction's employment laws are most favorable.",
      "Include an acknowledgment that the employee has read, understood, and had opportunity to consult with counsel before signing."
    ],
    commonClauses: {
      "Employment Relationship": "Clause establishing the employment relationship, whether at-will or term employment, start date, and reporting structure.",
      "Position and Duties": "Detailed description of job title, department, reporting relationships, primary responsibilities, and any specific duties or expectations.",
      "Compensation": "Comprehensive compensation terms including base salary, payment schedule, bonus structure, commission structure, equity grants, and any other compensation.",
      "Benefits": "Detailed description of all benefits including health insurance, retirement plans, vacation, sick leave, and any other benefits provided.",
      "Confidentiality": "Comprehensive confidentiality obligations protecting employer's business information, trade secrets, customer data, and proprietary information during and after employment.",
      "Intellectual Property Assignment": "Clause establishing that all work product, inventions, and intellectual property created during employment belong to employer, with assignment provisions.",
      "Non-Competition": "Reasonable restrictions on employee's ability to compete with employer during and after employment (must be reasonable in scope, duration, and geography to be enforceable).",
      "Non-Solicitation": "Restrictions on soliciting employer's employees, customers, vendors, or business partners (typically more enforceable than non-compete clauses).",
      "Termination": "Comprehensive termination provisions including grounds for termination with cause, termination without cause, notice requirements, and effect of termination.",
      "Severance": "If applicable, provisions for severance pay, conditions for receiving severance, and post-termination benefits.",
      "Post-Employment Obligations": "Employee's obligations after termination including return of property, cooperation, non-disparagement, and continued confidentiality.",
      "Governing Law": "Selection of applicable state law and jurisdiction for disputes, with consideration of employment law protections."
    },
    languageRequirements: [
      "Use formal, professional legal language appropriate for employment contracts",
      "Employ precise terminology - consistently use defined terms (Employer, Employee, Company, etc.)",
      "Use mandatory language ('shall', 'must', 'will') for obligations",
      "Include standard legal phrases and structure appropriate for employment agreements",
      "Capitalize all defined terms consistently throughout",
      "Use active voice for clarity",
      "Include cross-references between related sections",
      "Use qualifiers like 'reasonable', 'material' where appropriate"
    ],
    formattingRequirements: [
      "Begin with formal preamble identifying parties with full legal names and addresses",
      "Include recitals explaining the nature of the employment relationship",
      "Use numbered sections with lettered subsections for complex provisions",
      "Bold all defined terms on first use and important terms (salary, job title, dates)",
      "Include detailed compensation and benefits sections with clear subsections",
      "Add effective date and employment start date clearly at the top",
      "DO NOT include signature blocks - signatures are handled separately via the signature feature",
      "Use tables or lists for benefits, compensation components, or duties when helpful"
    ],
    optionalClauses: [
      "Probationary period provisions",
      "Performance review and evaluation procedures",
      "Training and development requirements",
      "Reimbursement of expenses",
      "Relocation assistance",
      "Stock option or equity grant details",
      "Change of control provisions (golden parachute, etc.)",
      "Dispute resolution (arbitration, mediation, or litigation)",
      "Non-disparagement clauses",
      "Background check or drug testing requirements"
    ],
    jurisdictionConsiderations: [
      "California: Non-compete clauses are generally unenforceable except in limited circumstances (sale of business). Non-solicitation clauses are more likely to be enforceable.",
      "New York: Non-compete clauses must be reasonable. Courts will enforce reasonable restrictions that protect legitimate business interests.",
      "Massachusetts: Has specific requirements for non-compete clauses including consideration, reasonableness, and notice requirements.",
      "Montana: Only state that doesn't have at-will employment by default. Requires 'good cause' for termination after probationary period.",
      "Federal: Various federal laws apply including FLSA (wage and hour), Title VII (anti-discrimination), ADA, ADEA, etc. Contract cannot waive these rights."
    ]
  },
  "Consulting Agreement": {
    type: "Consulting Agreement",
    purpose: "A contract between a consultant and client that defines the scope of consulting services, compensation, and terms of engagement. Establishes the consultant as an independent contractor.",
    professionalDescription: "An agreement defining services, compensation, duties, and legal terms for hiring a consultant. This comprehensive consulting agreement establishes clear expectations, protects both parties' interests, and ensures the consultant is properly classified as an independent contractor. Essential for engaging consultants, advisors, or professional service providers. A well-drafted consulting agreement clearly defines the scope of services, deliverables, compensation structure, intellectual property ownership, confidentiality obligations, and termination procedures, helping prevent disputes and protect both consultant and client interests.",
    requiredSections: [
      "Preamble and Parties (full legal names, business addresses, entity types)",
      "Recitals (purpose and nature of consulting engagement)",
      "Engagement and Independent Contractor Relationship (explicit contractor status)",
      "Scope of Services (detailed description of consulting services and deliverables)",
      "Performance Standards and Deliverables (quality requirements, acceptance criteria)",
      "Compensation and Payment Terms (rates, payment schedule, invoicing requirements)",
      "Expenses and Reimbursements (what expenses are covered, documentation, approval)",
      "Term and Duration (start date, end date, or ongoing basis)",
      "Independent Contractor Status (detailed provisions establishing non-employee relationship)",
      "Tax Obligations (clarification that consultant is responsible for own taxes)",
      "Intellectual Property Rights (ownership of work product, pre-existing IP, licenses)",
      "Confidentiality and Non-Disclosure (comprehensive confidentiality obligations)",
      "Termination Provisions (grounds for termination, notice requirements, effect)",
      "Limitation of Liability (reasonable limitations on consultant's liability)",
      "Indemnification (mutual or one-way indemnification provisions)",
      "Insurance Requirements (if applicable - general liability, professional liability)",
      "Dispute Resolution (arbitration, mediation, or litigation procedures)",
      "Governing Law and Jurisdiction",
      "Severability and Entire Agreement"
    ],
    sectionDetails: {
      "Scope of Services": "Must include: (1) detailed description of consulting services to be performed, (2) specific deliverables with acceptance criteria, (3) timelines and milestones, (4) performance standards and quality requirements, (5) reporting requirements and frequency, (6) location of work (remote, on-site, or hybrid), (7) resources and materials to be provided by each party, (8) procedures for change orders or scope modifications, and (9) any exclusions or limitations on services.",
      "Intellectual Property Rights": "Must clearly establish: (1) all work product, deliverables, and intellectual property created under the agreement belong to the client, (2) consultant assigns all rights to client, (3) consultant retains rights to pre-existing intellectual property and general knowledge, (4) consultant grants client a license to use pre-existing IP incorporated into deliverables, (5) consultant warrants that deliverables don't infringe third-party rights, and (6) consultant will execute any additional documents needed to perfect client's ownership.",
      "Termination Provisions": "Must comprehensively address: (1) termination with cause (breach, failure to perform, etc.), (2) termination without cause (convenience), (3) notice requirements for each type of termination, (4) effect of termination on payment obligations (payment for work completed, cancellation fees, etc.), (5) return of client property and materials, (6) survival of certain provisions (confidentiality, IP, indemnification), and (7) procedures for transition of work and knowledge transfer."
    },
    legalConsiderations: [
      "The independent contractor classification is critical. The agreement must clearly establish factors demonstrating independence to avoid misclassification risks, which can result in significant penalties, back taxes, and liability for employee benefits.",
      "The scope of services must be detailed enough to prevent scope creep and disputes, but flexible enough to allow for reasonable modifications. Include clear procedures for change orders with pricing adjustments.",
      "Intellectual property ownership must be explicitly addressed. Include both 'work made for hire' language and assignment provisions as backup, since work made for hire only applies in specific circumstances.",
      "Payment terms must be clear and comply with applicable laws. Some jurisdictions require prompt payment for contractor services. Specify invoicing requirements, payment deadlines, and late payment consequences.",
      "Confidentiality provisions are essential to protect business information. Ensure they are reasonable in scope and duration to be enforceable, and clearly define what constitutes confidential information.",
      "Limitation of liability clauses should be reasonable. Consultants typically cannot limit liability for gross negligence or willful misconduct. Consider mutual limitations or caps on liability.",
      "Termination provisions must balance flexibility with protection. Include provisions for termination with cause (breach, failure to perform) and without cause (convenience), with appropriate notice requirements and payment for completed work.",
      "Indemnification clauses should be carefully drafted. Consider mutual indemnification for breaches of the agreement, but be cautious of overly broad indemnification that could expose the consultant to unlimited liability.",
      "Ensure compliance with applicable labor laws, including worker classification tests (IRS 20-factor test, ABC test in some states, economic realities test). The agreement should support proper classification.",
      "Consider including dispute resolution provisions (arbitration or mediation) to avoid costly litigation, but ensure the consultant has a fair process and the choice aligns with strategic interests."
    ],
    legalProtections: [
      "Protection against worker misclassification claims and associated tax and liability exposure",
      "Clear ownership of intellectual property and work product",
      "Protection of confidential business information",
      "Ability to terminate the relationship with appropriate notice",
      "Protection against consultant competing or soliciting during and after the engagement",
      "Right to seek damages for breach of contract",
      "Protection against claims arising from consultant's work through indemnification and limitation of liability"
    ],
    bestPractices: [
      "Be extremely specific about deliverables, acceptance criteria, and quality standards. Vague descriptions lead to disputes and scope creep. Include detailed specifications and success criteria.",
      "Include detailed payment terms: rates (hourly, daily, fixed fee, or milestone-based), payment schedule, invoicing requirements, late payment fees, currency if applicable, and payment methods.",
      "Specify expense reimbursement policies clearly: what expenses are covered (travel, meals, materials, etc.), maximum amounts, required documentation, approval processes, and reimbursement timeline.",
      "Address intellectual property comprehensively: work product ownership, pre-existing IP rights, licenses granted, assignment requirements, and procedures for perfecting ownership.",
      "Include detailed confidentiality provisions that protect business information while being reasonable enough to be enforceable. Specify what constitutes confidential information and duration of obligations.",
      "Specify work arrangements: location (remote, on-site, hybrid), schedule flexibility, communication expectations, and reporting requirements.",
      "Include provisions for revisions, change orders, and scope modifications with clear procedures, pricing adjustments, and approval requirements.",
      "Address termination comprehensively: grounds for termination, notice requirements, payment for completed work, return of materials, and survival of key provisions.",
      "Consider including insurance requirements (general liability, professional liability, errors and omissions) depending on the nature of the consulting services.",
      "Include dispute resolution provisions (arbitration or mediation) to avoid costly litigation, but ensure the process is fair to both parties and doesn't disadvantage the consultant.",
      "Specify governing law and jurisdiction. Consider the consultant's location, client's location, and which jurisdiction's laws are most favorable.",
      "Include provisions for knowledge transfer, documentation, and training if the consultant will be transferring knowledge or systems to the client.",
      "Consider including exclusivity provisions if the consultant should not work for competitors, but ensure such restrictions are reasonable and enforceable."
    ],
    commonClauses: {
      "Engagement": "Clause establishing that client engages consultant to perform specified consulting services as an independent contractor, not as an employee.",
      "Independent Contractor Relationship": "Comprehensive clause establishing the non-employee relationship, including statements about tax obligations, benefits, authority, control over work methods, and right to work for other clients.",
      "Scope of Services": "Detailed description of consulting services, deliverables, timelines, performance standards, and acceptance criteria.",
      "Compensation": "Clear specification of payment rates, payment schedule, invoicing requirements, payment method, and any milestone or performance-based payments.",
      "Expenses": "Provisions for expense reimbursement, including what expenses are covered, documentation requirements, approval processes, and reimbursement timeline.",
      "Intellectual Property Assignment": "Clause establishing that all work product, deliverables, and intellectual property created under the agreement belong to client, with provisions for pre-existing IP.",
      "Confidentiality": "Comprehensive confidentiality obligations protecting client's business information, customer data, proprietary information, and trade secrets.",
      "Term and Termination": "Specification of the engagement term, grounds for termination, notice requirements, effect of termination, and payment for completed work.",
      "Limitation of Liability": "Reasonable limitations on consultant's liability, typically excluding indirect, consequential, or punitive damages, with caps on total liability.",
      "Indemnification": "Provisions requiring consultant to indemnify client for claims arising from consultant's work, breach of agreement, or violation of laws, with appropriate limitations.",
      "Governing Law": "Selection of applicable state law and jurisdiction for disputes.",
      "Severability": "Provision that invalid clauses don't void the entire agreement.",
      "Entire Agreement": "Merger clause stating the written agreement is the complete understanding and supersedes all prior agreements."
    },
    languageRequirements: [
      "Use formal, professional legal language appropriate for business contracts",
      "Employ precise terminology - consistently use 'Consultant' and 'Client' as defined terms",
      "Use mandatory language ('shall', 'must', 'will') for obligations, permissive language ('may') only for rights",
      "Include standard legal phrases and structure (WHEREAS clauses, NOW THEREFORE, etc.)",
      "Capitalize all defined terms consistently throughout",
      "Use active voice for clarity and enforceability",
      "Include cross-references between related sections",
      "Use qualifiers like 'reasonable', 'material', 'substantial' where appropriate"
    ],
    formattingRequirements: [
      "Begin with formal preamble identifying parties with full legal names and addresses",
      "Include recitals explaining the nature and purpose of the consulting engagement",
      "Use numbered sections with lettered subsections for complex provisions",
      "Bold all defined terms on first use and in section headers",
      "Include detailed scope of services section with clear subsections and deliverables",
      "Use tables or lists for deliverables, milestones, payment schedules, or expenses when helpful",
      "Add effective date and term clearly at the top",
      "DO NOT include signature blocks - signatures are handled separately via the signature feature",
      "Use consistent formatting for all sections"
    ],
    optionalClauses: [
      "Exclusivity provisions (if consultant should not work for competitors)",
      "Non-compete or non-solicitation clauses (must be reasonable)",
      "Most favored nation pricing (if consultant provides services to multiple clients)",
      "Audit rights (client's right to review consultant's records)",
      "Background check or credential verification requirements",
      "Subcontracting restrictions or approval requirements",
      "Force majeure clause",
      "Assignment restrictions",
      "Dispute resolution (arbitration, mediation, or litigation)"
    ],
    jurisdictionConsiderations: [
      "California: Very strict on independent contractor classification (ABC test). Non-compete clauses are generally unenforceable except in limited circumstances.",
      "New York: Has specific requirements for independent contractor agreements. Consider New York law for enforceability.",
      "Massachusetts: Has strict independent contractor classification requirements similar to California.",
      "Federal: IRS uses a 20-factor test. The agreement should support factors indicating independence.",
      "DOL: Department of Labor uses an 'economic realities' test focusing on whether the worker is economically dependent on the employer."
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
 * This creates comprehensive, attorney-level instructions for GPT-4
 */
export function buildDocumentTypePromptEnhancement(documentType: string): string {
  const typePrompt = getDocumentTypePrompt(documentType)
  
  if (!typePrompt) {
    return ""
  }

  let enhancement = `\n## Document-Specific Requirements for ${typePrompt.type}

### Professional Description and Purpose
${typePrompt.professionalDescription || typePrompt.purpose}

This document serves the following purpose: ${typePrompt.purpose}

### Required Sections (MUST BE INCLUDED)
The document MUST include ALL of the following sections in this order:
${typePrompt.requiredSections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### Detailed Section Requirements
${typePrompt.sectionDetails && Object.keys(typePrompt.sectionDetails).length > 0
  ? Object.entries(typePrompt.sectionDetails).map(([section, details]) => 
      `**${section}**: ${details}`
    ).join("\n\n")
  : "Follow standard legal document structure for this document type. Each section should be fully developed with comprehensive detail."}

### Critical Legal Considerations
When drafting this document, you MUST pay special attention to these critical legal issues:
${typePrompt.legalConsiderations.map((c, i) => `${i + 1}. ${c}`).join("\n")}

### Legal Protections Provided
This document must provide the following legal protections:
${typePrompt.legalProtections?.map((p, i) => `- ${p}`).join("\n") || "Standard legal protections for this document type"}

### Best Practices for Professional Drafting
Follow these attorney-level best practices:
${typePrompt.bestPractices.map((p, i) => `${i + 1}. ${p}`).join("\n")}

### Required Clauses with Detailed Specifications
The document MUST include these clauses with the following specifications:
${typeof typePrompt.commonClauses === 'object' && !Array.isArray(typePrompt.commonClauses) 
  ? Object.entries(typePrompt.commonClauses).map(([clause, description]) => 
      `**${clause}**: ${description}`
    ).join("\n\n")
  : (Array.isArray(typePrompt.commonClauses) 
      ? typePrompt.commonClauses.map((c, i) => `- ${c}`).join("\n")
      : "- Standard clauses for this document type")}

${typePrompt.optionalClauses && typePrompt.optionalClauses.length > 0 ? `
### Optional Clauses (Include if Relevant)
Consider including these clauses if applicable to the specific situation:
${typePrompt.optionalClauses.map((c, i) => `- ${c}`).join("\n")}
` : ""}

### Language and Terminology Requirements
Use the following language standards:
${typePrompt.languageRequirements?.map((r, i) => `${i + 1}. ${r}`).join("\n") || "Professional legal language appropriate for business contracts"}

### Formatting and Structure Requirements
Follow these formatting requirements:
${typePrompt.formattingRequirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

${typePrompt.jurisdictionConsiderations && typePrompt.jurisdictionConsiderations.length > 0 ? `
### Jurisdiction-Specific Considerations
Be aware of these jurisdiction-specific requirements:
${typePrompt.jurisdictionConsiderations.map((j, i) => `- ${j}`).join("\n")}
` : ""}

${typePrompt.riskMitigation && typePrompt.riskMitigation.length > 0 ? `
### Risk Mitigation Requirements
To minimize legal risk and maximize enforceability, the document MUST include these risk mitigation strategies:
${typePrompt.riskMitigation.map((r, i) => `${i + 1}. ${r}`).join("\n")}
` : ""}

${typePrompt.complianceRequirements && typePrompt.complianceRequirements.length > 0 ? `
### Compliance Requirements
The document MUST comply with the following legal requirements:
${typePrompt.complianceRequirements.map((c, i) => `${i + 1}. ${c}`).join("\n")}
` : `
### Compliance Requirements
Ensure compliance with all applicable federal, state, and local laws, regulations, and industry standards relevant to this document type. Consider jurisdiction-specific requirements, industry regulations, and any mandatory legal provisions that must be included.`}

${typePrompt.enforcementProvisions && typePrompt.enforcementProvisions.length > 0 ? `
### Enforcement and Dispute Resolution
The document MUST include comprehensive enforcement mechanisms:
${typePrompt.enforcementProvisions.map((e, i) => `${i + 1}. ${e}`).join("\n")}
` : `
### Enforcement and Dispute Resolution
Include comprehensive enforcement mechanisms, including remedies for breach, dispute resolution procedures (litigation, arbitration, or mediation), venue selection, and choice of law provisions appropriate for the document type and parties involved.`}

${typePrompt.qualityChecklist && typePrompt.qualityChecklist.length > 0 ? `
### Quality Assurance Checklist
Before finalizing the document, verify that it includes:
${typePrompt.qualityChecklist.map((q, i) => `- ${q}`).join("\n")}
` : `
### Quality Assurance Checklist
Before finalizing the document, verify that it includes:
- All required sections are present and fully developed
- All defined terms are capitalized and used consistently
- All cross-references between sections are accurate
- All obligations are clearly stated with mandatory language ("shall", "must", "will")
- All legal protections are comprehensive and enforceable
- The document complies with applicable laws and regulations
- The language is precise, unambiguous, and professional
- The structure follows standard legal document conventions`}

${typePrompt.professionalStandards && typePrompt.professionalStandards.length > 0 ? `
### Professional Standards
This document must meet attorney-level professional standards:
${typePrompt.professionalStandards.map((s, i) => `${i + 1}. ${s}`).join("\n")}
` : `
### Professional Standards
This document must meet attorney-level professional standards:
1. Use precise, tested legal language that has been upheld in court
2. Include comprehensive provisions covering all material terms
3. Address potential disputes and edge cases proactively
4. Ensure all provisions are reasonable and enforceable
5. Use clear structure and formatting for easy review
6. Include appropriate legal protections for all parties
7. Comply with ethical standards and professional best practices`}

### Quality Standards
The final document must:
- Be comprehensive and include ALL required sections with full detail (attorney-level quality)
- Use precise, professional legal language throughout that has been tested in court
- Include all standard clauses with proper legal terminology and comprehensive detail
- Comply with applicable federal, state, and local laws and regulations
- Provide maximum legal protection while remaining reasonable and enforceable
- Be structured like an attorney-drafted document used in professional practice
- Address all material terms and potential edge cases proactively
- Include appropriate risk mitigation and enforcement mechanisms
- Be clear, unambiguous, and ready for execution
- Follow professional legal document formatting conventions

### Critical Legal Disclaimer
IMPORTANT: While this document is generated using comprehensive legal templates and attorney-level guidance, it is a template and may require customization for specific circumstances. The generated document should be reviewed by qualified legal counsel familiar with the applicable jurisdiction and subject matter. Laws vary by jurisdiction and change over time. No warranty or guarantee is provided as to the enforceability, suitability, or legal compliance of this document for any specific purpose. Users are solely responsible for ensuring the document is appropriate for their specific situation and complies with all applicable laws.

`

  return enhancement
}

