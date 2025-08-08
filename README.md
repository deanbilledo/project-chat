# Project Messenger - Real-time Chat Application

A modern, real-time messenger## Usage

### For Host (You)
1. Run `start.bat` or `npm start` in the project directory
2. Share the network URL with friends
3. Open http://localhost:3000 in your browser
4. Enter your nickname to login/create account
5. Start chatting in public or search for users to message privately!

### For Friends
1. Open the shared URL in their browser
2. Enter their nickname to login/create account
3. Search for other users or join the public chat

### How to Use Messenger Features

**Public Chat:**
- Click "Public Chat" in the sidebar to join the group conversation
- Everyone online can see and participate in these messages

**Private Messaging:**
1. Use the search box at the top to find users by nickname
2. Click on a user from the search results to start a private chat
3. Your conversation will appear in the sidebar for easy access
4. Switch between public and private chats by clicking in the sidebar

**User Search:**
- Type at least 2 characters in the search box
- Results show online status and last seen information
- Click any user to start a private conversation built with Node.js, Express, and Socket.io. Features both public group chat and private messaging with user search functionality.

## Features

- 🚀 **Real-time messaging** - Instant message delivery for both public and private chats
- 👥 **Simple account system** - Login with just a nickname (auto-creates account)
- 🔍 **User search** - Find and message any registered user
- 💬 **Private messaging** - Send direct messages to specific users
- 🌐 **Public chat room** - Group conversation visible to everyone
- ⌨️ **Typing indicators** - See when others are typing in both public and private chats
- 📱 **Responsive design** - Works perfectly on desktop and mobile devices
- 🌐 **Network access** - Friends can connect from different networks
- 👤 **User management** - See who's online and offline status
- ⏰ **Smart timestamps** - Contextual time display (now, time, or full date)
- 🎨 **Modern UI** - Clean, messenger-like interface

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- PowerShell (Windows) or Terminal (Mac/Linux)

### Installation

1. **Clone or download the project**
   ```powershell
   git clone <repository-url>
   cd project-chat
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the server**
   ```powershell
   npm start
   ```

4. **Open your browser**
   - Local access: http://localhost:3000
   - The server will display network URLs that friends can use to connect

### Development Mode

For development with auto-restart on file changes:
```powershell
npm run dev
```

## Network Access Setup

To allow friends to connect from different networks:

### 1. Find Your IP Address
```powershell
ipconfig
```
Look for your IPv4 Address (usually starts with 192.168. or 10.)

### 2. Configure Windows Firewall
```powershell
# Run PowerShell as Administrator
New-NetFirewallRule -DisplayName "Chat App" -Direction Inbound -Port 3000 -Protocol TCP -Action Allow
```

### 3. Router Port Forwarding (if needed)
If friends can't connect, you may need to set up port forwarding on your router:
1. Access your router's admin panel (usually 192.168.1.1 or 192.168.0.1)
2. Find "Port Forwarding" or "Virtual Server" settings
3. Forward external port 3000 to your computer's IP address port 3000

### 4. Share Your Public IP
Find your public IP at https://whatismyipaddress.com and share:
```
http://[YOUR_PUBLIC_IP]:3000
```

## Usage

### For Host (You)
1. Run `npm start` in the project directory
2. Share the network URL with friends
3. Open http://localhost:3000 in your browser
4. Enter your nickname and start chatting!

### For Friends
1. Open the shared URL in their browser
2. Enter their nickname
3. Start chatting!

## File Structure

```
project-chat/
├── package.json          # Project dependencies and scripts
├── server.js             # Express server with Socket.io and messaging logic
├── start.bat             # Easy startup script for Windows
├── README.md             # This file
├── .gitignore           # Git ignore file
└── public/               # Client-side files
    ├── index.html        # Messenger interface with sidebar and chat area
    ├── styles.css        # Modern messenger-style CSS
    └── app.js            # Client-side messaging and UI logic
```

## Customization

### Changing the Port
Edit `server.js` and modify the PORT variable:
```javascript
const PORT = process.env.PORT || 3001; // Change 3000 to your preferred port
```

### Styling
Modify `public/styles.css` to change colors, fonts, or layout. The design uses a modern messenger-style layout.

### Features
- **Message length limit**: Currently 500 characters (configurable in both `app.js` and `server.js`)
- **Nickname length**: 2-20 characters (configurable in `app.js`)
- **Search results**: Limited to 10 users (configurable in `server.js`)
- **Account persistence**: Accounts persist until server restart (no database)

## Troubleshooting

### Common Issues

**"Cannot GET /"**
- Make sure you're accessing the correct URL (http://localhost:3000)
- Ensure the server is running (`npm start`)

**Friends can't connect**
- Check Windows Firewall settings
- Verify your local IP address
- Consider port forwarding if connecting from outside your network

**Messages not appearing**
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try refreshing the page

**"EADDRINUSE" error**
- Another application is using port 3000
- Change the port in `server.js` or stop the other application

### Server Logs
The server provides helpful information:
- User connections and disconnections
- Message activity
- Network addresses for sharing

## Security Notes

- This application is designed for trusted friend groups
- Simple nickname-based accounts (anyone can use any available nickname)
- Messages are not encrypted in transit (consider HTTPS for production)
- No message persistence (messages and accounts disappear when server restarts)
- Private messages are only stored in memory during the session

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to fork and modify this project for your needs. Some ideas for enhancements:
- Message persistence with a database
- User authentication with passwords
- Message encryption
- File sharing capabilities
- Group chats (multiple private rooms)
- Emoji reactions
- Message editing/deletion
- Push notifications

## License

MIT License - feel free to use and modify as needed.
Start-Process powershell -ArgumentList "-Command", "npx localtunnel --port 3000" -WindowStyle Normal