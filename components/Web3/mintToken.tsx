import { use } from 'chai';
import * as React from 'react'
import { useState,useEffect } from 'react';

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'

  const AddressToken = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

export function MintNFT(TokenAdress: any) {



console.log(TokenAdress,"yyes");

  const { config } = usePrepareContractWrite({
    address: AddressToken,
    abi: [
        {
            "inputs": [],
            "name": "mintTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
    ],
    functionName: 'mintTokens',
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  return (
    <div>
      <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-success" disabled={!write || isLoading} onClick={() => write()}>
        {isLoading ? 'Minting...' : 'Mint'}
      </button>
      {isSuccess && (
        <div>
          letsgo tu as minté 10 $Cyasinu
          <div>
          </div>
        </div>
      )}
    </div>
  )
}
