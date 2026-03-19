import React from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom';
import Image from '../img/medium-shot-woman-holding-laptop.jpg'
import Tick from '../icons/mark.png'

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-white px-6 py-20 flex flex-col items-center">

      {/* Floating Layers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-3xl text-center"
      >
        {/* Decorative Layer 1 */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200/30 blur-3xl rounded-full"></div>
        {/* Decorative Layer 2 */}
        <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-purple-200/40 blur-3xl rounded-full"></div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-6"
        >
          Your Campaign Setup Is Complete
        </motion.h1>

        <div className='flex flex-col justify-between items-center gap-4'>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            You've successfully created your advertising campaign setup. Our team and automated systems
            will now perform the required platform validation, traffic compatibility checks, and content
            safety scans across all networks you selected.
          </p>

          <Link to='/review'>
            <button className="px-10 py-4 bg-black text-white text-md rounded-full shadow-lg hover:bg-gray-800 transition-all">
              Click to check Campaign Dashboard
            </button>
          </Link>
          
        </div>
      </motion.div>

      {/* Image + Info Layer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-16 grid md:grid-cols-2 gap-10 items-center max-w-5xl"
      >
        {/* Image placeholder */}
        <div className="w-full h-64 bg-gray-100 rounded-2xl shadow-inner flex items-center justify-center text-gray-400">
          <img src={Image} alt='image' />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">What's Happening Next?</h2>
          <ul className="space-y-3 text-gray-600 leading-relaxed">
            <li className='flex items-center gap-2'>
              <img src={Tick} alt='tick' className='w-7 h-7'/>
              <span>Your campaign is being reviewed for category compliance.</span>
            </li>
            <li className='flex items-center gap-2'>
              <img src={Tick} alt='tick' className='w-7 h-7'/>
              <span>We’re checking availability across the platforms you selected.</span>
            </li>
            <li className='flex items-center gap-2'>
              <img src={Tick} alt='tick' className='w-7 h-7'/>
              <span>Our AI prepares the content optimization suggestions.</span>
            </li>
            <li className='flex items-center gap-2'>
              <img src={Tick} alt='tick' className='w-7 h-7'/>
              <span>The system estimates audience match + predicted reach.</span>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Processing Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-20 w-full max-w-4xl"
      >
        <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">Timeline</h3>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Day 1</h4>
            <p className="text-gray-600">We verify your campaign category, scan assets, and prepare platform matching.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Day 2</h4>
            <p className="text-gray-600">Platforms confirm acceptance. Traffic compatibility and pricing validation starts.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Day 3</h4>
            <p className="text-gray-600">Your final campaign dashboard becomes available. You can start optimizing.</p>
          </div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-20 text-center"
      >
        <p className="text-gray-600 max-w-lg mx-auto mb-6 leading-relaxed">
          You only go through this process once. After your first campaign validation is approved,
          every future campaign will run instantly on the platforms you choose.
        </p>

        <Link to='/review'>
          <button className="px-10 py-4 bg-black text-white text-md rounded-full shadow-lg hover:bg-gray-800 transition-all">
            Click to check Campaign Dashboard
          </button>
        </Link>
      </motion.div>
    </div>
  )
}