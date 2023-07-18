
import NFTTile from "../../components/Web3/NFTTile";
import MarketplaceJSON from "../../Marketplace.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../../components/Web3/utils";
import { useContractRead } from "wagmi";
import Token from '../token/index';
import { get } from "http";

export default function Marketplace() {
const sampleData = [
    {
        "name": "",
        "description": "",
        "website":"",
        "image":"",
        "price":"",
        "currentlySelling":"",
        "address":"",
    },
    {
      "name": "",
      "description": "",
      "website":"",
      "image":"",
      "price":"",
      "currentlySelling":"",
      "address":"",
  },
  {
    "name": "",
    "description": "",
    "website":"",
    "image":"",
    "price":"",
    "currentlySelling":"",
    "address":"",
}
];
const [data, updateData] = useState<any>(sampleData);
const [dataFetched, updateFetched] = useState<any>(false);
const contractConfig = {
  address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  abi : MarketplaceJSON.abi,
} as const;

// getAllNFTs() from contact read 

const {
  data: getAllNFTsData,
} = useContractRead({
  address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  abi: MarketplaceJSON.abi,
  functionName: "getAllNFTs",
});


useEffect(() => {

  if (!getAllNFTsData || !dataFetched) {
    console.log(getAllNFTsData);
    updateData(getAllNFTsData);
    updateFetched(true);
  }
}, []);





 const allNFTMarket = getAllNFTsData?.filter((value :any, index:any) => {
return value.currentlySelling == true;

 });
 const addImage = getAllNFTsData?.map((value :any, index:any) => {
  // get tokenId
  const tokenId = value.tokenId;
  
  const {
    data: getTokenURI,
  } = useContractRead({
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    abi: MarketplaceJSON.abi,
    functionName: "tokenURI",
    args: [tokenId],
  });
  value.image = getTokenURI;

  });



return (
    <div>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Top NFTs
            </div>
        
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
            {data?.map((value :any, index:any) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}