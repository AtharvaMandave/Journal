'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

function ContactPage() {
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    mobile: '',
    contactType: '',
    subject: '',
    message: '',
    captcha: ''
  });

  const [captchaData, setCaptchaData] = useState({
    code: '',
    sessionId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const API_BASE_URL = "/api";

  // Load captcha on component mount
  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/captcha`);

      const data = await response.json();

      if (data.success) {
        setCaptchaData({
          code: data.captcha,
          sessionId: data.sessionId
        });
      }
    } catch (error) {
      console.error('Failed to load captcha:', error);
      // Fallback to simple captcha
      setCaptchaData({
        code: 'ABC123',
        sessionId: 'fallback'
      });
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sessionId: captchaData.sessionId
        })
      });

      const result = await response.json();

      if (result.success) {
        showNotification(result.message || 'Message sent successfully!', 'success');

        // Reset form
        setFormData({
          contactName: '',
          email: '',
          mobile: '',
          contactType: '',
          subject: '',
          message: '',
          captcha: ''
        });

        // Load new captcha
        await loadCaptcha();
      } else {
        showNotification(result.error || 'Failed to send message', 'error');
        // Reload captcha on error
        await loadCaptcha();
      }
    } catch (error) {
      console.error('Submission error:', error);
      showNotification('Network error. Please try again later.', 'error');
      await loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      contactName: '',
      email: '',
      mobile: '',
      contactType: '',
      subject: '',
      message: '',
      captcha: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
            }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <div className="h-1 w-20 bg-blue-600 rounded"></div>
        </div>

        {/* Contact Information Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Journal Info */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start space-x-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Journal Information</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  International Research Journal of Modernization in Engineering Technology & Science.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Indus Satellite Green, AB Road, Indore (Madhya Pradesh)
                </p>
              </div>
            </div>
          </div>

          {/* Email Contact */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Contact</h3>
                <a
                  href="mailto:editor@ijrmets.com"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  atharvamandave1@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Phone Contact */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start space-x-3">
              <Phone className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone Contact</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">+91 786-909-67-94</p>
                  <p className="text-gray-700">+91 786-986-27-10</p>
                  <p className="text-xs text-gray-500">(WhatsApp or SMS only)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Write to us</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-4 gap-6 mb-6">
              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Type Contact Name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Id <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Type Email Id"
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Type Mobile Number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Contact Type */}
              <div>
                <label htmlFor="contactType" className="block text-sm font-medium text-gray-700 mb-2">
                  Type Of Contact <span className="text-red-500">*</span>
                </label>
                <select
                  id="contactType"
                  name="contactType"
                  value={formData.contactType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select One</option>
                  <option value="author">Author Inquiry</option>
                  <option value="reviewer">Reviewer Application</option>
                  <option value="editor">Editorial Board</option>
                  <option value="subscription">Subscription</option>
                  <option value="technical">Technical Support</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Type Subject"
                required
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type Contact Message"
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Captcha */}
            <div className="mb-6">
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-2">
                    Validation Code <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 px-4 py-2 rounded text-lg font-mono tracking-widest text-gray-800 select-none">
                      {captchaData.code || 'Loading...'}
                    </div>
                    <button
                      type="button"
                      onClick={loadCaptcha}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Reload Captcha"
                      disabled={isSubmitting}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline" onClick={loadCaptcha}>
                    Reload Captcha
                  </p>
                </div>

                <div>
                  <label htmlFor="captchaInput" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Captcha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="captchaInput"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    placeholder="Enter Captcha"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;