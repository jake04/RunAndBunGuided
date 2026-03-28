#!/usr/bin/env python3
"""
Test script to verify that Flask is serving assets correctly.
"""
import sys
from pathlib import Path
import subprocess
import time
import requests

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

def test_flask_assets():
    """Test that Flask serves required assets."""
    
    # Start Flask server in background
    print("Starting Flask server...")
    flask_process = subprocess.Popen(
        [sys.executable, Path(__file__).parent / 'src' / 'server.py'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for server to start
    time.sleep(3)
    
    try:
        base_url = 'http://localhost:5000'
        
        # Test main page
        print("\n1. Testing main page...")
        response = requests.get(f'{base_url}/')
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            if 'base href="/"' in response.text:
                print("   ✓ Base href is correct: /")
            else:
                print("   ✗ Base href is incorrect!")
            if '<title>' in response.text:
                print("   ✓ HTML is valid")
        else:
            print(f"   ✗ Failed to load main page")
            
        # Test critical assets
        assets_to_test = [
            '/js/vendor/jquery-1.9.1.min.js',
            '/js/vendor/select2/select2.min.js',
            '/js/vendor/select2/select2.css',
            '/css/main.css',
            '/calc/data/species.js',
            '/js/shared_controls.js',
        ]
        
        print("\n2. Testing critical assets...")
        for asset in assets_to_test:
            response = requests.get(f'{base_url}{asset}')
            status = "✓" if response.status_code == 200 else "✗"
            print(f"   {status} {asset}: {response.status_code}")
            
        print("\n✓ All tests completed!")
        
    finally:
        flask_process.terminate()
        flask_process.wait()

if __name__ == '__main__':
    try:
        test_flask_assets()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
