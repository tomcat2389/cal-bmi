import "@fhevm/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import type { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "solidity-coverage";
import * as dotenv from "dotenv";

import "./tasks/accounts";
import "./tasks/FHECounter";

// Load environment variables from .env file
dotenv.config();

// Support both .env file (PRIVATE_KEY) and Hardhat vars (MNEMONIC)
// Priority: PRIVATE_KEY from .env > MNEMONIC from vars
const PRIVATE_KEY = process.env.PRIVATE_KEY?.trim() || "";
const hasPrivateKey = PRIVATE_KEY && PRIVATE_KEY.length > 0;

// Always need a valid mnemonic for hardhat local network, even if using private key for sepolia
const DEFAULT_MNEMONIC = "test test test test test test test test test test test junk";

// Get mnemonic from vars, but ensure it's always valid for hardhat network
// For sepolia, we can use private key from .env instead
let mnemonicFromVars: string = "";
try {
  mnemonicFromVars = vars.get("MNEMONIC", "");
} catch {
  mnemonicFromVars = "";
}

// Validate mnemonic (must be 12 or 24 words)
const isValidMnemonic = (mnemonic: string): boolean => {
  const words = mnemonic.trim().split(/\s+/);
  return words.length === 12 || words.length === 24;
};

// Use valid mnemonic from vars, or fallback to default
const MNEMONIC: string = 
  mnemonicFromVars && isValidMnemonic(mnemonicFromVars)
    ? mnemonicFromVars.trim()
    : DEFAULT_MNEMONIC;

const INFURA_API_KEY: string = 
  process.env.INFURA_API_KEY?.trim() || 
  vars.get("INFURA_API_KEY", "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
const ETHERSCAN_API_KEY: string = 
  process.env.ETHERSCAN_API_KEY?.trim() || 
  vars.get("ETHERSCAN_API_KEY", "");

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
  },
  networks: {
    hardhat: {
      // Hardhat local network always uses mnemonic for testing
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: 31337,
    },
    anvil: {
      // Anvil can use private key or mnemonic
      accounts: hasPrivateKey
        ? [PRIVATE_KEY]
        : {
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0/",
            count: 10,
          },
      chainId: 31337,
      url: "http://localhost:8545",
    },
    sepolia: {
      // Sepolia testnet: use private key if available, otherwise use mnemonic
      accounts: hasPrivateKey 
        ? [PRIVATE_KEY] // Use private key from .env
        : {              // Or use mnemonic
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0/",
            count: 10,
          },
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.27",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
      evmVersion: "cancun",
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
