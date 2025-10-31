# PowerShell script to deploy contract to Hardhat network on Windows
# This replaces the bash script which doesn't work on Windows

$ErrorActionPreference = "Stop"

$HARDHAT_NODE_PORT = 8545
$HARDHAT_NODE_HOST = "127.0.0.1"
$HARDHAT_NODE_URL = "http://${HARDHAT_NODE_HOST}:${HARDHAT_NODE_PORT}"
$TIMEOUT_SECONDS = 60
$CHECK_INTERVAL_SECONDS = 1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$hardhatDir = Join-Path $scriptDir "..\..\fhevm-hardhat-template"

if (-not (Test-Path $hardhatDir)) {
    Write-Host "Error: Cannot find fhevm-hardhat-template directory at $hardhatDir" -ForegroundColor Red
    exit 1
}

Set-Location $hardhatDir

Write-Host "--- Starting Hardhat Node in background ---" -ForegroundColor Cyan

# Start Hardhat Node in the background
$hardhatNode = Start-Process -FilePath "npx" -ArgumentList "hardhat", "node" -PassThru -NoNewWindow -WindowStyle Hidden

if ($null -eq $hardhatNode) {
    Write-Host "Error: Failed to start Hardhat Node" -ForegroundColor Red
    exit 1
}

Write-Host "Hardhat Node started with PID: $($hardhatNode.Id). Waiting for it to be ready..." -ForegroundColor Yellow

# Wait for Hardhat Node to be ready
$attempts = 0
$nodeReady = $false

while ($attempts -lt $TIMEOUT_SECONDS -and -not $nodeReady) {
    try {
        $response = Invoke-WebRequest -Uri $HARDHAT_NODE_URL -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "Hardhat Node is ready!" -ForegroundColor Green
            $nodeReady = $true
            break
        }
    } catch {
        # Node not ready yet
    }
    
    if (-not $nodeReady) {
        Write-Host "Waiting for Hardhat Node... (Attempt $($attempts + 1)/$TIMEOUT_SECONDS)" -ForegroundColor Yellow
        Start-Sleep -Seconds $CHECK_INTERVAL_SECONDS
        $attempts++
    }
}

if (-not $nodeReady) {
    Write-Host "Error: Hardhat Node did not start within $TIMEOUT_SECONDS seconds." -ForegroundColor Red
    if (-not $hardhatNode.HasExited) {
        Stop-Process -Id $hardhatNode.Id -Force -ErrorAction SilentlyContinue
    }
    exit 1
}

# Wait a bit more to ensure node is fully ready
Start-Sleep -Seconds 2

# Deploy FHEBMICalculator.sol on localhost
Write-Host "--- Deploying FHEBMICalculator.sol on Hardhat Node ---" -ForegroundColor Cyan
$deployExitCode = 0

try {
    # Add localhost network to hardhat config if not exists
    # For now, we'll use hardhat network directly by deploying with --network localhost
    # hardhat-deploy should handle this
    
    npx hardhat deploy --network localhost
    $deployExitCode = $LASTEXITCODE
} catch {
    Write-Host "Deployment error: $_" -ForegroundColor Red
    $deployExitCode = 1
}

# Kill Hardhat Node
Write-Host "--- Stopping Hardhat Node (PID: $($hardhatNode.Id)) ---" -ForegroundColor Cyan
if (-not $hardhatNode.HasExited) {
    Stop-Process -Id $hardhatNode.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Hardhat Node stopped." -ForegroundColor Green
} else {
    Write-Host "Hardhat Node already stopped." -ForegroundColor Yellow
}

# Wait a bit to ensure cleanup
Start-Sleep -Seconds 1

# Exit with deployment exit code
if ($deployExitCode -ne 0) {
    exit $deployExitCode
}

