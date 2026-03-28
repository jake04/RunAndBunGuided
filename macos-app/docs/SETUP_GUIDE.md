# macOS App Setup Guide

Quick start for setting up and running the Pokémon Damage Calculator as a native macOS application.

## Prerequisites

- macOS 10.13 or later
- Python 3.9 or later (recommended: 3.11)
- Node.js 14+ (for building the calculator)
- Homebrew (optional, for installing Python if needed)

## Quick Start (Development)

### 1. Install Python Dependencies

```bash
# From the project root directory
npm run macos:install
```

This installs:
- PyQt5 (GUI framework)
- Flask (web server)
- Flask-CORS (cross-origin requests)
- requests (for HTTP calls)

The packages are installed to `~/.local/lib/python3.x/site-packages/` (your user directory).

#### Using a Virtual Environment (Alternative)

If you prefer isolation or want to avoid modifying your global Python, use a virtual environment instead:

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
python3 -m pip install -r macos-app/requirements.txt

# To run the app, make sure venv is activated first:
source venv/bin/activate
python3 macos-app/src/app.py
```

### 2. Build the Calculator

```bash
# Build the TypeScript calculator to JavaScript
npm run build
```

This creates the `dist/` directory with the compiled frontend and calculator libraries.

### 3. Run the App (Development Mode)

```bash
# Start the PyQt5 app
npm run macos:dev
```

Or directly with Python:
```bash
python macos-app/src/app.py
```

The app will:
1. Start a Flask web server on `http://localhost:5000`
2. Launch a PyQt5 window
3. Load the calculator UI in an embedded WebView
4. Be ready to use immediately

## Building a Distributable App

### 1. Ensure Everything is Built

```bash
# Clean previous builds
npm run macos:clean

# Build the calculator and web UI
npm run build
```

### 2. Build the .app Bundle

```bash
# Build the standalone macOS app
npm run macos:build
```

This creates `macos-app/dist/Pokémon Damage Calculator.app`

### 3. (Optional) Move to Applications

```bash
# Copy to Applications folder
cp -r macos-app/dist/Pokémon\ Damage\ Calculator.app /Applications/

# Launch from Spotlight (Cmd+Space, type "Pokémon")
# Or open directly with Finder
```

## Using mGBA Script Integration

### 1. Prepare Your mGBA Script

Create a Lua script for mGBA that exports Pokémon team data. Expected format:

**JSON Format (Preferred):**
```json
{
  "team": [
    {
      "species": "Pikachu",
      "level": 50,
      "moves": ["Thunderbolt", "Quick Attack"],
      "ability": "Static",
      "nature": "Timid",
      "item": "Leftovers"
    }
  ]
}
```

**Text Format:**
```
Pokemon: Pikachu
Level: 50
Move1: Thunderbolt
Move2: Quick Attack
Ability: Static
Nature: Timid
Item: Leftovers

Pokemon: Charizard
...
```

### 2. Import into Calculator

1. Run your mGBA Lua script to output team data
2. Copy the output to clipboard
3. In the calculator app: **Tools → Import mGBA Script Data** (Cmd+I)
4. Paste the data and click Import
5. The calculator UI will populate with your Pokémon data

## Architecture

```
┌─────────────────────────────────────────────┐
│   Pokémon Damage Calculator (macOS App)     │
├─────────────────────────────────────────────┤
│                                             │
│  PyQt5 Application (app.py)                 │
│    ├─ Menu bar (File, Tools, Help)          │
│    └─ WebView (embedded browser)            │
│        │                                    │
│        ↓                                    │
│  Flask Web Server (server.py)               │
│    ├─ Serves dist/ (web UI)                │
│    ├─ /calculate endpoint (proxies to Node)│
│    └─ Handles static files                 │
│        │                                    │
│        ↓                                    │
│  TypeScript Calculator (calc/)              │
│    ├─ Damage calculation logic              │
│    └─ Pokémon/move/ability data             │
│                                             │
│  Script Import Dialog (script_import_dialog.py)
│    ├─ Parse JSON or text format             │
│    └─ Inject into web UI via JS             │
└─────────────────────────────────────────────┘
```

## Troubleshooting

### "externally-managed-environment" error
macOS Python 3.11+ restricts pip installation to system packages. Options to fix:

**Option 1: Use `--user` flag (default, simpler)**
```bash
# Already configured in npm scripts
npm run macos:install
# Packages install to ~/.local/lib/python3.x/site-packages/
```

**Option 2: Use a virtual environment (recommended for development)**
```bash
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r macos-app/requirements.txt
python3 macos-app/src/app.py
```

**Option 3: Use --break-system-packages (NOT recommended)**
```bash
# Only if you know what you're doing
python3 -m pip install --break-system-packages -r macos-app/requirements.txt
```

### "Pokémon Damage Calculator cannot be opened"
Gatekeeper may block the app. Grant permission:
```bash
# Allow execution
xattr -d com.apple.quarantine /Applications/Pokémon\ Damage\ Calculator.app

# Or open System Preferences → Security & Privacy → General
```

### "Port 5000 already in use"
Another app is using port 5000. Options:
1. Close the conflicting app
2. Edit `macos-app/src/app.py` to use a different port (e.g., 5001)

### "Calculator not found / No data loading"
Ensure you've run `npm run build`:
```bash
npm run build
npm run macos:dev
```

### "Python not found" / "ModuleNotFoundError"
Install Python dependencies:
```bash
pip install -r macos-app/requirements.txt
```

Or use a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r macos-app/requirements.txt
npm run macos:dev
```

### "Script import not working"
1. Ensure data is copied correctly (no extra whitespace)
2. Check format (JSON or text key: value pairs)
3. Open browser console (Cmd+Option+I) to see JavaScript errors

## Development Tips

### Enable Debug Logging

Edit `macos-app/src/app.py` and change:
```python
logging.basicConfig(level=logging.DEBUG)  # Change from INFO to DEBUG
```

### Inspect the Web UI

The embedded WebView supports the same developer tools as a normal browser. In the calculator window:
```
Cmd + Option + I  → Open DevTools (inspect HTML, console, networks)
```

### Modify the Calculator UI

Edit files in `src/` (HTML, CSS, JS) and rebuild:
```bash
npm run build
npm run macos:dev  # Reload to see changes
```

### Add Custom Functionality

Edit `macos-app/src/server.py` to add new API endpoints:
```python
@app.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.json
    # Your logic here
    return jsonify({'result': ...})
```

## Next Steps

**Iteration 2 Goals:**
- Real-time auto-refresh when script data is imported
- Persistent storage of saved sets
- Python port of the calculator (remove Node.js dependency)

**Future Features:**
- Menu bar icon (macOS-specific)
- Notifications for important events
- Keyboard shortcuts for common actions
- Multi-window support (separate team builder)

## Files Reference

| File | Purpose |
|------|---------|
| `macos-app/src/app.py` | Main PyQt5 application |
| `macos-app/src/server.py` | Flask web server |
| `macos-app/src/script_import_dialog.py` | mGBA script import UI |
| `macos-app/setup.py` | Packaging config (py2app) |
| `macos-app/requirements.txt` | Python dependencies |
| `macos-app/README.md` | Architecture overview |

## Support

For issues or feature requests, check the main project [CONTRIBUTING.md](../CONTRIBUTING.md)

For macOS app specific issues, refer to the [README.md](README.md) in this directory.
