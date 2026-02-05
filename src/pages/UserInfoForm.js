// UserInfoForm.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Phone, AlertCircle, Loader, Eye, EyeOff, ArrowLeft, X } from 'lucide-react';

function UserInfoForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, login, signup } = useAuth();
  const { selectedChannels, selectedPlatforms } = location.state || {};
  
  // Single source of truth for submission status
  const submissionAttemptedRef = useRef(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phoneNumber: '',
    notes: ''
  });

  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');

  // Redirect if no data from previous steps
  useEffect(() => {
    if (!selectedChannels || !selectedPlatforms || selectedPlatforms.length === 0) {
      navigate('/');
    }
  }, [selectedChannels, selectedPlatforms, navigate]);

  // Save form data to localStorage when moving to step 2
  useEffect(() => {
    if (step === 2 && !isAuthenticated) {
      try {
        localStorage.setItem('campaignForm_data', JSON.stringify({
          formData,
          selectedChannels,
          selectedPlatforms,
          authData: { email: authData.email }
        }));
      } catch (e) {
        console.error('Failed to save form data:', e);
      }
    }
  }, [step, formData, selectedChannels, selectedPlatforms, authData.email, isAuthenticated]);

  // Auto-submit when authenticated user returns
  useEffect(() => {
    const checkAndSubmit = async () => {
      console.log('🔍 Checking auth status:', { 
        isAuthenticated, 
        submissionAttempted: submissionAttemptedRef.current
      });
      
      // Only proceed if authenticated and haven't attempted submission
      if (!isAuthenticated || submissionAttemptedRef.current) {
        return;
      }

      const savedDataStr = localStorage.getItem('campaignForm_data');
      
      if (!savedDataStr) {
        console.log('⚠️ No saved campaign data found');
        return;
      }

      try {
        const parsed = JSON.parse(savedDataStr);
        console.log('✅ Parsed saved data');
        
        // Mark that we're attempting submission - this prevents any further attempts
        submissionAttemptedRef.current = true;
        
        // Clean up localStorage immediately
        localStorage.removeItem('campaignForm_data');
        console.log('🧹 Cleaned up localStorage');
        
        // Restore the form data
        setFormData(parsed.formData);
        setStep(2);
        
        // Show success message
        setAuthSuccess('Email verified! Submitting your campaign...');
        console.log('🚀 Starting auto-submission...');
        
        // Auto-submit after brief delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        await submitCampaignData(parsed.formData, parsed.selectedChannels, parsed.selectedPlatforms);
      } catch (e) {
        console.error('❌ Failed to process saved data:', e);
        // Reset only if parsing failed
        submissionAttemptedRef.current = false;
      }
    };

    checkAndSubmit();
  }, [isAuthenticated]); // Re-run when auth status changes

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (formData.businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAuthInputChange = (e) => {
    const { name, value } = e.target;
    setAuthData(prev => ({ ...prev, [name]: value }));
    setAuthError(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep(2);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        if (!authData.email || !authData.password) {
          setAuthError('Email and password are required');
          setIsSubmitting(false);
          return;
        }
        
        const result = await login(authData.email, authData.password);
        
        if (result) {
          setAuthSuccess('Authentication successful!');
        }
      } else {
        if (!authData.name || !authData.email || !authData.password) {
          setAuthError('All fields are required');
          setIsSubmitting(false);
          return;
        }
        
        const result = await signup(authData.email, authData.password, authData.name);
        
        if (result.requiresVerification) {
          setVerificationSent(true);
          setMaskedEmail(result.maskedEmail || authData.email);
          setAuthSuccess(`Registration successful! Please check ${result.maskedEmail || 'your email'} to verify your account. After verification, simply return to this page and we'll automatically complete your campaign submission.`);
          setIsSubmitting(false);
          return;
        }
        
        setAuthSuccess('Account created successfully!');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('https://yepper-backend-ll50.onrender.com/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authData.email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAuthSuccess('Verification email resent! Please check your inbox.');
      } else {
        setAuthError(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      setAuthError('Failed to resend verification email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCampaignData = async (data = formData, channels = selectedChannels, platforms = selectedPlatforms) => {
    // Don't allow manual submission if auto-submission already happened
    if (submitSuccess) {
      console.log('⚠️ Campaign already submitted, skipping...');
      return;
    }

    try {
      console.log('📤 Submitting campaign data...');
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthError('Authentication token not found. Please sign in again.');
        setIsSubmitting(false);
        submissionAttemptedRef.current = false; // Allow retry
        return;
      }

      const response = await fetch('https://yepper-backend-ll50.onrender.com/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          selectedChannels: channels,
          selectedPlatforms: platforms,
          userEmail: user?.email || authData.email
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit campaign');
      }

      console.log('✅ Campaign submitted successfully:', responseData.data.campaignId);
      
      // Mark as successfully submitted
      setCampaignId(responseData.data.campaignId);
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      // Redirect after success message
      setTimeout(() => {
        navigate('/campaign-success', { 
          state: { 
            campaignId: responseData.data.campaignId,
            message: 'Campaign submitted successfully!' 
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('❌ Submission error:', error);
      setAuthError(error.message || 'Failed to submit campaign. Please try again.');
      setIsSubmitting(false);
      submissionAttemptedRef.current = false; // Allow retry on error
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setAuthError(null);
    setAuthSuccess(null);
    setVerificationSent(false);
  };

  if (!selectedChannels || !selectedPlatforms) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Alert Messages */}
      {(errors.submit || authError || authSuccess || submitSuccess) && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-6">
          <div className="max-w-2xl mx-auto">
            {authError && (
              <div className="mb-4 border-2 border-red-600 bg-red-50 p-4 rounded-lg shadow-lg">
                <div className="flex items-start justify-between">
                  <p className="text-red-700 text-sm flex-1">{authError}</p>
                  <button onClick={() => setAuthError(null)} className="ml-4 text-red-700 hover:text-red-900">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 border-2 border-green-600 bg-green-50 p-4 rounded-lg shadow-lg">
                <div className="flex items-start justify-between">
                  <p className="text-green-700 text-sm flex-1">{authSuccess}</p>
                  <button onClick={() => setAuthSuccess(null)} className="ml-4 text-green-700 hover:text-green-900">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            {submitSuccess && (
              <div className="mb-4 border-2 border-green-600 bg-green-50 p-4 rounded-lg shadow-lg">
                <div className="flex items-start justify-between">
                  <p className="text-green-700 text-sm flex-1">Campaign submitted successfully! Redirecting...</p>
                  <button onClick={() => setSubmitSuccess(false)} className="ml-4 text-green-700 hover:text-green-900">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Back Buttons */}
        {step === 2 && !submitSuccess && !isSubmitting && (
          <button onClick={handleBackToStep1} className="mb-8 flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium">
            <ArrowLeft size={18} />Back to form
          </button>
        )}
        {step === 1 && (
          <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        {/* Step 1: Form */}
        {step === 1 && (
          <>
            <div className="mb-10 space-y-3">
              <h1 className="text-5xl font-bold text-black leading-tight">Tell us about yourself</h1>
              <p className="text-lg text-gray-600">We'll use this information to contact you about your advertising campaign</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Campaign Summary</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Channels</p>
                  <p className="text-base font-semibold text-gray-900">{selectedChannels.length} selected</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Platforms</p>
                  <p className="text-base font-semibold text-gray-900">{selectedPlatforms.length} selected</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-white border border-gray-200 rounded-xl shadow-md p-8 sm:p-10">
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-3 border rounded-lg ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all`}
                      placeholder="John Doe" />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />{errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-3 border rounded-lg ${errors.businessName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all`}
                      placeholder="Your Company Ltd" />
                  </div>
                  {errors.businessName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />{errors.businessName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-3 border rounded-lg ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all`}
                      placeholder="+250 7XX XXX XXX" />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />{errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2">
                    Additional Notes <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <textarea id="notes" name="notes" rows={4} value={formData.notes} onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all"
                    placeholder="Tell us about your advertising goals, budget, or any specific requirements..." maxLength={1000} />
                  <p className="mt-2 text-xs text-gray-500 text-right">{formData.notes.length}/1000 characters</p>
                </div>

                <button type="submit" className="w-full py-4 px-4 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg">
                  Continue to Authentication
                </button>
              </div>
            </form>

            <p className="mt-6 text-xs text-center text-gray-500">
              Your information will be kept confidential and only used to contact you about your advertising campaign.
            </p>
          </>
        )}

        {/* Step 2: Authentication */}
        {step === 2 && (
          <div className="border border-gray-200 bg-white rounded-xl shadow-md p-10">
            <h2 className="text-2xl font-bold mb-8">
              {verificationSent ? 'Check Your Email' : isAuthenticated ? 'Review & Submit Campaign' : 'Sign In to Continue'}
            </h2>
            
            {verificationSent ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We've sent a verification email to <strong className="text-black">{maskedEmail}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Click the link in the email to verify your account. After verification, simply return to this page and we'll automatically complete your campaign submission.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isSubmitting}
                    className="text-black hover:text-gray-700 font-medium text-sm underline disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Resend verification email'}
                  </button>
                </div>
              </div>
            ) : !isAuthenticated ? (
              <div className="space-y-6">
                <p className="text-gray-600">Please sign in or create an account to submit your campaign.</p>
                <div className="flex gap-6 border-b border-gray-200">
                  <button onClick={() => setAuthMode('login')}
                    className={`pb-4 px-2 font-semibold transition-colors ${authMode === 'login' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-700'}`}>
                    Sign In
                  </button>
                  <button onClick={() => setAuthMode('signup')}
                    className={`pb-4 px-2 font-semibold transition-colors ${authMode === 'signup' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-700'}`}>
                    Sign Up
                  </button>
                </div>
                <form onSubmit={handleAuth} className="space-y-5">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={authData.name} onChange={handleAuthInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required={authMode === 'signup'} />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={authData.email} onChange={handleAuthInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" value={authData.password} onChange={handleAuthInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-black text-white py-4 font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="animate-spin" size={20} />Processing...
                      </span>
                    ) : (authMode === 'login' ? 'Sign In & Submit Campaign' : 'Create Account & Submit Campaign')}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-2 border-green-600 bg-green-50 p-4 rounded-lg">
                  <span className="text-green-700 font-medium">You're signed in as {user?.email}</span>
                </div>
                <button onClick={() => submitCampaignData()} disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin" size={20} />Submitting Campaign...
                    </span>
                  ) : 'Submit Campaign'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfoForm;