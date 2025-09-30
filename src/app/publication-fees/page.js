import { Check, FileText, Globe, Users, Award, Download } from 'lucide-react';

export default function PublicationFeesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pay Publication Fees for All Authors
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg mb-3">
            <span className="bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
              ₹599 for Indian Authors
            </span>
            <span className="hidden md:inline">|</span>
            <span className="bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
              $23 for Foreign Authors
            </span>
          </div>
          <p className="text-emerald-100 text-lg">
            Journal also provides DOI
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-emerald-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-emerald-600" size={28} />
            Paper Publication or Processing Charges
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">International Research Journal of Modernization in Engineering Technology & Science (IRJMETS)</span> is an Open Access journal. IRJMETS allows its readers to access published articles free of cost and encourages global knowledge sharing.
          </p>
          <p className="text-gray-700 leading-relaxed">
            However, to sustain peer review, administrative efforts, formatting, DOI generation, site maintenance, and global indexing, we rely on a nominal <span className="font-semibold text-emerald-600">Article Processing Fee</span>.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-white/10 backdrop-blur-sm text-white text-center py-6">
            <h2 className="text-3xl font-bold mb-2">Pay for Research Paper</h2>
            <div className="text-5xl font-bold mb-2">₹599 / $23</div>
            <p className="text-emerald-100">per research paper</p>
          </div>

          <div className="bg-white p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Pricing Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 rounded-full p-1 mt-1">
                    <Check className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">₹599 for Indian Authors</p>
                    <p className="text-sm text-gray-600">(₹709 with DOI)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 rounded-full p-1 mt-1">
                    <Check className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">$23 for Foreign Authors</p>
                    <p className="text-sm text-gray-600">($27 with DOI)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 rounded-full p-1 mt-1">
                    <Globe className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Online Publication</p>
                    <p className="text-sm text-gray-600">of research paper</p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 rounded-full p-1 mt-1">
                    <Users className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Up to 8 Authors</p>
                    <p className="text-sm text-gray-600">per paper</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 rounded-full p-1 mt-1">
                    <FileText className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Maximum 25 Pages</p>
                    <p className="text-sm text-gray-600">per submission</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 rounded-full p-1 mt-1">
                    <Download className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Free Soft Copy</p>
                    <p className="text-sm text-gray-600">of paper & certificates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
              Click Here to Pay
            </button>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Award className="text-emerald-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Open Access</h3>
            <p className="text-gray-600 text-sm">Free access to published articles for global knowledge sharing</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Globe className="text-emerald-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Global Indexing</h3>
            <p className="text-gray-600 text-sm">Your research indexed in major international databases</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-emerald-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">DOI Included</h3>
            <p className="text-gray-600 text-sm">Digital Object Identifier for permanent citation</p>
          </div>
        </div>
      </div>
    </div>
  );
}