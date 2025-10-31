# Secure BMI Calculator

A fully privacy-preserving BMI (Body Mass Index) calculation service built with Fully Homomorphic Encryption Virtual Machine (FHEVM). Calculate your BMI securely without revealing your actual height and weight measurements to anyone, including the blockchain.

## 🌐 Live Demo

**🚀 Try it now**: [https://cal-bmi-ten.vercel.app/](https://cal-bmi-ten.vercel.app/)

**📋 Sepolia Testnet Contract**: [0x63dEb47F2E5f4Ae0d1BcA9f0F4F3AB5addC9ED82](https://sepolia.etherscan.io/address/0x63dEb47F2E5f4Ae0d1BcA9f0F4F3AB5addC9ED82)

## ✨ Key Features

- **🔒 Complete Privacy Protection**: Your height and weight are encrypted before being sent to the blockchain
- **🔐 Zero-Knowledge Computation**: Smart contract processes only encrypted data and never sees your actual measurements
- **🎯 Category-Only Results**: Only your BMI category (Underweight/Normal/Overweight) is revealed, never your exact BMI value
- **🌐 Blockchain-Powered**: Deployed on Sepolia testnet for transparent and verifiable computation
- **💼 MetaMask Integration**: Seamless Web3 wallet connection
- **🎨 Modern UI**: Beautiful, responsive interface with smooth animations
- **⚡ Real-Time Calculation**: Instant encrypted computation on-chain

## 🏗️ Architecture

### Backend (Smart Contract)

- **Solidity**: FHEVM-compatible smart contract (`FHEBMICalculator.sol`)
- **FHEVM**: Fully Homomorphic Encryption operations for encrypted computation
- **Sepolia Testnet**: Ethereum Layer 2 testnet deployment
- **Hardhat**: Development and deployment framework

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Fully type-safe development
- **Tailwind CSS**: Modern, responsive styling with custom animations
- **MetaMask**: Web3 wallet integration via EIP-6963
- **Zama FHE SDK**: Client-side encryption/decryption operations
- **Vercel**: Production deployment platform

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- MetaMask browser extension
- Sepolia testnet ETH (for gas fees)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd cal-bmi
```

2. **Install dependencies**

```bash
# Frontend dependencies
cd frontend
npm install

# Smart contract dependencies
cd ../fhevm-hardhat-template
npm install
```

3. **Environment setup**

Create a `.env` file in `fhevm-hardhat-template/`:

```env
PRIVATE_KEY=your_private_key_here_without_0x
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Getting API Keys:**
- **Infura API Key**: Sign up at [infura.io](https://infura.io/) and create a new project
- **Etherscan API Key** (Optional): Sign up at [etherscan.io](https://etherscan.io/) and create API key at [etherscan.io/myapikey](https://etherscan.io/myapikey)
- **Private Key**: Export from MetaMask (Account Details > Export Private Key)

4. **Get Sepolia ETH**

You need Sepolia testnet ETH to pay for gas fees. Get it from faucets:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

Check your wallet balance:

```bash
cd fhevm-hardhat-template
npm run wallet:info
```

You need at least 0.001-0.01 ETH for deployment.

## 💻 Local Development

### Start Local Blockchain

```bash
cd fhevm-hardhat-template
npx hardhat node
```

### Deploy to Local Network

In a new terminal:

```bash
cd fhevm-hardhat-template
npx hardhat deploy --network hardhat
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will start at `http://localhost:3000`.

**Configure MetaMask for Local Development:**
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

## 📦 Production Deployment

### Deploy Smart Contract to Sepolia

```bash
cd fhevm-hardhat-template
npx hardhat compile
npx hardhat deploy --network sepolia
```

The contract address will be displayed. This address is already configured in the frontend.

### Verify Contract (Optional)

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Build Frontend

```bash
cd frontend
npm run build
```

The frontend is automatically deployed to Vercel when you push to the main branch.

## 🎯 How to Use

1. **Visit the application**: [https://cal-bmi-ten.vercel.app/](https://cal-bmi-ten.vercel.app/)
2. **Connect Wallet**: Click "Connect MetaMask" and approve the connection
3. **Switch Network**: Ensure you're connected to Sepolia testnet
4. **Input Data**: Enter your height (in centimeters) and weight (in kilograms)
5. **Calculate**: Click "Calculate BMI" to perform encrypted computation on-chain
6. **View Result**: Click "View BMI Category" to decrypt and see your BMI category

## 🔬 How It Works

### Privacy-Preserving Computation Flow

1. **🔐 Client-Side Encryption**: Height and weight are encrypted on your device using FHE public keys before transmission
2. **📤 On-Chain Submission**: Encrypted data is sent to the smart contract on Sepolia testnet
3. **🧮 Homomorphic Operations**: BMI calculation (weight / height²) occurs entirely on encrypted data
4. **🔓 Result Decryption**: Only you can decrypt the result using your private key
5. **📊 Category Display**: Only the BMI category is revealed (Underweight, Normal, or Overweight), never the exact BMI value

### BMI Classification

The smart contract classifies BMI results into three categories:

- **Underweight**: BMI < 18.5
- **Normal**: 18.5 ≤ BMI < 24
- **Overweight**: BMI ≥ 24

## 📁 Project Structure

```
cal-bmi/
├── fhevm-hardhat-template/     # Smart contract development
│   ├── contracts/              # Solidity contracts
│   │   └── FHEBMICalculator.sol
│   ├── deploy/                 # Deployment scripts
│   ├── deployments/            # Deployment artifacts (localhost, sepolia)
│   ├── test/                   # Contract tests
│   ├── scripts/                # Utility scripts
│   └── hardhat.config.ts       # Hardhat configuration
├── frontend/                   # Next.js React application
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── providers.tsx       # React context providers
│   ├── components/             # React components
│   │   ├── FHEBMICalculatorDemo.tsx
│   │   └── ErrorNotDeployed.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useFHEBMICalculator.tsx
│   │   └── metamask/           # MetaMask integration hooks
│   ├── fhevm/                  # FHE SDK integration
│   ├── abi/                    # Contract ABIs and addresses (auto-generated)
│   ├── scripts/                # Build scripts (genabi)
│   └── public/                 # Static assets
│       └── images/             # BMI category images
└── README.md                   # This file
```

## 🧪 Testing

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

## 🚢 Deployment

The frontend is deployed on **Vercel** and automatically builds on every push to the main branch.

**Deployment URL**: [https://cal-bmi-ten.vercel.app/](https://cal-bmi-ten.vercel.app/)

**Deployment Requirements:**
- HTTPS environment (required for MetaMask)
- Proper CORS headers (configured in `next.config.ts`)
- ABI files committed to repository (for production builds)

## 🐛 Troubleshooting

### MetaMask Connection Issues

- **Wrong Network**: Ensure you're connected to Sepolia testnet (Chain ID: 11155111)
- **Insufficient Funds**: Make sure you have Sepolia ETH for gas fees
- **Extension Not Detected**: Refresh the page and ensure MetaMask is unlocked

### Build Errors

- **Missing ABI Files**: Run `npm run genabi` in the `frontend/` directory
- **Deployment Artifacts Not Found**: Deploy contracts first using `npx hardhat deploy`

### Decryption Signature Popup Not Appearing

The MetaMask off-chain signature popup only appears once. Signatures are cached for 365 days to avoid repeated prompts. To force a new signature:
- Clear your browser cache
- Or restart the browser

### MetaMask Nonce Mismatch

If you encounter nonce mismatch errors after restarting Hardhat node:

1. Open MetaMask extension
2. Select the Hardhat network
3. Go to Settings > Advanced
4. Click "Clear Activity Tab"

### Insufficient Funds Error

If you get "insufficient funds" error during deployment:

1. Ensure your wallet has Sepolia ETH
2. Check balance: `npm run wallet:info` in `fhevm-hardhat-template/`
3. Get more ETH from faucets if needed

## 📝 Privacy Protection Notice

- ✅ Your height and weight are encrypted on your device before being sent to the blockchain
- ✅ The smart contract processes only encrypted data and cannot view your actual measurements
- ✅ You are the only one who can decrypt and view your BMI category result
- ✅ We reveal only your BMI category (Underweight, Normal, or Overweight), never your exact BMI value

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License - see the LICENSE files in each directory for details.

## 🙏 Acknowledgments

- **Zama** - For the incredible FHEVM technology and FHE SDK
- **Ethereum Foundation** - For Sepolia testnet
- **Vercel** - For seamless deployment platform

## 📚 Additional Resources

- **FHEVM Documentation**: [docs.zama.ai](https://docs.zama.ai/protocol/solidity-guides/)
- **Zama Community**: [Discord](https://discord.gg/zama)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **MetaMask Documentation**: [docs.metamask.io](https://docs.metamask.io/)

---

**Built with privacy technology using FHEVM, React, Next.js, and Vercel.**
