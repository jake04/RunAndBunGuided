"""
Main PyQt5 application for the Pokémon damage calculator.
Embeds the web UI in a native macOS window with script import functionality.
"""
import sys
import os
import threading
import time
import logging
from pathlib import Path

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QMenuBar, QMenu, QAction, QMessageBox
)
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import Qt, QUrl, pyqtSlot, QTimer, QObject
from PyQt5.QtWebChannel import QWebChannel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import server from the same package
import server
from script_import_dialog import ScriptImportDialog


class PokemonCalculatorApp(QMainWindow):
    """Main application window."""
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Pokémon Damage Calculator')
        self.setGeometry(100, 100, 1200, 800)
        
        # Start Flask server in background thread
        self.flask_thread = threading.Thread(
            target=self._run_flask,
            daemon=True,
            name='FlaskServer'
        )
        self.flask_thread.start()
        logger.info('Flask server thread started')
        
        # Wait for Flask to be ready (with timeout)
        self.flask_ready = False
        self.wait_for_flask(timeout=10)
        
        # Initialize UI
        self.init_ui()
    
    def wait_for_flask(self, timeout=10):
        """Wait for Flask server to be ready."""
        import socket
        start = time.time()
        while time.time() - start < timeout:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                result = sock.connect_ex(('localhost', 5000))
                sock.close()
                if result == 0:
                    self.flask_ready = True
                    logger.info('Flask server is ready')
                    return
            except Exception:
                pass
            time.sleep(0.1)
        
        logger.warning('Flask server did not start within timeout')
    
    def init_ui(self):
        """Initialize the user interface."""
        # Create web view
        self.web_view = QWebEngineView()
        
        # Create web channel for Python ↔ JavaScript communication
        self.channel = QWebChannel()
        self.web_view.page().setWebChannel(self.channel)
        
        # Register Python object with JavaScript bridge
        self.bridge = CalculatorBridge(self)
        self.channel.registerObject('pyBridge', self.bridge)
        
        # Load the calculator UI from Flask
        if self.flask_ready:
            self.web_view.load(QUrl('http://localhost:5000'))
        else:
            error_html = '''<html><body style="font-family: sans-serif; padding: 20px;">
                <h2>Error: Server Failed to Start</h2>
                <p>The Flask server could not start. Please ensure:</p>
                <ul>
                    <li>Python dependencies are installed: <code>pip install -r requirements.txt</code></li>
                    <li>Port 5000 is not in use by another application</li>
                </ul>
                <p>Close this window and try again.</p>
            </body></html>'''
            self.web_view.setHtml(error_html)
        
        # Set central widget
        self.setCentralWidget(self.web_view)
        
        # Create menu bar
        self.create_menu_bar()
    
    def create_menu_bar(self):
        """Create the application menu bar."""
        menubar = self.menuBar()
        
        # File menu
        file_menu = menubar.addMenu('File')
        
        quit_action = QAction('Quit', self)
        quit_action.triggered.connect(self.close)
        quit_action.setShortcut('Cmd+Q')
        file_menu.addAction(quit_action)
        
        # Tools menu
        tools_menu = menubar.addMenu('Tools')
        
        import_action = QAction('Import mGBA Script Data...', self)
        import_action.triggered.connect(self.open_import_dialog)
        import_action.setShortcut('Cmd+I')
        tools_menu.addAction(import_action)
        
        # Help menu
        help_menu = menubar.addMenu('Help')
        
        about_action = QAction('About', self)
        about_action.triggered.connect(self.show_about)
        help_menu.addAction(about_action)
        
        docs_action = QAction('Documentation', self)
        docs_action.triggered.connect(self.show_docs)
        help_menu.addAction(docs_action)
    
    def open_import_dialog(self):
        """Open the script import dialog."""
        dialog = ScriptImportDialog(self)
        dialog.data_imported.connect(self.on_data_imported)
        dialog.exec_()
    
    def on_data_imported(self, data):
        """Handle imported data from script."""
        # Inject the data into the web UI via JavaScript
        script = f"""
        (function() {{
            if (window.importPokemonTeam) {{
                window.importPokemonTeam({repr(data)});
            }} else {{
                console.warn('importPokemonTeam not found in calculator');
            }}
        }})();
        """
        self.web_view.page().runJavaScript(script)
    
    def show_about(self):
        """Show about dialog."""
        QMessageBox.about(
            self,
            'About Pokémon Damage Calculator',
            'Pokémon Damage Calculator for Run & Bun\n\n'
            'A lightweight macOS application for calculating Pokémon battle damage.\n\n'
            'Fork of Syl R&B Calc and smogon/damage-calc\n\n'
            'Version: 1.0.0'
        )
    
    def show_docs(self):
        """Show documentation."""
        QMessageBox.information(
            self,
            'Documentation',
            'mGBA Script Integration:\n\n'
            '1. Run your mGBA lua script that exports Pokémon team data\n'
            '2. Copy the output to clipboard\n'
            '3. Use Tools > Import mGBA Script Data to import\n\n'
            'Supported formats: JSON or plain text\n'
            'See macos-app/README.md for details'
        )
    
    def _run_flask(self):
        """Run Flask server in background thread."""
        # Suppress Flask logging
        log = logging.getLogger('werkzeug')
        log.setLevel(logging.ERROR)
        
        try:
            server.app.run(
                host='localhost',
                port=5000,
                debug=False,
                use_reloader=False,
                threaded=True
            )
        except Exception as e:
            logger.error(f'Flask server error: {e}')
    
    def closeEvent(self, event):
        """Handle window close event."""
        # Flask will be terminated when the app exits
        event.accept()


class CalculatorBridge(QObject):
    """Bridge between Python and JavaScript for IPC."""
    
    def __init__(self, parent):
        super().__init__()
        self.parent = parent
    
    @pyqtSlot(str)
    def log_message(self, message):
        """Log a message from JavaScript."""
        logger.info(f'[JS] {message}')


def main():
    """Main entry point."""
    app = QApplication(sys.argv)
    
    window = PokemonCalculatorApp()
    window.show()
    
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
