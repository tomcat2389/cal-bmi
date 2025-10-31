export function errorNotDeployed(chainId: number | undefined) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
        <div className="text-center mb-6">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Contract Not Deployed</h2>
          <p className="text-neutral-600">
            FHEBMICalculator contract is not deployed on{" "}
            <span className="font-mono text-neutral-900">chainId={chainId}</span>
            {chainId === 11155111 ? " (Sepolia)" : ""}
          </p>
        </div>

        <div className="bg-neutral-50 rounded-md p-6 mb-6">
          <p className="text-sm text-neutral-700 mb-4">
            The deployment address is missing from the ABI directory. To deploy FHEBMICalculator on Sepolia, run:
          </p>
          <div className="bg-neutral-900 text-neutral-100 font-mono text-sm p-4 rounded-md overflow-x-auto">
            <div className="opacity-70 mb-2"># From fhevm-hardhat-template directory</div>
            <div>npx hardhat deploy --network {chainId === 11155111 ? "sepolia" : "your-network-name"}</div>
          </div>
        </div>

        <p className="text-sm text-neutral-600 text-center">
          Alternatively, switch to a local Hardhat Node using the MetaMask browser extension.
        </p>
      </div>
    </div>
  );
}
