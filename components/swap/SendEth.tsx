import React from "react";



interface SendEthProps {
  handleAddress: any;
  handleAmount: any;
  handleSubmit: any;
  errorMessage: any;
  defaultAccount: any;
}

const SendEth = ({
  handleAddress,
  handleAmount,
  handleSubmit,
  errorMessage,
  defaultAccount,
}: SendEthProps) => {
  return (
    <div className="card bg-base-200 border border-warning p-8 shadow-xl mt-8 lg:mt-0 lg:ml-4 w-full">
      <div className="grid flex-grow card place-items-center">
        <h1 className="text-3xl mb-5 font-bold">Buy Nessdoge for 0.001 ETH each</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label mt-4">
              <span className="label-text">Amount in ETH</span>
            </label>
            <label className="input-group input-group-lg">
              <input
                type="number"
                step="0.001"
               
                className="input input-warning input-bordered"
                onChange={handleAmount}
                required
              />
              <span className="bg-warning text-white font-bold">ETH</span>
            </label>
          </div>
          <div>
            <button
              disabled={!defaultAccount}
              className="btn w-full btn-outline btn-warning mt-8"
            >
              Buy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendEth;
