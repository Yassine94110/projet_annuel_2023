import axie from "../tile.jpeg";
import { useRouter } from 'next/router';
import { GetIpfsUrlFromPinata } from "./utils";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, useState, useEffect } from "react";
import { ethers } from "ethers";

function NFTTile (data: { data: { price: any,tokenId: string; image: any; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }; }) {

    const redirectToPage = () => {
        router.push('/nft/[id]', `/nft/${data.data.tokenId}`);
      };



     

const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);


    const router = useRouter();
    return (
     
        <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
        <img src={IPFSUrl} alt="" className="w-72 h-80 rounded-lg object-cover" crossOrigin="anonymous" />
            <div className= "text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                {/* <strong className="text-xl">{data.data.name}</strong> */}
                {/* <p className="display-inline">
                    {data.data.description}
                </p> */}
                <p className="display-inline">
                    {data.data.price}
                </p>
            </div>
            <button onClick={redirectToPage}>Redirection</button>
        </div>

    
    )
}

export default NFTTile;