# Recall AI

An Electron-based desktop application that tracks and logs active window usage, helping you understand your computer usage patterns.

## Features

- Automatic window activity tracking
- Cross-platform support (Windows, macOS)
- Local SQLite database storage
- Minimal and unobtrusive interface

## Prerequisites

Before running this application, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dalva8711/recall-ai.git
cd recall-ai
```

2. Install dependencies:
```bash
npm install
```

## Usage

To start the application:
```bash
npm start
```

The application will run in the background and automatically track your active windows every minute.

## Project Structure

- `main.js` - Main Electron process file
- `public/` - Contains the HTML entry point
- `src/` - Renderer process and other source files
- `logger/` - Activity logging functionality
  - `activityLogger.js` - Window activity tracking logic
  - `query.js` - Database query utilities
  - `clear.js` - Database cleanup utilities

## Dependencies

- [Electron](https://www.electronjs.org/) - Cross-platform desktop application framework
- [active-win](https://github.com/sindresorhus/active-win) - Get metadata about the active window
- [sqlite3](https://github.com/TryGhost/node-sqlite3) - SQLite database for Node.js

## Development

The application is built using Electron and uses:
- CommonJS modules
- SQLite for data storage
- Native window tracking capabilities

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request