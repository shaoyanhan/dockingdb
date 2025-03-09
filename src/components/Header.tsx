import { Link } from 'react-router-dom';
import { useState } from 'react';
import ContactModal from './ContactModal';

const Header = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <header className="bg-green-700 p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <Link 
          to="/" 
          className="text-white text-4xl font-bold transition-all duration-200 hover:scale-105 mb-4 sm:mb-0 focus:outline-none active:scale-95"
        >
          DockingDB
        </Link>
        <div className="flex gap-4">
          <Link 
            to="/download" 
            className="px-6 py-2 rounded-md transition-all duration-200 cursor-pointer bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 active:bg-green-800 active:scale-95 inline-block text-center"
          >
            Download
          </Link>
          <button 
            className="px-6 py-2 rounded-md transition-all duration-200 cursor-pointer bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 active:bg-green-800 active:scale-95"
            onClick={() => setIsContactModalOpen(true)}
          >
            Contact
          </button>
        </div>
      </div>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </header>
  );
};

export default Header; 