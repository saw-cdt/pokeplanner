import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getPokemonByLevel } from '../data/pokemonData';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

// Avatar del Pokémon del entrenador
export default function PokemonAvatar({ level }) {
  const pokemon = getPokemonByLevel(level);

  return (
    <View style={styles.container}>
      <View style={styles.pokeball}>
        <Text style={styles.pokemonImage}>{pokemon.image}</Text>
      </View>
      <Text style={styles.pokemonName}>{pokemon.name}</Text>
      <Text style={styles.pokemonType}>Tipo: {pokemon.type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: isSmallScreen ? 15 : 20,
  },
  pokeball: {
    width: isSmallScreen ? 100 : 120,
    height: isSmallScreen ? 100 : 120,
    borderRadius: isSmallScreen ? 50 : 60,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pokemonImage: {
    fontSize: isSmallScreen ? 50 : 60,
  },
  pokemonName: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: 4,
  },
  pokemonType: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
  },
});
