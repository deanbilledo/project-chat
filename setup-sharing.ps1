# PowerShell script to help setup messenger sharing
Write-Host "🚀 Messenger Sharing Setup Assistant" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get local IP addresses
Write-Host "📍 Finding your network information..." -ForegroundColor Yellow
$localIPs = @()
Get-NetIPConfiguration | Where-Object { $_.IPv4Address.PrefixOrigin -eq "Dhcp" -or $_.IPv4Address.PrefixOrigin -eq "Manual" } | ForEach-Object {
    $ip = $_.IPv4Address.IPAddress
    if ($ip -match "^192\.168\.|^10\.|^172\.") {
        $localIPs += $ip
    }
}

Write-Host ""
Write-Host "📡 Your Local Network Access URLs:" -ForegroundColor Green
if ($localIPs.Count -gt 0) {
    foreach ($ip in $localIPs) {
        Write-Host "   http://$ip:3000" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "✅ Share these URLs with friends on the SAME WiFi network" -ForegroundColor Green
} else {
    Write-Host "❌ No local network interfaces found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 For friends on DIFFERENT networks, you have 2 options:" -ForegroundColor Yellow
Write-Host ""

# Check if ngrok is installed
Write-Host "🔍 Checking for ngrok..." -ForegroundColor Yellow
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue

if ($ngrokInstalled) {
    Write-Host "✅ ngrok is already installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 To share over the internet:" -ForegroundColor Cyan
    Write-Host "   1. Run: ngrok http 3000" -ForegroundColor White
    Write-Host "   2. Copy the https:// URL ngrok provides" -ForegroundColor White
    Write-Host "   3. Share that URL with friends" -ForegroundColor White
} else {
    Write-Host "❌ ngrok not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 To install ngrok:" -ForegroundColor Cyan
    Write-Host "   npm install -g ngrok" -ForegroundColor White
    Write-Host ""
    Write-Host "Or download from: https://ngrok.com/download" -ForegroundColor White
}

Write-Host ""
Write-Host "🛡️ Checking Windows Firewall..." -ForegroundColor Yellow

# Check firewall rule
$firewallRule = Get-NetFirewallRule -DisplayName "*3000*" -ErrorAction SilentlyContinue
if ($firewallRule) {
    Write-Host "✅ Firewall rule for port 3000 already exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  No firewall rule found for port 3000" -ForegroundColor Yellow
    Write-Host ""
    $createRule = Read-Host "Create firewall rule to allow port 3000? (y/n)"
    if ($createRule -eq "y" -or $createRule -eq "Y") {
        try {
            New-NetFirewallRule -DisplayName "Messenger App Port 3000" -Direction Inbound -Port 3000 -Protocol TCP -Action Allow
            Write-Host "✅ Firewall rule created successfully!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to create firewall rule. Please run as Administrator." -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "📋 SUMMARY:" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "1. Same WiFi: Share local IP URLs above" -ForegroundColor White
Write-Host "2. Internet: Use ngrok http 3000" -ForegroundColor White
Write-Host "3. Make sure Windows Firewall allows port 3000" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Need more help? Check SHARING_GUIDE.txt" -ForegroundColor Yellow
Write-Host ""

# Try to get public IP
Write-Host "🌍 Attempting to get your public IP..." -ForegroundColor Yellow
try {
    $publicIP = Invoke-RestMethod -Uri "https://api.ipify.org" -TimeoutSec 5
    Write-Host "📡 Your Public IP: $publicIP" -ForegroundColor Green
    Write-Host "   (For port forwarding: http://$publicIP:3000)" -ForegroundColor White
} catch {
    Write-Host "❌ Could not get public IP automatically" -ForegroundColor Red
    Write-Host "   Check manually at: https://whatismyipaddress.com" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
