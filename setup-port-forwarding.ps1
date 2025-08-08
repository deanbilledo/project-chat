# Port Forwarding Quick Setup Script
# Run this script to open router admin panel

Write-Host "🌐 MESSENGER APP - PORT FORWARDING HELPER" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Display current network info
Write-Host "📍 Current Network Information:" -ForegroundColor Yellow
Write-Host "   Local IP: 192.168.1.57"
Write-Host "   Router IP: 192.168.1.1"
Write-Host "   Public IP: 49.145.202.77"
Write-Host ""

# Display port forwarding settings
Write-Host "⚙️  Port Forwarding Configuration:" -ForegroundColor Yellow
Write-Host "   Service Name: Messenger App"
Write-Host "   External Port: 3000"
Write-Host "   Internal IP: 192.168.1.57"
Write-Host "   Internal Port: 3000"
Write-Host "   Protocol: TCP"
Write-Host ""

# Ask user if they want to open router admin
$openRouter = Read-Host "Open router admin panel? (y/n)"
if ($openRouter -eq "y" -or $openRouter -eq "Y") {
    Write-Host "🌐 Opening router admin panel..." -ForegroundColor Green
    Start-Process "http://192.168.1.1"
}

Write-Host ""
Write-Host "🔗 After setup, share this URL with friends:" -ForegroundColor Green
Write-Host "   👉 http://49.145.202.77:3000" -ForegroundColor White -BackgroundColor Blue
Write-Host ""

# Test local connectivity
Write-Host "🧪 Testing local server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://192.168.1.57:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ Local server is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Local server not responding: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Configure port forwarding in router admin panel"
Write-Host "   2. Test with: http://49.145.202.77:3000"
Write-Host "   3. Share URL with friends outside your network"
Write-Host ""

Read-Host "Press Enter to exit"
