import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadPokemonCollection, savePokemonCollection, loadActivePokemon, saveActivePokemon, loadTrainerProgress } from '../utils/storage';
import { GEN1_POKEMON, getPokemonSprite, evolvePokemon } from '../data/gen1Pokemon';
import CustomAlert from '../components/CustomAlert';

export default function PokemonCollectionScreen() {
  const navigation = useNavigation();
  const [collection, setCollection] = useState([]);
  const [activePokemon, setActivePokemon] = useState(null);
  const [trainerLevel, setTrainerLevel] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', buttons: [], pokemon: null });

  useEffect(() => {
    loadData();
    
    const interval = setInterval(() => {
      loadData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const savedCollection = await loadPokemonCollection();
    const active = await loadActivePokemon();
    const progress = await loadTrainerProgress();
    
    // Verificar evoluciones para todos los Pokémon según su propio nivel
    const updatedCollection = savedCollection.map(pokemon => {
      const evolution = evolvePokemon(pokemon);
      if (evolution) {
        return evolution;
      }
      return pokemon;
    });
    
    // Si hubo evoluciones, guardar la colección actualizada y actualizar el activo si evolucionó
    if (JSON.stringify(updatedCollection) !== JSON.stringify(savedCollection)) {
      await savePokemonCollection(updatedCollection);
      
      // Si el Pokémon activo evolucionó, actualizarlo
      if (active) {
        const updatedActive = updatedCollection.find(p => p.uniqueId === active.uniqueId);
        if (updatedActive && updatedActive.id !== active.id) {
          await saveActivePokemon(updatedActive);
          setActivePokemon(updatedActive);
          setAlert({
            visible: true,
            title: '¡Evolución!',
            message: `¡${active.name} ha evolucionado en ${updatedActive.name}!`,
            buttons: [{
              text: 'Genial!',
              onPress: () => setAlert({ ...alert, visible: false })
            }],
            pokemon: { sprite: getPokemonSprite(updatedActive.id) }
          });
        } else {
          setActivePokemon(updatedActive || active);
        }
      }
    } else {
      // Actualizar el Pokémon activo con los datos más recientes de la colección
      if (active) {
        const currentActive = updatedCollection.find(p => p.uniqueId === active.uniqueId);
        setActivePokemon(currentActive || active);
      }
    }
    
    setCollection(updatedCollection);
    setTrainerLevel(progress.level);
  };

  const setAsActive = async (pokemon) => {
    await saveActivePokemon(pokemon);
    setActivePokemon(pokemon);
    setDetailModalVisible(false);
    
    // Navegar de vuelta a la pantalla de perfil
    navigation.goBack();
  };

  const openDetail = (pokemon) => {
    setSelectedPokemon(pokemon);
    setDetailModalVisible(true);
  };

  const getPokemonData = (pokemonId) => {
    return GEN1_POKEMON.find(p => p.id === pokemonId);
  };

  const renderPokemonCard = ({ item }) => {
    const pokemonData = getPokemonData(item.id);
    const isActive = activePokemon && activePokemon.uniqueId === item.uniqueId;
    
    return (
      <TouchableOpacity 
        style={[styles.pokemonCard, isActive && styles.activePokemonCard]}
        onPress={() => openDetail(item)}
      >
        <Image 
          source={{ uri: getPokemonSprite(item.id) }}
          style={styles.pokemonImage}
        />
        <Text 
          style={styles.pokemonName} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
        <Text style={styles.pokemonLevel}>Nv. {item.level || 1}</Text>
        {isActive && <Text style={styles.activeLabel}>★ ACTIVO</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Colección</Text>
        <Text style={styles.subtitle}>{collection.length} Pokémon capturados</Text>
      </View>

      <FlatList
        data={collection}
        keyExtractor={(item) => item.uniqueId}
        renderItem={renderPokemonCard}
        numColumns={3}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No has capturado ningún Pokémon</Text>
            <Text style={styles.emptySubtext}>Completa misiones para obtener Pokébolas</Text>
          </View>
        }
      />

      {/* Modal de detalle de Pokémon */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {selectedPokemon && (
            <View style={styles.modalContent}>
              <Image 
                source={{ uri: getPokemonSprite(selectedPokemon.id) }}
                style={styles.modalPokemonImage}
              />
              <Text style={styles.modalPokemonName}>{selectedPokemon.name}</Text>
              <Text style={styles.modalPokemonLevel}>Nivel {selectedPokemon.level}</Text>
              
              {(() => {
                const pokemonData = getPokemonData(selectedPokemon.id);
                return (
                  <View style={styles.modalStats}>
                    <Text style={styles.modalStatText}>Rareza: {'★'.repeat(pokemonData.rarity)}</Text>
                    {pokemonData.evolvesAt && selectedPokemon.canEvolve !== false && (
                      <Text style={styles.modalStatText}>
                        Evoluciona en nivel {pokemonData.evolvesAt}
                      </Text>
                    )}
                    {selectedPokemon.canEvolve === false && (
                      <Text style={[styles.modalStatText, {color: '#999'}]}>
                        No puede evolucionar
                      </Text>
                    )}
                  </View>
                );
              })()}

              <View style={styles.modalButtons}>
                {(!activePokemon || activePokemon.uniqueId !== selectedPokemon.uniqueId) && (
                  <TouchableOpacity 
                    style={styles.setActiveButton}
                    onPress={() => setAsActive(selectedPokemon)}
                  >
                    <Text style={styles.setActiveButtonText}>Establecer como Activo</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={styles.closeModalButton}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.closeModalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        pokemon={alert.pokemon}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#DC0A2D',
    padding: isSmallScreen ? 15 : 20,
    paddingTop: isSmallScreen ? 40 : 50,
  },
  title: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#FFF',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#FFF',
    fontWeight: '600',
  },
  grid: {
    padding: isSmallScreen ? 10 : 15,
  },
  pokemonCard: {
    flex: 1,
    backgroundColor: '#FFF',
    margin: isSmallScreen ? 3 : 5,
    padding: isSmallScreen ? 8 : 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: isSmallScreen ? 130 : 140,
    maxHeight: isSmallScreen ? 150 : 160,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  activePokemonCard: {
    borderColor: '#FFCB05',
    backgroundColor: '#FFF9E6',
  },
  pokemonImage: {
    width: isSmallScreen ? 50 : 60,
    height: isSmallScreen ? 50 : 60,
    marginTop: 4,
  },
  pokemonName: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  pokemonLevel: {
    fontSize: isSmallScreen ? 10 : 11,
    color: '#666',
    fontWeight: '600',
  },
  activeLabel: {
    fontSize: isSmallScreen ? 8 : 9,
    fontWeight: 'bold',
    color: '#FFCB05',
    marginBottom: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  modalPokemonImage: {
    width: 150,
    height: 150,
  },
  modalPokemonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: 5,
  },
  modalPokemonLevel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  modalStats: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalStatText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalButtons: {
    width: '100%',
  },
  setActiveButton: {
    backgroundColor: '#FFCB05',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  setActiveButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#CCC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeModalButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
