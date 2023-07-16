import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from '../../Marketplace.json' 
import axios from "axios";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import NFTTile from "../../components/Web3/NFTTile";
import { ethers } from "ethers";
import Transactions from '../../components/swap/Transactions';

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
} from 'wagmi'
import { get } from 'http';

const AddressToken = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
export default function Profile() {
  
  const [data, updateData] = useState<any>([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");
  const [transactionsData, updateTransactionsData] = useState([]);


  const {
    data: getAllMyNFT,
  } = useContractRead({
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    abi: MarketplaceJSON.abi,
    functionName: "getAllNFTs",
  });

console.log(getAllMyNFT);
  return (
   <div className="profileClass" >
  
            {/* <div className="profileClass">
            <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
                <div className="mb-5">
                    <h2 className="font-bold">Wallet Address</h2>  
                    {address}
                </div>
            </div>
            <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
                    <div>
                        <h2 className="font-bold">No. of NFTs</h2>
                        {getAllMyNFT?.length}
                                  </div>
                    <div className="ml-20">
                        <h2 className="font-bold">Total Value</h2>
                        {totalPrice} ETHs
                    </div>
            </div>
            <div className="flex flex-col text-center items-center mt-11 text-white">
                <h2 className="font-bold">Your NFTs</h2>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {getAllMyNFT?.map((value: { price: any; tokenId: string; image: any; name: string | number | boolean | ReactPortal | PromiseLikeOfReactNode | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; description: string | number | boolean | ReactPortal | PromiseLikeOfReactNode | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; }, index: Key | null | undefined) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <div className="mt-10 text-xl">
                    {data?.length == 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
                </div>
            </div>
            </div> */}
        </div>
  );
}
