import { useEffect, useState } from "react";
import axios from "axios";
import NFTTile from "../../components/Web3/NFTTile";
import { useContractRead } from "wagmi";
import MarketplaceJSON from "../../Marketplace.json";

export default function Profile() {
  const [data, setData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const AddressToken = '0x5fbdb2315678afecb367f032d93f642f64180aa3'


  const {
    data: getAllMyNFT,
  } = useContractRead({
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    abi: MarketplaceJSON.abi,
    functionName: "getAllNFTs",
  });


  // setData(getAllMyNFT);
  return (
    <div className="profileClass">
      {/* Render your profile information */}
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          {/* Render additional profile information */}
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
           <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {getAllMyNFT ? getAllMyNFT.length : "Loading..."}
          </div> 
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {getAllMyNFT ? (
              getAllMyNFT?.map((value, index) => (
                <NFTTile data={value} key={index} />
              ))
            ) : (
              <p>Loading NFTs...</p>
            )}
              </div>
          <div className="mt-10 text-xl">
            {data.length === 0
              ? "Oops, No NFT data to display (Are you logged in?)"
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
