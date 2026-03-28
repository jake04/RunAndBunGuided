"""
Flask web server for the Pokémon damage calculator.
Serves the existing HTML/JS UI and provides API endpoints.
"""
import os
import json
import subprocess
import logging
from pathlib import Path
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Get the root directory of the project
ROOT_DIR = Path(__file__).parent.parent.parent
DIST_DIR = ROOT_DIR / 'dist'
CALC_DIR = ROOT_DIR / 'calc'
SRC_DIR = ROOT_DIR / 'src'

app = Flask(__name__, 
            static_folder=str(DIST_DIR),
            static_url_path='',
            template_folder=str(SRC_DIR))

# Enhanced CORS configuration for PyQt5 WebEngine
CORS(app, 
     origins=["http://localhost:5000", "file://"],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)

# Ensure proper caching headers for development
@app.after_request
def set_cache_headers(response):
    """Set appropriate cache headers for development."""
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@app.route('/')
def index():
    """Serve the main calculator page."""
    # Serve dist/index.html if it exists, otherwise serve from src/
    if (DIST_DIR / 'index.html').exists():
        return send_from_directory(str(DIST_DIR), 'index.html')
    # Fallback: serve template directly if dist not built yet
    template_file = SRC_DIR / 'index.template.html'
    if template_file.exists():
        with open(template_file, 'r') as f:
            return f.read()
    return 'Calculator not built. Please run: npm run build', 400


@app.route('/calculate', methods=['POST'])
def calculate():
    """
    API endpoint for damage calculations.
    Accepts JSON payload with Pokemon, move, and field data.
    Returns damage calculation results.
    
    For now, delegates to the existing Node.js server.
    Future iteration: replace with pure Python implementation.
    """
    try:
        data = request.json
        
        # For iteration 1, we delegate to the existing Node.js server
        # which has the calculator built in. This maintains compatibility
        # while we can later port the calculator to pure Python.
        
        # Check if Node.js calc server is running
        # Otherwise, provide a helpful error message
        try:
            import requests
            # Try to call the original server if it's running
            response = requests.post('http://localhost:3000/calculate', json=data, timeout=5)
            if response.status_code == 200:
                return jsonify(response.json())
            else:
                return jsonify({'error': 'Calculation failed'}), 500
        except Exception:
            # If Node server not running, return informative error
            return jsonify({
                'error': 'Calculator backend not available. Start with: npm install && npm run build'
            }), 503
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/honkalculate')
def honkalculate():
    """Serve the advanced calculator page."""
    if (DIST_DIR / 'honkalculate.html').exists():
        return send_from_directory(str(DIST_DIR), 'honkalculate.html')
    # Fallback to template
    template_file = SRC_DIR / 'honkalculate.template.html'
    if template_file.exists():
        with open(template_file, 'r') as f:
            return f.read()
    return 'Page not found', 404


@app.route('/randoms')
def randoms():
    """Serve the randoms calculator page."""
    if (DIST_DIR / 'randoms.html').exists():
        return send_from_directory(str(DIST_DIR), 'randoms.html')
    # Fallback to template
    template_file = SRC_DIR / 'randoms.template.html'
    if template_file.exists():
        with open(template_file, 'r') as f:
            return f.read()
    return 'Page not found', 404


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Server error'}), 500


if __name__ == '__main__':
    # Only run Flask server directly if this is being tested
    # In production, this is launched by app.py
    app.run(host='localhost', port=5000, debug=False)
