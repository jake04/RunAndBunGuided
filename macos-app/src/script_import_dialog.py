"""
Dialog for importing Pokémon team data from mGBA lua script output.
Parses the text format and injects data into the calculator UI.
"""
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QTextEdit, 
    QPushButton, QMessageBox
)
from PyQt5.QtCore import Qt, pyqtSignal
import json


class ScriptImportDialog(QDialog):
    """Dialog for importing mGBA lua script output."""
    
    # Signal emitted when data is successfully imported
    data_imported = pyqtSignal(dict)
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle('Import mGBA Script Data')
        self.setGeometry(100, 100, 600, 400)
        self.init_ui()
    
    def init_ui(self):
        """Initialize the dialog UI."""
        layout = QVBoxLayout()
        
        # Instructions
        instructions = QLabel(
            'Paste the output from your mGBA lua script here.\n'
            'The script should export Pokémon team data in text or JSON format.'
        )
        layout.addWidget(instructions)
        
        # Text input area
        self.text_input = QTextEdit()
        self.text_input.setPlaceholderText(
            'Example format:\n'
            'Pokemon: Pikachu\n'
            'Level: 50\n'
            'Move1: Thunderbolt\n'
            '...'
        )
        layout.addWidget(self.text_input)
        
        # Buttons
        button_layout = QHBoxLayout()
        
        import_button = QPushButton('Import')
        import_button.clicked.connect(self.import_data)
        button_layout.addWidget(import_button)
        
        cancel_button = QPushButton('Cancel')
        cancel_button.clicked.connect(self.reject)
        button_layout.addWidget(cancel_button)
        
        layout.addLayout(button_layout)
        self.setLayout(layout)
    
    def import_data(self):
        """Parse and import the script data."""
        text = self.text_input.toPlainText().strip()
        
        if not text:
            QMessageBox.warning(self, 'Empty Input', 'Please paste script output first.')
            return
        
        try:
            # Try to parse as JSON first
            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                # Fall back to line-by-line parsing
                data = self._parse_text_format(text)
            
            # Emit the parsed data
            self.data_imported.emit(data)
            QMessageBox.information(self, 'Success', 'Data imported successfully!')
            self.accept()
        
        except Exception as e:
            QMessageBox.critical(
                self, 
                'Parse Error', 
                f'Failed to parse input:\n{str(e)}'
            )
    
    def _parse_text_format(self, text):
        """
        Parse line-by-line text format.
        Expected format:
            Pokemon: Pikachu
            Level: 50
            Move1: Thunderbolt
            Move2: Quick Attack
            ...
        """
        data = {}
        lines = text.split('\n')
        current_pokemon = None
        pokemon_list = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if ':' not in line:
                continue
            
            key, value = line.split(':', 1)
            key = key.strip().lower()
            value = value.strip()
            
            # Start of a new Pokémon
            if key == 'pokemon':
                if current_pokemon:
                    pokemon_list.append(current_pokemon)
                current_pokemon = {'species': value}
            
            elif key in ['level', 'hp', 'attack', 'defense', 'spattack', 'spdefense', 'speed']:
                if current_pokemon:
                    try:
                        current_pokemon[key] = int(value)
                    except ValueError:
                        current_pokemon[key] = value
            
            elif key.startswith('move'):
                if current_pokemon:
                    if 'moves' not in current_pokemon:
                        current_pokemon['moves'] = []
                    current_pokemon['moves'].append(value)
            
            elif key in ['ability', 'nature', 'item']:
                if current_pokemon:
                    current_pokemon[key] = value
        
        # Add the last Pokémon
        if current_pokemon:
            pokemon_list.append(current_pokemon)
        
        data['team'] = pokemon_list
        return data
