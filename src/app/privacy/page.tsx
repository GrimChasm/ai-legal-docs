import type { Metadata } from "next"
import Link from "next/link"
import Logo from "@/components/logo"

export const metadata: Metadata = {
  title: "Privacy Policy | ContractVault",
  description: "Privacy Policy for ContractVault",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-12 md:py-16">
        <div className="mb-8">
          <Link href="/" className="inline-block mb-6">
            <Logo size="md" showText={true} />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-text-muted mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-lg max-w-none space-y-6 text-text-main">
            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                ContractVault ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-text-main mb-3 mt-4">2.1 Information You Provide</h3>
              <p className="leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Account information (name, email address, password)</li>
                <li>Document information and content you input when generating documents</li>
                <li>Signature data and related information</li>
                <li>Communication data when you contact us</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-main mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="leading-relaxed">
                We automatically collect certain information when you use our Service, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Device information and IP address</li>
                <li>Usage data and interaction patterns</li>
                <li>Log data and error reports</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">3. How We Use Your Information</h2>
              <p className="leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process your document generation requests</li>
                <li>Manage your account and authenticate users</li>
                <li>Send you service-related communications</li>
                <li>Respond to your inquiries and provide support</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">4. Data Storage and Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
              <p className="leading-relaxed mt-4">
                Your documents and data are stored securely and are only accessible by you and authorized ContractVault personnel for service provision and support purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">5. Data Sharing and Disclosure</h2>
              <p className="leading-relaxed">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or respond to legal process</li>
                <li>To protect our rights, property, or safety, or that of our users</li>
                <li>With service providers who assist us in operating our Service (under strict confidentiality agreements)</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">6. Your Rights and Choices</h2>
              <p className="leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise these rights, please contact us through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">7. Data Retention</h2>
              <p className="leading-relaxed">
                We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">8. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">9. International Data Transfers</h2>
              <p className="leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">10. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-main mb-4">11. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through the Service.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

