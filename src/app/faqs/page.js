'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  FileText, 
  Clock, 
  DollarSign, 
  Award, 
  Shield, 
  Users,
  Search,
  Mail,
  HelpCircle,
  CheckCircle
} from 'lucide-react';

const faqCategories = [
  {
    id: 'submission',
    title: 'Paper Submission',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    faqs: [
      {
        question: 'How do I submit my research paper?',
        answer: 'You can submit your research paper online through our submission portal. First, create an account or login. Then navigate to the "Submit Paper" section, fill in the required details, upload your manuscript in the prescribed format, and submit. You will receive a Paper ID immediately for tracking purposes.'
      },
      {
        question: 'What file formats are accepted for submission?',
        answer: 'We accept manuscripts in Microsoft Word (.doc, .docx) and PDF formats. However, Word format is preferred for the review process. Please ensure your document follows our paper format template available in the downloads section.'
      },
      {
        question: 'Can I submit my paper at any time?',
        answer: 'Yes! Our submission portal is open 24/7, 365 days a year. You can submit your paper at any time that is convenient for you. Our team will acknowledge receipt within 6 hours of submission.'
      },
      {
        question: 'Is there a limit on the number of pages?',
        answer: 'While there is no strict page limit, we recommend keeping your manuscript between 6-12 pages including references, figures, and tables. Papers should be concise and focused on the research contribution.'
      },
      {
        question: 'Can I submit a paper if I am not affiliated with any institution?',
        answer: 'Yes, independent researchers are welcome to submit their work. However, you must provide complete contact information and ensure the research meets our quality standards.'
      }
    ]
  },
  {
    id: 'review',
    title: 'Review Process',
    icon: Clock,
    color: 'from-purple-500 to-purple-600',
    faqs: [
      {
        question: 'How long does the review process take?',
        answer: 'Our peer review process typically takes 24-48 hours. Once your paper is received, it undergoes an initial screening followed by expert peer review. You will be notified of the review decision via email.'
      },
      {
        question: 'What happens after I submit my paper?',
        answer: 'After submission: 1) You receive a Paper ID within minutes. 2) Initial screening within 6 hours. 3) Peer review within 24-48 hours. 4) Decision notification via email. 5) If accepted, you pay publication fees. 6) Paper published within 4 hours after payment.'
      },
      {
        question: 'How can I track my paper status?',
        answer: 'You can track your paper status using the Paper ID provided at submission. Visit the "Track Paper" section, enter your Paper ID, and you will see the current status of your manuscript in the review process.'
      },
      {
        question: 'What are the possible review outcomes?',
        answer: 'Your paper can be: 1) Accepted - ready for publication after fee payment. 2) Minor Revision - requires small changes. 3) Major Revision - significant improvements needed. 4) Rejected - does not meet publication standards.'
      },
      {
        question: 'Can I revise and resubmit a rejected paper?',
        answer: 'Yes, if your paper receives major revisions or is rejected with feedback, you can address the reviewers\' comments and resubmit. Each resubmission is treated as a new submission with a new Paper ID.'
      }
    ]
  },
  {
    id: 'publication',
    title: 'Publication & Fees',
    icon: DollarSign,
    color: 'from-green-500 to-green-600',
    faqs: [
      {
        question: 'What are the publication charges?',
        answer: 'TechnoScholars operates with minimal publication fees to cover processing and hosting costs. Exact fees depend on paper length and processing requirements. Visit our "Publication Fees" page for detailed pricing. We are committed to being a low-cost, accessible journal.'
      },
      {
        question: 'How quickly will my paper be published?',
        answer: 'Once your paper is accepted and you have submitted the publication fee along with the copyright form, your paper will be published within 4 hours! We pride ourselves on our fast publication process.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept multiple payment methods including: Debit Card, Credit Card, Net Banking, Paytm, PhonePe, Google Pay, BHIM, and other UPI apps. Our payment gateway is secure and PCI-DSS compliant.'
      },
      {
        question: 'Will my paper get a DOI?',
        answer: 'Yes! All published papers receive a unique DOI (Digital Object Identifier). This permanent identifier ensures your work can be cited and found easily by researchers worldwide.'
      },
      {
        question: 'Do I receive a publication certificate?',
        answer: 'Yes! Each author receives a free soft copy of the publication certificate. We also provide hard copy certificates for authors who request them.'
      },
      {
        question: 'Is there a discount for multiple authors?',
        answer: 'Publication fees are per paper, not per author. All co-authors on a single paper share one publication fee. We also offer discounts for institutional subscriptions and bulk submissions.'
      }
    ]
  },
  {
    id: 'indexing',
    title: 'Indexing & Impact',
    icon: Award,
    color: 'from-yellow-500 to-orange-600',
    faqs: [
      {
        question: 'Where is TechnoScholars indexed?',
        answer: 'TechnoScholars is indexed in multiple prestigious databases and search engines. This ensures maximum visibility for your research. Visit our "Indexing" page for the complete list of databases where we are indexed.'
      },
      {
        question: 'What is the Impact Factor of this journal?',
        answer: 'TechnoScholars currently has an Impact Factor of 8.187. This reflects the average number of citations received by papers published in our journal, demonstrating the quality and influence of our published research.'
      },
      {
        question: 'Is this an Open Access journal?',
        answer: 'Yes! TechnoScholars is a fully Open Access journal. All published papers are freely available to read, download, and share worldwide. This maximizes the impact and reach of your research.'
      },
      {
        question: 'Can I include my publication in my resume/CV?',
        answer: 'Absolutely! TechnoScholars is a peer-reviewed international journal with ISSN 2582-5208. Publications here are recognized for academic, professional, and career advancement purposes.'
      }
    ]
  },
  {
    id: 'plagiarism',
    title: 'Quality & Ethics',
    icon: Shield,
    color: 'from-red-500 to-pink-600',
    faqs: [
      {
        question: 'How do you check for plagiarism?',
        answer: 'Every submitted manuscript undergoes rigorous plagiarism checking using industry-standard software. Papers with significant plagiarism are rejected immediately. We maintain strict ethical standards following COPE (Committee on Publication Ethics) guidelines.'
      },
      {
        question: 'What is the acceptable similarity index?',
        answer: 'We require papers to have less than 15% similarity index excluding references. Self-plagiarism should be minimal. Papers exceeding this threshold will be asked to revise before consideration.'
      },
      {
        question: 'What are your publication ethics policies?',
        answer: 'We strictly follow COPE guidelines. This includes: zero tolerance for plagiarism, proper citation requirements, disclosure of conflicts of interest, ethical research conduct, and protection of human/animal subjects. Authors must submit a signed copyright form confirming originality.'
      },
      {
        question: 'Can I publish the same paper in another journal?',
        answer: 'No. By submitting to TechnoScholars, you confirm that the work is original and not under consideration elsewhere. Duplicate publication violates copyright and ethical standards and will result in paper retraction.'
      },
      {
        question: 'What if I find an error in my published paper?',
        answer: 'If you discover an error after publication, contact us immediately. Depending on severity: minor errors can be corrected with an erratum, significant errors may require a corrigendum, and serious issues may lead to retraction with explanation.'
      }
    ]
  },
  {
    id: 'authors',
    title: 'Author Guidelines',
    icon: Users,
    color: 'from-indigo-500 to-blue-600',
    faqs: [
      {
        question: 'How many authors can be listed on a paper?',
        answer: 'There is no strict limit on the number of authors. However, all listed authors must have made substantial contributions to the research. Author order should reflect the level of contribution.'
      },
      {
        question: 'Can I change author details after submission?',
        answer: 'Minor corrections (spelling, affiliation) can be made before publication. Major changes (adding/removing authors, changing order) require written consent from all affected parties and must be requested before review completion.'
      },
      {
        question: 'What if I need to withdraw my submission?',
        answer: 'You can withdraw your paper before the review decision by contacting us with your Paper ID. Once accepted and paid for, withdrawal requires valid justification and may affect future submissions.'
      },
      {
        question: 'Do you provide templates for paper formatting?',
        answer: 'Yes! We provide a detailed paper format template (available for download) that includes formatting guidelines, structure requirements, citation style, and examples. Following this template speeds up the review process.'
      },
      {
        question: 'What if I need help with my submission?',
        answer: 'Our 24/7 support team is here to help! You can reach us via email, phone, or our contact form. We assist with technical issues, formatting questions, submission problems, and any other queries.'
      }
    ]
  }
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (categoryId, faqIndex) => {
    const key = `${categoryId}-${faqIndex}`;
    setOpenFAQ(openFAQ === key ? null : key);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    activeCategory === 'all' || category.id === activeCategory
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-green-600 via-green-600 to-green-700 text-white py-16"
      >
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find answers to common questions about publishing with TechnoScholars
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Filter */}
      <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Topics
            </motion.button>
            {faqCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.title}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4">
          {filteredCategories.map((category, catIndex) => (
            category.faqs.length > 0 && (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="mb-12"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                    <p className="text-gray-600 text-sm">{category.faqs.length} questions</p>
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const isOpen = openFAQ === `${category.id}-${faqIndex}`;
                    return (
                      <motion.div
                        key={faqIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: faqIndex * 0.05 }}
                        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-green-500 transition-all"
                      >
                        <button
                          onClick={() => toggleFAQ(category.id, faqIndex)}
                          className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 pr-4">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {faq.question}
                            </h3>
                          </div>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-green-600" />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )
          ))}

          {/* No Results */}
          {filteredCategories.every(cat => cat.faqs.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or browse all categories</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16"
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl text-white/90 mb-8">
            Our support team is available 24/7 to help you with any queries
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Mail className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Email Support</h3>
              <p className="text-sm text-white/80 mb-3">Get help via email</p>
              <a href="mailto:support@technoscholars.com" className="text-sm font-semibold hover:underline">
                support@technoscholars.com
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <HelpCircle className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-sm text-white/80 mb-3">Chat with our team</p>
              <button className="text-sm font-semibold hover:underline">
                Start Chat →
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <CheckCircle className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Submit Ticket</h3>
              <p className="text-sm text-white/80 mb-3">Create a support ticket</p>
              <a href="/contact" className="text-sm font-semibold hover:underline">
                Contact Us →
              </a>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Contact Support Team
          </motion.a>
        </div>
      </motion.section>
    </main>
  );
}