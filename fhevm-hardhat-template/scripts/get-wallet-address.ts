import { ethers } from "ethers";
import * as dotenv from "dotenv";

// Load .env file
dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.error("❌ PRIVATE_KEY not found in .env file");
    console.log("\n💡 Make sure you have a .env file with:");
    console.log("   PRIVATE_KEY=your_private_key_here");
    process.exit(1);
  }

  try {
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey.trim());
    
    console.log("\n📋 Wallet Information:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Address: ${wallet.address}`);
    console.log(`Public Key: ${wallet.publicKey}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    // If connected to network, check balance
    if (process.env.INFURA_API_KEY) {
      const provider = new ethers.JsonRpcProvider(
        `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      );
      
      const balance = await provider.getBalance(wallet.address);
      const balanceInEth = ethers.formatEther(balance);
      
      console.log(`💰 Balance on Sepolia: ${balanceInEth} ETH`);
      
      if (parseFloat(balanceInEth) === 0) {
        console.log("\n⚠️  You need Sepolia ETH to deploy!");
        console.log("🔗 Get Sepolia ETH from:");
        console.log("   - https://sepoliafaucet.com/");
        console.log("   - https://www.infura.io/faucet/sepolia");
        console.log("   - https://faucets.chain.link/sepolia");
      } else if (parseFloat(balanceInEth) < 0.001) {
        console.log("\n⚠️  Low balance! You may need more ETH for gas fees.");
      } else {
        console.log("\n✅ You have enough ETH to deploy!");
      }
    }
    
    console.log("\n📝 Use this address to get Sepolia ETH from faucets:");
    console.log(`   ${wallet.address}\n`);
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("invalid private key")) {
      console.log("\n💡 Make sure your PRIVATE_KEY is valid (64 hex characters, with or without 0x prefix)");
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

