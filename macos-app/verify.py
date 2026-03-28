#!/usr/bin/env python3
"""
Verification script for the macOS damage calculator application.

This script checks that all dependencies are installed and working correctly.

Usage:
    python macos-app/verify.py
"""
import sys
import subprocess
from pathlib import Path

def print_header(text):
    """Print a section header."""
    print(f'\n{"=" * 60}')
    print(f'  {text}')
    print(f'{"=" * 60}\n')

def check_python_version():
    """Check Python version is 3.9+."""
    print('Checking Python version...', end=' ')
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print(f'✓ Python {version.major}.{version.minor}.{version.micro}')
        return True
    else:
        print(f'✗ Python {version.major}.{version.minor} (need 3.9+)')
        return False

def check_module(module_name, readable_name=None):
    """Check if a module is installed."""
    display_name = readable_name or module_name
    print(f'Checking {display_name}...', end=' ')
    try:
        __import__(module_name)
        print('✓')
        return True
    except ImportError:
        print('✗ Not installed')
        return False

def check_file(file_path, description):
    """Check if a file exists."""
    exists = Path(file_path).exists()
    status = '✓' if exists else '✗'
    print(f'{status} {description}')
    return exists

def check_npm_and_build():
    """Check if npm build has been run."""
    print('Checking npm build...', end=' ')
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            # Check if dist/ exists
            if Path('dist').exists():
                print('✓ npm is installed and dist/ exists')
                return True
            else:
                print('✗ npm installed but dist/ not built. Run: npm run build')
                return False
        else:
            print('✗ npm not installed or not in PATH')
            return False
    except FileNotFoundError:
        print('✗ npm not found in PATH')
        return False

def main():
    """Run all verification checks."""
    print_header('Pokémon Damage Calculator - Verification')
    
    checks_passed = 0
    checks_total = 0
    
    # Check Python version
    print_header('System Check')
    if check_python_version():
        checks_passed += 1
    checks_total += 1
    
    # Check Python modules
    print_header('Python Dependencies')
    modules = [
        ('PyQt5', 'PyQt5'),
        ('flask', 'Flask'),
        ('flask_cors', 'Flask-CORS'),
        ('requests', 'requests'),
    ]
    
    for module_name, readable_name in modules:
        checks_total += 1
        if check_module(module_name, readable_name):
            checks_passed += 1
    
    # Check build output
    print_header('Build Output Files')
    files = [
        ('dist/index.html', 'dist/index.html (web UI)'),
        ('src/index.template.html', 'src/index.template.html (template)'),
        ('calc/dist', 'calc/dist/ (calculator)'),
    ]
    
    for file_path, description in files:
        checks_total += 1
        if check_file(file_path, description):
            checks_passed += 1
    
    # Check npm
    print_header('Build System')
    checks_total += 1
    if check_npm_and_build():
        checks_passed += 1
    
    # Summary
    print_header('Summary')
    print(f'Checks passed: {checks_passed}/{checks_total}')
    
    if checks_passed == checks_total:
        print('\n✓ All checks passed! You can now run:')
        print('  python macos-app/src/app.py')
    else:
        print('\n✗ Some checks failed. Please fix the issues above.')
        print('\nCommon fixes:')
        print('  1. Install Python dependencies: pip install -r macos-app/requirements.txt')
        print('  2. Build the calculator: npm run build')
        print('  3. Check Python version: python --version (need 3.9+)')
        return False
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
