import { Upload, Mail, Search, Users, FileCheck, RefreshCw, CheckCircle, XCircle, AlertTriangle, Clock, Shield, Scale, Award, ArrowRight, Eye, UserCheck } from 'lucide-react';

export default function PeerReviewProcess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md p-4 rounded-2xl mb-6 shadow-xl">
              <FileCheck className="w-12 h-12" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Peer Review Process</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              A transparent, rigorous, and fair double-blind peer review system ensuring the highest quality of published research
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Process Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Submission to Publication Journey</h2>
          
          <div className="space-y-6">
            <ProcessStep
              number="1"
              icon={<Upload className="w-6 h-6" />}
              title="Paper Submission"
              color="blue"
            >
              <StepDetail icon={<ArrowRight size={16} />}>
                Submit your paper online at <a href="https://irjmets.com/register.php" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold underline">irjmets.com/register</a>
              </StepDetail>
              <StepDetail icon={<Mail size={16} />}>
                Receive your unique <strong>Paper ID</strong> immediately after submission
              </StepDetail>
              <StepDetail icon={<Clock size={16} />}>
                Track your paper&apos;s progress using the Paper ID through email updates
              </StepDetail>
            </ProcessStep>

            <ProcessStep
              number="2"
              icon={<Search className="w-6 h-6" />}
              title="Editorial Board Screening"
              color="purple"
            >
              <StepDetail icon={<FileCheck size={16} />}>
                <strong>Plagiarism Check:</strong> All submissions are screened for originality and proper citations
              </StepDetail>
              <StepDetail icon={<FileCheck size={16} />}>
                <strong>Format Verification:</strong> Ensuring compliance with journal guidelines and required sections
              </StepDetail>
              <StepDetail icon={<Eye size={16} />}>
                <strong>Scope Assessment:</strong> Editor-in-Chief verifies alignment with IRJMETS focus and scope
              </StepDetail>
              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700">
                  <AlertTriangle className="inline w-4 h-4 text-purple-600 mr-1" />
                  Papers not meeting basic requirements will be returned for amendments or rejected without further review
                </p>
              </div>
            </ProcessStep>

            <ProcessStep
              number="3"
              icon={<Users className="w-6 h-6" />}
              title="Reviewer Assignment & Double-Blind Review"
              color="indigo"
            >
              <StepDetail icon={<UserCheck size={16} />}>
                Manuscript assigned to a <strong>Reviewer with relevant expertise</strong>
              </StepDetail>
              <StepDetail icon={<Users size={16} />}>
                Paper sent to <strong>two independent experts</strong> in the field (reviewers unknown to each other)
              </StepDetail>
              <StepDetail icon={<Eye size={16} />}>
                <strong>Double-blind process:</strong> Author and reviewer identities remain confidential
              </StepDetail>
              <StepDetail icon={<FileCheck size={16} />}>
                Reviewers evaluate multiple aspects and provide detailed recommendations
              </StepDetail>
            </ProcessStep>

            <ProcessStep
              number="4"
              icon={<Scale className="w-6 h-6" />}
              title="Review & Decision"
              color="green"
            >
              <div className="space-y-3">
                <p className="text-gray-700 font-medium mb-3">Reviewers assess manuscripts based on:</p>
                <EvaluationCriteria 
                  icon={<Award className="w-5 h-5 text-yellow-500" />}
                  title="Innovation"
                  description="Originality, new evidence, and contribution to knowledge"
                />
                <EvaluationCriteria 
                  icon={<CheckCircle className="w-5 h-5 text-blue-500" />}
                  title="Quality"
                  description="Clarity, logic, language, thoroughness, and layout"
                />
                <EvaluationCriteria 
                  icon={<Users className="w-5 h-5 text-purple-500" />}
                  title="Relevance"
                  description="Reader interest, applicability, topic importance, and impact"
                />
              </div>
            </ProcessStep>
          </div>
        </div>

        {/* Decision Outcomes */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-12 border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Possible Review Outcomes</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <DecisionCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Accept"
              description="Manuscript satisfies all publication parameters and is worthy of publication"
              color="green"
            />
            <DecisionCard
              icon={<RefreshCw className="w-6 h-6" />}
              title="Minor/Major Revisions"
              description="Further revision required to satisfy all publication parameters"
              color="blue"
            />
            <DecisionCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Reject & Resubmission Suggested"
              description="Substantial revision required to address key shortcomings"
              color="orange"
            />
            <DecisionCard
              icon={<XCircle className="w-6 h-6" />}
              title="Reject"
              description="Manuscript fails key parameters; unlikely that revisions can address shortcomings"
              color="red"
            />
          </div>
        </div>

        {/* Communication & Next Steps */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <InfoCard
            icon={<Mail className="w-6 h-6" />}
            title="Decision Communication"
            color="indigo"
          >
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                <span>All decisions confirmed by Editor-in-Chief before notification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                <span>Decision email sent with anonymized reviewer comments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                <span>All feedback provided in confidential, anonymous form</span>
              </li>
            </ul>
          </InfoCard>

          <InfoCard
            icon={<RefreshCw className="w-6 h-6" />}
            title="Revision Stage"
            color="purple"
          >
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                <span>Manuscripts requiring revision returned to authors</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                <span>Detailed reviewer feedback provided for improvements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                <span>Authors can resubmit after addressing comments</span>
              </li>
            </ul>
          </InfoCard>
        </div>

        {/* Final Publication */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-3xl p-8 md:p-10 mb-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold">Final Steps & Publication</h3>
          </div>
          
          <div className="space-y-4">
            <PublicationStep number="1">
              Accepted papers receive confirmation email from IRJMETS
            </PublicationStep>
            <PublicationStep number="2">
              Authors submit the Copyright Form for processing
            </PublicationStep>
            <PublicationStep number="3">
              Article published online under <strong>CC-BY-NC-ND license</strong> within 4 hours
            </PublicationStep>
            <PublicationStep number="4">
              Published article and <strong>Publication Certificate</strong> emailed to authors
            </PublicationStep>
          </div>

          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-green-100">
              <Clock className="inline w-5 h-5 mr-2" />
              We ensure rapid and accurate publication to disseminate your research quickly
            </p>
          </div>
        </div>

        {/* Fair Play Policy */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Fair Play Policy</h3>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Editors evaluate manuscripts for their <strong>intellectual content only</strong>, without regard to:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <FairPlayItem>Race</FairPlayItem>
              <FairPlayItem>Gender</FairPlayItem>
              <FairPlayItem>Sexual Orientation</FairPlayItem>
              <FairPlayItem>Religious Belief</FairPlayItem>
              <FairPlayItem>Ethnic Origin</FairPlayItem>
              <FairPlayItem>Citizenship</FairPlayItem>
              <FairPlayItem>Political Philosophy</FairPlayItem>
              <FairPlayItem>Personal Characteristics</FairPlayItem>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-gray-800 font-medium">
                <CheckCircle className="inline w-5 h-5 text-blue-600 mr-2" />
                Decisions based solely on: <strong>importance, originality, clarity, and relevance to journal aims</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright & Author Rights */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Scale className="w-6 h-6 text-indigo-600" />
              Author Rights
            </h3>
            <ul className="space-y-3">
              <RightItem>Reuse ideas or data in future research</RightItem>
              <RightItem>Reproduce copies for teaching purposes</RightItem>
              <RightItem>Use published version in presentations</RightItem>
              <RightItem>Grant permission for figure/table reuse</RightItem>
              <RightItem>Retain ownership of copyright</RightItem>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              Journal Rights
            </h3>
            <ul className="space-y-3">
              <RightItem>Reproduce and distribute the work</RightItem>
              <RightItem>Edit and translate as needed</RightItem>
              <RightItem>Create derivative works</RightItem>
              <RightItem>Make available in all media formats</RightItem>
              <RightItem>Enforce copyright on author&apos;s behalf</RightItem>
            </ul>
          </div>
        </div>

        {/* Author Warranties */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Author Warranties & Responsibilities</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <WarrantyCard icon={<CheckCircle className="w-5 h-5" />}>
              Guarantee of <strong>original work</strong>
            </WarrantyCard>
            <WarrantyCard icon={<CheckCircle className="w-5 h-5" />}>
              Not previously published elsewhere
            </WarrantyCard>
            <WarrantyCard icon={<CheckCircle className="w-5 h-5" />}>
              Not under consideration at other journals
            </WarrantyCard>
            <WarrantyCard icon={<CheckCircle className="w-5 h-5" />}>
              All third-party material properly cited
            </WarrantyCard>
            <WarrantyCard icon={<CheckCircle className="w-5 h-5" />}>
              Permissions obtained for borrowed content
            </WarrantyCard>
            <WarrantyCard icon={<CheckCircle className="w-5 h-5" />}>
              No plagiarized content included
            </WarrantyCard>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
            <p className="text-gray-800 font-semibold flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Authors are responsible for any rewritten content or changed titles from other published papers</span>
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-10 shadow-2xl text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Need More Information?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Our editorial team is here to assist you throughout the submission and review process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:editor@irjmets.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              <Mail className="w-5 h-5" />
              editor@irjmets.com
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors border-2 border-white/20"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({ number, icon, title, color, children }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 border-blue-200',
    purple: 'from-purple-500 to-purple-600 border-purple-200',
    indigo: 'from-indigo-500 to-indigo-600 border-indigo-200',
    green: 'from-green-500 to-green-600 border-green-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-r ${colorClasses[color]} text-white px-6 py-4 flex items-center gap-4`}>
        <div className="bg-white/90 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
          {number}
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className="p-6 space-y-3">
        {children}
      </div>
    </div>
  );
}

function StepDetail({ icon, children }) {
  return (
    <div className="flex items-start gap-3 text-gray-700">
      <div className="text-indigo-600 mt-1 flex-shrink-0">
        {icon}
      </div>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

function EvaluationCriteria({ icon, title, description }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h4 className="font-bold text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 ml-8">{description}</p>
    </div>
  );
}

function DecisionCard({ icon, title, description, color }) {
  const colorClasses = {
    green: 'from-green-50 to-emerald-50 border-green-300 text-green-700',
    blue: 'from-blue-50 to-cyan-50 border-blue-300 text-blue-700',
    orange: 'from-orange-50 to-amber-50 border-orange-300 text-orange-700',
    red: 'from-red-50 to-rose-50 border-red-300 text-red-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border-2 rounded-xl p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h4 className="font-bold text-lg">{title}</h4>
      </div>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}

function InfoCard({ icon, title, color, children }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${colorClasses[color]} text-white px-6 py-4 flex items-center gap-3`}>
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function PublicationStep({ number, children }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-white/20 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
        {number}
      </div>
      <p className="text-green-50 leading-relaxed pt-1">{children}</p>
    </div>
  );
}

function FairPlayItem({ children }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
      <span className="text-gray-700 font-medium">{children}</span>
    </div>
  );
}

function RightItem({ children }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
      <span className="text-gray-700">{children}</span>
    </li>
  );
}

function WarrantyCard({ icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="text-green-600 flex-shrink-0">{icon}</div>
      <span className="text-gray-700">{children}</span>
    </div>
  );
}