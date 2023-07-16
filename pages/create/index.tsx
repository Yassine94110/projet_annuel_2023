import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { useToken } from 'wagmi';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { MintNFT } from '../../components/Web3/mintToken';

// Pinata API configuration
const pinataApiKey = 'fc5a222b17cfe129e9b8';
const pinataSecretApiKey = 'fbf28c7e428a38ba9a688f9a3403fad7692095a09e253691993f890237056604';

function Create() {
  // State for tracking the uploaded NFT
  const [uploadedNFT, setUploadedNFT] = useState(null);


  useEffect(() => {
  if (uploadedNFT) {
    console.log('MZAZADZAD');
  }

  }, []);

  // Handle NFT upload
  const handleUploadNFT = async (event: { preventDefault: () => void; target: { files: any[]; }; }) => {
    event.preventDefault();

    try {
      console.log('Uploading NFT...');
      // Get the uploaded file
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("oui");
        setUploadedNFT(data);
        console.log(data);
      } else {
        console.error('Failed to upload NFT');
      }
    } catch (error) {
      console.error('Error uploading NFT', error);
    }
  };

  return (
    <div>
      <Head>
        <title>Create NFT</title>
      </Head>

      <main>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-5">Create NFT</h1>
              {/* NFT upload form */}
              <form>
                <input type="file" accept="image/*" onChange={handleUploadNFT} />
                { uploadedNFT && <button type="submit">Upload NFT</button>}
              </form>
              {/* Display uploaded NFT data */}
              {uploadedNFT && (
  <div className=''>
    <h2>NFT Uploaded!</h2>
    <p>IPFS CID: {uploadedNFT.IpfsHash}</p>
    <p>URL: https://ipfs.io/ipfs/{uploadedNFT.IpfsHash}</p>
    <img src={`https://ipfs.io/ipfs/${uploadedNFT.IpfsHash}`} alt="Uploaded NFT" />
  </div>
)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Create;
