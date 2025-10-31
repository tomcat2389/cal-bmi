# 🚀 Hướng Dẫn Deploy Với Private Key (.env)

## 📋 Bước 1: Cài đặt Dependencies

```powershell
npm install
```

Package `dotenv` sẽ được cài đặt tự động để đọc file `.env`.

## 📝 Bước 2: Tạo file .env

1. Tạo file `.env` trong thư mục `fhevm-hardhat-template/`
2. Điền thông tin theo mẫu:

```env
PRIVATE_KEY=your_private_key_here_without_0x
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Lấy Private Key từ MetaMask:
1. Mở MetaMask → Click vào account
2. Chọn **Account Details**
3. Click **Export Private Key**
4. Nhập password
5. Copy private key (có thể có hoặc không có prefix `0x`, đều OK)

### Lấy Infura API Key:
- Đăng ký tại: https://infura.io/
- Tạo project mới → Copy API Key

### Lấy Etherscan API Key (Optional):
- Đăng ký tại: https://etherscan.io/
- Tạo API key tại: https://etherscan.io/myapikey

## 💰 Bước 4: Nhận Sepolia ETH

**QUAN TRỌNG**: Bạn cần Sepolia ETH để trả gas fees!

1. Lấy địa chỉ wallet (từ Bước 2)
2. Truy cập một trong các faucet:
   - https://sepoliafaucet.com/
   - https://www.infura.io/faucet/sepolia
   - https://faucets.chain.link/sepolia
3. Nhập địa chỉ wallet và request ETH
4. Kiểm tra balance:
   ```powershell
   npm run wallet:info
   ```

Cần ít nhất **0.001-0.01 ETH** để deploy.

## ✅ Bước 5: Compile Contract

```powershell
npx hardhat compile
```

## 🚀 Bước 6: Deploy lên Sepolia

```powershell
npx hardhat deploy --network sepolia
```

**Kết quả sẽ hiển thị:**
```
FHEBMICalculator contract: 0x...
```

Copy địa chỉ này lại để update frontend sau.

## ✅ Bước 7: Verify Contract (Optional nhưng nên làm)

```powershell
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

Thay `<CONTRACT_ADDRESS>` bằng địa chỉ contract vừa deploy.

## 📝 Lưu Ý

- ✅ File `.env` đã được `.gitignore`, an toàn với git
- ✅ Nếu có `PRIVATE_KEY` trong `.env`, sẽ ưu tiên dùng private key
- ✅ Nếu không có `PRIVATE_KEY`, sẽ fallback về `MNEMONIC` từ Hardhat vars
- ⚠️ **KHÔNG BAO GIỜ** commit file `.env` lên git!
- ⚠️ Đảm bảo wallet có Sepolia ETH (ít nhất 0.01 ETH)

## 🔄 Update Frontend

Sau khi deploy, chạy:

```powershell
cd ../frontend
npm run genabi
```

Script này sẽ tự động lấy contract address mới và update vào frontend.

