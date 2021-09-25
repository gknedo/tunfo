import React, { useState } from 'react';
import About from '../../pages/About';
import MenuItem from './Menu/MenuItem';

const renderMenuItems = ({isMobile} = {isMobile: false}) => {
  const className = isMobile ? "px-2 pt-2 pb-3 space-y-1" : "flex space-x-4";

  return <div className={className}>
    <MenuItem isMobile={isMobile} to="/">About</MenuItem>
    <MenuItem isMobile={isMobile} to="/jungle" selected>The Jungle</MenuItem>
    <MenuItem isMobile={isMobile} to="/attributes">Attributes</MenuItem>
    <MenuItem isMobile={isMobile} to="/faq">FAQ</MenuItem>
    <MenuItem isMobile={isMobile} to="/roadmap">Roadmap</MenuItem>
  </div>;
}

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return(
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img className="block lg:hidden h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
              <img className="hidden lg:block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg" alt="Workflow" />
            </div>
            <div className="hidden sm:block sm:ml-6">
              {renderMenuItems()}
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        { isOpen && renderMenuItems({isMobile: true}) }
      </div>
    </nav>
  );
}

export default Menu;
