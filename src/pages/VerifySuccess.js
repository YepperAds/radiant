import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifySuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAutoLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [autoLoginSuccess, setAutoLoginSuccess] = useState(false);
  
  const token = searchParams.get('token');
  const autoLogin = searchParams.get('auto_login');

  useEffect(() => {
    const processVerification = async () => {
      if (token && autoLogin) {
        try {
          // Perform auto-login
          await handleAutoLogin(token);
          setAutoLoginSuccess(true);
          
          // Check if there's saved campaign data
          const savedData = localStorage.getItem('campaignForm_data');
          
          if (savedData) {
            // User came from DirectAdvertise flow
            // Redirect back to user-info page where auto-submission will happen
            setTimeout(() => {
              navigate('/user-info', { replace: true });
            }, 1500);
          } else {
            // Normal verification (not from campaign flow)
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Auto-login error:', error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    processVerification();
  }, [token, autoLogin, handleAutoLogin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Verifying your email and signing you in...</p>
        </div>
      </div>
    );
  }

  // Check if user has saved campaign data
  const hasCampaignData = localStorage.getItem('campaignForm_data');

  if (hasCampaignData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-black mb-4">
              Email Verified Successfully!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Redirecting you back to complete your campaign submission...
            </p>
            
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // Normal verification success (not from campaign flow)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-4">
            Email Verified Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your account has been verified. You can now access all features.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            {autoLoginSuccess ? 'Continue to Dashboard' : 'Go to Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccess; 