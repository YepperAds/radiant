import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const campaigns = [
  { 
    id: 1, 
    title: "Average Working Adults (25–45)", 
    budget: "RWF 18,762,750", 
    image: "https://images.pexels.com/photos/10415856/pexels-photo-10415856.jpeg",
    route: "/working-adult-campaigns"
  },
  { 
    id: 2, 
    title: "Parents & Family Heads", 
    budget: "RWF 19,037,150", 
    image: "https://images.pexels.com/photos/3819540/pexels-photo-3819540.jpeg",
    route: "/parents-families-campaigns"
  },
  { 
    id: 3, 
    title: "Rural / Countryside Population", 
    budget: "RWF 2,059,150", 
    image: "https://images.pexels.com/photos/34445925/pexels-photo-34445925.jpeg",
    route: "/country-side-campaigns"
  },
  { 
    id: 4, 
    title: "Motari & Transport Workers", 
    budget: "RWF 3,237,150", 
    image: "https://igisabo.rw/wp-content/uploads/2022/02/CODMG-750x375.jpg",
    route: "/motari-transport-campaigns"
  },
  { 
    id: 5, 
    title: "Car Owners / Middle–High Income", 
    budget: "RWF 19,037,150", 
    image: "https://images.pexels.com/photos/804130/pexels-photo-804130.jpeg",
    route: "/car-owners-campaigns"
  },
  { 
    id: 6, 
    title: "High-Net-Worth / Corporate Clients", 
    budget: "RWF 19,037,150", 
    image: "https://images.pexels.com/photos/5648103/pexels-photo-5648103.jpeg",
    route: "/high-net-worth-campaigns"
  },
  { 
    id: 7, 
    title: "Youth / Young Adults (18–30)", 
    budget: "RWF 19,037,150", 
    image: "https://images.pexels.com/photos/5537506/pexels-photo-5537506.jpeg",
    route: "/youth-campaigns"
  },
];

export default function Section1() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9F9F9] py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Section */}
        <header className="mb-20 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-black mb-8 leading-[1.1]">
            Radiant Smart <br /> 
            <span className="text-gray-400">Campaigns are here.</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Select a target demographic to visualize performance metrics 
            and campaign specifications in real-time.
          </p>
        </header>

        <hr className="border-gray-200 mb-12" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
          {campaigns.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate(item.route)}
              className="group cursor-pointer"
            >
              {/* Image Container: OpenAI uses fixed ratios and sharp corners or very slight radii */}
              <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-sm bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                />
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[15px] font-medium text-black mb-1 group-hover:underline decoration-1 underline-offset-4">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 tabular-nums">Budget: {item.budget}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xl">↗</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}