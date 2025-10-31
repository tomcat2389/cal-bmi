"use client";

import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useFHEBMICalculator } from "@/hooks/useFHEBMICalculator";
import { errorNotDeployed } from "./ErrorNotDeployed";

/*
 * Privacy-preserving BMI Calculator Demo Component
 * Features:
 * - Encrypted height and weight input
 * - FHE-based BMI calculation
 * - Privacy-preserving result (only category, not exact BMI value)
 * - Beautiful, modern UI design
 */
export const FHEBMICalculatorDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // BMI Calculator Hook
  //////////////////////////////////////////////////////////////////////////////

  const bmiCalculator = useFHEBMICalculator({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI Rendering
  //////////////////////////////////////////////////////////////////////////////

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
            <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-3 tracking-tight">Privacy BMI Calculator</h1>
            <p className="text-sm text-neutral-600 mb-8 leading-relaxed">Connect your wallet to start using fully privacy-preserving BMI calculation service</p>
            <button
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
              onClick={connect}
            >
              Connect MetaMask
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (bmiCalculator.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  const categoryNames = ["Underweight", "Normal", "Overweight"];
  const categoryColors = {
    0: "text-slate-700 bg-slate-50 border-slate-200",
    1: "text-emerald-700 bg-emerald-50 border-emerald-200",
    2: "text-amber-700 bg-amber-50 border-amber-200"
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">Privacy BMI Calculator</h1>
            <p className="text-sm text-neutral-600">Fully privacy-preserving BMI calculation service based on FHEVM</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
              Input Information
            </h2>

            {/* Height Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Height (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={bmiCalculator.height}
                  onChange={(e) => bmiCalculator.setHeight(Number(e.target.value))}
                  min="150"
                  max="250"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-200 text-base bg-white"
                  placeholder="170"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">cm</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">Range: 150-250cm</p>
            </div>

            {/* Weight Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={bmiCalculator.weight}
                  onChange={(e) => bmiCalculator.setWeight(Number(e.target.value))}
                  min="30"
                  max="200"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-200 text-base bg-white"
                  placeholder="65"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">kg</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">Range: 30-200kg</p>
            </div>

            {/* Calculate Button */}
            <button
              className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium py-3.5 px-6 rounded-md transition-colors duration-200"
              disabled={!bmiCalculator.canCalculateBMI}
              onClick={() => bmiCalculator.calculateBMI(bmiCalculator.height, bmiCalculator.weight)}
            >
              {bmiCalculator.isCalculating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </div>
              ) : (
                "Calculate BMI"
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
              Results
            </h2>

            {/* BMI Category Result */}
            {bmiCalculator.category !== undefined ? (
              <div className={`p-8 rounded-md border ${categoryColors[bmiCalculator.category as keyof typeof categoryColors]} mb-6`}>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    {categoryNames[bmiCalculator.category]}
                  </h3>
                  <p className="text-xs uppercase tracking-wide opacity-70">
                    BMI Category
                  </p>
                </div>
              </div>
            ) : bmiCalculator.handle ? (
              <div className="p-8 rounded-md border border-neutral-200 bg-neutral-50 mb-6">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-base font-semibold text-neutral-700 mb-2">
                    Calculation Complete
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Your BMI category has been encrypted and stored. Click the button below to view the result.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-md border border-dashed border-neutral-300 bg-neutral-50 mb-6">
                <div className="text-center text-neutral-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Please enter your height and weight, then click calculate</p>
                </div>
              </div>
            )}

            {/* Decrypt Button */}
            {bmiCalculator.handle && !bmiCalculator.isDecrypted && (
              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 mb-3"
                disabled={!bmiCalculator.canDecryptCategory}
                onClick={bmiCalculator.decryptBMICategory}
              >
                {bmiCalculator.isDecrypting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Decrypting...
                  </div>
                ) : (
                  "View BMI Category"
                )}
              </button>
            )}

            {/* Reset Button */}
            <button
              className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-2.5 px-4 rounded-md transition-colors duration-200 border border-neutral-200"
              onClick={bmiCalculator.reset}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {bmiCalculator.message && (
          <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-neutral-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-700">{bmiCalculator.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Info */}
        <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-md p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-neutral-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-semibold text-neutral-900 mb-3">Privacy Protection Notice</h3>
              <ul className="text-sm text-neutral-600 space-y-2 leading-relaxed">
                <li className="flex items-start">
                  <span className="mr-2 text-neutral-400">•</span>
                  <span>Your height and weight data is fully encrypted during transmission and calculation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-neutral-400">•</span>
                  <span>The smart contract can only access encrypted data and cannot view your actual values</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-neutral-400">•</span>
                  <span>Only you can decrypt and view your BMI category result</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-neutral-400">•</span>
                  <span>Your exact BMI value will not be revealed, only the category information (Underweight/Normal/Overweight)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details (Collapsible) */}
        <details className="mt-6 bg-white rounded-md border border-neutral-200 shadow-sm">
          <summary className="cursor-pointer p-5 text-base font-medium text-neutral-900 hover:text-neutral-700 transition-colors list-none">
            <div className="flex items-center justify-between">
              <span>Technical Details</span>
              <svg className="w-5 h-5 text-neutral-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <div className="px-5 pb-5 border-t border-neutral-200">
            <div className="grid gap-6 md:grid-cols-2 mt-4">
              <div>
                <h4 className="font-medium text-neutral-900 mb-3 text-sm">Blockchain Status</h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Network ID</span>
                    <span className="font-mono text-neutral-900 text-xs">{chainId}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-neutral-600">Contract Address</span>
                    <span className="font-mono text-neutral-900 text-xs break-all text-right ml-2">{bmiCalculator.contractAddress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">FHEVM Status</span>
                    <span className={`font-medium text-xs ${fhevmStatus === 'ready' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {fhevmStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-3 text-sm">Calculation Status</h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Calculating</span>
                    <span className={bmiCalculator.isCalculating ? 'text-amber-600 font-medium' : 'text-emerald-600'}>
                      {bmiCalculator.isCalculating ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Decrypting</span>
                    <span className={bmiCalculator.isDecrypting ? 'text-amber-600 font-medium' : 'text-emerald-600'}>
                      {bmiCalculator.isDecrypting ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Decrypted</span>
                    <span className={bmiCalculator.isDecrypted ? 'text-emerald-600 font-medium' : 'text-neutral-500'}>
                      {bmiCalculator.isDecrypted ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
