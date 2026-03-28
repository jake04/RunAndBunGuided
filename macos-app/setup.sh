#!/bin/bash
# Setup script for macOS Pokémon Damage Calculator
# This script creates a virtual environment and installs all dependencies

set -e

echo "🎯 Setting up Pokémon Damage Calculator for macOS..."
echo ""

# Check Python version
echo "✓ Checking Python version..."
python3 --version

# Create virtual environment if it doesn't exist
if [ ! -d "macos-app/venv" ]; then
    echo "✓ Creating virtual environment..."
    python3 -m venv macos-app/venv
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo "✓ Activating virtual environment..."
source macos-app/venv/bin/activate

# Upgrade pip
echo "✓ Upgrading pip..."
python3 -m pip install --upgrade pip > /dev/null 2>&1

# Install dependencies
echo "✓ Installing Python dependencies..."
python3 -m pip install -r macos-app/requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Build the calculator: npm run build"
echo "  2. Run the app:         npm run macos:dev"
echo "  3. Or verify setup:     python macos-app/verify.py"
echo ""
