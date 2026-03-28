# macOS App Development Roadmap

## Current Status: Iteration 1 - Bare Minimum Viable Product

This iteration provides a standalone macOS application that embeds the existing web calculator with mGBA script import capability.

### Features Included ✓
- ✓ Native PyQt5 application window (runs standalone)
- ✓ Embedded web UI (existing HTML/JS calculator)
- ✓ Flask web server (lightweight alternative to Express)
- ✓ mGBA script import dialog (JSON and text format parsing)
- ✓ Python ↔ JavaScript bridge for data injection
- ✓ Menu bar (File, Tools, Help)
- ✓ Packaging for distribution (py2app)
- ✓ No external dependencies beyond Python, PyQt5, Flask

### Known Limitations ⚠️

1. **Node.js Dependency**
   - The `/calculate` endpoint still delegates to Node.js Express server
   - Solution in Iteration 2: Port TypeScript calculator to pure Python
   - Workaround: Run both Flask and Node servers (or py2app will need Node bundled)

2. **Port 5000 Hard-Coded**
   - Flask server uses port 5000 (conflicts with Airplay Receiver on some Macs)
   - Solution: Make configurable in environment variables or UI settings

3. **Limited mGBA Integration**
   - Only manual import via copy-paste
   - No real-time file watching or auto-refresh
   - Solution in Iteration 2: Watch mGBA log files for real-time updates

4. **No Data Persistence**
   - App state not saved on close
   - No history of imports or favorite sets
   - Solution in Iteration 2: Add SQLite storage for user data

5. **Single-Window UI**
   - No separate team builder or advanced configurator
   - All features accessed through embedded web view
   - Solution in Iteration 3: Add macOS-native UI elements

## Iteration 2 Roadmap (Proposed)

### High Priority
- [ ] **Port calc to pure Python** - Remove Node.js dependency
  - Effort: High (weeks)
  - Benefit: Lightweight, single process, easier distribution
  - Consider: Using pydantic for data validation

- [ ] **Real-time script monitoring** - Auto-import fresh data
  - Effort: Medium (days)
  - Implementation: Watch mGBA logs or temp files for changes
  - Benefit: Live calculator updates as you switch Pokémon

- [ ] **Data persistence** - Save sets and preferences
  - Effort: Medium (days)
  - Implementation: SQLite or JSON file storage
  - Features: Favorite teams, damage thresholds, preferences

### Medium Priority
- [ ] **Settings/preferences UI**
  - Team import format customization
  - Port configuration
  - Appearance (dark mode, font size)

- [ ] **Keyboard shortcuts optimization**
  - Common calculator actions (switch Pokémon, change move, etc.)
  - QuickLook integration (macOS feature)

- [ ] **Error reporting & logging**
  - Better error messages for common issues
  - Debug log export for troubleshooting

### Low Priority
- [ ] **macOS Menu Bar icon** - Minimize to menu bar
- [ ] **Notifications** - Damage threshold alerts
- [ ] **Siri Shortcuts** - Integration with macOS automation
- [ ] **iCloud sync** - Sync sets across devices (requires backend)

## Iteration 3+ (Future Vision)

### Multi-Window Support
- Separate team builder window
- Individual Pokémon configuration
- Set comparison view
- Spreadsheet-like team editor

### Advanced Features
- Integration with Pokémon Showdown (live ladder)
- Battle simulator (link with actual battles)
- Move effectiveness analyzer
- Type matchup visualizer
- Damage range graphs and statistics

### Platform Expansion
- Windows version (via PyInstaller)
- Linux version (GTK or Qt native)
- Web version (existing)
- iOS/Android companion app

## Technical Debt & Known Issues

### Architecture
- Flask server and PyQt5 app run in same process
  - Pro: Simple deployment
  - Con: If one crashes, both go down
  - Future: Consider separate server process

### Python Version Support
- Currently requires Python 3.9+
- Could drop to 3.8 with minor changes
- Should support 3.12 (test on release)

### Code Organization
- app.py is growing (currently ~200 lines)
- Should split into:
  - `app.py` - main window & lifecycle
  - `windows/` - separate window types
  - `widgets/` - reusable UI components

### Testing
- Currently no automated tests (manual verification only)
- Should add:
  - Unit tests for Flask endpoints
  - Integration tests for script parsing
  - UI tests for PyQt5 components

## Dependencies Update Schedule

Keep dependencies current for security:
- PyQt5: 5.15.x (latest stable)
- Flask: 3.x (latest)
- py2app: Latest compatible with macOS version

Track these annually:
- macOS minimum version support (currently 10.13)
- Python minimum version (currently 3.9)

## Decision Points for Iteration 2

### 1. Python Calculator Port - Go/No-Go
**Decision**: Port TypeScript calc to pure Python
- **Pro**: No Node.js dependency, lighter bundle, faster startup
- **Con**: High effort, risk of calculation bugs
- **Alternative**: Keep Node subprocess (heavier but lower risk)

### 2. Auto-Sync Features - Scope?
**Decision**: Implement real-time mGBA script monitoring
- **Pro**: Seamless workflow, live updates
- **Con**: Complex file watching, debugging challenges
- **Alternative**: Keep manual import only (simpler, still useful)

### 3. Data Storage Backend
**Decision**: SQLite in user's `~/Library/Application Support/`
- **Pro**: Standard macOS convention, no external services
- **Con**: Single-device only (no cloud sync)
- **Alternative**: SQLite + optional cloud sync endpoint (future)

## Contributing

To help with the roadmap:
1. Pick an item from the Iteration 2 list
2. Create a GitHub issue with your proposal
3. Discuss implementation approach
4. Submit PR with tests
5. Get code review + merge

Priority fixes (help needed):
- [ ] Node.js subprocess testing (Windows/Linux compat)
- [ ] Python packaging improvements (easier installation)
- [ ] Documentation improvements
- [ ] Test coverage

---

**Last Updated**: March 24, 2026
**Iteration**: 1 (MVP)
**Status**: Ready for initial testing
