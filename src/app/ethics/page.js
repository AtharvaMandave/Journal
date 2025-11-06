import { Shield, Users, FileCheck, AlertCircle, BookOpen, Scale, Lock, CheckCircle } from 'lucide-react';

export default function PublicationEthics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">Publication Ethics & Malpractice Statement</h1>
          </div>
          <p className="text-green-100 text-lg max-w-3xl mt-4">
            IRJMETS Journal upholds the highest standards of publication ethics and is committed to preventing publication malpractices. Our guidelines align with COPE Principles and Best Practice Standards.
          </p>
          <a 
            href="https://publicationethics.org" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
          >
            <BookOpen size={20} />
            Learn More at COPE
          </a>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <p className="text-gray-700 leading-relaxed text-lg">
            Publication ethics is essential for improving research quality worldwide. This document outlines standards for editors, authors, and reviewers. Publishers support timely publication without interfering with content integrity.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 space-y-8">
        
        {/* Editorial Responsibilities */}
        <Section
          icon={<Users className="w-6 h-6" />}
          title="Editorial Responsibilities"
          color="blue"
        >
          <ResponsibilityItem number="1">
            Editors&apos; decisions to accept or reject manuscripts should be based on <strong>importance, originality, clarity, and relevance</strong>. Manuscripts must be processed in a timely manner.
          </ResponsibilityItem>
          <ResponsibilityItem number="2">
            Editors must ensure appropriate reviewers are selected—individuals with relevant expertise, capable of critical evaluation, and free from competing interests.
          </ResponsibilityItem>
          <ResponsibilityItem number="3">
            All manuscripts received for review must be treated as <strong>confidential documents</strong> and not shared without authorization.
          </ResponsibilityItem>
          <ResponsibilityItem number="4">
            The editor is responsible for deciding which articles submitted to the journal should be published.
          </ResponsibilityItem>
          <ResponsibilityItem number="5">
            Editors may be guided by editorial board policies and constrained by legal requirements regarding copyright infringement and plagiarism.
          </ResponsibilityItem>
          <ResponsibilityItem number="6">
            Editors should have no potential conflicts of interest regarding manuscripts (research, authors, or funders).
          </ResponsibilityItem>
          <ResponsibilityItem number="7">
            Editors and editorial staff must not reveal reviewer identities before or after publication.
          </ResponsibilityItem>
        </Section>

        {/* Reviewer Duties */}
        <Section
          icon={<FileCheck className="w-6 h-6" />}
          title="Duties & Responsibilities of Reviewers"
          color="purple"
        >
          <ResponsibilityItem number="1">
            Peer review assists editors in making decisions and helps authors improve their papers through constructive feedback.
          </ResponsibilityItem>
          <ResponsibilityItem number="2">
            Peer review is essential to scholarly communication. Authors contributing to publications have an obligation to perform their fair share of reviewing.
          </ResponsibilityItem>
          <ResponsibilityItem number="3">
            Reviewers must comment on ethical questions and potential research or publication misconduct.
          </ResponsibilityItem>
          <ResponsibilityItem number="4">
            Reviews must be completed in a timely manner. Reviewers should notify editors immediately if unable to complete the work.
          </ResponsibilityItem>
          <ResponsibilityItem number="5">
            Reviewers must maintain <strong>strict confidentiality</strong> of manuscript content.
          </ResponsibilityItem>
          <ResponsibilityItem number="6">
            Privileged information obtained through peer review must be kept confidential and not used for personal advantage.
          </ResponsibilityItem>
          <ResponsibilityItem number="7">
            Reviews should be conducted objectively. Personal criticism is inappropriate. Views should be expressed clearly with supporting arguments.
          </ResponsibilityItem>
          <ResponsibilityItem number="8">
            Reviewers should identify relevant published work not cited by authors and ensure proper citations are included.
          </ResponsibilityItem>
          <ResponsibilityItem number="9">
            Reviewers must alert editors to any substantial similarity or overlap with other published papers they know of.
          </ResponsibilityItem>
          <ResponsibilityItem number="10">
            Reviewers who feel unqualified or cannot complete timely reviews should notify the editor and excuse themselves.
          </ResponsibilityItem>
        </Section>

        {/* Author Responsibilities */}
        <Section
          icon={<Scale className="w-6 h-6" />}
          title="Author Responsibilities"
          color="green"
        >
          <ResponsibilityItem number="1">
            Research must be conducted ethically and responsibly, complying with all relevant legislation.
          </ResponsibilityItem>
          <ResponsibilityItem number="2">
            Results must be presented <strong>clearly, honestly, and without fabrication, falsification, or inappropriate data manipulation</strong>.
          </ResponsibilityItem>
          <ResponsibilityItem number="3">
            Corresponding authors must ensure appropriate co-authors are included, all have approved the final version, and agreed to submission.
          </ResponsibilityItem>
          <ResponsibilityItem number="4">
            Authorship should be limited to those who made significant contributions to conception, design, execution, or interpretation.
          </ResponsibilityItem>
          <ResponsibilityItem number="5">
            All individuals making significant contributions should be listed as co-authors.
          </ResponsibilityItem>
          <ResponsibilityItem number="6">
            Authors must not engage in <strong>plagiarism or self-plagiarism</strong>.
          </ResponsibilityItem>
          <ResponsibilityItem number="7">
            Authors must agree to the open access policy enabling unrestricted access and reuse of published articles.
          </ResponsibilityItem>
          <ResponsibilityItem number="8">
            Papers must contain sufficient detail and references to permit replication. Fraudulent or inaccurate statements are unacceptable.
          </ResponsibilityItem>
          <ResponsibilityItem number="9">
            Authors may be asked to provide raw data for editorial review and should retain data for a reasonable time after publication.
          </ResponsibilityItem>
          <ResponsibilityItem number="10">
            Authors must ensure entirely original work, with proper citation or quotation of others&apos; work and words.
          </ResponsibilityItem>
          <ResponsibilityItem number="11">
            Authors should not publish the same research in multiple journals. Concurrent submission constitutes unethical behavior.
          </ResponsibilityItem>
          <ResponsibilityItem number="12">
            Upon discovering significant errors in published work, authors must promptly notify the editor and cooperate to retract or correct the paper.
          </ResponsibilityItem>
        </Section>

        {/* Special Topics Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Misconduct */}
          <HighlightBox
            icon={<AlertCircle className="w-6 h-6" />}
            title="Dealing with Potential Misconduct"
            color="red"
          >
            <p className="text-gray-700 mb-4">
              Editors have a duty to take action on suspected or reported misconduct in both published and unpublished papers.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Seek response from those suspected of misconduct</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Request institutional investigation if needed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Ensure proper investigation is conducted</span>
              </li>
            </ul>
          </HighlightBox>

          {/* Plagiarism */}
          <HighlightBox
            icon={<Lock className="w-6 h-6" />}
            title="Plagiarism Policy"
            color="orange"
          >
            <p className="text-gray-700 mb-4">
              All submissions are checked for plagiarism. Authors declare their work is original, but ultimate responsibility lies with them.
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <p className="text-sm text-gray-700 font-medium">
                Plagiarism occurs when authors use others&apos; work without permission, credit, or acknowledgment. Always credit sources and place your work in context.
              </p>
            </div>
          </HighlightBox>

          {/* Ethical Oversight */}
          <HighlightBox
            icon={<Shield className="w-6 h-6" />}
            title="Ethical Oversight"
            color="indigo"
          >
            <p className="text-gray-700 mb-3">
              Research involving chemicals, humans, animals, or hazardous equipment must be clearly identified in manuscripts.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <span>Provide ethical clearance when required</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <span>Justify confidential data handling</span>
              </li>
            </ul>
          </HighlightBox>

          {/* Disclaimer */}
          <HighlightBox
            icon={<AlertCircle className="w-6 h-6" />}
            title="Disclaimer"
            color="gray"
          >
            <p className="text-gray-700 text-sm leading-relaxed">
              The Editorial Board makes every effort to ensure accuracy of all content. However, we make no warranties regarding accuracy, completeness, or suitability. Views expressed are those of the authors, not necessarily the editors.
            </p>
          </HighlightBox>
        </div>

        {/* Commitment Statement */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Our Commitment</h3>
              <p className="text-green-50 leading-relaxed">
                Editors and reviewers ensure all submitted articles are original studies not submitted elsewhere. Manuscripts receive fair, objective review with timely feedback based on reviewer availability and expertise. We are committed to maintaining the highest standards of academic integrity and ethical publishing practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, color, children }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 border-blue-200',
    purple: 'from-purple-500 to-purple-600 border-purple-200',
    green: 'from-green-500 to-green-600 border-green-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className={`bg-gradient-to-r ${colorClasses[color]} text-white px-6 py-4 flex items-center gap-3`}>
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );
}

function ResponsibilityItem({ number, children }) {
  return (
    <div className="flex gap-4 group hover:bg-gray-50 p-4 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
          {number}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed pt-1">{children}</p>
    </div>
  );
}

function HighlightBox({ icon, title, color, children }) {
  const colorClasses = {
    red: 'border-red-200 bg-red-50/50',
    orange: 'border-orange-200 bg-orange-50/50',
    indigo: 'border-indigo-200 bg-indigo-50/50',
    gray: 'border-gray-200 bg-gray-50/50',
  };

  const iconColorClasses = {
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className={`rounded-xl border-2 ${colorClasses[color]} p-6 shadow-md`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`${iconColorClasses[color]} p-2 rounded-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}