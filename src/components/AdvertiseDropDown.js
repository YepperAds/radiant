// // AdvertiseDropdown.js
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Globe, 
//   Tv, 
//   Radio, 
//   Building2, 
//   Users
// } from 'lucide-react';
// import { Button } from './components';
// import { useNavigate } from 'react-router-dom';

// const Dropdown = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [hoveredChannel, setHoveredChannel] = useState(null);
//     const [selectedChannels, setSelectedChannels] = useState([]);
//     const navigate = useNavigate();

//     const channels = [
//         { id: 'all', icon: Globe, label: 'All', color: 'from-gray-500 to-gray-600' },
//         { id: 'websites', icon: Globe, label: 'On Websites', color: 'from-blue-500 to-blue-600' },
//         { id: 'tv', icon: Tv, label: 'On TVs', color: 'from-purple-500 to-purple-600' },
//         { id: 'radio', icon: Radio, label: 'On Radios', color: 'from-green-500 to-green-600' },
//         { id: 'billboards', icon: Building2, label: 'On Billboards', color: 'from-orange-500 to-orange-600' },
//         { id: 'influencers', icon: Users, label: 'On Influencers', color: 'from-pink-500 to-pink-600' }
//     ];

//     const handleChannelToggle = (channelId) => {
//         if (channelId === 'all') {
//             if (selectedChannels.length === channels.length - 1) {
//                 setSelectedChannels([]);
//             } else {
//                 setSelectedChannels(channels.filter(c => c.id !== 'all').map(c => c.id));
//             }
//         } else {
//             setSelectedChannels(prev => 
//                 prev.includes(channelId) 
//                     ? prev.filter(id => id !== channelId)
//                     : [...prev, channelId]
//             );
//         }
//     };

//     const isAllSelected = selectedChannels.length === channels.length - 1;

//     const handleNext = () => {
//         if (selectedChannels.length === 0) {
//             alert('Please select at least one channel');
//             return;
//         }
        
//         // Navigate to select-platforms with selected channels in state
//         navigate('/select-platforms', { 
//             state: { 
//                 selectedChannels: selectedChannels.map(channelId => {
//                     const channel = channels.find(c => c.id === channelId);
//                     return channel ? channel.id : channelId;
//                 })
//             } 
//         });
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-8">
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8 }}
//                 className="relative w-full max-w-md"
//             >
//                 <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
//                     <Button 
//                         onClick={() => setIsOpen(!isOpen)}
//                         variant="secondary" 
//                         size="lg" 
//                         className="w-full flex items-center justify-center space-x-4 focus:outline-none focus:ring-0"
//                     >
//                         <span className="text-center leading-tight">Click to Choose where you want to advertise</span>
//                     </Button>

//                     <AnimatePresence>
//                         {isOpen && (
//                             <motion.div
//                                 initial={{ height: 0, opacity: 0 }}
//                                 animate={{ height: 'auto', opacity: 1 }}
//                                 exit={{ height: 0, opacity: 0 }}
//                                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                                 className="overflow-hidden"
//                             >
//                                 <div className="p-6">
//                                     <div className="grid grid-cols-3 gap-4 mb-6">
//                                         {channels.map((channel, index) => {
//                                             const isSelected = channel.id === 'all' 
//                                                 ? isAllSelected 
//                                                 : selectedChannels.includes(channel.id);
                                            
//                                             return (
//                                                 <motion.button
//                                                     key={channel.id}
//                                                     initial={{ opacity: 0, y: 20 }}
//                                                     animate={{ opacity: 1, y: 0 }}
//                                                     transition={{ duration: 0.3, delay: index * 0.05 }}
//                                                     onMouseEnter={() => setHoveredChannel(channel.id)}
//                                                     onMouseLeave={() => setHoveredChannel(null)}
//                                                     onClick={() => handleChannelToggle(channel.id)}
//                                                     className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 group relative ${
//                                                         isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
//                                                     }`}
//                                                 >
//                                                     <div className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
//                                                         isSelected 
//                                                             ? 'bg-blue-500 scale-100' 
//                                                             : 'bg-gray-200 scale-0 group-hover:scale-100'
//                                                     }`}>
//                                                         {isSelected && (
//                                                             <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                                                             </svg>
//                                                         )}
//                                                     </div>

//                                                     <motion.div
//                                                         whileHover={{ scale: 1.1 }}
//                                                         whileTap={{ scale: 0.95 }}
//                                                         className={`w-14 h-14 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center shadow-lg transition-all duration-200 ${
//                                                             hoveredChannel === channel.id ? 'shadow-xl' : ''
//                                                         } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
//                                                     >
//                                                         <channel.icon size={28} className="text-white" />
//                                                     </motion.div>
//                                                     <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors">
//                                                         {channel.label}
//                                                     </span>
//                                                 </motion.button>
//                                             );
//                                         })}
//                                     </div>

