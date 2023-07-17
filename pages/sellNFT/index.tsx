import React, { useEffect, useState } from 'react';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../../pinata';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import Marketplace from '../../Marketplace.json';
const ethers = require('ethers');

const SellNFT = () => {
  const [name, setName] = useState<string>('');
  // const [description, setDescription] = useState<string>('');
  // const [price, setPrice] = useState<string>('0.01');
  const [fileURL, setFileURL] = useState<any>(null);
  const [message, updateMessage] = useState<string>('');
  const [listPrice, setListPrice] = useState<any>(null);
  const [hideMint, setHideMint] = useState<boolean>(true);
  const contractConfig = {
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    abi : Marketplace.abi,
  } as const;
 // useEffect

 useEffect(() => {
    console.log("oui");
    if (!listPrice) {
        setListPrice(getListPriceData);
    }
}, [listPrice]);

  // hook create token 

//   const { config: createTokenConfig } = usePrepareContractWrite({
//     ...contractConfig,
//     functionName: "createToken",
//     // TypeError: invalid FixedNumber string value (argument="value", value="", code=INVALID_ARGUMENT, version=6.6.2)
//     args: [
//       fileURL,
//       ethers.parseUnits(price.toString(), "ether").toString(),
//     ],
//   });

const { data : dataCreateToken, isLoading:  isLoadingCreateToken, isSuccess:isSuccessCreateToken, write: writeCreateToken } = useContractWrite({
    address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    abi: Marketplace.abi,
    functionName: 'createToken',
  })

  // executeSale(tokenId, {value:salePrice});

  // hook getlistprice 


  const {
    data: getListPriceData,
    isError,
    isLoading,
    status,
  } = useContractRead({
    address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    abi: Marketplace.abi,
    functionName: "getListPrice",
  });
  

  
  async function disableButton() {
    const listButton = document.getElementById('list-button');
    listButton.disabled = true;
    listButton.style.backgroundColor = 'grey';
    listButton.style.opacity = 0.3;
  }

  async function enableButton () {
    const listButton = document.getElementById('final-button');
    listButton.disabled = false;
    listButton.style.backgroundColor = '#A500FF';
    listButton.style.opacity = 1;
    setHideMint(false);
  }

  async function uploadMetadataToIPFS() {
    // Make sure that none of the fields are empty
    // !name || !description || !price ||
    if (!name || !fileURL) {
      updateMessage('Please fill all the fields!');
      return -1;
    }

    const nftJSON = {
      name,
      // description,
      // price,
      image: fileURL,
    };

    try {
      // Upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log('Uploaded JSON to Pinata: ', response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log('Error uploading JSON metadata:', e);
    }
  }

  async function onChangeFile(e: { target: { files: any[] } }) {
    var file = e.target.files[0];
    // Check for file extension
    try {
      // Upload the file to IPFS
      disableButton();
      updateMessage('Uploading image... please do not click anything!');
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        updateMessage('');
        console.log('Uploaded image to Pinata: ', response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log('Error during file upload', e);
    }
  }

  async function listNFT(e: { preventDefault: () => void; }) {
    e.preventDefault();
    try {
        const metadataURL = await uploadMetadataToIPFS();
        if (metadataURL === -1) return;
        // //After adding your Hardhat network to your metamask, this code will get providers and signers
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner();
        disableButton();
  
        alert("Appuie sur mint");
        enableButton();
        setHideMint(false);
      } catch (e) {
        alert("Upload error" + e);
      }
  }

  return (
    <div>
      <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
      <div className="mb-4">
        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">
          NFT Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      {/* <div className="mb-6">
        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">
          NFT Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          type="text"
          placeholder="Axie Infinity Collection"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div> */}
      {/* <div className="mb-6">
        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">
          Price (in ETH)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          placeholder="Min 0.01 ETH"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        </div> */}
        <div>
        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">
          Upload Image (&lt;500 KB)
        </label>
        <input type="file" onChange={onChangeFile}></input>
      </div>
      <br />
      <div className="text-red-500 text-center">{message}</div>
      <button
        onClick={listNFT}
        className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
        id="list-button"
      >
        List NFT
      </button>
      <div>
      <button id="final-button"
        disabled={ isLoadingCreateToken || hideMint} hidden={hideMint}
        onClick={() =>
            writeCreateToken({
            args: [
                fileURL.toString(),
                name.toString(),
            ],
            value: ethers.parseEther('0.01')
          })
        }
      >
        Claim
      </button>
      {isLoadingCreateToken && <div>Check Wallet</div>}
      {isSuccessCreateToken && <div>Transaction: {JSON.stringify(dataCreateToken)}</div>}
    </div>

    </div>
  );
};

export default SellNFT;
