import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const CONTRACT_NAME = "FHEBMICalculator";

// <root>/packages/fhevm-hardhat-template
const rel = "../fhevm-hardhat-template";

// <root>/packages/site/components
const outdir = path.resolve("./abi");

if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}

const dir = path.resolve(rel);
const dirname = path.basename(dir);

const line =
  "\n===================================================================\n";

if (!fs.existsSync(dir)) {
  console.error(
    `${line}Unable to locate ${rel}. Expecting <root>/packages/${dirname}${line}`
  );
  process.exit(1);
}

if (!fs.existsSync(outdir)) {
  console.error(`${line}Unable to locate ${outdir}.${line}`);
  process.exit(1);
}

const deploymentsDir = path.join(dir, "deployments");
// if (!fs.existsSync(deploymentsDir)) {
//   console.error(
//     `${line}Unable to locate 'deployments' directory.\n\n1. Goto '${dirname}' directory\n2. Run 'npx hardhat deploy --network ${chainName}'.${line}`
//   );
//   process.exit(1);
// }

function deployOnHardhatNode() {
  try {
    if (process.platform === "win32") {
      // On Windows, deploy directly to hardhat network (in-process, no node needed)
      // Then copy deployment files to localhost directory for compatibility
      console.log("Compiling contracts...");
      execSync(`npx hardhat compile`, {
        cwd: dir,
        stdio: "inherit",
      });
      
      console.log("Deploying to Hardhat network (Windows)...");
      execSync(`npx hardhat deploy --network hardhat`, {
        cwd: dir,
        stdio: "inherit",
      });
      
      // Copy hardhat deployments to localhost directory for compatibility
      const hardhatDeployDir = path.join(deploymentsDir, "hardhat");
      const localhostDeployDir = path.join(deploymentsDir, "localhost");
      
      if (fs.existsSync(hardhatDeployDir) && !fs.existsSync(localhostDeployDir)) {
        console.log("Copying deployment files to localhost directory...");
        if (!fs.existsSync(deploymentsDir)) {
          fs.mkdirSync(deploymentsDir, { recursive: true });
        }
        fs.mkdirSync(localhostDeployDir, { recursive: true });
        
        // Copy all JSON files from hardhat to localhost
        const files = fs.readdirSync(hardhatDeployDir);
        files.forEach(file => {
          if (file.endsWith('.json')) {
            const sourcePath = path.join(hardhatDeployDir, file);
            const destPath = path.join(localhostDeployDir, file);
            fs.copyFileSync(sourcePath, destPath);
          }
        });
      }
    } else {
      // Use bash script on Linux/Mac (start node and deploy)
      execSync(`./deploy-hardhat-node.sh`, {
        cwd: path.join(process.cwd(), "scripts"),
        stdio: "inherit",
      });
    }
  } catch (e) {
    console.error(`${line}Script execution failed: ${e}${line}`);
    process.exit(1);
  }
}

function readDeployment(chainName, chainId, contractName, optional) {
  const chainDeploymentDir = path.join(deploymentsDir, chainName);

  if (!fs.existsSync(chainDeploymentDir) && chainId === 31337) {
    // Try to auto-deploy the contract on hardhat node!
    deployOnHardhatNode();
  }

  if (!fs.existsSync(chainDeploymentDir)) {
    console.error(
      `${line}Unable to locate '${chainDeploymentDir}' directory.\n\n1. Goto '${dirname}' directory\n2. Run 'npx hardhat deploy --network ${chainName}'.${line}`
    );
    if (!optional) {
      process.exit(1);
    }
    return undefined;
  }

  const jsonString = fs.readFileSync(
    path.join(chainDeploymentDir, `${contractName}.json`),
    "utf-8"
  );

  const obj = JSON.parse(jsonString);
  obj.chainId = chainId;

  return obj;
}

// Auto deployed on Linux/Mac (will fail on windows)
let deployLocalhost = readDeployment("localhost", 31337, CONTRACT_NAME, true /* optional */);

// Sepolia is optional
let deploySepolia = readDeployment("sepolia", 11155111, CONTRACT_NAME, true /* optional */);

// If we have Sepolia but no localhost, use Sepolia ABI for localhost address
if (!deployLocalhost && deploySepolia) {
  deployLocalhost = { 
    abi: deploySepolia.abi, 
    address: "0x0000000000000000000000000000000000000000",
    chainId: 31337
  };
}

// If we have localhost but no Sepolia, use localhost ABI for Sepolia
if (deployLocalhost && !deploySepolia) {
  deploySepolia = { 
    abi: deployLocalhost.abi, 
    address: "0x0000000000000000000000000000000000000000",
    chainId: 11155111
  };
}

// If we have both, check they match
if (deployLocalhost && deploySepolia) {
  if (
    JSON.stringify(deployLocalhost.abi) !== JSON.stringify(deploySepolia.abi)
  ) {
    console.error(
      `${line}Deployments on localhost and Sepolia differ. Cant use the same abi on both networks. Consider re-deploying the contracts on both networks.${line}`
    );
    process.exit(1);
  }
}

// Ensure we have at least one deployment
if (!deployLocalhost && !deploySepolia) {
  console.error(
    `${line}No deployments found. Please deploy to at least one network (localhost or sepolia).${line}`
  );
  process.exit(1);
}


// Use Sepolia ABI if available, otherwise use localhost ABI
const abiToUse = (deploySepolia || deployLocalhost).abi;

const tsCode = `
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const ${CONTRACT_NAME}ABI = ${JSON.stringify({ abi: abiToUse }, null, 2)} as const;
\n`;
const tsAddresses = `
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const ${CONTRACT_NAME}Addresses = { 
  "11155111": { address: "${deploySepolia?.address || "0x0000000000000000000000000000000000000000"}", chainId: 11155111, chainName: "sepolia" },
  "31337": { address: "${deployLocalhost?.address || "0x0000000000000000000000000000000000000000"}", chainId: 31337, chainName: "hardhat" },
};
`;

console.log(`Generated ${path.join(outdir, `${CONTRACT_NAME}ABI.ts`)}`);
console.log(`Generated ${path.join(outdir, `${CONTRACT_NAME}Addresses.ts`)}`);
console.log(tsAddresses);

fs.writeFileSync(path.join(outdir, `${CONTRACT_NAME}ABI.ts`), tsCode, "utf-8");
fs.writeFileSync(
  path.join(outdir, `${CONTRACT_NAME}Addresses.ts`),
  tsAddresses,
  "utf-8"
);
