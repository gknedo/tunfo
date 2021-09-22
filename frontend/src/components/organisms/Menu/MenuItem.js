import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function MenuItem({to, children}) {
  const path = useLocation().pathname;

  const itemClass = (path == to) ?
    "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
   
    return <Link to={to} className={itemClass} >{children}</Link>;

}

export default MenuItem;
