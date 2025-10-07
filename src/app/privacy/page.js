import { Shield, Lock, Eye, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Eye,
      title: "Information Collection",
      content: "The personal information we collect depends on how you use the IRJMETS Site. We collect certain non-personally identifiable information, such as the type of operating system, browser type, and the domain name of your Internet Service Provider. Personally identifiable information may be collected through contact information you send to us."
    },
    {
      icon: FileText,
      title: "Use of Information",
      content: "IRJMETS uses personal information in ways that are compatible with the purposes for which it was intended: to enable your use of the Site, to respond to your inquiries, for system administration, troubleshooting, customer support, and to improve the design of the Site and journal."
    },
    {
      icon: Shield,
      title: "Information Sharing",
      content: "IRJMETS does not share, rent, or sell personal information with other people or organizations except to provide products or services you've requested, when we have your permission, or as required by law to prevent fraud, illegal activities, or situations involving potential threats to physical safety."
    },
    {
      icon: AlertCircle,
      title: "External Links",
      content: "IRJMETS contains external links to other websites and organizations. We do not control the use of information or data collection on external websites. We encourage you to read their terms, conditions, and privacy policies. This privacy policy governs only IRJMETS."
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "Access Control",
      description: "Only authorized personnel who need to access Personal Data can do so."
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "All Personal Data is stored in a secure computing environment protected by high security systems and firewalls."
    },
    {
      icon: CheckCircle,
      title: "SSL Encryption",
      description: "We use Secure Sockets Layer (SSL) protocol with 256-bit RSA encryption to protect data in transit."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 mr-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-center text-blue-100 max-w-2xl mx-auto">
            IRJMETS is committed to protecting the privacy of visitors, users, and authors
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <p className="text-gray-700 leading-relaxed">
            We have adopted the following guidelines to ensure user privacy. IRJMETS reserves the right to change these guidelines as required. Any changes will be posted on the website. Users might not receive direct communication regarding policy changes.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4 flex-shrink-0">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Security Measures</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              IRJMETS is committed to ensuring that your personal information is safe. We have implemented suitable electronic, physical, and managerial procedures to safeguard and secure the personal information we collect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                <feature.icon className="w-10 h-10 mb-4 text-blue-200" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Policy Updates
              </h3>
              <p className="text-amber-800 leading-relaxed">
                This privacy policy is subject to change. We recommend reviewing this page periodically to stay informed about how we protect your information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} IRJMETS. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}