// Evoluciones de los starters según nivel del entrenador
export const POKEMON_EVOLUTIONS = {
  // Bulbasaur line
  1: { 
    1: { id: 1, name: 'Bulbasaur', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', evolvesAt: 16 },
    16: { id: 2, name: 'Ivysaur', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', evolvesAt: 32 },
    32: { id: 3, name: 'Venusaur', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', evolvesAt: null },
  },
  // Charmander line
  4: {
    1: { id: 4, name: 'Charmander', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', evolvesAt: 16 },
    16: { id: 5, name: 'Charmeleon', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', evolvesAt: 36 },
    36: { id: 6, name: 'Charizard', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', evolvesAt: null },
  },
  // Squirtle line
  7: {
    1: { id: 7, name: 'Squirtle', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', evolvesAt: 16 },
    16: { id: 8, name: 'Wartortle', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png', evolvesAt: 36 },
    36: { id: 9, name: 'Blastoise', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', evolvesAt: null },
  },
};

// Obtener la forma actual del Pokémon según nivel del entrenador
export const getPokemonForm = (starterId, trainerLevel) => {
  const evolutionLine = POKEMON_EVOLUTIONS[starterId];
  if (!evolutionLine) return null;
  
  // Encontrar la forma correcta según el nivel
  let currentForm = evolutionLine[1]; // Forma base
  
  Object.keys(evolutionLine).forEach(evolveLevel => {
    const level = parseInt(evolveLevel);
    if (trainerLevel >= level) {
      currentForm = evolutionLine[level];
    }
  });
  
  return currentForm;
};

// Lista de Pokémon disponibles según nivel del entrenador (mantener compatibilidad)
export const POKEMON_LIST = [
  { id: 1, name: 'Bulbasaur', level: 1, image: '🌱', type: 'Planta' },
  { id: 2, name: 'Ivysaur', level: 5, image: '🌿', type: 'Planta' },
  { id: 3, name: 'Venusaur', level: 10, image: '🌺', type: 'Planta' },
  { id: 4, name: 'Charmander', level: 1, image: '🔥', type: 'Fuego' },
  { id: 5, name: 'Charmeleon', level: 5, image: '🦎', type: 'Fuego' },
  { id: 6, name: 'Charizard', level: 10, image: '🐉', type: 'Fuego' },
  { id: 7, name: 'Squirtle', level: 1, image: '💧', type: 'Agua' },
  { id: 8, name: 'Wartortle', level: 5, image: '🐢', type: 'Agua' },
  { id: 9, name: 'Blastoise', level: 10, image: '🌊', type: 'Agua' },
  { id: 25, name: 'Pikachu', level: 3, image: '⚡', type: 'Eléctrico' },
  { id: 26, name: 'Raichu', level: 8, image: '⚡️', type: 'Eléctrico' },
];

// Medallas/logros desbloqueables
export const BADGES = [
  { id: 1, name: 'Primera Misión', description: 'Completa tu primera tarea', icon: '🎯', required: 1 },
  { id: 2, name: 'Entrenador Novato', description: 'Alcanza nivel 5', icon: '⭐', required: 5 },
  { id: 3, name: 'Maestro Pokémon', description: 'Completa 50 tareas', icon: '👑', required: 50 },
  { id: 4, name: 'Racha de Fuego', description: 'Completa tareas 7 días seguidos', icon: '🔥', required: 7 },
  { id: 5, name: 'Coleccionista', description: 'Desbloquea 5 Pokémon', icon: '📚', required: 5 },
];

export const getPokemonByLevel = (level) => {
  const availablePokemon = POKEMON_LIST.filter(p => p.level <= level);
  return availablePokemon[availablePokemon.length - 1] || POKEMON_LIST[0];
};
