import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import ProductLayout from '@/components/ProductLayout';
import UtrippinLogo from '@/components/UtrippinLogo';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Shield, Lock, FileText, Users, Globe } from 'lucide-react';

const Legal = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEOHead 
        title="Legal Center - Terms, Privacy & Safety | Utrippin.ai"
        description="Read Utrippin.ai's comprehensive legal policies, privacy practices, terms of service, copyright information, and Travel Buddy safety guidelines for secure travel planning."
        canonical="https://utrippin.ai/legal"
        keywords="Utrippin.ai legal, terms of service, privacy policy, copyright, Travel Buddy safety, travel platform legal"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/legal#webpage",
              "url": "https://utrippin.ai/legal",
              "name": "Legal Center - Terms, Privacy & Safety | Utrippin.ai",
              "description": "Read Utrippin.ai's comprehensive legal policies, privacy practices, terms of service, copyright information, and Travel Buddy safety guidelines.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />

      <ProductLayout>
        <div className="bg-gradient-to-br from-travel-navy via-travel-navy/95 to-travel-navy/90">
          <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <UtrippinLogo />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Legal Center
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Comprehensive legal policies and protection guidelines for Utrippin.ai users
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card 
              className="bg-white/10 backdrop-blur border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300"
              onClick={() => scrollToSection('terms')}
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-utrippin-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Terms & Legal Notices</h3>
                <p className="text-white/70">Comprehensive terms of use and legal obligations</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white/10 backdrop-blur border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300"
              onClick={() => scrollToSection('privacy')}
            >
              <CardContent className="p-6 text-center">
                <Lock className="h-12 w-12 text-utrippin-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Privacy Policy</h3>
                <p className="text-white/70">Data protection and privacy practices</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white/10 backdrop-blur border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300"
              onClick={() => scrollToSection('copyright')}
            >
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-utrippin-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Copyright & IP Policy</h3>
                <p className="text-white/70">Intellectual property rights and usage terms</p>
              </CardContent>
            </Card>
          </div>

          {/* Legal Content */}
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Terms of Use */}
            <section id="terms" className="bg-white rounded-lg shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-travel-navy" />
                <h2 className="text-3xl font-bold text-travel-navy">Terms of Use & Legal Notices</h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-body space-y-8">
                {/* Critical Travel Buddy Warning */}
                <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
                  <div className="flex items-start">
                    <AlertTriangle className="h-8 w-8 text-red-500 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-red-800 mb-2">CRITICAL TRAVEL BUDDY SAFETY WARNING</h3>
                      <p className="text-red-700 font-semibold mb-2">
                        IF YOU MEET SOMEONE OFFLINE FROM OUR TRAVEL BUDDY SYSTEM, YOU DO SO AT YOUR OWN RISK. 
                        UTRIPPIN.AI IS NOT RESPONSIBLE FOR YOUR SAFETY AND YOU ASSUME ALL RISKS WHEN TRAVELING WITH STRANGERS.
                      </p>
                      <ul className="text-red-700 list-disc list-inside space-y-1">
                        <li>We perform NO background checks on users</li>
                        <li>We cannot verify identity, criminal history, or intentions</li>
                        <li>Always meet in public places first</li>
                        <li>Inform friends/family of your travel plans</li>
                        <li>Trust your instincts - if something feels wrong, leave immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">1. Agreement to Terms & Binding Nature</h3>
                    <p>By accessing, browsing, or using Utrippin.ai ("Platform", "we", "us", or "our"), including creating an account, using our Travel Buddy system, booking travel services, or any other interaction with our platform, you ("User", "you", or "your") agree to be legally bound by these Terms of Use, our Privacy Policy, and all applicable laws and regulations.</p>
                    <p className="mt-3">This agreement constitutes a legally binding contract between you and Utrippin.ai. If you do not agree to these terms in their entirety, you must immediately cease using our services. Continued use after any modifications to these terms constitutes acceptance of the modified terms.</p>
                    <p className="mt-3"><strong>Electronic Signature:</strong> Your use of our platform constitutes your electronic signature and acceptance of these terms under the Electronic Signatures in Global and National Commerce Act and applicable state laws.</p>
                    <p className="mt-3"><strong>Age Requirement:</strong> You must be at least 18 years old to use our services. Users under 18 require verifiable parental consent and supervision.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">2. Detailed Service Definitions & Our Limited Role</h3>
                    <p><strong>Platform Nature:</strong> Utrippin.ai operates as a digital intermediary and booking platform that connects users with third-party travel service providers. We are NOT a travel agency, airline, hotel operator, car rental company, event organizer, or travel companion matching service.</p>
                    <p className="mt-3"><strong>Third-Party Relationships:</strong> All bookings create direct contractual relationships between you and the respective service providers (airlines, hotels, car rental companies, event venues, etc.). We facilitate these transactions but are not a party to these contracts.</p>
                    <p className="mt-3"><strong>No Ownership or Control:</strong> We do not own, operate, manage, or control any transportation, accommodation, vehicle, or event services. We cannot guarantee availability, quality, safety, or performance of any third-party services.</p>
                    <p className="mt-3"><strong>Information Accuracy:</strong> While we strive for accuracy, all information displayed is provided by third-party suppliers and may be subject to change without notice. We disclaim responsibility for outdated, incorrect, or incomplete information.</p>
                    <p className="mt-3"><strong>Service Availability:</strong> Our platform and services may be unavailable due to maintenance, technical issues, or circumstances beyond our control. We reserve the right to modify, suspend, or discontinue services at any time.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">3. Enhanced International Compliance & Travel Responsibilities</h3>
                    <p><strong>Global Accessibility:</strong> Our platform is accessible worldwide, but you are solely responsible for compliance with all applicable laws, regulations, and restrictions in your jurisdiction and destination countries.</p>
                    <p className="mt-3"><strong>Travel Documentation:</strong> You are responsible for obtaining and maintaining valid passports, visas, health certificates, travel insurance, and any other required documentation. We provide no assistance or guidance regarding travel requirements.</p>
                    <p className="mt-3"><strong>Health & Safety Compliance:</strong> You must comply with all health regulations, vaccination requirements, quarantine rules, and safety protocols. We disclaim responsibility for health-related travel restrictions or requirements.</p>
                    <p className="mt-3"><strong>Customs & Immigration:</strong> You are responsible for compliance with customs regulations, import/export restrictions, and immigration laws. We provide no advice or assistance with customs or immigration matters.</p>
                    <p className="mt-3"><strong>Local Laws:</strong> You must research and comply with local laws, customs, and cultural norms at your destination. What is legal in one jurisdiction may be prohibited in another.</p>
                    <p className="mt-3"><strong>Travel Advisories:</strong> You are responsible for checking government travel advisories, security alerts, and safety warnings for your destinations.</p>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4 flex items-center">
                      <Users className="h-6 w-6 mr-2" />
                      4. Comprehensive Travel Buddy System Protections
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-red-100 border border-red-300 p-4 rounded">
                        <h4 className="font-bold text-red-800 mb-2">ABSOLUTE LIABILITY DISCLAIMER</h4>
                        <p className="text-red-700">Utrippin.ai provides NO WARRANTIES, guarantees, or representations regarding Travel Buddy participants. ANY offline meetings, travel arrangements, or interactions are undertaken AT YOUR SOLE RISK AND RESPONSIBILITY.</p>
                      </div>
                      
                      <p><strong>No Background Verification:</strong> We do not conduct criminal background checks, identity verification, reference checks, or any form of screening beyond basic registration data validation.</p>
                      <p><strong>No Liability for User Conduct:</strong> We are not responsible for the actions, behavior, statements, or conduct of any Travel Buddy participants, whether online or offline.</p>
                      <p><strong>Meeting Safety Protocol:</strong> If you choose to meet someone offline:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>ALWAYS meet in public, well-populated areas</li>
                        <li>Inform multiple trusted contacts of your plans, including who you're meeting and where</li>
                        <li>Share location tracking with trusted contacts</li>
                        <li>Arrange your own transportation</li>
                        <li>Never share personal financial information</li>
                        <li>Trust your instincts - leave immediately if you feel unsafe</li>
                        <li>Consider video calling before meeting in person</li>
                      </ul>
                      <p><strong>Dispute Resolution:</strong> Any disputes between Travel Buddy participants must be resolved directly between the parties. Utrippin.ai will not mediate, arbitrate, or provide assistance with user disputes.</p>
                      <p><strong>Reporting Mechanisms:</strong> While we provide tools to report inappropriate behavior, we cannot guarantee response times or specific actions. Serious incidents should be reported to local authorities.</p>
                      <p><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts for violations of these terms, but such actions do not imply any liability or responsibility for user safety.</p>
                      <p><strong>No Guarantees:</strong> We make no representations about the compatibility, reliability, honesty, or safety of any Travel Buddy participants.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">5. Booking & Financial Terms</h3>
                    <p><strong>Payment Processing:</strong> All payments are processed by third-party payment processors. We do not store complete credit card information and are not responsible for payment processing failures or errors.</p>
                    <p className="mt-3"><strong>Pricing & Fees:</strong> Prices displayed are subject to change and may not include all taxes, fees, or surcharges. Final pricing is determined by the service provider at the time of booking.</p>
                    <p className="mt-3"><strong>Cancellation & Refunds:</strong> All cancellations and refunds are governed by the terms and conditions of the respective service providers. We do not determine refund eligibility or amounts.</p>
                    <p className="mt-3"><strong>Currency Conversion:</strong> When applicable, currency conversions are approximate and may differ from actual conversion rates at the time of transaction.</p>
                    <p className="mt-3"><strong>Booking Confirmation:</strong> A booking is confirmed only when you receive confirmation from the respective service provider. Platform confirmation does not guarantee service provider acceptance.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">6. Enhanced User Responsibilities</h3>
                    <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                    <p className="mt-3"><strong>Accurate Information:</strong> You must provide complete, accurate, and current information during registration and booking processes.</p>
                    <p className="mt-3"><strong>Prohibited Activities:</strong> You may not:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Use our platform for illegal activities</li>
                      <li>Attempt to circumvent security measures</li>
                      <li>Engage in fraudulent transactions</li>
                      <li>Harass, threaten, or harm other users</li>
                      <li>Upload malicious software or content</li>
                      <li>Misrepresent your identity or qualifications</li>
                      <li>Violate intellectual property rights</li>
                      <li>Use automated systems to access our platform</li>
                    </ul>
                    <p className="mt-3"><strong>Content Standards:</strong> Any content you submit must be lawful, accurate, and appropriate. You grant us a non-exclusive license to use submitted content for platform operations.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">7. Intellectual Property Protection</h3>
                    <p><strong>Platform Content:</strong> All content on Utrippin.ai, including text, graphics, logos, software, and design elements, is protected by copyright, trademark, and other intellectual property laws.</p>
                    <p className="mt-3"><strong>User Content License:</strong> By submitting content, you grant us a worldwide, royalty-free license to use, modify, and display such content for platform operations.</p>
                    <p className="mt-3"><strong>Third-Party Content:</strong> Respect for third-party intellectual property rights is required. We respond to valid DMCA takedown notices.</p>
                    <p className="mt-3"><strong>Trademark Usage:</strong> Our trademarks and logos may not be used without explicit written permission.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">8. Enhanced Liability Limitations</h3>
                    <p><strong>Maximum Liability Disclaimer:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, UTRIPPIN.AI SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OUR PLATFORM.</p>
                    <p className="mt-3"><strong>Force Majeure:</strong> We are not liable for any failure to perform due to circumstances beyond our reasonable control, including natural disasters, government actions, labor disputes, or technical failures.</p>
                    <p className="mt-3"><strong>Third-Party Service Failures:</strong> We disclaim all liability for failures, delays, cancellations, or poor performance by third-party service providers.</p>
                    <p className="mt-3"><strong>Travel Disruptions:</strong> We are not responsible for travel disruptions caused by weather, mechanical failures, strikes, terrorism, pandemic restrictions, or other unforeseeable events.</p>
                    <p className="mt-3"><strong>Damage Limitations:</strong> If liability is found despite these disclaimers, our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">9. Dispute Resolution & Governing Law</h3>
                    <p><strong>Governing Law:</strong> These Terms are governed by the laws of the United States and the State of Florida, without regard to conflict of law principles.</p>
                    <p className="mt-3"><strong>Jurisdiction:</strong> Any legal disputes shall be resolved exclusively in the state or federal courts located in Florida, and you consent to personal jurisdiction in these courts.</p>
                    <p className="mt-3"><strong>Mandatory Arbitration:</strong> Most disputes must be resolved through binding arbitration rather than court proceedings, except for intellectual property disputes and small claims court matters.</p>
                    <p className="mt-3"><strong>Class Action Waiver:</strong> You waive any right to participate in class action lawsuits or class-wide arbitrations against Utrippin.ai.</p>
                    <p className="mt-3"><strong>Legal Fees:</strong> In any legal proceeding, the prevailing party may be entitled to recover reasonable attorney fees and costs.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">10. Data Protection & Privacy Cross-References</h3>
                    <p><strong>Privacy Policy Integration:</strong> Our Privacy Policy is incorporated by reference and forms part of these Terms.</p>
                    <p className="mt-3"><strong>Data Processing Consent:</strong> By using our platform, you consent to our data processing practices as described in our Privacy Policy.</p>
                    <p className="mt-3"><strong>International Data Transfers:</strong> You consent to the transfer of your data to the United States and other countries where our service providers operate.</p>
                    <p className="mt-3"><strong>Third-Party Data Sharing:</strong> We may share necessary data with service providers to facilitate bookings and provide services.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">11. Modification & Termination</h3>
                    <p><strong>Terms Updates:</strong> We may modify these Terms at any time. Continued use after modifications constitutes acceptance of the updated terms.</p>
                    <p className="mt-3"><strong>Account Termination:</strong> We may suspend or terminate accounts for violations of these terms or for any reason at our discretion.</p>
                    <p className="mt-3"><strong>Service Discontinuation:</strong> We may discontinue services or features at any time without liability to users.</p>
                    <p className="mt-3"><strong>Survival:</strong> Provisions regarding liability limitations, dispute resolution, and intellectual property survive termination of these terms.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">12. Additional Protections & Miscellaneous</h3>
                    <p><strong>Severability:</strong> If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.</p>
                    <p className="mt-3"><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and Utrippin.ai.</p>
                    <p className="mt-3"><strong>No Waiver:</strong> Our failure to enforce any provision does not constitute a waiver of that provision.</p>
                    <p className="mt-3"><strong>Electronic Communications:</strong> You consent to receive communications from us electronically, including legal notices and terms updates.</p>
                    <p className="mt-3"><strong>Assignment:</strong> You may not assign your rights under these Terms. We may assign our rights and obligations to any party.</p>
                    <p className="mt-3"><strong>Contact Information:</strong> For legal notices or terms-related questions, contact us at legal@utrippin.ai.</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-12" />

            {/* Privacy Policy */}
            <section id="privacy" className="bg-white rounded-lg shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-8 w-8 text-travel-navy" />
                <h2 className="text-3xl font-bold text-travel-navy">Privacy Policy</h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-body space-y-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                  <p className="text-blue-800 font-semibold">
                    This Privacy Policy explains how Utrippin.ai collects, uses, shares, and protects your personal information. 
                    Your privacy is important to us, and we are committed to transparency in our data practices.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">1. Comprehensive Information We Collect</h3>
                    <p><strong>Account Information:</strong> Name, email address, phone number, date of birth, profile photos, travel preferences, and verification documents.</p>
                    <p className="mt-3"><strong>Booking Data:</strong> Travel dates, destinations, passenger information, payment details (processed by third-party processors), booking history, and service preferences.</p>
                    <p className="mt-3"><strong>Travel Buddy Information:</strong> Profile details, travel interests, communication preferences, chat messages, match history, and interaction data.</p>
                    <p className="mt-3"><strong>Technical Data:</strong> IP address, device information, browser type, operating system, app usage data, location data, cookies, and tracking pixels.</p>
                    <p className="mt-3"><strong>Communication Data:</strong> Customer service interactions, survey responses, feedback, and any other communications with us.</p>
                    <p className="mt-3"><strong>Behavioral Data:</strong> Search history, page views, click patterns, time spent on pages, and feature usage analytics.</p>
                    <p className="mt-3"><strong>Third-Party Data:</strong> Information from social media logins, travel partners, marketing partners, and public sources.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">2. How We Use Your Information</h3>
                    <p><strong>Service Provision:</strong> Facilitating bookings, processing payments, managing accounts, and providing customer support.</p>
                    <p className="mt-3"><strong>Travel Buddy Matching:</strong> Creating compatibility profiles, suggesting matches, facilitating communications, and improving matching algorithms.</p>
                    <p className="mt-3"><strong>Personalization:</strong> Customizing travel recommendations, displaying relevant offers, and tailoring user experiences.</p>
                    <p className="mt-3"><strong>Communication:</strong> Sending booking confirmations, service updates, promotional materials, and customer service responses.</p>
                    <p className="mt-3"><strong>Legal Compliance:</strong> Meeting regulatory requirements, preventing fraud, ensuring security, and protecting our legal interests.</p>
                    <p className="mt-3"><strong>Analytics & Improvement:</strong> Analyzing usage patterns, improving services, developing new features, and conducting market research.</p>
                    <p className="mt-3"><strong>Marketing:</strong> Sending promotional materials, targeted advertising, and market research (with appropriate consents).</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">3. Information Sharing Practices</h3>
                    <p><strong>Service Providers:</strong> Airlines, hotels, car rental companies, event organizers, and other travel service providers receive necessary booking information.</p>
                    <p className="mt-3"><strong>Travel Buddy Participants:</strong> Limited profile information is shared with matched users, and direct messages are facilitated through our platform.</p>
                    <p className="mt-3"><strong>Payment Processors:</strong> Stripe and other payment processors receive payment information necessary to process transactions.</p>
                    <p className="mt-3"><strong>Business Partners:</strong> Marketing partners, analytics providers, and affiliate networks may receive aggregated or pseudonymized data.</p>
                    <p className="mt-3"><strong>Legal Requirements:</strong> We may disclose information to comply with legal obligations, court orders, or government requests.</p>
                    <p className="mt-3"><strong>Business Transfers:</strong> Information may be transferred in connection with mergers, acquisitions, or asset sales.</p>
                    <p className="mt-3"><strong>Consent-Based Sharing:</strong> Any other sharing requires your explicit consent.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">4. International Data Transfers</h3>
                    <p><strong>Cross-Border Processing:</strong> Your data may be processed in the United States, European Union, and other countries where our service providers operate.</p>
                    <p className="mt-3"><strong>Adequacy Decisions:</strong> We rely on adequacy decisions, standard contractual clauses, and other approved transfer mechanisms.</p>
                    <p className="mt-3"><strong>Safeguards:</strong> Appropriate technical and organizational measures protect data during international transfers.</p>
                    <p className="mt-3"><strong>Consent:</strong> By using our services, you consent to these international data transfers.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">5. Your Privacy Rights</h3>
                    <p><strong>Access Rights:</strong> You can request copies of personal information we hold about you.</p>
                    <p className="mt-3"><strong>Correction Rights:</strong> You can request correction of inaccurate or incomplete information.</p>
                    <p className="mt-3"><strong>Deletion Rights:</strong> You can request deletion of your personal information, subject to legal and legitimate business requirements.</p>
                    <p className="mt-3"><strong>Portability Rights:</strong> You can request your data in a machine-readable format for transfer to other services.</p>
                    <p className="mt-3"><strong>Objection Rights:</strong> You can object to certain processing activities, particularly for marketing purposes.</p>
                    <p className="mt-3"><strong>Restriction Rights:</strong> You can request restriction of processing under certain circumstances.</p>
                    <p className="mt-3"><strong>Withdrawal of Consent:</strong> Where processing is based on consent, you can withdraw consent at any time.</p>
                    <p className="mt-3"><strong>Complaint Rights:</strong> You can file complaints with relevant data protection authorities.</p>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">6. Travel Buddy Privacy & Safety</h3>
                    <p><strong>Profile Visibility:</strong> Your Travel Buddy profile is visible to other users according to your privacy settings.</p>
                    <p className="mt-3"><strong>Matching Algorithm:</strong> We use your preferences and behavior to suggest compatible travel companions.</p>
                    <p className="mt-3"><strong>Communication Monitoring:</strong> We may monitor communications for safety and quality purposes, but cannot guarantee user safety.</p>
                    <p className="mt-3"><strong>Safety Reporting:</strong> We provide tools to report inappropriate behavior, but response times and actions cannot be guaranteed.</p>
                    <p className="mt-3"><strong>Data Sharing Limitations:</strong> We limit the personal information shared with Travel Buddy matches, but users may share additional information directly.</p>
                    <p className="mt-3"><strong>Offline Meeting Disclaimer:</strong> We have no control over or responsibility for offline meetings between Travel Buddy participants.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">7. Security Measures</h3>
                    <p><strong>Technical Safeguards:</strong> Encryption, secure servers, access controls, and regular security updates protect your data.</p>
                    <p className="mt-3"><strong>Organizational Measures:</strong> Employee training, background checks, confidentiality agreements, and access limitations.</p>
                    <p className="mt-3"><strong>Incident Response:</strong> We have procedures for detecting, responding to, and notifying users of security breaches.</p>
                    <p className="mt-3"><strong>Third-Party Security:</strong> We require service providers to maintain appropriate security measures.</p>
                    <p className="mt-3"><strong>User Responsibility:</strong> You are responsible for maintaining the security of your account credentials.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">8. Data Retention & Deletion</h3>
                    <p><strong>Retention Periods:</strong> We retain personal information only as long as necessary for legitimate business purposes and legal requirements.</p>
                    <p className="mt-3"><strong>Account Data:</strong> Account information is retained while your account is active and for a reasonable period after closure.</p>
                    <p className="mt-3"><strong>Booking Records:</strong> Transaction records are retained for accounting, tax, and legal compliance purposes.</p>
                    <p className="mt-3"><strong>Communication Data:</strong> Customer service records and Travel Buddy messages are retained for quality and safety purposes.</p>
                    <p className="mt-3"><strong>Deletion Procedures:</strong> When retention periods expire, data is securely deleted or anonymized.</p>
                    <p className="mt-3"><strong>Backup Data:</strong> Deleted data may persist in backups for a limited time before permanent deletion.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">9. Third-Party Integrations</h3>
                    <p><strong>Social Media:</strong> If you connect social media accounts, we may access profile information according to platform permissions.</p>
                    <p className="mt-3"><strong>Analytics Services:</strong> Google Analytics and similar services help us understand user behavior (subject to their privacy policies).</p>
                    <p className="mt-3"><strong>Payment Processors:</strong> Stripe and other processors handle payment data according to their security standards and privacy policies.</p>
                    <p className="mt-3"><strong>Travel Partners:</strong> Airlines, hotels, and other partners receive only necessary booking information.</p>
                    <p className="mt-3"><strong>Marketing Partners:</strong> Advertising networks may receive pseudonymized data for targeted marketing.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">10. Jurisdiction-Specific Rights</h3>
                    <p><strong>GDPR (European Union):</strong> EU residents have enhanced rights under the General Data Protection Regulation, including data portability and the right to be forgotten.</p>
                    <p className="mt-3"><strong>CCPA (California):</strong> California residents have rights to know about personal information collection, request deletion, and opt-out of sale of personal information.</p>
                    <p className="mt-3"><strong>Other Regional Laws:</strong> We comply with applicable privacy laws in all jurisdictions where we operate.</p>
                    <p className="mt-3"><strong>Enforcement:</strong> Users can contact relevant data protection authorities to file complaints about our privacy practices.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">11. Policy Updates & Communication</h3>
                    <p><strong>Update Procedures:</strong> We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.</p>
                    <p className="mt-3"><strong>Notification Methods:</strong> Significant changes will be communicated via email, platform notifications, or website postings.</p>
                    <p className="mt-3"><strong>Effective Dates:</strong> The effective date of any changes will be clearly indicated.</p>
                    <p className="mt-3"><strong>Continued Use:</strong> Continued use after changes constitutes acceptance of the updated policy.</p>
                    <p className="mt-3"><strong>Contact Information:</strong> Questions about this Privacy Policy can be directed to privacy@utrippin.ai.</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-12" />

            {/* Copyright & IP Policy */}
            <section id="copyright" className="bg-white rounded-lg shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-travel-navy" />
                <h2 className="text-3xl font-bold text-travel-navy">Copyright & Intellectual Property Policy</h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-body space-y-8">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
                  <p className="text-purple-800 font-semibold">
                    Utrippin.ai respects intellectual property rights and expects our users to do the same. 
                    This policy outlines our approach to copyright protection and intellectual property matters.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">1. Ownership & Licensing</h3>
                    <p><strong>Platform Ownership:</strong> All content on Utrippin.ai, including text, graphics, logos, images, software, design elements, and functionality, is owned by or licensed to Utrippin.ai and protected by copyright, trademark, and other intellectual property laws.</p>
                    <p className="mt-3"><strong>User Content License:</strong> By submitting content to our platform (reviews, photos, Travel Buddy profiles, etc.), you grant Utrippin.ai a worldwide, non-exclusive, royalty-free, transferable license to use, modify, adapt, reproduce, distribute, and display such content for platform operations and promotional purposes.</p>
                    <p className="mt-3"><strong>Third-Party Content:</strong> Some content is provided by third-party suppliers and is subject to their respective intellectual property rights and usage terms.</p>
                    <p className="mt-3"><strong>Limited Use License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use our platform for personal, non-commercial purposes in accordance with these terms.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">2. User-Generated Content Guidelines</h3>
                    <p><strong>Submission Standards:</strong> All user-generated content must be original, accurate, appropriate, and comply with applicable laws and our community guidelines.</p>
                    <p className="mt-3"><strong>Prohibited Content:</strong> Users may not submit content that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Infringes on third-party intellectual property rights</li>
                      <li>Contains false, misleading, or defamatory information</li>
                      <li>Includes inappropriate, offensive, or harmful material</li>
                      <li>Violates privacy rights of others</li>
                      <li>Contains malicious code or spam</li>
                      <li>Promotes illegal activities</li>
                    </ul>
                    <p className="mt-3"><strong>Content Moderation:</strong> We reserve the right to review, edit, or remove user-generated content at our discretion.</p>
                    <p className="mt-3"><strong>Representation & Warranties:</strong> By submitting content, you represent that you own or have the necessary rights to the content and that its use will not infringe on third-party rights.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">3. DMCA Compliance Procedures</h3>
                    <p><strong>Takedown Notices:</strong> If you believe content on our platform infringes your copyright, you may submit a DMCA takedown notice to our designated agent at dmca@utrippin.ai.</p>
                    <p className="mt-3"><strong>Required Information:</strong> Valid DMCA notices must include:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Identification of the copyrighted work claimed to be infringed</li>
                      <li>Identification of the allegedly infringing material and its location</li>
                      <li>Your contact information (name, address, phone, email)</li>
                      <li>A statement of good faith belief that use is not authorized</li>
                      <li>A statement of accuracy under penalty of perjury</li>
                      <li>Your physical or electronic signature</li>
                    </ul>
                    <p className="mt-3"><strong>Counter-Notification Process:</strong> Users whose content is removed may submit counter-notifications if they believe the removal was improper.</p>
                    <p className="mt-3"><strong>Repeat Infringer Policy:</strong> We may terminate accounts of users who repeatedly infringe copyrights.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">4. Trademark Protection</h3>
                    <p><strong>Our Trademarks:</strong> "Utrippin.ai," our logos, and other brand elements are trademarks of Utrippin.ai and may not be used without express written permission.</p>
                    <p className="mt-3"><strong>Usage Guidelines:</strong> Any authorized use of our trademarks must comply with our brand guidelines and trademark usage policies.</p>
                    <p className="mt-3"><strong>Third-Party Trademarks:</strong> References to third-party trademarks are for identification purposes only and do not imply endorsement or affiliation.</p>
                    <p className="mt-3"><strong>Trademark Infringement:</strong> We respond promptly to valid trademark infringement claims and expect users to respect trademark rights.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">5. API and Data Usage</h3>
                    <p><strong>API Access:</strong> Any access to our APIs requires a separate developer agreement and compliance with usage terms and rate limits.</p>
                    <p className="mt-3"><strong>Data Scraping:</strong> Automated data collection or scraping of our platform is prohibited without explicit written permission.</p>
                    <p className="mt-3"><strong>Commercial Use Restrictions:</strong> Commercial use of our platform or data requires separate licensing agreements.</p>
                    <p className="mt-3"><strong>Attribution Requirements:</strong> Any permitted use of our data or content must include appropriate attribution to Utrippin.ai.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">6. Content Quality & Verification</h3>
                    <p><strong>Accuracy Standards:</strong> All content must be accurate, current, and verifiable. False or misleading content may be removed.</p>
                    <p className="mt-3"><strong>Review Authenticity:</strong> Reviews and ratings must be based on genuine experiences and may not be fabricated or incentivized.</p>
                    <p className="mt-3"><strong>Photo Rights:</strong> Users must own rights to photos they upload or have permission from copyright holders.</p>
                    <p className="mt-3"><strong>Content Verification:</strong> We may request verification of content accuracy or ownership rights.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">7. Enforcement & Remedies</h3>
                    <p><strong>Monitoring:</strong> We use automated and manual systems to detect potential intellectual property violations.</p>
                    <p className="mt-3"><strong>Investigation Process:</strong> We investigate reported violations and take appropriate action, which may include content removal or account termination.</p>
                    <p className="mt-3"><strong>Legal Action:</strong> We may pursue legal remedies for serious or repeated intellectual property violations.</p>
                    <p className="mt-3"><strong>Cooperation:</strong> We cooperate with law enforcement and rights holders in investigating and pursuing intellectual property violations.</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-travel-navy mb-4">8. International IP Considerations</h3>
                    <p><strong>Cross-Border Rights:</strong> Intellectual property laws vary by jurisdiction, and we respect applicable laws in the countries where we operate.</p>
                    <p className="mt-3"><strong>Treaty Compliance:</strong> We comply with international intellectual property treaties and agreements.</p>
                    <p className="mt-3"><strong>Local Representation:</strong> In some jurisdictions, we may work with local representatives to address intellectual property matters.</p>
                    <p className="mt-3"><strong>Jurisdictional Challenges:</strong> Users acknowledge that intellectual property enforcement may vary across different legal systems.</p>
                    <p className="mt-3"><strong>Contact Information:</strong> For intellectual property matters, contact us at ip@utrippin.ai or through our designated DMCA agent.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Protection Notices */}
            <section className="bg-gradient-to-r from-red-100 to-yellow-100 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-8 w-8 text-red-600" />
                <h2 className="text-3xl font-bold text-red-800">Additional Safety & Protection Notices</h2>
              </div>
              
              <div className="space-y-6 text-red-800">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Age Verification & Minor Protection</h3>
                  <p>Users must be 18 years or older. We comply with COPPA and do not knowingly collect information from minors. Any accounts discovered to belong to minors will be immediately terminated.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Anti-Discrimination & Equal Opportunity</h3>
                  <p>We prohibit discrimination based on race, gender, religion, nationality, sexual orientation, or other protected characteristics. All users deserve respectful treatment regardless of background.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Emergency Procedures</h3>
                  <p>In case of emergency while using our Travel Buddy system, contact local emergency services immediately. Our platform cannot provide emergency assistance or intervention.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Force Majeure & Travel Disruptions</h3>
                  <p>We are not liable for travel disruptions caused by natural disasters, pandemics, political events, strikes, or other circumstances beyond our control. Travel insurance is strongly recommended.</p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-travel-navy mb-4">Legal Contact Information</h2>
              <div className="space-y-2 text-body">
                <p><strong>General Legal Inquiries:</strong> legal@utrippin.ai</p>
                <p><strong>Privacy Questions:</strong> privacy@utrippin.ai</p>
                <p><strong>Copyright/DMCA:</strong> dmca@utrippin.ai</p>
                <p><strong>Intellectual Property:</strong> ip@utrippin.ai</p>
                <p><strong>Safety Concerns:</strong> safety@utrippin.ai</p>
              </div>
              <p className="text-sm text-gray-600 mt-6">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
        </div>
      </ProductLayout>
    </>
  );
};

export default Legal;
