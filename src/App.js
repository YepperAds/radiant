// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Media from './pages/Media'
import UserInfoForm from './pages/UserInfoForm'
import Analysis from './pages/Analysis';

import Rich from './pages/SelectPlatforms';
import AdultsCampaigns from './pages/page/AdultsCampaigns'
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
              <Route path="/select-platforms" element={<Media />} />
              <Route path="/user-info" element={<UserInfoForm />} />
              <Route path="/analysis" element={<Analysis />} />

              <Route path="/working-adult-campaigns" element={<AdultsCampaigns />} />
              <Route path="/high-net-worth-campaigns" element={<Rich />} />
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