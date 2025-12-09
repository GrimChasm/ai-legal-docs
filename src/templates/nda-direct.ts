/**
 * Non-Disclosure Agreement Template
 * 
 * This is a professionally written NDA template that generates documents
 * directly without requiring AI. Simply replace placeholders with user values.
 */

import { formatDate } from "@/lib/template-engine"

export default function ndaDirectTemplate(values: {
  clientName: string
  recipientName: string
  effectiveDate: string
  jurisdiction: string
  confidentialityTerm: number
  purpose: string
}) {
  const formattedDate = formatDate(values.effectiveDate)
  const termYears = values.confidentialityTerm || 2

  return `# NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on ${formattedDate} ("Effective Date") between:

**Disclosing Party:** ${values.clientName || "[Client Name]"}  
**Receiving Party:** ${values.recipientName || "[Recipient Name]"}

## 1. DEFINITIONS

**1.1 Confidential Information** means all non-public, proprietary, or confidential information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in any other form, including but not limited to: business plans, financial information, customer lists, trade secrets, technical data, product designs, marketing strategies, and any other information that is marked or designated as confidential or that would reasonably be considered confidential under the circumstances.

**1.2 Purpose** means: ${values.purpose || "[Purpose of disclosure]"}

## 2. CONFIDENTIALITY OBLIGATIONS

**2.1** The Receiving Party agrees to hold and maintain all Confidential Information in strict confidence and not to disclose, publish, or disseminate any Confidential Information to any third party without the prior written consent of the Disclosing Party.

**2.2** The Receiving Party shall use the Confidential Information solely for the Purpose and for no other purpose whatsoever.

**2.3** The Receiving Party shall take all reasonable precautions to protect the confidentiality of the Confidential Information, using at least the same degree of care it uses to protect its own confidential information, but in no event less than reasonable care.

## 3. EXCLUSIONS

The obligations set forth in Section 2 shall not apply to information that:
- (a) is or becomes publicly available through no breach of this Agreement by the Receiving Party;
- (b) was rightfully known by the Receiving Party prior to disclosure;
- (c) is rightfully received by the Receiving Party from a third party without breach of any confidentiality obligation;
- (d) is independently developed by the Receiving Party without use of or reference to the Confidential Information; or
- (e) is required to be disclosed by law, regulation, or court order, provided that the Receiving Party gives the Disclosing Party reasonable prior notice of such disclosure.

## 4. TERM

**4.1** This Agreement shall remain in effect for a period of ${termYears} ${termYears === 1 ? "year" : "years"} from the Effective Date, unless terminated earlier by mutual written consent of both parties.

**4.2** The confidentiality obligations set forth in this Agreement shall survive termination of this Agreement and shall continue in effect for the duration specified in Section 4.1.

## 5. RETURN OF MATERIALS

Upon termination of this Agreement or upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all documents, materials, and other tangible manifestations of Confidential Information, and all copies thereof, and certify in writing that it has done so.

## 6. REMEDIES

The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages would be inadequate. Therefore, the Disclosing Party shall be entitled to seek injunctive relief and other equitable remedies in addition to any other remedies available at law or in equity.

## 7. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of ${values.jurisdiction || "[Jurisdiction]"}, without regard to its conflict of law principles.

## 8. GENERAL PROVISIONS

**8.1** This Agreement constitutes the entire agreement between the parties concerning the subject matter hereof and supersedes all prior agreements and understandings.

**8.2** This Agreement may not be modified except in writing signed by both parties.

**8.3** If any provision of this Agreement is found to be unenforceable, the remainder shall remain in full force and effect.

**8.4** This Agreement may be executed in counterparts, each of which shall be deemed an original.

## SIGNATURES

**Disclosing Party:**

\`\`\`
_________________________          _________________________
Signature                            Date

${values.clientName || "[Client Name]"}
\`\`\`

**Receiving Party:**

\`\`\`
_________________________          _________________________
Signature                            Date

${values.recipientName || "[Recipient Name]"}
\`\`\`
`
}

