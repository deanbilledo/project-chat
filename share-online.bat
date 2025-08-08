@echo off
echo 🚀 Easy Internet Access Setup for Your Messenger App
echo.
echo This script will help you share your messenger with friends over the internet
echo using ngrok (no port forwarding needed!)
echo.

echo 📦 Checking if ngrok is installed...
where ngrok >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ ngrok is already installed!
    goto :start_ngrok
) else (
    echo ❌ ngrok is not installed
    echo.
    echo 📥 Installing ngrok...
    npm install -g ngrok
    if %errorlevel% neq 0 (
        echo ❌ Failed to install ngrok
        echo 💡 Please install it manually: npm install -g ngrok
        pause
        exit /b 1
    )
    echo ✅ ngrok installed successfully!
)

:start_ngrok
echo.
echo 🌐 Starting ngrok tunnel...
echo 📝 This will create a public URL for your messenger app
echo.
echo ⚠️  IMPORTANT: 
echo    - Keep this window open while friends are using the app
echo    - The URL will change each time you restart ngrok
echo    - Share the HTTPS URL (more secure)
echo.
echo 🚀 Starting ngrok on port 3000...
echo.

ngrok http 3000
