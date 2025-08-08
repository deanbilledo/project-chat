const os = require('os');
const https = require('https');

console.log('🔍 Getting network information for your messenger app...\n');

// Get local network interfaces
const networkInterfaces = os.networkInterfaces();
let localIPs = [];

Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((interface) => {
        if (interface.family === 'IPv4' && !interface.internal) {
            localIPs.push(interface.address);
        }
    });
});

console.log('📍 Local Network Access (same WiFi/network):');
if (localIPs.length > 0) {
    localIPs.forEach(ip => {
        console.log(`   http://${ip}:3000`);
    });
} else {
    console.log('   No local network interfaces found');
}

console.log('\n🌐 Getting your public IP address...');

// Get public IP address
const options = {
    hostname: 'api.ipify.org',
    path: '/?format=json',
    method: 'GET'
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const result = JSON.parse(data);
            console.log(`📡 Your Public IP: ${result.ip}`);
            console.log(`🔗 Public Access URL: http://${result.ip}:3000`);
            
            console.log('\n' + '='.repeat(60));
            console.log('📋 INSTRUCTIONS FOR YOUR FRIENDS:');
            console.log('='.repeat(60));
            
            console.log('\n1️⃣  If they are on the SAME WiFi network as you:');
            localIPs.forEach(ip => {
                console.log(`    Share this URL: http://${ip}:3000`);
            });
            
            console.log('\n2️⃣  If they are on DIFFERENT WiFi/internet:');
            console.log(`    a) You need to set up port forwarding on your router`);
            console.log(`    b) Forward port 3000 to your computer (${localIPs[0] || 'your local IP'})`);
            console.log(`    c) Then share: http://${result.ip}:3000`);
            
            console.log('\n3️⃣  Alternative - Use a service like ngrok:');
            console.log(`    a) Install ngrok: npm install -g ngrok`);
            console.log(`    b) Run: ngrok http 3000`);
            console.log(`    c) Share the https URL ngrok provides`);
            
            console.log('\n🔒 ROUTER PORT FORWARDING STEPS:');
            console.log('    1. Open your router admin panel (usually 192.168.1.1 or 192.168.0.1)');
            console.log('    2. Look for "Port Forwarding" or "Virtual Servers"');
            console.log('    3. Add new rule:');
            console.log(`       - External Port: 3000`);
            console.log(`       - Internal Port: 3000`);
            console.log(`       - Internal IP: ${localIPs[0] || '[YOUR_LOCAL_IP]'}`);
            console.log(`       - Protocol: TCP`);
            console.log('    4. Save and restart router if needed');
            
            console.log('\n🚨 SECURITY NOTE:');
            console.log('    Port forwarding opens your computer to the internet.');
            console.log('    Only do this temporarily and close the port when done.');
            
        } catch (error) {
            console.log('❌ Could not get public IP address');
            console.log('💡 You can manually check your public IP at: https://whatismyipaddress.com/');
        }
        
        console.log('\n');
    });
});

req.on('error', (error) => {
    console.log('❌ Error getting public IP:', error.message);
    console.log('💡 You can manually check your public IP at: https://whatismyipaddress.com/');
    
    console.log('\n📋 Manual Instructions:');
    console.log('1. Get your public IP from https://whatismyipaddress.com/');
    console.log('2. Set up port forwarding on your router for port 3000');
    console.log('3. Share http://[YOUR_PUBLIC_IP]:3000 with friends');
});

req.end();
