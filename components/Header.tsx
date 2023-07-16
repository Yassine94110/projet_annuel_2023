import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header:React.FC = () => {
  return <header>
  <div className="navbar bg-base-100">
    <div className="navbar-start">

      <a className="btn btn-ghost normal-case text-xl">NESSDOGE</a>
    </div>
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1">
        {
        [ { name: 'Accueil', link: '/' },
         { name: 'Token', link: '/token' },
         { name: 'Create', link: '/create' },
         { name: 'Profile', link: '/profile' },
         { name: 'Sell NFT', link: '/sellNFT' },
          {
        name: 'Swap', link: '/swap' },
         { name: 'Marketplace', link:
        '/marketplace' }
       ].map((item,index) => (
        <li key={index}>
          <Link href={item.link}>
            {item.name}
          </Link></li>
        ))}

      </ul>
    </div>
    <div className="navbar-end">
      <ConnectButton />
    </div>
  </div>
</header>
  }