//                                     <div className='flex items-center justify-end'>
//                                         <Button 
//                                             onClick={handleNext}
//                                             variant="secondary" 
//                                             size="md" 
//                                             className="px-6"
//                                             disabled={selectedChannels.length === 0}
//                                         >
//                                             Next
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>

//                 <motion.div
//                     animate={{ y: [0, -10, 0] }}
//                     transition={{ duration: 3, repeat: Infinity }}
//                     className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl -z-10"
//                 />
//                 <motion.div
//                     animate={{ y: [0, 10, 0] }}
//                     transition={{ duration: 4, repeat: Infinity }}
//                     className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -z-10"
//                 />
//             </motion.div>
//         </div>
//     );
// };

// export default Dropdown;

// AdvertiseDropdown.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Tv, 
  Radio, 
  Building2, 
  Users
} from 'lucide-react';
import { Button } from './components';
import { useNavigate } from 'react-router-dom';

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredChannel, setHoveredChannel] = useState(null);
    const [selectedChannels, setSelectedChannels] = useState([]);
    const navigate = useNavigate();

    const channels = [
        { id: 'all', icon: Globe, label: 'All', color: 'from-gray-500 to-gray-600' },
        { id: 'websites', icon: Globe, label: 'On Websites', color: 'from-blue-500 to-blue-600' },
        { id: 'tv', icon: Tv, label: 'On TVs', color: 'from-purple-500 to-purple-600' },
        { id: 'radio', icon: Radio, label: 'On Radios', color: 'from-green-500 to-green-600' },
        { id: 'billboards', icon: Building2, label: 'On Billboards', color: 'from-orange-500 to-orange-600' },
        { id: 'influencers', icon: Users, label: 'On Influencers', color: 'from-pink-500 to-pink-600' }
    ];

    const handleChannelToggle = (channelId) => {
        if (channelId === 'all') {
            if (selectedChannels.length === channels.length - 1) {
                setSelectedChannels([]);
            } else {
                setSelectedChannels(channels.filter(c => c.id !== 'all').map(c => c.id));
            }
        } else {
            setSelectedChannels(prev => 
                prev.includes(channelId) 
                    ? prev.filter(id => id !== channelId)
                    : [...prev, channelId]
            );
        }
    };

    const isAllSelected = selectedChannels.length === channels.length - 1;

    const handleNext = () => {
        if (selectedChannels.length === 0) {
            alert('Please select at least one channel');
            return;
        }
        
        // Navigate to select-platforms with selected channels in state
        navigate('/select-platforms', { 
            state: { 
                selectedChannels: selectedChannels.map(channelId => {
                    const channel = channels.find(c => c.id === channelId);
                    return channel ? channel.id : channelId;
                })
            } 
        });
    };

    return (
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <Button 
                        onClick={() => setIsOpen(!isOpen)}
                        variant="secondary" 
                        size="lg" 
                        className="w-full flex items-center justify-center px-4 py-3 sm:py-4 focus:outline-none focus:ring-0"
                    >
                        <span className="text-center leading-tight text-sm sm:text-base">
                            Click to Choose where you want to advertise
                        </span>
                    </Button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        {channels.map((channel, index) => {
                                            const isSelected = channel.id === 'all' 
                                                ? isAllSelected 
                                                : selectedChannels.includes(channel.id);
                                            
                                            return (
                                                <motion.button
                                                    key={channel.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    onMouseEnter={() => setHoveredChannel(channel.id)}
                                                    onMouseLeave={() => setHoveredChannel(null)}
                                                    onClick={() => handleChannelToggle(channel.id)}
                                                    className={`flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-xl transition-all duration-200 group relative ${
                                                        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className={`absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                                                        isSelected 
                                                            ? 'bg-blue-500 scale-100' 
                                                            : 'bg-gray-200 scale-0 group-hover:scale-100'
                                                    }`}>
                                                        {isSelected && (
                                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center shadow-lg transition-all duration-200 ${
                                                            hoveredChannel === channel.id ? 'shadow-xl' : ''
                                                        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                                    >
                                                        <channel.icon size={24} className="text-white sm:w-7 sm:h-7" />
                                                    </motion.div>
                                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors">
                                                        {channel.label}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <div className='flex items-center justify-end'>
                                        <Button 
                                            onClick={handleNext}
                                            variant="secondary" 
                                            size="md" 
                                            className="px-4 sm:px-6 text-sm sm:text-base"
                                            disabled={selectedChannels.length === 0}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-full blur-xl -z-10"
                />
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-24 sm:h-24 bg-purple-500/10 rounded-full blur-xl -z-10"
                />
            </motion.div>
        </div>
    );
};

export default Dropdown;