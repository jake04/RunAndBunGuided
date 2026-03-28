// Encounter data for Pokémon Run & Bun Emerald
// Routes and available Pokémon encounters with level ranges and encounter odds

const ENCOUNTER_DATA = {
  routes: {
    "Littleroot Town": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 101": {
      land: [
        { name: "Lillipup", level: "2-3", odds: "20%" },
        { name: "Bunnelby", level: "2-3", odds: "10%" },
        { name: "Buneary", level: "2-3", odds: "10%" },
        { name: "Skitty", level: "2-3", odds: "10%" },
        { name: "Zigzagoon-G", level: "2-3", odds: "10%" },
        { name: "Poochyena", level: "2-3", odds: "10%" },
        { name: "Starly", level: "2-3", odds: "10%" },
        { name: "Pidgey", level: "2-3", odds: "10%" },
        { name: "Litleo", level: "2-3", odds: "5%" }
      ],
      fishing: [],
      surf: []
    },
    "Oldale Town": {
      land: [
        { name: "Ponyta", level: "2-3", odds: "20%" },
        { name: "Growlithe", level: "2-3", odds: "10%" },
        { name: "Houndour", level: "2-3", odds: "10%" },
        { name: "Fletchling", level: "2-3", odds: "10%" },
        { name: "Natu", level: "2-3", odds: "10%" },
        { name: "Salandit", level: "2-3", odds: "5%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 103": {
      land: [
        { name: "Gossifleur", level: "2-3", odds: "20%" },
        { name: "Bounsweet", level: "2-3", odds: "20%" },
        { name: "Exeggcute", level: "2-3", odds: "15%" },
        { name: "Budew", level: "2-3", odds: "15%" },
        { name: "Lotad", level: "2-3", odds: "10%" },
        { name: "Seedot", level: "2-3", odds: "15%" },
        { name: "Deerling", level: "2-3", odds: "4%" },
        { name: "Deerling-S", level: "2-3", odds: "1%" }
      ],
      fishing: [
        { name: "Tentacool", level: "2-3", odds: "40%" },
        { name: "Skrelp", level: "2-3", odds: "30%" },
        { name: "Chinchou", level: "2-3", odds: "20%" },
        { name: "Lotad", level: "2-3", odds: "10%" }
      ],
      surf: [
        { name: "Tentacruel", level: "50", odds: "60%" },
        { name: "Dragalge", level: "50", odds: "20%" },
        { name: "Lanturn", level: "50", odds: "10%" },
        { name: "Ludicolo", level: "50", odds: "10%" }
      ]
    },
    "Route 102": {
      land: [
        { name: "Paras", level: "5", odds: "20%" },
        { name: "Weedle", level: "5", odds: "10%" },
        { name: "Scatterbug", level: "5", odds: "10%" },
        { name: "Blipbug", level: "5", odds: "5%" }
      ],
      fishing: [],
      surf: []
    },
    "Petalburg City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 104": {
      land: [
        { name: "Tyrogue", level: "8", odds: "14%" },
        { name: "Timburr", level: "8", odds: "10%" },
        { name: "Makuhita", level: "8", odds: "10%" },
        { name: "Farfetch'd-G", level: "8", odds: "10%" },
        { name: "Mienfoo", level: "8", odds: "10%" },
        { name: "Pancham", level: "8", odds: "10%" },
        { name: "Meditite", level: "8", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Dewford Town": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 107": {
      land: [
        { name: "Phanpy", level: "8", odds: "20%" },
        { name: "Cufant", level: "8", odds: "30%" },
        { name: "Rhyhorn", level: "8", odds: "10%" },
        { name: "Onix", level: "8", odds: "10%" },
        { name: "Togedemaru", level: "8", odds: "10%" },
        { name: "Aron", level: "8", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 106": {
      land: [
        { name: "Amaura", level: "8", odds: "33%" },
        { name: "Geodude-A", level: "8", odds: "15%" },
        { name: "Dwebble", level: "8", odds: "15%" },
        { name: "Nosepass", level: "8", odds: "15%" },
        { name: "Sandshrew-A", level: "8", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Granite Cave 1F": {
      land: [
        { name: "Sandshrew-A", level: "8", odds: "22%" },
        { name: "Sneasel", level: "8", odds: "28%" },
        { name: "Snorunt", level: "8", odds: "14%" }
      ],
      fishing: [],
      surf: []
    },
    "Granite Cave B1F": {
      land: [
        { name: "Gligar", level: "8", odds: "30%" },
        { name: "Nosepass", level: "8", odds: "20%" },
        { name: "Magnemite", level: "8", odds: "20%" },
        { name: "Dottler", level: "8", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Granite Cave B2F": {
      land: [
        { name: "Hatenna", level: "8", odds: "30%" },
        { name: "Gligar", level: "8", odds: "30%" },
        { name: "Geodude-A", level: "8", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Stevens Room": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 109": {
      land: [
        { name: "Shinx", level: "12", odds: "30%" },
        { name: "Mareep", level: "12", odds: "20%" },
        { name: "Tynamo", level: "12", odds: "10%" },
        { name: "Yamper", level: "12", odds: "10%" }
      ],
      fishing: [
        { name: "Remoraid", level: "10", odds: "20%" },
        { name: "Buizel", level: "5", odds: "10%" }
      ],
      surf: []
    },
    "Slateport City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 110": {
      land: [
        { name: "Carnivine", level: "14", odds: "20%" },
        { name: "Shroomish", level: "14", odds: "10%" },
        { name: "Steenee", level: "14", odds: "10%" },
        { name: "Gossifleur", level: "14", odds: "10%" },
        { name: "Paras", level: "5-14", odds: "10%" },
        { name: "Bellsprout", level: "5-14", odds: "10%" },
        { name: "Chikorita", level: "14", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Petalburg Woods": {
      land: [
        { name: "Rockruff", level: "14", odds: "22%" },
        { name: "Phanpy", level: "14", odds: "11%" },
        { name: "Growlithe", level: "14", odds: "11%" },
        { name: "Mudbray", level: "14", odds: "17%" },
        { name: "Togedemaru", level: "14", odds: "11%" },
        { name: "Meowth-G", level: "14", odds: "11%" }
      ],
      fishing: [],
      surf: []
    },
    "Rustboro City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 115": {
      land: [
        { name: "Gallade", level: "90", odds: "20%" },
        { name: "Gardevoir", level: "90", odds: "20%" },
        { name: "Lopunny", level: "90", odds: "20%" },
        { name: "Alakazam", level: "90", odds: "10%" },
        { name: "Altaria", level: "90", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 116": {
      land: [
        { name: "Makuhita", level: "14", odds: "20%" },
        { name: "Tyrogue", level: "14", odds: "15%" },
        { name: "Munna", level: "14", odds: "15%" },
        { name: "Hatenna", level: "14", odds: "15%" },
        { name: "Yanma", level: "5-14", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Rusturf Tunnel": {
      land: [
        { name: "Trapinch", level: "16", odds: "20%" },
        { name: "Gligar", level: "16", odds: "20%" },
        { name: "Swinub", level: "16", odds: "20%" },
        { name: "Sandile", level: "16", odds: "20%" },
        { name: "Rockruff", level: "16", odds: "10%" },
        { name: "Geodude-A", level: "16", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Verdanturf Town": {
      land: [],
      fishing: [],
      surf: []
    },
    "Mauville City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 117": {
      land: [
        { name: "Petilil", level: "20", odds: "20%" },
        { name: "Foongus", level: "20", odds: "20%" },
        { name: "Phanpy", level: "20", odds: "10%" },
        { name: "Nidorina", level: "20", odds: "10%" },
        { name: "Roselia", level: "20", odds: "10%" },
        { name: "Meowth-G", level: "20", odds: "10%" },
        { name: "Toxel", level: "20", odds: "10%" },
        { name: "Joltik", level: "20", odds: "5%" },
        { name: "Electrike", level: "20", odds: "5%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 111": {
      land: [
        { name: "Trapinch", level: "5-32", odds: "20%" },
        { name: "Onix", level: "32", odds: "20%" },
        { name: "Boldore", level: "32", odds: "15%" },
        { name: "Krokorok", level: "32", odds: "15%" },
        { name: "Excadrill", level: "32", odds: "10%" },
        { name: "Donphan", level: "5-32", odds: "10%" },
        { name: "Drilbur", level: "5-32", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 118": {
      land: [
        { name: "Altaria", level: "50", odds: "20%" },
        { name: "Kangaskhan", level: "50", odds: "20%" },
        { name: "Donphan", level: "40", odds: "20%" },
        { name: "Raichu", level: "50", odds: "20%" },
        { name: "Raichu-A", level: "50", odds: "10%" },
        { name: "Probopass", level: "50", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Altering Cave": {
      land: [
        { name: "Swablu", level: "5-50", odds: "40%" },
        { name: "Altaria", level: "50", odds: "30%" },
        { name: "Kangaskhan", level: "50", odds: "30%" }
      ],
      fishing: [],
      surf: []
    },
    "Mirage Tower 1F": {
      land: [
        { name: "Riolu", level: "5-26", odds: "20%" },
        { name: "Timburr", level: "5-26", odds: "20%" },
        { name: "Magnemite", level: "26", odds: "20%" },
        { name: "Bergmite", level: "26", odds: "20%" },
        { name: "Gurdurr", level: "26", odds: "10%" },
        { name: "Sandshrew-A", level: "5-26", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Mirage Tower 2F": {
      land: [
        { name: "Drilbur", level: "5-32", odds: "20%" },
        { name: "Baltoy", level: "32", odds: "20%" },
        { name: "Claydol", level: "5-32", odds: "20%" },
        { name: "Lairon", level: "32", odds: "20%" },
        { name: "Excadrill", level: "40", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Mirage Tower 3F": {
      land: [
        { name: "Solosis", level: "32", odds: "20%" },
        { name: "Duosion", level: "32", odds: "20%" },
        { name: "Orbeetle", level: "32", odds: "20%" },
        { name: "Munna", level: "32", odds: "20%" },
        { name: "Mawile", level: "32", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Mirage Tower 4F": {
      land: [
        { name: "Zoroark", level: "32", odds: "20%" },
        { name: "Xatu", level: "32", odds: "20%" },
        { name: "Sigilyph", level: "32", odds: "20%" },
        { name: "Absol", level: "32", odds: "20%" },
        { name: "Salazzle", level: "32", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 113": {
      land: [
        { name: "Stunky", level: "5-32", odds: "22%" },
        { name: "Koffing", level: "32", odds: "20%" },
        { name: "Drapion", level: "32", odds: "10%" },
        { name: "Skuntank", level: "32", odds: "12%" }
      ],
      fishing: [],
      surf: []
    },
    "Fallarbor Town": {
      land: [],
      fishing: [],
      surf: []
    },
    "Desert Underpass": {
      land: [
        { name: "Maractus", level: "32", odds: "33%" },
        { name: "Dwebble", level: "32", odds: "33%" },
        { name: "Vibrava", level: "5-56", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 114": {
      land: [
        { name: "Orbeetle", level: "32", odds: "20%" },
        { name: "Xatu", level: "32", odds: "20%" },
        { name: "Zoroark", level: "32", odds: "20%" },
        { name: "Claydol", level: "32", odds: "20%" },
        { name: "Shiftry", level: "67", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Meteor Falls 1F1": {
      land: [
        { name: "Litwick", level: "5-55", odds: "40%" },
        { name: "Tepig", level: "5-55", odds: "20%" },
        { name: "Litten", level: "55", odds: "10%" },
        { name: "Crobat", level: "55", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Meteor Falls 1F2": {
      land: [
        { name: "Litwick", level: "5-55", odds: "20%" },
        { name: "Fennekin", level: "5-55", odds: "20%" },
        { name: "Braixen", level: "55", odds: "10%" },
        { name: "Noivern", level: "55", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Meteor Falls B1F1": {
      land: [
        { name: "Gligar", level: "5-55", odds: "22%" },
        { name: "Sneasel-H", level: "5-55", odds: "12%" },
        { name: "Altaria", level: "55", odds: "12%" },
        { name: "Bewear", level: "55", odds: "12%" }
      ],
      fishing: [],
      surf: []
    },
    "Meteor Falls B1F2": {
      land: [
        { name: "Trapinch", level: "5-55", odds: "20%" },
        { name: "Grookey", level: "5-56", odds: "10%" },
        { name: "Rowlett", level: "5-56", odds: "10%" },
        { name: "Chespin", level: "5-56", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 112": {
      land: [],
      fishing: [],
      surf: []
    },
    "Fiery Path": {
      land: [
        { name: "Phanpy", level: "20", odds: "20%" },
        { name: "Foongus", level: "20", odds: "20%" },
        { name: "Weepinbell", level: "20", odds: "10%" },
        { name: "Yamper", level: "20", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Mt. Chimney": {
      land: [
        { name: "Trapinch", level: "5-32", odds: "10%" },
        { name: "Donphan", level: "32", odds: "20%" },
        { name: "Krokorok", level: "32", odds: "20%" },
        { name: "Clefairy", level: "40", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Jagged Pass": {
      land: [
        { name: "Snubbull", level: "5-40", odds: "20%" },
        { name: "Nidoking", level: "40", odds: "20%" },
        { name: "Skuntank", level: "40", odds: "20%" },
        { name: "Weezing", level: "40", odds: "10%" }
      ],
      fishing: [],
      surf: []
    },
    "Lavaridge Town": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 134": {
      land: [],
      fishing: [],
      surf: []
    },
    "New Mauville (Outside)": {
      land: [],
      fishing: [],
      surf: []
    },
    "New Mauville (Inside)": {
      land: [
        { name: "Magnemite", level: "20", odds: "33%" },
        { name: "Togedemaru", level: "20", odds: "33%" },
        { name: "Meowth-G", level: "20", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 105": {
      land: [],
      fishing: [
        { name: "Gastly", level: "5-58", odds: "20%" },
        { name: "Kirlia", level: "58", odds: "10%" },
        { name: "Lampent", level: "58", odds: "20%" }
      ],
      surf: []
    },
    "Route 108": {
      land: [],
      fishing: [
        { name: "Shuppet", level: "5-58", odds: "20%" },
        { name: "Kadabra", level: "58", odds: "20%" },
        { name: "Haunter", level: "58", odds: "20%" }
      ],
      surf: []
    },
    "Abandoned Ship B1F Rooms": {
      land: [
        { name: "Banette", level: "58", odds: "33%" },
        { name: "Gardevoir", level: "58", odds: "33%" },
        { name: "Gengar", level: "58", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 119": {
      land: [
        { name: "Litwick", level: "5-58", odds: "40%" },
        { name: "Lampent", level: "5-58", odds: "20%" },
        { name: "Chandelure", level: "58", odds: "20%" },
        { name: "Crobat", level: "5-58", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Fortree City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 120": {
      land: [
        { name: "Litwick", level: "58", odds: "20%" },
        { name: "Gastly", level: "5-58", odds: "20%" },
        { name: "Drifloon", level: "5-58", odds: "20%" },
        { name: "Drifblim", level: "58", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Scorched Slab": {
      land: [
        { name: "Abra", level: "8", odds: "40%" },
        { name: "Hatenna", level: "8", odds: "20%" },
        { name: "Spinarak", level: "32", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 121": {
      land: [
        { name: "Absol", level: "56", odds: "30%" },
        { name: "Nuzleaf", level: "56", odds: "20%" },
        { name: "Shiftry", level: "56", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Safari Zone (South)": {
      land: [],
      fishing: [],
      surf: []
    },
    "Safari Zone (Southwest)": {
      land: [],
      fishing: [],
      surf: []
    },
    "Safari Zone (Northwest)": {
      land: [],
      fishing: [],
      surf: []
    },
    "Safari Zone (North)": {
      land: [],
      fishing: [],
      surf: []
    },
    "Lilycove City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 122": {
      land: [
        { name: "Litwick", level: "56", odds: "40%" },
        { name: "Crobat", level: "5-58", odds: "20%" },
        { name: "Weavile", level: "58", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 123": {
      land: [
        { name: "Amoonguss", level: "56", odds: "25%" },
        { name: "Morelull", level: "5-56", odds: "25%" },
        { name: "Shiinotic", level: "56", odds: "25%" },
        { name: "Parasect", level: "56", odds: "25%" }
      ],
      fishing: [],
      surf: []
    },
    "Mt. Pyre 1F-2F": {
      land: [
        { name: "Pidgeot", level: "56", odds: "22%" },
        { name: "Kirlia", level: "56", odds: "11%" },
        { name: "Gardevoir", level: "58", odds: "10%" },
        { name: "Kadabra", level: "58", odds: "5%" }
      ],
      fishing: [],
      surf: []
    },
    "Mt. Pyre 3F-4F": {
      land: [
        { name: "Shiftry", level: "67", odds: "13%" },
        { name: "Lilligant", level: "67", odds: "13%" },
        { name: "Lilligant-H", level: "67", odds: "13%" },
        { name: "Arcanine", level: "67", odds: "13%" }
      ],
      fishing: [],
      surf: []
    },
    "Mt. Pyre 5F-6F": {
      land: [
        { name: "Excadrill", level: "69", odds: "11%" },
        { name: "Garchomp", level: "69", odds: "11%" },
        { name: "Camerupt", level: "69", odds: "11%" },
        { name: "Flygon", level: "69", odds: "5%" }
      ],
      fishing: [],
      surf: []
    },
    "Mt. Pyre (Exterior)": {
      land: [
        { name: "Exeggutor", level: "67", odds: "13%" },
        { name: "Houndoom", level: "70", odds: "14%" },
        { name: "Torkoal", level: "70", odds: "14%" },
        { name: "Aggron", level: "70", odds: "14%" }
      ],
      fishing: [],
      surf: []
    },
    "Mt. Pyre (Summit)": {
      land: [
        { name: "Houndoom", level: "70", odds: "34%" },
        { name: "Aggron", level: "70", odds: "33%" },
        { name: "Charizard", level: "70", odds: "33%" }
      ],
      fishing: [],
      surf: []
    },
    "Magma Hideout 1": {
      land: [
        { name: "Sneasler", level: "72", odds: "40%" },
        { name: "Starmie", level: "72", odds: "20%" },
        { name: "Sliggoo-H", level: "72", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Magma Hideout 2-4": {
      land: [
        { name: "Sneasler", level: "72", odds: "33%" },
        { name: "Audino", level: "72", odds: "33%" },
        { name: "Duraludon", level: "72", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Magma Hideout 5": {
      land: [
        { name: "Abomasnow", level: "72", odds: "40%" },
        { name: "Glalie", level: "72", odds: "20%" },
        { name: "Avalugg-H", level: "72", odds: "20%" }
      ],
      fishing: [],
      surf: []
    },
    "Magma Hideout 6-7": {
      land: [
        { name: "Ludicolo", level: "75", odds: "22%" },
        { name: "Heracross", level: "75", odds: "11%" },
        { name: "Pinsir", level: "75", odds: "11%" },
        { name: "Scyther", level: "75", odds: "11%" }
      ],
      fishing: [],
      surf: []
    },
    "Aqua Hideout B1F": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 124": {
      land: [],
      fishing: [
        { name: "Petilil", level: "5-75", odds: "17%" },
        { name: "Flabébé", level: "5-75", odds: "17%" },
        { name: "Flabébé-Yellow", level: "5-75", odds: "17%" },
        { name: "Flabébé-Orange", level: "5-75", odds: "17%" },
        { name: "Flabébé-Blue", level: "5-75", odds: "16%" },
        { name: "Flabébé-White", level: "5-75", odds: "16%" }
      ],
      surf: []
    },
    "Mossdeep City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 125": {
      land: [],
      fishing: [
        { name: "Togekiss", level: "85", odds: "17%" },
        { name: "Florges", level: "85", odds: "17%" },
        { name: "Florges-Yellow", level: "85", odds: "17%" },
        { name: "Florges-Orange", level: "85", odds: "17%" },
        { name: "Florges-Blue", level: "85", odds: "16%" },
        { name: "Florges-White", level: "85", odds: "16%" }
      ],
      surf: []
    },
    "Shoal Cave (Entrance/Inner)": {
      land: [],
      fishing: [
        { name: "Muk-A", level: "80", odds: "34%" },
        { name: "Audino", level: "80", odds: "33%" },
        { name: "Slowbro", level: "80", odds: "33%" }
      ],
      surf: []
    },
    "Shoal Cave (Other)": {
      land: [],
      fishing: [
        { name: "Audino", level: "80", odds: "34%" },
        { name: "Avalugg", level: "80", odds: "33%" },
        { name: "Avalugg-H", level: "80", odds: "33%" }
      ],
      surf: []
    },
    "Shoal Cave (Ice)": {
      land: [],
      fishing: [
        { name: "Weavile", level: "80", odds: "40%" },
        { name: "Goodra-H", level: "80", odds: "40%" }
      ],
      surf: []
    },
    "Route 127": {
      land: [
        { name: "Weavile", level: "80", odds: "25%" },
        { name: "Samurott-H", level: "80", odds: "25%" },
        { name: "Goodra-H", level: "80", odds: "25%" },
        { name: "Zoroark-H", level: "80", odds: "25%" }
      ],
      fishing: [],
      surf: []
    },
    "Route 126": {
      land: [],
      fishing: [],
      surf: [
        { name: "Grimmsnarl", level: "82", odds: "25%" },
        { name: "Ursaluna", level: "82", odds: "25%" },
        { name: "Sableye", level: "82", odds: "25%" },
        { name: "Mawile", level: "82", odds: "25%" }
      ]
    },
    "124 Underwater": {
      land: [],
      fishing: [],
      surf: [
        { name: "Weavile", level: "85", odds: "25%" },
        { name: "Glalie", level: "85", odds: "25%" },
        { name: "Mamoswine", level: "85", odds: "25%" },
        { name: "Alakazam", level: "85", odds: "25%" }
      ]
    },
    "126 Underwater": {
      land: [],
      fishing: [],
      surf: [
        { name: "Greninja", level: "85", odds: "34%" },
        { name: "Dragapult", level: "85", odds: "33%" },
        { name: "Chandelure", level: "85", odds: "33%" }
      ]
    },
    "Sootopolis City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 128": {
      land: [],
      fishing: [],
      surf: [
        { name: "Corviknight", level: "82", odds: "33%" },
        { name: "Aerodactyl", level: "82", odds: "33%" },
        { name: "Salamence", level: "82", odds: "34%" }
      ]
    },
    "Route 129": {
      land: [],
      fishing: [],
      surf: [
        { name: "Altaria", level: "82", odds: "33%" },
        { name: "Hydreigon", level: "85", odds: "33%" },
        { name: "Greninja", level: "85", odds: "34%" }
      ]
    },
    "Ever Grande City": {
      land: [],
      fishing: [],
      surf: []
    },
    "Seafloor Cavern E": {
      land: [],
      fishing: [],
      surf: [
        { name: "Blastoise", level: "85", odds: "33%" },
        { name: "Primarina", level: "85", odds: "33%" },
        { name: "Samurott-H", level: "85", odds: "34%" }
      ]
    },
    "Seafloor Cavern 1-5": {
      land: [
        { name: "Gengar", level: "85", odds: "33%" },
        { name: "Dragapult", level: "85", odds: "33%" },
        { name: "Grimmsnarl", level: "85", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Seafloor Cavern 6-7": {
      land: [
        { name: "Venusaur", level: "85", odds: "33%" },
        { name: "Charizard", level: "85", odds: "33%" },
        { name: "Metagross", level: "85", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Seafloor Cavern 8": {
      land: [
        { name: "Gengar", level: "85", odds: "33%" },
        { name: "Alakazam", level: "85", odds: "33%" },
        { name: "Greninja", level: "85", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Cave of Origin": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 130": {
      land: [],
      fishing: [],
      surf: [
        { name: "Togekiss", level: "82", odds: "33%" },
        { name: "Corviknight", level: "82", odds: "33%" },
        { name: "Dragonite", level: "82", odds: "34%" }
      ]
    },
    "Route 131": {
      land: [],
      fishing: [],
      surf: [
        { name: "Altaria", level: "82", odds: "33%" },
        { name: "Salamence", level: "82", odds: "33%" },
        { name: "Flygon", level: "82", odds: "34%" }
      ]
    },
    "Pacifidlog Town": {
      land: [],
      fishing: [],
      surf: []
    },
    "Route 132": {
      land: [],
      fishing: [],
      surf: [
        { name: "Blastoise", level: "85", odds: "33%" },
        { name: "Charizard", level: "85", odds: "33%" },
        { name: "Venusaur", level: "85", odds: "34%" }
      ]
    },
    "Route 133": {
      land: [],
      fishing: [],
      surf: [
        { name: "Garchomp", level: "85", odds: "33%" },
        { name: "Gengar", level: "85", odds: "33%" }
      ]
    },
    "Sky Pillar 1F/3F": {
      land: [
        { name: "Aerodactyl", level: "82", odds: "33%" },
        { name: "Kleavor", level: "82", odds: "33%" },
        { name: "Dragapult", level: "82", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Sky Pillar 5F": {
      land: [
        { name: "Salamence", level: "82", odds: "33%" },
        { name: "Corviknight", level: "82", odds: "33%" },
        { name: "Dragonite", level: "82", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Victory Road 1F": {
      land: [
        { name: "Metagross", level: "85", odds: "33%" },
        { name: "Tyranitar", level: "85", odds: "33%" },
        { name: "Dragapult", level: "85", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Victory Road B1F": {
      land: [
        { name: "Venusaur", level: "85", odds: "33%" },
        { name: "Charizard", level: "85", odds: "33%" },
        { name: "Blastoise", level: "85", odds: "34%" }
      ],
      fishing: [],
      surf: []
    },
    "Victory Road B2F": {
      land: [
        { name: "Chandelure", level: "85", odds: "33%" },
        { name: "Kommo-o", level: "85", odds: "33%" },
        { name: "Mamoswine", level: "85", odds: "34%" }
      ],
      fishing: [],
      surf: []
    }
  },

  // Helper methods
  getAllRoutes: function() {
    return Object.keys(this.routes).filter(route => route !== 'Starter');
  },

  getPokemonByRoute: function(routeName) {
    const route = this.routes[routeName];
    if (!route) return [];
    
    // Combine all pokemon from land, fishing, and surf
    const pokemon = [];
    if (route.land) pokemon.push(...route.land);
    if (route.fishing) pokemon.push(...route.fishing);
    if (route.surf) pokemon.push(...route.surf);
    return pokemon;
  },

  getRouteCount: function() {
    return this.getAllRoutes().length;
  },

  getTotalPokemonCount: function() {
    let total = 0;
    for (const route in this.routes) {
      const r = this.routes[route];
      if (r.land) total += r.land.length;
      if (r.fishing) total += r.fishing.length;
      if (r.surf) total += r.surf.length;
    }
    return total;
  }
};
