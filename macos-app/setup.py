"""
Setup configuration for building the macOS app using py2app.
This packages the PyQt5 application and Flask server into a standalone .app bundle.

Build with: python setup.py py2app

For Electron-style bundling, consider these alternatives:
- PyInstaller: More flexible bundling, works on all platforms
- cx_Freeze: Another cross-platform option
- Briefcase: Built on top of distutils for BeeWare
"""
import sys
import os
from setuptools import setup, find_packages
from pathlib import Path

# Add the parent directory to the path so we can import from macos-app
sys.path.insert(0, str(Path(__file__).parent.parent))

# Check if running on macOS
if sys.platform != 'darwin':
    print('Warning: This setup.py is configured for macOS. Use PyInstaller or cx_Freeze for cross-platform builds.')
    print('Continuing with standard setuptools...')
    py2app_options = {}
    APP = []
    setup_requires = []
else:
    from py2app.build_app import py2app
    setup_requires = ['py2app']
    
    # Path to the main app
    APP = ['macos-app/src/app.py']
    
    # Resources to include in the bundle
    # These will be available at runtime in the app's resource directory
    DATA_FILES = [
        ('dist', ['dist']),  # Built web UI (from npm build)
        ('src', ['src']),    # HTML templates
    ]
    
    # Try to include calc dist if it exists
    if Path('calc/dist').exists():
        DATA_FILES.append(('calc/dist', ['calc/dist']))
    
    # py2app options
    py2app_options = {
        'py2app': {
            'argv_emulation': False,
            'packages': [
                'PyQt5',
                'flask',
                'flask_cors',
                'werkzeug',
                'jinja2',
                'markupsafe',
                'itsdangerous',
                'click',
                'colorama',
            ],
            'includes': [
                'PyQt5.QtCore',
                'PyQt5.QtGui',
                'PyQt5.QtWidgets',
                'PyQt5.QtWebEngineWidgets',
                'PyQt5.QtWebChannel',
                'PyQt5.QtNetwork',
                'PyQt5.QtPrintSupport',
            ],
            'resources': [item[1] for item in DATA_FILES] if DATA_FILES else [],
            'data_files': DATA_FILES if DATA_FILES else [],
            'plist': {
                'CFBundleName': 'Pokémon Damage Calculator',
                'CFBundleDisplayName': 'Pokémon Damage Calculator',
                'CFBundleIdentifier': 'dev.sylmar.rnbcalc',
                'CFBundleVersion': '1.0.0',
                'CFBundleShortVersionString': '1.0',
                'CFBundleExecutable': 'Pokémon Damage Calculator',
                'NSPrincipalClass': 'NSApplication',
                'NSRequiresIPhoneOS': False,
                'NSHumanReadableCopyright': 'MIT License',
                'LSMinimumSystemVersion': '10.13',
            },
            'semi_standalone': True,  # Bundle Python but use system libraries where possible
            'arch': 'universal2',  # Universal binary for Apple Silicon and Intel
        }
    }

# Main setup call
setup(
    name='Pokémon Damage Calculator',
    version='1.0.0',
    description='Lightweight Pokémon damage calculator for Run & Bun',
    author='Sylmar',
    author_email='',
    url='https://github.com/sylmardev/rnbcalc',
    license='MIT',
    packages=find_packages('macos-app/src'),
    package_dir={'': 'macos-app/src'},
    app=APP if APP else None,
    options=py2app_options,
    setup_requires=setup_requires,
    install_requires=[
        'PyQt5>=5.15.0',
        'Flask>=3.0.0',
        'Flask-CORS>=4.0.0',
        'requests>=2.31.0',
    ],
    classifiers=[
        'Environment :: MacOS X',
        'Natural Language :: English',
        'Operating System :: MacOS :: MacOS X',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'License :: OSI Approved :: MIT License',
    ],
)
