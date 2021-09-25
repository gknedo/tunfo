import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const defaultClass = (isSelected) => {
  const selectedClass = isSelected ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white";
  return `${selectedClass} px-3 py-2 rounded-md text-sm font-medium`;
}

const mobileClass = (isSelected) => {
  const selectedClass = isSelected ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white";
  return `${selectedClass} block px-3 py-2 rounded-md text-base font-medium`;
}

function MenuItem({to, children, isMobile}) {
  const path = useLocation().pathname;
  const isSelected = path === to;
  const className = isMobile ? mobileClass(isSelected) : defaultClass(isSelected);
   
  return <Link to={to} className={className} >{children}</Link>;

}

export default MenuItem;
