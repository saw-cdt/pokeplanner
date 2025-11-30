import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { loadPokemonCollection } from '../utils/storage';
import { GEN1_POKEMON } from '../data/gen1Pokemon';

// Pantalla de Pokédex
export default function AchievementsScreen() {
  const [collection, setCollection] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    loadCollection();
    
    // Recargar colección cada segundo para actualizar
    const interval = setInterval(() => {
      loadCollection();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadCollection = async () => {
    const data = await loadPokemonCollection();
    setCollection(data);
  };

  const hasPokemon = (pokemonId) => {
    return collection.some(p => p.id === pokemonId);
  };

  const getCardWidth = () => {
    const { width } = dimensions;
    if (width < 360) return '23%';
    if (width < 400) return '22%';
    if (width < 600) return '19%';
    if (width < 800) return '16%';
    return '13%';
  };

  const getFontSize = (base) => {
    const { width } = dimensions;
    if (width < 360) return base;
    if (width < 600) return base + 1;
    if (width < 800) return base + 2;
    return base + 3;
  };

  const getPadding = () => {
    const { width } = dimensions;
    if (width < 360) return 4;
    if (width < 600) return 5;
    return 6;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <Text style={styles.subtitle}>{collection.length}/151 capturados</Text>
      </View>

      <View style={styles.gridContainer}>
        {GEN1_POKEMON.map(pokemon => {
          const caught = hasPokemon(pokemon.id);
          
          return (
            <View key={pokemon.id} style={[styles.pokemonCard, { width: getCardWidth(), padding: getPadding() }]}>
              <View style={styles.pokemonImageContainer}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                  }}
                  style={[
                    styles.pokemonImage,
                    !caught && styles.pokemonImageLocked
                  ]}
                />
              </View>
              <Text style={[styles.pokemonNumber, { fontSize: getFontSize(7) }]}>#{String(pokemon.id).padStart(3, '0')}</Text>
              <Text 
                style={[styles.pokemonName, !caught && styles.pokemonNameLocked, { fontSize: getFontSize(9) }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {caught ? pokemon.name : '???'}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#3B4CCA',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFCB05',
    marginTop: 5,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-evenly',
  },
  pokemonCard: {
    aspectRatio: 0.8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 6,
    marginHorizontal: '1%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD',
    justifyContent: 'space-between',
  },
  pokemonImageContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pokemonImageLocked: {
    opacity: 0.3,
    tintColor: '#000',
  },
  pokemonNumber: {
    color: '#999',
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 1,
  },
  pokemonName: {
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 3,
    marginBottom: 4,
    lineHeight: 12,
  },
  pokemonNameLocked: {
    color: '#999',
  },
});
