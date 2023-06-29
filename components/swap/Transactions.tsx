const { ethers } = require("ethers");
import React from "react";

interface TransactionsProps {
  txs: any;
}

const Transactions = ({ txs }: TransactionsProps) => {
  return (
    <div className="card bg-base-200 p-8 shadow-xl mr-4 w-full mb-24 lg:mb-8 border border-success">
      <h1 className="text-3xl mb-5 font-bold"></h1>
      {txs ? (
        <>
          <div className="alert alert-success">
            <div className="">
              
             
              <p className="break-words w-60 lg:w-full">{txs[0].hash}</p>
            </div>
            <h1 className="font-bold">
              {ethers.utils.formatEther(txs[0].value)} ETH
            </h1>
          </div>
        </>
      ) : (
        <p className="stat-desc">No transaction</p>
      )}
    </div>
  );
};

export default Transactions;
