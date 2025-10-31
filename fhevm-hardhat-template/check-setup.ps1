# Script kiểm tra setup trước khi deploy
# Chạy: .\check-setup.ps1

Write-Host "🔍 Đang kiểm tra setup..." -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Node.js
Write-Host "1. Kiểm tra Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Node.js version: $nodeVersion" -ForegroundColor Green
    $nodeMajor = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
    if ($nodeMajor -lt 20) {
        Write-Host "   ⚠️  Cần Node.js >= 20, hiện tại: $nodeMajor" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Node.js chưa được cài đặt!" -ForegroundColor Red
    exit 1
}

# Kiểm tra npm
Write-Host "2. Kiểm tra npm..." -ForegroundColor Yellow
$npmVersion = npm --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ npm version: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ npm chưa được cài đặt!" -ForegroundColor Red
    exit 1
}

# Kiểm tra node_modules
Write-Host "3. Kiểm tra dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules đã tồn tại" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules chưa có, cần chạy: npm install" -ForegroundColor Red
}

# Kiểm tra Hardhat vars
Write-Host "4. Kiểm tra Hardhat variables..." -ForegroundColor Yellow
Write-Host "   (Chạy 'npx hardhat vars setup' để xem các biến cần thiết)" -ForegroundColor Gray

# Kiểm tra file config
Write-Host "5. Kiểm tra config files..." -ForegroundColor Yellow
if (Test-Path "hardhat.config.ts") {
    Write-Host "   ✅ hardhat.config.ts tồn tại" -ForegroundColor Green
} else {
    Write-Host "   ❌ hardhat.config.ts không tồn tại!" -ForegroundColor Red
}

if (Test-Path "contracts/FHEBMICalculator.sol") {
    Write-Host "   ✅ FHEBMICalculator.sol tồn tại" -ForegroundColor Green
} else {
    Write-Host "   ❌ FHEBMICalculator.sol không tồn tại!" -ForegroundColor Red
}

if (Test-Path "deploy/deploy.ts") {
    Write-Host "   ✅ deploy.ts tồn tại" -ForegroundColor Green
} else {
    Write-Host "   ❌ deploy.ts không tồn tại!" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Checklist để deploy:" -ForegroundColor Cyan
Write-Host "   [ ] Chạy: npm install" -ForegroundColor White
Write-Host "   [ ] Set MNEMONIC: npx hardhat vars set MNEMONIC" -ForegroundColor White
Write-Host "   [ ] Set INFURA_API_KEY: npx hardhat vars set INFURA_API_KEY" -ForegroundColor White
Write-Host "   [ ] (Optional) Set ETHERSCAN_API_KEY: npx hardhat vars set ETHERSCAN_API_KEY" -ForegroundColor White
Write-Host "   [ ] Có Sepolia ETH trong wallet" -ForegroundColor White
Write-Host "   [ ] Compile: npx hardhat compile" -ForegroundColor White
Write-Host "   [ ] Deploy: npx hardhat deploy --network sepolia" -ForegroundColor White

