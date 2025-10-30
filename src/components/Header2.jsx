import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { MenuData2 } from './Menu';
import './header.css';
import { IconContext } from 'react-icons';

function Header() {

  return (
    <>
      <IconContext.Provider value={{ color: '#000' }}>
        <div className='header-container header'>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Header;