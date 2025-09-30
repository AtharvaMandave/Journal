import React from 'react';
import Link from 'next/link';

const CallForPaper = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white mt-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Call for Paper</h1>
        <div className="w-full h-px bg-gray-300"></div>
      </div>

      {/* Content Grid */}
      <div className="space-y-6 mb-12">
        {/* Submission Last Date */}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <div className="text-lg text-gray-600">
            Submission Last Date
          </div>
          <div className="text-lg font-semibold text-gray-800">
            30 Sep 2025
          </div>
        </div>

        {/* Review Status */}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <div className="text-lg text-gray-600">
            Review Status
          </div>
          <div className="text-lg font-semibold text-gray-800">
            24 hrs to 48 hrs
          </div>
        </div>

        {/* Paper Publication */}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <div className="text-lg text-gray-600">
            Paper Publication
          </div>
          <div className="text-lg font-semibold text-gray-800">
            4 hrs
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
       <Link href='/submit'> <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-lg">
          Submit Your Paper Now
        </button></Link>
      </div>
    </div>
  );
};

export default CallForPaper;