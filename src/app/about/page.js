import { CheckCircle, Users, Globe, Award, BookOpen, Clock, Shield, Eye } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Fast Publication",
      description: "Streamlined review process with average time from submission to decision of 4-6 weeks"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Rigorous Standards",
      description: "Double-blind peer review ensures quality and fairness in evaluation"
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      title: "Open Access",
      description: "All published content is freely accessible worldwide with DOI registration"
    },
    {
      icon: <Eye className="w-6 h-6 text-orange-600" />,
      title: "Transparent Process",
      description: "Clear guidelines and transparent review process from submission to publication"
    }
  ];

  const policies = [
    { icon: <CheckCircle className="w-5 h-5 text-red-600" />, text: "Zero-tolerance policy on plagiarism and research misconduct" },
    { icon: <CheckCircle className="w-5 h-5 text-blue-600" />, text: "Double-blind peer review process" },
    { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: "DOI registration for each published paper" },
    { icon: <CheckCircle className="w-5 h-5 text-purple-600" />, text: "Immediate open access upon publication" },
    { icon: <CheckCircle className="w-5 h-5 text-orange-600" />, text: "ORCID integration for author identification" },
    { icon: <CheckCircle className="w-5 h-5 text-indigo-600" />, text: "Creative Commons licensing for all content" }
  ];

  const stats = [
    { number: "2,500+", label: "Papers Published" },
    { number: "15,000+", label: "Monthly Readers" },
    { number: "45", label: "Countries Represented" },
    { number: "4.2", label: "Average Impact Factor" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About the Journal
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A premier peer-reviewed, open-access journal dedicated to advancing applied science and engineering research through innovative scholarship and transparent publishing practices.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We are committed to providing a fast, fair, and transparent pathway from submission to publication. Our journal serves as a bridge between cutting-edge research and practical applications, fostering innovation in applied science and engineering.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We believe in democratizing access to scientific knowledge while maintaining the highest standards of academic integrity and peer review excellence.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                  <BookOpen className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Research Areas</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li>• Applied Physics & Materials Science</li>
                    <li>• Engineering Innovation</li>
                    <li>• Computational Methods</li>
                    <li>• Interdisciplinary Applications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Publish With Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine rigorous academic standards with modern publishing practices to ensure your research reaches the widest possible audience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-blue-100 text-lg">Connecting researchers worldwide through open science</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Commitment to Excellence</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {policies.map((policy, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  {policy.icon}
                  <span className="text-gray-700 leading-relaxed">{policy.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Additional Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Aims & Scope", description: "Learn about our research focus areas and submission guidelines" },
                { title: "Ethics & Integrity", description: "Our commitment to research ethics and publication standards" },
                { title: "Peer Review Process", description: "Detailed information about our review methodology" },
                { title: "Copyright Policy", description: "Understanding licensing and author rights" },
                { title: "Publication Fees", description: "Transparent information about costs and waivers" },
                { title: "Author Guidelines", description: "Complete submission and formatting requirements" }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-800">
                    Learn More →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-6 text-blue-300" />
          <h2 className="text-3xl font-bold mb-4">Ready to Submit Your Research?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of researchers who have chosen our journal for their groundbreaking work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Submit Manuscript
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors">
              Contact Editorial Team
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}