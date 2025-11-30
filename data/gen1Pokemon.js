// Pokémon de la Generación 1 (151 Pokémon)
// Rareza: 1 = Común, 2 = Poco común, 3 = Raro, 4 = Muy raro, 5 = Legendario

export const GEN1_POKEMON = [
  // Starters y evoluciones
  { id: 1, name: 'Bulbasaur', rarity: 5, evolvesAt: 16, evolvesTo: 2 },
  { id: 2, name: 'Ivysaur', rarity: 3, evolvesAt: 32, evolvesTo: 3 },
  { id: 3, name: 'Venusaur', rarity: 4, evolvesAt: null },
  { id: 4, name: 'Charmander', rarity: 5, evolvesAt: 16, evolvesTo: 5 },
  { id: 5, name: 'Charmeleon', rarity: 3, evolvesAt: 36, evolvesTo: 6 },
  { id: 6, name: 'Charizard', rarity: 4, evolvesAt: null },
  { id: 7, name: 'Squirtle', rarity: 5, evolvesAt: 16, evolvesTo: 8 },
  { id: 8, name: 'Wartortle', rarity: 3, evolvesAt: 36, evolvesTo: 9 },
  { id: 9, name: 'Blastoise', rarity: 4, evolvesAt: null },
  
  // Comunes
  { id: 10, name: 'Caterpie', rarity: 1, evolvesAt: 7, evolvesTo: 11 },
  { id: 11, name: 'Metapod', rarity: 1, evolvesAt: 10, evolvesTo: 12 },
  { id: 12, name: 'Butterfree', rarity: 2, evolvesAt: null },
  { id: 13, name: 'Weedle', rarity: 1, evolvesAt: 7, evolvesTo: 14 },
  { id: 14, name: 'Kakuna', rarity: 1, evolvesAt: 10, evolvesTo: 15 },
  { id: 15, name: 'Beedrill', rarity: 2, evolvesAt: null },
  { id: 16, name: 'Pidgey', rarity: 1, evolvesAt: 18, evolvesTo: 17 },
  { id: 17, name: 'Pidgeotto', rarity: 2, evolvesAt: 36, evolvesTo: 18 },
  { id: 18, name: 'Pidgeot', rarity: 3, evolvesAt: null },
  { id: 19, name: 'Rattata', rarity: 1, evolvesAt: 20, evolvesTo: 20 },
  { id: 20, name: 'Raticate', rarity: 2, evolvesAt: null },
  { id: 21, name: 'Spearow', rarity: 1, evolvesAt: 20, evolvesTo: 22 },
  { id: 22, name: 'Fearow', rarity: 2, evolvesAt: null },
  { id: 23, name: 'Ekans', rarity: 1, evolvesAt: 22, evolvesTo: 24 },
  { id: 24, name: 'Arbok', rarity: 2, evolvesAt: null },
  { id: 25, name: 'Pikachu', rarity: 2, evolvesAt: 25, evolvesTo: 26 }, // Piedra Trueno -> nivel 25
  { id: 26, name: 'Raichu', rarity: 3, evolvesAt: null },
  { id: 27, name: 'Sandshrew', rarity: 1, evolvesAt: 22, evolvesTo: 28 },
  { id: 28, name: 'Sandslash', rarity: 2, evolvesAt: null },
  { id: 29, name: 'Nidoran♀', rarity: 1, evolvesAt: 16, evolvesTo: 30 },
  { id: 30, name: 'Nidorina', rarity: 2, evolvesAt: 30, evolvesTo: 31 }, // Piedra Luna -> nivel 30
  { id: 31, name: 'Nidoqueen', rarity: 3, evolvesAt: null },
  { id: 32, name: 'Nidoran♂', rarity: 1, evolvesAt: 16, evolvesTo: 33 },
  { id: 33, name: 'Nidorino', rarity: 2, evolvesAt: 30, evolvesTo: 34 }, // Piedra Luna -> nivel 30
  { id: 34, name: 'Nidoking', rarity: 3, evolvesAt: null },
  { id: 35, name: 'Clefairy', rarity: 2, evolvesAt: 25, evolvesTo: 36 }, // Piedra Luna -> nivel 25
  { id: 36, name: 'Clefable', rarity: 3, evolvesAt: null },
  { id: 37, name: 'Vulpix', rarity: 2, evolvesAt: 30, evolvesTo: 38 }, // Piedra Fuego -> nivel 30
  { id: 38, name: 'Ninetales', rarity: 3, evolvesAt: null },
  { id: 39, name: 'Jigglypuff', rarity: 2, evolvesAt: 25, evolvesTo: 40 }, // Piedra Luna -> nivel 25
  { id: 40, name: 'Wigglytuff', rarity: 3, evolvesAt: null },
  { id: 41, name: 'Zubat', rarity: 1, evolvesAt: 22, evolvesTo: 42 },
  { id: 42, name: 'Golbat', rarity: 2, evolvesAt: null },
  { id: 43, name: 'Oddish', rarity: 1, evolvesAt: 21, evolvesTo: 44 },
  { id: 44, name: 'Gloom', rarity: 2, evolvesAt: 30, evolvesTo: 45 }, // Piedra Hoja -> nivel 30
  { id: 45, name: 'Vileplume', rarity: 3, evolvesAt: null },
  { id: 46, name: 'Paras', rarity: 1, evolvesAt: 24, evolvesTo: 47 },
  { id: 47, name: 'Parasect', rarity: 2, evolvesAt: null },
  { id: 48, name: 'Venonat', rarity: 1, evolvesAt: 31, evolvesTo: 49 },
  { id: 49, name: 'Venomoth', rarity: 2, evolvesAt: null },
  { id: 50, name: 'Diglett', rarity: 1, evolvesAt: 26, evolvesTo: 51 },
  { id: 51, name: 'Dugtrio', rarity: 2, evolvesAt: null },
  { id: 52, name: 'Meowth', rarity: 1, evolvesAt: 28, evolvesTo: 53 },
  { id: 53, name: 'Persian', rarity: 2, evolvesAt: null },
  { id: 54, name: 'Psyduck', rarity: 1, evolvesAt: 33, evolvesTo: 55 },
  { id: 55, name: 'Golduck', rarity: 2, evolvesAt: null },
  { id: 56, name: 'Mankey', rarity: 1, evolvesAt: 28, evolvesTo: 57 },
  { id: 57, name: 'Primeape', rarity: 2, evolvesAt: null },
  { id: 58, name: 'Growlithe', rarity: 2, evolvesAt: 30, evolvesTo: 59 }, // Piedra Fuego -> nivel 30
  { id: 59, name: 'Arcanine', rarity: 3, evolvesAt: null },
  { id: 60, name: 'Poliwag', rarity: 1, evolvesAt: 25, evolvesTo: 61 },
  { id: 61, name: 'Poliwhirl', rarity: 2, evolvesAt: 35, evolvesTo: 62 }, // Piedra Agua -> nivel 35
  { id: 62, name: 'Poliwrath', rarity: 3, evolvesAt: null },
  { id: 63, name: 'Abra', rarity: 2, evolvesAt: 16, evolvesTo: 64 },
  { id: 64, name: 'Kadabra', rarity: 3, evolvesAt: 40, evolvesTo: 65 }, // Intercambio -> nivel 40
  { id: 65, name: 'Alakazam', rarity: 4, evolvesAt: null },
  { id: 66, name: 'Machop', rarity: 1, evolvesAt: 28, evolvesTo: 67 },
  { id: 67, name: 'Machoke', rarity: 2, evolvesAt: 40, evolvesTo: 68 }, // Intercambio -> nivel 40
  { id: 68, name: 'Machamp', rarity: 4, evolvesAt: null },
  { id: 69, name: 'Bellsprout', rarity: 1, evolvesAt: 21, evolvesTo: 70 },
  { id: 70, name: 'Weepinbell', rarity: 2, evolvesAt: 30, evolvesTo: 71 }, // Piedra Hoja -> nivel 30
  { id: 71, name: 'Victreebel', rarity: 3, evolvesAt: null },
  { id: 72, name: 'Tentacool', rarity: 1, evolvesAt: 30, evolvesTo: 73 },
  { id: 73, name: 'Tentacruel', rarity: 2, evolvesAt: null },
  { id: 74, name: 'Geodude', rarity: 1, evolvesAt: 25, evolvesTo: 75 },
  { id: 75, name: 'Graveler', rarity: 2, evolvesAt: 40, evolvesTo: 76 }, // Intercambio -> nivel 40
  { id: 76, name: 'Golem', rarity: 4, evolvesAt: null },
  { id: 77, name: 'Ponyta', rarity: 1, evolvesAt: 40, evolvesTo: 78 },
  { id: 78, name: 'Rapidash', rarity: 2, evolvesAt: null },
  { id: 79, name: 'Slowpoke', rarity: 1, evolvesAt: 37, evolvesTo: 80 },
  { id: 80, name: 'Slowbro', rarity: 2, evolvesAt: null },
  { id: 81, name: 'Magnemite', rarity: 1, evolvesAt: 30, evolvesTo: 82 },
  { id: 82, name: 'Magneton', rarity: 2, evolvesAt: null },
  { id: 83, name: 'Farfetch\'d', rarity: 2, evolvesAt: null },
  { id: 84, name: 'Doduo', rarity: 1, evolvesAt: 31, evolvesTo: 85 },
  { id: 85, name: 'Dodrio', rarity: 2, evolvesAt: null },
  { id: 86, name: 'Seel', rarity: 1, evolvesAt: 34, evolvesTo: 87 },
  { id: 87, name: 'Dewgong', rarity: 2, evolvesAt: null },
  { id: 88, name: 'Grimer', rarity: 1, evolvesAt: 38, evolvesTo: 89 },
  { id: 89, name: 'Muk', rarity: 2, evolvesAt: null },
  { id: 90, name: 'Shellder', rarity: 1, evolvesAt: 30, evolvesTo: 91 }, // Piedra Agua -> nivel 30
  { id: 91, name: 'Cloyster', rarity: 3, evolvesAt: null },
  { id: 92, name: 'Gastly', rarity: 2, evolvesAt: 25, evolvesTo: 93 },
  { id: 93, name: 'Haunter', rarity: 3, evolvesAt: 40, evolvesTo: 94 }, // Intercambio -> nivel 40
  { id: 94, name: 'Gengar', rarity: 4, evolvesAt: null },
  { id: 95, name: 'Onix', rarity: 2, evolvesAt: null },
  { id: 96, name: 'Drowzee', rarity: 1, evolvesAt: 26, evolvesTo: 97 },
  { id: 97, name: 'Hypno', rarity: 2, evolvesAt: null },
  { id: 98, name: 'Krabby', rarity: 1, evolvesAt: 28, evolvesTo: 99 },
  { id: 99, name: 'Kingler', rarity: 2, evolvesAt: null },
  { id: 100, name: 'Voltorb', rarity: 1, evolvesAt: 30, evolvesTo: 101 },
  { id: 101, name: 'Electrode', rarity: 2, evolvesAt: null },
  { id: 102, name: 'Exeggcute', rarity: 2, evolvesAt: 30, evolvesTo: 103 }, // Piedra Hoja -> nivel 30
  { id: 103, name: 'Exeggutor', rarity: 3, evolvesAt: null },
  { id: 104, name: 'Cubone', rarity: 1, evolvesAt: 28, evolvesTo: 105 },
  { id: 105, name: 'Marowak', rarity: 2, evolvesAt: null },
  { id: 106, name: 'Hitmonlee', rarity: 3, evolvesAt: null },
  { id: 107, name: 'Hitmonchan', rarity: 3, evolvesAt: null },
  { id: 108, name: 'Lickitung', rarity: 2, evolvesAt: null },
  { id: 109, name: 'Koffing', rarity: 1, evolvesAt: 35, evolvesTo: 110 },
  { id: 110, name: 'Weezing', rarity: 2, evolvesAt: null },
  { id: 111, name: 'Rhyhorn', rarity: 1, evolvesAt: 42, evolvesTo: 112 },
  { id: 112, name: 'Rhydon', rarity: 2, evolvesAt: null },
  { id: 113, name: 'Chansey', rarity: 3, evolvesAt: null },
  { id: 114, name: 'Tangela', rarity: 2, evolvesAt: null },
  { id: 115, name: 'Kangaskhan', rarity: 3, evolvesAt: null },
  { id: 116, name: 'Horsea', rarity: 1, evolvesAt: 32, evolvesTo: 117 },
  { id: 117, name: 'Seadra', rarity: 2, evolvesAt: null },
  { id: 118, name: 'Goldeen', rarity: 1, evolvesAt: 33, evolvesTo: 119 },
  { id: 119, name: 'Seaking', rarity: 2, evolvesAt: null },
  { id: 120, name: 'Staryu', rarity: 1, evolvesAt: 30, evolvesTo: 121 }, // Piedra Agua -> nivel 30
  { id: 121, name: 'Starmie', rarity: 3, evolvesAt: null },
  { id: 122, name: 'Mr. Mime', rarity: 3, evolvesAt: null },
  { id: 123, name: 'Scyther', rarity: 3, evolvesAt: null },
  { id: 124, name: 'Jynx', rarity: 3, evolvesAt: null },
  { id: 125, name: 'Electabuzz', rarity: 3, evolvesAt: null },
  { id: 126, name: 'Magmar', rarity: 3, evolvesAt: null },
  { id: 127, name: 'Pinsir', rarity: 3, evolvesAt: null },
  { id: 128, name: 'Tauros', rarity: 3, evolvesAt: null },
  { id: 129, name: 'Magikarp', rarity: 1, evolvesAt: 20, evolvesTo: 130 },
  { id: 130, name: 'Gyarados', rarity: 4, evolvesAt: null },
  { id: 131, name: 'Lapras', rarity: 4, evolvesAt: null },
  { id: 132, name: 'Ditto', rarity: 3, evolvesAt: null },
  { id: 133, name: 'Eevee', rarity: 3, evolvesAt: 25, evolvesTo: 134 }, // Piedra Agua/Fuego/Trueno -> nivel 25, por defecto Vaporeon
  { id: 134, name: 'Vaporeon', rarity: 4, evolvesAt: null },
  { id: 135, name: 'Jolteon', rarity: 4, evolvesAt: null },
  { id: 136, name: 'Flareon', rarity: 4, evolvesAt: null },
  { id: 137, name: 'Porygon', rarity: 3, evolvesAt: null },
  { id: 138, name: 'Omanyte', rarity: 3, evolvesAt: 40, evolvesTo: 139 },
  { id: 139, name: 'Omastar', rarity: 4, evolvesAt: null },
  { id: 140, name: 'Kabuto', rarity: 3, evolvesAt: 40, evolvesTo: 141 },
  { id: 141, name: 'Kabutops', rarity: 4, evolvesAt: null },
  { id: 142, name: 'Aerodactyl', rarity: 4, evolvesAt: null },
  { id: 143, name: 'Snorlax', rarity: 4, evolvesAt: null },
  { id: 144, name: 'Articuno', rarity: 5, evolvesAt: null },
  { id: 145, name: 'Zapdos', rarity: 5, evolvesAt: null },
  { id: 146, name: 'Moltres', rarity: 5, evolvesAt: null },
  { id: 147, name: 'Dratini', rarity: 3, evolvesAt: 30, evolvesTo: 148 },
  { id: 148, name: 'Dragonair', rarity: 4, evolvesAt: 55, evolvesTo: 149 },
  { id: 149, name: 'Dragonite', rarity: 5, evolvesAt: null },
  { id: 150, name: 'Mewtwo', rarity: 5, evolvesAt: null },
  { id: 151, name: 'Mew', rarity: 5, evolvesAt: null },
];

