# Privacy-Preserving BMI Calculator

A decentralized application (dApp) that computes Body Mass Index (BMI) with complete privacy protection using Fully Homomorphic Encryption (FHEVM). Users can calculate their BMI without revealing their actual height and weight measurements.

## Key Features

- **Zero-Knowledge BMI Computation**: Input data remains encrypted throughout the entire process
- **Blockchain-Powered**: Smart contract deployed on Sepolia testnet
- **Modern UI**: Beautiful React interface with MetaMask integration
- **Privacy-First**: Only BMI category results are revealed (underweight/normal/overweight)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-Time Calculation**: Instant encrypted computation on-chain

## Live Demo

**Sepolia Testnet Contract**: [0x63dEb47F2E5f4Ae0d1BcA9f0F4F3AB5addC9ED82](https://sepolia.etherscan.io/address/0x63dEb47F2E5f4Ae0d1BcA9f0F4F3AB5addC9ED82)

## Architecture

### Backend (Smart Contract)
- **Solidity**: FHEVM-compatible smart contract
- **FHEVM**: Homomorphic encryption operations
- **Sepolia Testnet**: Ethereum Layer 2 testnet

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, responsive styling
- **MetaMask**: Web3 wallet integration
- **Zama FHE SDK**: Client-side encryption/decryption

## Prerequisites

- Node.js 20 or higher
- MetaMask browser extension
- Sepolia testnet ETH (for gas fees)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Yale-Giles/privacy-bmi-calculator.git
cd privacy-bmi-calculator
```

### 2. Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install

# Smart contract dependencies
cd ../fhevm-hardhat-template
npm install
```

### 3. Environment Setup

Create a `.env` file in the `fhevm-hardhat-template/` directory:

```env
PRIVATE_KEY=your_private_key_here_without_0x
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Getting API Keys:**

- **Infura API Key**: Sign up at https://infura.io/ and create a new project
- **Etherscan API Key** (Optional): Sign up at https://etherscan.io/ and create API key at https://etherscan.io/myapikey
- **Private Key**: Export from MetaMask (Account Details > Export Private Key)

**Alternative: Using Hardhat Vars**

If you prefer using Hardhat's built-in variable management:

```bash
cd fhevm-hardhat-template
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set ETHERSCAN_API_KEY
```

**Note**: If `PRIVATE_KEY` is set in `.env`, it takes priority over `MNEMONIC`.

### 4. Get Sepolia ETH

You need Sepolia testnet ETH to pay for gas fees. Get it from faucets:

- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia
- https://faucets.chain.link/sepolia

Check your wallet balance:

```bash
cd fhevm-hardhat-template
npm run wallet:info
```

You need at least 0.001-0.01 ETH for deployment.

### 5. Local Development

#### Start Local Blockchain

```bash
cd fhevm-hardhat-template
npx hardhat node
```

#### Deploy to Local Network

```bash
npx hardhat deploy --network localhost
```

#### Start Frontend

```bash
cd ../frontend
npm run dev:mock  # Uses local mock for development
```

Visit `http://localhost:3000` and connect MetaMask to the local Hardhat network:
- Network Name: Hardhat
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency: ETH

### 6. Production Deployment

#### Deploy Smart Contract to Sepolia

```bash
cd fhevm-hardhat-template
npx hardhat compile
npx hardhat deploy --network sepolia
```

The contract address will be displayed. Copy it for frontend configuration.

#### Verify Contract (Optional but Recommended)

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

Replace `<CONTRACT_ADDRESS>` with your deployed contract address.

#### Update Frontend

After deployment, update the frontend with the new contract address:

```bash
cd ../frontend
npm run genabi
```

This script automatically reads the deployment artifacts and updates the ABI and addresses.

#### Build Frontend

```bash
cd frontend
npm run build
```

For static export:

```bash
npm run export  # Creates static files in 'out/' directory
```

## Usage

1. **Connect Wallet**: Click "Connect MetaMask" and connect your wallet
2. **Input Data**: Enter your height (cm) and weight (kg)
3. **Calculate**: Click "Calculate BMI" to perform encrypted computation
4. **View Result**: Click "View BMI Category" to decrypt and see your BMI category

## How It Works

### Privacy-Preserving Computation

1. **Input Encryption**: Height and weight are encrypted client-side using FHE public keys
2. **On-Chain Processing**: Encrypted data is sent to the smart contract
3. **Homomorphic Operations**: BMI calculation occurs on encrypted data
4. **Result Decryption**: Only the BMI category (not actual values) is decrypted and revealed

### BMI Classification

- **Underweight**: BMI < 18.5
- **Normal**: 18.5 ≤ BMI < 24
- **Overweight**: BMI ≥ 24

## Project Structure

```
privacy-bmi-calculator/
├── fhevm-hardhat-template/     # Smart contract development
│   ├── contracts/              # Solidity contracts
│   │   └── FHEBMICalculator.sol
│   ├── deploy/                 # Deployment scripts
│   ├── test/                   # Contract tests
│   ├── tasks/                  # Hardhat custom tasks
│   ├── scripts/                # Utility scripts
│   └── hardhat.config.ts       # Hardhat configuration
├── frontend/                   # React application
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── fhevm/                  # FHE SDK integration
│   ├── abi/                    # Contract ABIs and addresses
│   └── public/                 # Static assets
└── README.md                   # This file
```

## Testing

### Smart Contract Tests

```bash
cd fhevm-hardhat-template
npm run test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Deployment Options

The frontend is configured for static export and can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

**Requirements:**
- HTTPS environment (required for MetaMask)
- Proper CORS headers (automatically configured)

## Troubleshooting

### MetaMask Nonce Mismatch

If you encounter nonce mismatch errors after restarting Hardhat node:

1. Open MetaMask extension
2. Select the Hardhat network
3. Go to Settings > Advanced
4. Click "Clear Activity Tab"

### View Function Call Result Mismatch

If you see outdated data after restarting Hardhat node:

1. Restart the entire browser (MetaMask caches in extension memory)

### Insufficient Funds Error

If you get "insufficient funds" error during deployment:

1. Ensure your wallet has Sepolia ETH
2. Check balance: `npm run wallet:info` in `fhevm-hardhat-template/`
3. Get more ETH from faucets if needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the BSD-3-Clause-Clear License - see the LICENSE files for details.

## Acknowledgments

- **Zama** - For the incredible FHEVM technology
- **Ethereum Foundation** - For Sepolia testnet
- **OpenZeppelin** - For smart contract best practices

## Support

- **Issues**: [GitHub Issues](https://github.com/Yale-Giles/privacy-bmi-calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Yale-Giles/privacy-bmi-calculator/discussions)
- **Zama Community**: [Discord](https://discord.gg/zama)
- **FHEVM Documentation**: [docs.zama.ai](https://docs.zama.ai/protocol/solidity-guides/)

---

Built with privacy technology using FHEVM, React, and Next.js.
