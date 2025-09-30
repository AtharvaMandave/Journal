'use client'
import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, XCircle, FileText, Award, Globe } from 'lucide-react';
import Link from 'next/link';

const PublicationProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 1,
      title: "PRELIMINARY REVIEW",
      subtitle: "(QUALITY, PLAGIARISM & GRAMMATICAL MISTAKE CHECK)",
      color: "from-slate-500 to-slate-600",
      icon: FileText,
      description: "Initial quality assessment and plagiarism detection"
    },
    {
      id: 2,
      title: "COPIED OR PLAGIARIZED",
      subtitle: "(REJECTED)",
      color: "from-red-500 to-red-600",
      icon: XCircle,
      description: "Papers with plagiarism issues are rejected"
    },
    {
      id: 3,
      title: "ORIGINAL",
      subtitle: "(ACCEPT FOR REVIEW AND PAPER ID ASSIGNMENT)",
      color: "from-emerald-500 to-emerald-600",
      icon: CheckCircle,
      description: "Original papers proceed to peer review"
    },
    {
      id: 4,
      title: "EDITORIAL BOARD",
      subtitle: "(COMMENT ON ARTICLE) ACCEPTED / REJECTED / ANY CHANGES",
      color: "from-green-600 to-green-700",
      icon: FileText,
      description: "Expert review and editorial decisions"
    },
    {
      id: 5,
      title: "FINAL DECISION NOTIFICATION",
      subtitle: "SENT TO AUTHOR",
      color: "from-amber-500 to-amber-600",
      icon: Award,
      description: "Authors receive final publication decision"
    },
    {
      id: 6,
      title: "COPYRIGHT FORM SUBMITTED",
      subtitle: "BY AUTHOR WITH PUBLICATION FEES",
      color: "from-gray-700 to-gray-800",
      icon: FileText,
      description: "Legal formalities and fee processing"
    },
    {
      id: 7,
      title: "FINAL PAPER SENT TO AUTHOR",
      subtitle: "WITH CERTIFICATES",
      color: "from-pink-500 to-pink-600",
      icon: Award,
      description: "Publication certificates and final paper delivery"
    },
    {
      id: 8,
      title: "ARTICLE PUBLISHED ONLINE",
      subtitle: "AND OPEN ACCESS TO ALL",
      color: "from-green-500 to-green-600",
      icon: Globe,
      description: "Global accessibility and online publication"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            PUBLICATION PROCESS
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            Follow our streamlined publication journey from submission to global accessibility
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
          {/* Connecting Lines */}
          <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;
            
            return (
              <div
                key={step.id}
                className={`relative flex items-center mb-8 transform transition-all duration-700 ${
                  isVisible ? 'translate-x-0 opacity-100' : index % 2 === 0 ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Step Number Circle */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 bg-white flex items-center justify-center z-10 transition-all duration-500 ${
                  isActive ? 'border-blue-500 shadow-lg scale-110' : 
                  isCompleted ? 'border-green-500' : 'border-gray-300'
                }`}>
                  <span className={`font-bold text-sm ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.id}
                  </span>
                </div>

                {/* Content Card */}
                <div className={`${index % 2 === 0 ? 'pr-8 mr-6 flex-row-reverse' : 'pl-8 ml-6'} flex items-center w-full`}>
                  <div className={`bg-white rounded-2xl shadow-lg p-6 max-w-md transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                    isActive ? 'shadow-2xl border-2 border-blue-200' : ''
                  }`}>
                    {/* Icon and Gradient Bar */}
                    <div className={`h-2 bg-gradient-to-r ${step.color} rounded-full mb-4`}></div>
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mr-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {step.subtitle}
                    </p>
                    
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Animated Progress Bar */}
                    {isActive && (
                      <div className="mt-3 bg-gray-200 rounded-full h-1">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connecting Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-16 z-0">
                    <ChevronDown className={`w-6 h-6 transition-colors duration-500 ${
                      isCompleted ? 'text-green-400' : 'text-gray-300'
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Publication Journey?</h3>
            <p className="mb-6 opacity-90">Join thousands of researchers who have successfully published with us</p>
           <Link href='/submit'> <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Submit Your Paper Now
            </button></Link>
          </div>
        </div>

        {/* Statistics */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { label: "Average Review Time", value: "24-48 hrs", color: "from-blue-500 to-blue-600" },
            { label: "Publication Speed", value: "4 hrs", color: "from-purple-500 to-purple-600" },
            { label: "Success Rate", value: "95%", color: "from-green-500 to-green-600" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className={`w-full h-1 bg-gradient-to-r ${stat.color} rounded-full mb-4`}></div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h4>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicationProcess;