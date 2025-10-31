# 💰 Lấy Sepolia ETH để Deploy Contract

## ⚠️ Vấn đề
Wallet của bạn hiện tại có **0 ETH** trên Sepolia testnet. Cần ít nhất **0.001-0.01 ETH** để deploy contract.

## 🚰 Cách 1: Sepolia Faucet (Khuyến nghị)

### Option A: Alchemy Sepolia Faucet
1. Truy cập: https://sepoliafaucet.com/
2. Nhập địa chỉ wallet của bạn (từ private key trong .env)
3. Hoàn tất CAPTCHA
4. Chờ vài phút để nhận ETH

### Option B: Infura Sepolia Faucet
1. Truy cập: https://www.infura.io/faucet/sepolia
2. Đăng nhập với tài khoản Infura (cùng account dùng cho API key)
3. Request Sepolia ETH
4. Chờ vài phút để nhận ETH

### Option C: Chainlink Faucet
1. Truy cập: https://faucets.chain.link/sepolia
2. Connect wallet hoặc nhập địa chỉ
3. Request Sepolia ETH
4. Chờ vài phút để nhận ETH

## 📋 Cách 2: Kiểm tra địa chỉ wallet

Để lấy địa chỉ wallet từ private key, bạn có thể:

### Dùng Hardhat console:
```powershell
npx hardhat console --network sepolia
```

Sau đó trong console:
```javascript
const { ethers } = require("hardhat");
const signers = await ethers.getSigners();
console.log("Wallet address:", signers[0].address);
```

### Hoặc tạo script đơn giản:
Tạo file `get-address.js`:
```javascript
const { ethers } = require("ethers");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error("PRIVATE_KEY not found in .env");
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey);
console.log("Wallet Address:", wallet.address);
```

Chạy:
```powershell
node get-address.js
```

## ✅ Sau khi có Sepolia ETH

1. Kiểm tra balance trên Etherscan:
   - Truy cập: https://sepolia.etherscan.io/address/YOUR_WALLET_ADDRESS
   - Thay `YOUR_WALLET_ADDRESS` bằng địa chỉ của bạn

2. Deploy lại:
   ```powershell
   npx hardhat deploy --network sepolia
   ```

## 💡 Lưu ý

- Sepolia ETH chỉ dùng cho testnet, không có giá trị thực
- Mỗi faucet có giới hạn số lượng ETH/ngày
- Có thể cần thử nhiều faucet để có đủ ETH
- Đảm bảo địa chỉ wallet chính xác (từ private key trong .env)

## 🔍 Kiểm tra Balance

Sau khi nhận ETH, kiểm tra bằng:
```powershell
npx hardhat console --network sepolia
```

Trong console:
```javascript
const { ethers } = require("hardhat");
const [signer] = await ethers.getSigners();
const balance = await ethers.provider.getBalance(signer.address);
console.log("Balance:", ethers.formatEther(balance), "ETH");
```

