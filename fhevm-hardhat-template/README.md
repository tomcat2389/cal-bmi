# FHEVM Hardhat Template

This directory contains the smart contract development setup for the Privacy-Preserving BMI Calculator.

For complete setup and deployment instructions, see the main [README.md](../README.md) in the root directory.

## Quick Reference

### Compile Contracts

```bash
npm install
npx hardhat compile
```

### Deploy to Local Network

```bash
npx hardhat node
# In another terminal:
npx hardhat deploy --network localhost
```

### Deploy to Sepolia

```bash
npx hardhat deploy --network sepolia
```

### Available Scripts

- `npm run compile` - Compile all contracts
- `npm run test` - Run all tests
- `npm run coverage` - Generate coverage report
- `npm run clean` - Clean build artifacts
- `npm run wallet:info` - Show wallet address and balance

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [Main Project README](../README.md)
