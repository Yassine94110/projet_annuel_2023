import { useRouter } from 'next/router'
import axie from "../tile.jpeg";
import { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../../components/Web3/utils";
import axios from "axios";
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import MarketplaceJSON from "../../Marketplace.json";
import { get } from 'http';



export default function NFTbyID() {
const router = useRouter();
const tokenId = router.query.id;
const [data, updateData] = useState<any>({});
const [dataFetched, updateDataFetched] = useState<any>(false);
const [message, updateMessage] = useState<any>("");
const [tokenURI, updateTokenURI] = useState<any>("");
const ethers = require("ethers");
const { address, isConnecting, isDisconnected } = useAccount()

const {
  data: getTokenURI,
} = useContractRead({
  address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  abi: MarketplaceJSON.abi,
  functionName: "tokenURI",
  args: [tokenId],
});

const {
  data: listedToken,
} = useContractRead({
  address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  abi: MarketplaceJSON.abi,
  functionName: "getListedTokenForId",
  args: [tokenId],
});


// useContractRead executeSale

const { data : dataExecuteSale, isLoading:  isLoadingExecuteSale, isSuccess:isSuccessExecuteSale, write: writeExecuteSale } = useContractWrite({
  address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  abi: MarketplaceJSON.abi,
  functionName: 'executeSale',
})







    const _tokenURI = getTokenURI;
    const _tokenURIURL = GetIpfsUrlFromPinata(_tokenURI);
  async function getNFTData() {
    console.log(listedToken);
    let item  = {
        price: ethers.formatEther(listedToken.price),
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: _tokenURIURL,
        // name: listedToken.name,
        // description: listedToken.description,
    }

    updateData(item);
    updateDataFetched(true);
    updateTokenURI(getTokenURI);
  }
 
//   async function buyNFT(tokenId) {
//     try {
//         const ethers = require("ethers");
//         //After adding your Hardhat network to your metamask, this code will get providers and signers
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();

//         //Pull the deployed contract instance
//         let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
//         const salePrice = ethers.utils.parseUnits(data.price, 'ether')
//         updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
//         //run the executeSale function
//         let transaction = await contract.executeSale(tokenId, {value:salePrice});
//         await transaction.wait();

//         alert('You successfully bought the NFT!');
//         updateMessage("");
//     }
//     catch(e) {
//         alert("Upload Error"+e)
//     }
// }


  if (!dataFetched) {
    getNFTData();
  }
  


  // let meta = await axios.get(_tokenURI.toString());
  // meta = meta.data;
  // let item  = {
  //     price: meta.price,
  //     tokenId: tokenId,
  //     seller: listedToken.seller,
  //     owner: listedToken.owner,
  //     image: meta.image,
  //     name: meta.name,
  //     description: meta.description,
  // }

  // updateData(item);
  // updateDataFetched(true);
  // updateTokenURI(getTokenURI);
  // console.log("oui");



  return <div >
  <div className="flex ml-20 mt-20">
      <img src={data.image} alt="" className="w-2/5" />
      <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
          {/* <div>
              Name: {data.name}
          </div>
          <div>
              Description: {data.description}
          </div> */}
          <div>
              Price: <span className="">{(data.price) + " ETH"}</span>
          </div>
          <div>
              Owner: <span className="text-sm">{data.owner}</span>
          </div>
          <div>
              Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
          { address != data.owner && address != data.seller ?
              <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() =>
                writeExecuteSale({
                args: [
                  tokenId.toString(),

                ],
                value: ethers.parseEther(data.price)
              })
            }>Buy this NFT</button>
              : <div className="text-emerald-700">You are the owner of this NFT</div>
          }
          
          <div className="text-green text-center mt-3">{message}</div>
          </div>
      </div>
  </div>
</div>
}