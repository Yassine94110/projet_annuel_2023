
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState,useEffect } from 'react';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { useToken } from 'wagmi'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { MintNFT } from '../../components/Web3/mintToken';








function Token() {
  
  const TokenAdress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

  const { address } = useAccount();
  const { data, isError, isLoading, status } = useToken({
    address: TokenAdress,
  })
  const balance = useBalance({
    address: address, 
    token: TokenAdress,
  })




 
  return (
    <div>
      <Head>
        <title>Token</title>
      </Head>

      <main>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-5">$CyasInu</h1>
                <h1 className="font-bold">Token address:</h1> 
                <span>{data?.address}</span>
                <h1 className="font-bold">Token name:</h1>
                <span>{data?.name}</span>
                <h1 className="font-bold">Token symbol:</h1>
                <span> {data?.symbol}</span>
                <h1 className="font-bold"> Balance: </h1>
                <span>{balance.data?.formatted} {balance.data?.symbol}</span>
                <h1 className="font-bold">status: {balance.status}</h1>
            {/* inject TokenAdress  in <MintNFT  /> */}
                <MintNFT TokenAdress={TokenAdress} />

            </div>
          </div>
        </div>

      </main>

    </div>
  );
}

export default Token;
