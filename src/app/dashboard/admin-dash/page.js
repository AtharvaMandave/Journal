'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const PaperDecisionInterface = () => {
  const { data: session, status } = useSession();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState('');

  // Check if user is admin
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    // Fetch papers (you'll need to implement this endpoint)
    fetchPapers();
  }, [session, status, isAdmin]);

  const fetchPapers = async () => {
    try {
      // Replace with your actual papers endpoint
      const response = await fetch('/api/papers');
      if (response.ok) {
        const data = await response.json();
        setPapers(data.papers || []);
      }
    } catch (error) {
      console.error('Failed to fetch papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (paperId, decision) => {
    setProcessingId(paperId);
    setMessage('');

    try {
      const response = await fetch('/api/admin/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paperId, decision }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Paper ${decision} successfully!`);
        // Update the paper status in the local state
        setPapers(papers.map(paper => 
          paper._id === paperId 
            ? { ...paper, status: decision }
            : paper
        ));
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to update paper status');
    } finally {
      setProcessingId(null);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'revise': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p>You need administrator privileges to access this page.</p>
            {!session && (
              <p className="mt-2 text-sm">Please sign in to continue.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Paper Decision Management
            </h1>
            <p className="mt-1 text-gray-600">
              Review and make decisions on submitted papers
            </p>
          </div>

          {message && (
            <div className="mx-6 mt-4 p-4 rounded-md bg-blue-50 border border-blue-200">
              <p className="text-blue-800">{message}</p>
            </div>
          )}

          <div className="p-6">
            {papers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No papers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paper
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {papers.map((paper) => (
                      <tr key={paper._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {paper.title || `Paper ${paper._id.slice(-6)}`}
                            </h3>
                            {paper.author && (
                              <p className="text-sm text-gray-600">
                                by {paper.author}
                              </p>
                            )}
                            {paper.submittedAt && (
                              <p className="text-xs text-gray-500">
                                Submitted: {new Date(paper.submittedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(paper.status)}`}>
                            {paper.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDecision(paper._id, 'accepted')}
                              disabled={processingId === paper._id}
                              className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecision(paper._id, 'rejected')}
                              disabled={processingId === paper._id}
                              className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleDecision(paper._id, 'revise')}
                              disabled={processingId === paper._id}
                              className="px-3 py-1 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                            >
                              Revise
                            </button>
                            <button
                              onClick={() => handleDecision(paper._id, 'published')}
                              disabled={processingId === paper._id}
                              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                            >
                              Publish
                            </button>
                            {processingId === paper._id && (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {['pending', 'accepted', 'rejected', 'published'].map(status => {
            const count = papers.filter(p => (p.status || 'pending') === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {status}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaperDecisionInterface;