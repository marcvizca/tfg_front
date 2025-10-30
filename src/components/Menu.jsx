import React from 'react';
import * as AiIcons from 'react-icons/ai';

export const MenuData = [
  {
    title: 'Equips',
    path:'/teams',
    icon:<AiIcons.AiOutlineTeam/>,
    cName:'nav-text'
  },
  {
    title: 'Perfil',
    path: '/profile',
    icon:<AiIcons.AiOutlineProfile/>,
    cName: 'nav-text'
  },
  {
    title: 'Tancar sessió',
    path:'/logout',
    icon:<AiIcons.AiOutlineLogout/>,
    cName:'nav-text'
  }
]

export const MenuData2 = [
  {
    title: 'Teams',
    path:'/teams',
    icon:<AiIcons.AiOutlineTeam/>,
    cName:'nav-text'
  }
]