// Función para obtener Pokémon disponibles según rareza de la Pokébola
export const getPokemonByBallType = (ballType, caughtLegendaries = []) => {
  // Pokébola (10 XP): Rareza 1-2 (Común y Poco común) + 0.1% de rareza 5
  // Superbola (25 XP): Rareza 1-3 (Común, Poco común, Raro) + 0.1% de rareza 5
  // Ultrabola (50 XP): Rareza 1-4 (Común, Poco común, Raro, Muy raro) + 0.1% de rareza 5
  // Masterball: Garantiza rareza 5 sin repetir hasta tenerlos todos
  
  if (ballType === 'masterball') {
    // Obtener todos los pokémon de rareza 5
    const legendaries = GEN1_POKEMON.filter(p => p.rarity === 5);
    // Filtrar los que aún no han sido capturados
    const available = legendaries.filter(p => !caughtLegendaries.includes(p.id));
    
    if (available.length === 0) {
      // Si ya se capturaron todos, permitir repetir
      return legendaries[Math.floor(Math.random() * legendaries.length)];
    }
    
    // Retornar uno aleatorio de los disponibles
    return available[Math.floor(Math.random() * available.length)];
  }
  
  // 0.1% de probabilidad de obtener un pokémon de rareza 5
  if (Math.random() < 0.001) {
    const legendaries = GEN1_POKEMON.filter(p => p.rarity === 5);
    return legendaries[Math.floor(Math.random() * legendaries.length)];
  }
  
  const maxRarity = ballType === 'pokeball' ? 2 : ballType === 'greatball' ? 3 : 4;
  
  // Solo Pokémon base (sin evoluciones)
  const basePokemon = GEN1_POKEMON.filter(p => {
    // No incluir evoluciones (verificar si algún Pokémon evoluciona a este)
    const isEvolution = GEN1_POKEMON.some(other => other.evolvesTo === p.id);
    return !isEvolution && p.rarity <= maxRarity;
  });
  
  // Selección ponderada por rareza (más común = más probabilidad)
  const weights = basePokemon.map(p => {
    // Invertir rareza para la probabilidad (rareza 1 = 5 puntos, rareza 5 = 1 punto)
    return 6 - p.rarity;
  });
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < basePokemon.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return basePokemon[i];
    }
  }
  
  return basePokemon[basePokemon.length - 1];
};

// Función para obtener el sprite del Pokémon
export const getPokemonSprite = (pokemonId) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
};

// Función para evolucionar un Pokémon capturado
export const evolvePokemon = (pokemon) => {
  // No evoluciona si tiene canEvolve en false
  if (pokemon.canEvolve === false) {
    return null;
  }

  const pokemonData = GEN1_POKEMON.find(p => p.id === pokemon.id);
  
  if (!pokemonData || !pokemonData.evolvesAt || !pokemonData.evolvesTo) {
    return null; // No puede evolucionar
  }
  
  if (pokemon.level >= pokemonData.evolvesAt) {
    const evolution = GEN1_POKEMON.find(p => p.id === pokemonData.evolvesTo);
    return {
      ...pokemon,
      id: evolution.id,
      name: evolution.name,
      canEvolve: true, // La evolución puede seguir evolucionando
    };
  }
  
  return null;
};

// Función para obtener datos de un Pokémon por ID
export const getPokemonById = (id) => {
  return GEN1_POKEMON.find(p => p.id === id);
};
