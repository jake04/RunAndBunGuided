# Quick Start Guide

Get the Pokémon Damage Calculator running on macOS in 5 minutes.

## Step 1: Install Dependencies (1 min)

```bash
# From the project root directory
npm run macos:install
```

**What this does**: 
- Creates an isolated Python virtual environment in `macos-app/venv/`
- Installs PyQt5, Flask, and dependencies into that environment
- This avoids any system Python conflicts (PEP 668)

The setup is automatic — all npm commands use this virtual environment.

## Step 2: Build the Calculator (1-2 min)

```bash
# From root directory
npm run build
```

**What this does**: Compiles TypeScript to JavaScript, bundles the web UI.

## Step 3: Verify Setup (30 sec)

```bash
python macos-app/verify.py
```

**What this does**: Checks that all dependencies are installed and build output exists.

If all checks pass ✓, continue to Step 4.
If any checks fail ✗, review the troubleshooting section in [SETUP_GUIDE.md](SETUP_GUIDE.md).

## Step 4: Run the App! (30 sec)

```bash
npm run macos:dev
```

Or directly:
```bash
python macos-app/src/app.py
```

**What happens**:
1. Flask server starts on port 5000
2. PyQt5 window opens
3. Calculator loads in the window
4. Ready to use!

---

## Next: Import mGBA Script Data

### Option A: Quick Test Import

```bash
# Create a test team data file
cat > /tmp/test_team.json << 'EOF'
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
EOF

# Copy to clipboard (macOS)
cat /tmp/test_team.json | pbcopy

# In the app: Tools → Import mGBA Script Data → Paste
```

### Option B: With Your mGBA Script

1. Run your mGBA Lua script to export team data
2. Copy the output
3. In the app: **Tools → Import mGBA Script Data** (Cmd+I)
4. Paste your data
5. Click "Import"

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'PyQt5'"
Run: `pip install -r macos-app/requirements.txt`

### "Port 5000 already in use"
Close other apps using port 5000, or:
```bash
# Find process using port 5000
lsof -i :5000
# Kill it (replace PID with the number)
kill -9 <PID>
```

### "Calculator not found"
Run: `npm run build`

### "Python command not found"
Use: `python3` instead of `python`
Or install Python via Homebrew: `brew install python3`

### App won't open from Applications folder
Run:
```bash
xattr -d com.apple.quarantine /Applications/Pokémon\ Damage\ Calculator.app
```

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run macos:install` | Install Python dependencies |
| `npm run build` | Build calculator & web UI |
| `npm run macos:dev` | Run app in development |
| `npm run macos:build` | Build .app bundle |
| `npm run macos:clean` | Remove build artifacts |
| `python macos-app/verify.py` | Check dependencies |

---

## What's Next?

- **Full docs**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Architecture**: See [README.md](README.md)
- **Roadmap**: See [ROADMAP.md](ROADMAP.md)
- **Main project**: See [../README.md](../README.md)

---

## Reporting Issues

If something doesn't work:

1. Run `python macos-app/verify.py` and share the output
2. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section
3. Open an issue on GitHub with:
   - Python version: `python --version`
   - macOS version: `sw_vers`
   - Error message and steps to reproduce

---

**Happy calculating! ⚡**
