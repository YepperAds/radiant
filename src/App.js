// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Success from './pages/Success';

// AdOwner
import SelectPlatforms from './pages/SelectPlatforms'
import UserInfoForm from './pages/UserInfoForm'
import CampaignReview from './pages/CampaignReview'

// Campaigns
// import SelectPlatforms from './pages/SelectPlatforms'
import AdultCampaigns from './pages/page/AdultsCampaigns'
import CarOwnersCampaigns from './pages/page/carOwnersCampaigns'
import CountrySidersCampaigns from './pages/page/countrySidersCampaigns'
import ParentsCampaigns from './pages/page/parentsCampaigns'
import TransportersCampaigns from './pages/page/transportersCampaigns'
import YouthCampaigns from './pages/page/youthCampaigns'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* AdOwner */}
              <Route path="/high-net-worth-campaigns" element={<SelectPlatforms />} />
              <Route path="/user-info" element={<UserInfoForm />} />
              <Route path="/campaign-success" element={<Success />} />
              <Route path="/review" element={<CampaignReview />} />

              {/* Campaigns */}
              <Route path="/high-net-worth-campaigns" element={<SelectPlatforms />} />
              <Route path="/working-adult-campaigns" element={<AdultCampaigns />} />
              <Route path="/car-owners-campaigns" element={<CarOwnersCampaigns />} />
              <Route path="/country-side-campaigns" element={<CountrySidersCampaigns />} />
              <Route path="/parents-families-campaigns" element={<ParentsCampaigns />} />
              <Route path="/motari-transport-campaigns" element={<TransportersCampaigns />} />
              <Route path="/youth-campaigns" element={<YouthCampaigns />} />

            </Routes>
          </div>
        </Router>
      </AuthProvider>
      
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;