// Sistema de medallas de Kanto con los Pokémon de cada líder de gimnasio

export const KANTO_BADGES = [
  {
    id: 1,
    name: 'Medalla Roca',
    leader: 'Brock',
    image: require('../assets/badge1.png'),
    requiredPokemon: [74, 95], // Geodude, Onix
  },
  {
    id: 2,
    name: 'Medalla Cascada',
    leader: 'Misty',
    image: require('../assets/badge2.png'),
    requiredPokemon: [120, 121], // Staryu, Starmie
  },
  {
    id: 3,
    name: 'Medalla Trueno',
    leader: 'Lt. Surge',
    image: require('../assets/badge3.png'),
    requiredPokemon: [25, 26, 100, 101], // Pikachu, Raichu, Voltorb, Electrode
  },
  {
    id: 4,
    name: 'Medalla Arcoíris',
    leader: 'Erika',
    image: require('../assets/badge4.png'),
    requiredPokemon: [44, 71, 114], // Gloom, Victreebel, Tangela
  },
  {
    id: 5,
    name: 'Medalla Alma',
    leader: 'Koga',
    image: require('../assets/badge5.png'),
    requiredPokemon: [109, 89, 110], // Koffing, Muk, Weezing
  },
  {
    id: 6,
    name: 'Medalla Pantano',
    leader: 'Sabrina',
    image: require('../assets/badge6.png'),
    requiredPokemon: [64, 65, 122], // Kadabra, Alakazam, Mr. Mime
  },
  {
    id: 7,
    name: 'Medalla Volcán',
    leader: 'Blaine',
    image: require('../assets/badge7.png'),
    requiredPokemon: [58, 59, 78], // Growlithe, Arcanine, Rapidash
  },
  {
    id: 8,
    name: 'Medalla Tierra',
    leader: 'Giovanni',
    image: require('../assets/badge8.png'),
    requiredPokemon: [50, 51, 111, 112], // Diglett, Dugtrio, Rhyhorn, Rhydon
  },
];

// Verificar si el usuario tiene todos los Pokémon necesarios para una medalla
export const checkBadgeRequirements = (badgeId, pokemonCollection) => {
  const badge = KANTO_BADGES.find(b => b.id === badgeId);
  if (!badge) return { earned: false, missing: [] };

  const collectedIds = pokemonCollection.map(p => p.id);
  const missing = badge.requiredPokemon.filter(reqId => !collectedIds.includes(reqId));

  return {
    earned: missing.length === 0,
    missing: missing,
    total: badge.requiredPokemon.length,
    collected: badge.requiredPokemon.length - missing.length
  };
};

// Obtener el nombre de un Pokémon por ID
export const getPokemonNameById = (id) => {
  const { GEN1_POKEMON } = require('./gen1Pokemon');
  const pokemon = GEN1_POKEMON.find(p => p.id === id);
  return pokemon ? pokemon.name : 'Desconocido';
};
