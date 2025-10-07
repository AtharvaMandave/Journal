import { Sparkles, Users, Target, Globe, Award, BookOpen, TrendingUp, MessageCircle, CheckCircle, Lightbulb, Rocket } from 'lucide-react';

export default function EditorMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Editor Badge */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl mb-6 shadow-2xl">
              <MessageCircle className="w-12 h-12" />
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Message from the Editor</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mb-6"></div>
            <p className="text-xl text-blue-100 max-w-3xl">
              Welcome to IRJMETS - Where Innovation Meets Excellence in Academic Publishing
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Opening Statement */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full blur-3xl -z-0 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Invitation to Excellence</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                IRJMETS invites <span className="font-semibold text-indigo-600">review papers, research articles, technical reports, and scientific manuscripts</span> from authors across all domains of engineering, technology, science, environmental science, management, business, medical science, and beyond.
              </p>
              
              <p className="text-gray-700 leading-relaxed text-lg">
                All submitted papers undergo a rigorous <span className="font-semibold text-indigo-600">peer review process</span>, ensuring the highest standards of quality and integrity. We welcome experimental, numerical, theoretical, and interpretative research that pushes the boundaries of knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Our Mission */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>
            <p className="text-indigo-100 leading-relaxed">
              To create a dynamic forum for the exchange of groundbreaking ideas and information on all aspects of research, engineering, technology, and science, fostering collaboration and innovation across disciplines.
            </p>
          </div>

          {/* Our Commitment */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Our Commitment</h3>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Superior quality editorial, reviewer, and support services powered by a talented, professional team both on-ground and offshore, dedicated to excellence in academic publishing.
            </p>
          </div>
        </div>

        {/* What We Publish */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">What We Publish</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PublicationType icon={<CheckCircle className="w-5 h-5" />} title="Original Papers" />
            <PublicationType icon={<CheckCircle className="w-5 h-5" />} title="Review Papers" />
            <PublicationType icon={<CheckCircle className="w-5 h-5" />} title="Research Articles" />
            <PublicationType icon={<CheckCircle className="w-5 h-5" />} title="Technical Notes" />
            <PublicationType icon={<CheckCircle className="w-5 h-5" />} title="Thesis Work" />
            <PublicationType icon={<CheckCircle className="w-5 h-5" />} title="Case Studies" />
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-gray-700 text-center">
              <span className="font-semibold text-green-700">All publications</span> must include significant analysis results and demonstrate technical rigor in their respective fields.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Raising Standards"
            description="A key factor in elevating the standards of discussion, evaluation, and analyses in engineering, science, and technology."
            color="purple"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Global Platform"
            description="Connecting professionals, engineers, students, researchers, and academicians from around the world."
            color="blue"
          />
          <FeatureCard
            icon={<Lightbulb className="w-6 h-6" />}
            title="Knowledge Sharing"
            description="A collaborative space for sharing expertise across engineering, science, management, and industrial disciplines."
            color="amber"
          />
        </div>

        {/* Who We Serve */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 md:p-10 mb-12 border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-slate-700 to-gray-800 p-3 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Our Community</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CommunityTag>Professionals</CommunityTag>
            <CommunityTag>Engineers</CommunityTag>
            <CommunityTag>Students</CommunityTag>
            <CommunityTag>Researchers</CommunityTag>
            <CommunityTag>Academicians</CommunityTag>
            <CommunityTag>Practitioners</CommunityTag>
            <CommunityTag>Scientists</CommunityTag>
            <CommunityTag>Innovators</CommunityTag>
          </div>
        </div>

        {/* Research Areas */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-xl shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Research Areas We Cover</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResearchArea>Engineering</ResearchArea>
            <ResearchArea>Technology</ResearchArea>
            <ResearchArea>Science</ResearchArea>
            <ResearchArea>Environmental Science</ResearchArea>
            <ResearchArea>Management</ResearchArea>
            <ResearchArea>Business Studies</ResearchArea>
            <ResearchArea>Medical Science</ResearchArea>
            <ResearchArea>Industrial Organization</ResearchArea>
            <ResearchArea>All Related Disciplines</ResearchArea>
          </div>
        </div>

        {/* Closing Statement with Signature */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="max-w-4xl">
              <p className="text-xl leading-relaxed mb-8 text-blue-50">
                We invite you to be part of this vibrant academic community where your research contributes to advancing knowledge and driving innovation across the globe. Join us in our mission to create a world-class platform for scholarly excellence.
              </p>
              
              <div className="border-t border-white/20 pt-6">
                <p className="text-2xl font-bold mb-2">Warm Regards,</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Editor-in-Chief
                </p>
                <p className="text-lg text-blue-200 mt-2">IRJMETS - International Research Journal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a 
              href="/submit" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Rocket className="w-5 h-5" />
              Submit Your Research
            </a>
            <a 
              href="/about" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-indigo-200"
            >
              <BookOpen className="w-5 h-5" />
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicationType({ icon, title }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
      <div className="text-green-600 flex-shrink-0">{icon}</div>
      <span className="font-semibold text-gray-800">{title}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600 border-purple-200',
    blue: 'from-blue-500 to-blue-600 border-blue-200',
    amber: 'from-amber-500 to-amber-600 border-amber-200',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className={`bg-gradient-to-br ${colorClasses[color]} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function CommunityTag({ children }) {
  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 text-center font-semibold text-gray-700 hover:shadow-md hover:scale-105 transition-all">
      {children}
    </div>
  );
}

function ResearchArea({ children }) {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 px-4 py-3 rounded-lg border border-rose-200 text-center font-medium text-gray-700 hover:shadow-md hover:scale-105 transition-all">
      {children}
    </div>
  );
}