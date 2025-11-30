import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { getPokemonByBallType, getPokemonSprite, GEN1_POKEMON } from '../data/gen1Pokemon';
import { loadPokeballs, savePokeballs, loadPokemonCollection, savePokemonCollection } from '../utils/storage';
import CustomAlert from './CustomAlert';

export default function CatchPokemonModal({ visible, onClose, onPokemonCaught }) {
  const [pokeballs, setPokeballs] = useState({ pokeball: 0, greatball: 0, ultraball: 0, masterball: 0 });
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', buttons: [], pokemon: null });

  React.useEffect(() => {
    if (visible) {
      loadPokeballs().then(balls => {
        // Asegurar que masterball esté siempre definido
        setPokeballs({
          pokeball: balls.pokeball || 0,
          greatball: balls.greatball || 0,
          ultraball: balls.ultraball || 0,
          masterball: balls.masterball || 0
        });
      });
    }
  }, [visible]);

  const usePokeball = async (ballType) => {
    const balls = await loadPokeballs();
    
    if (balls[ballType] <= 0) {
      setAlert({
        visible: true,
        title: 'Sin Pokébolas',
        message: 'No tienes pokébolas de este tipo. ¡Completa más misiones!',
        buttons: [{
          text: 'OK',
          onPress: () => setAlert({ ...alert, visible: false })
        }]
      });
      return;
    }

    // Usar la pokébola
    balls[ballType] -= 1;
    await savePokeballs(balls);
    setPokeballs({
      pokeball: balls.pokeball || 0,
      greatball: balls.greatball || 0,
      ultraball: balls.ultraball || 0,
      masterball: balls.masterball || 0
    });

    // Capturar Pokémon aleatorio según el tipo de bola
    const collection = await loadPokemonCollection();
    
    // Para masterball, obtener los IDs de legendarios que ya están en la colección
    let caughtLegendaryIds = [];
    if (ballType === 'masterball') {
      caughtLegendaryIds = collection
        .filter(p => {
          // Buscar el pokémon en GEN1_POKEMON para verificar su rareza
          const pokemonData = GEN1_POKEMON.find(gen1 => gen1.id === p.id);
          return pokemonData && pokemonData.rarity === 5;
        })
        .map(p => p.id);
    }
    
    const pokemon = getPokemonByBallType(ballType, caughtLegendaryIds);
    
    // Verificar si ya existe este Pokémon (mismo ID)
    const alreadyHave = collection.find(p => p.id === pokemon.id);
    
    if (alreadyHave) {
      setAlert({
        visible: true,
        title: 'Pokémon Duplicado',
        message: `Ya tienes a ${pokemon.name} en tu colección. La Pokébola se perdió.`,
        buttons: [{
          text: 'OK',
          onPress: () => setAlert({ ...alert, visible: false })
        }],
        pokemon: { sprite: getPokemonSprite(pokemon.id) }
      });
      return;
    }

    const newPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      level: 1,
      xp: 0,
      caughtAt: new Date().toISOString(),
      uniqueId: Date.now().toString() + Math.random(),
      canEvolve: true, // Puede evolucionar por defecto
    };

    // Verificar si ya tenemos alguna evolución de este Pokémon
    if (pokemon.evolvesTo) {
      const hasEvolution = collection.some(p => p.id === pokemon.evolvesTo);
      if (hasEvolution) {
        newPokemon.canEvolve = false; // No puede evolucionar si ya tenemos su evolución
      }
    }

    // Agregar a la colección
    collection.push(newPokemon);
    await savePokemonCollection(collection);

    // Mostrar alerta de captura exitosa sin cerrar el modal
    setAlert({
      visible: true,
      title: '¡Captura Exitosa!',
      message: `¡Capturaste a ${newPokemon.name}!`,
      buttons: [{
        text: '¡Genial!',
        onPress: () => setAlert({ ...alert, visible: false })
      }],
      pokemon: { sprite: getPokemonSprite(newPokemon.id) }
    });
    
    if (onPokemonCaught) {
      onPokemonCaught(newPokemon);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Capturar Pokémon</Text>
          <Text style={styles.subtitle}>Selecciona una Pokébola</Text>

          <View style={styles.ballsContainer}>
            <TouchableOpacity 
              style={[styles.ballButton, (pokeballs.pokeball || 0) === 0 && styles.disabledButton]}
              onPress={() => usePokeball('pokeball')}
              disabled={(pokeballs.pokeball || 0) === 0}
            >
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }} style={styles.ballImage} />
              <Text style={styles.ballName}>Pokébola</Text>
              <Text style={styles.ballCount}>x{pokeballs.pokeball || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.ballButton, (pokeballs.greatball || 0) === 0 && styles.disabledButton]}
              onPress={() => usePokeball('greatball')}
              disabled={(pokeballs.greatball || 0) === 0}
            >
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' }} style={styles.ballImage} />
              <Text style={styles.ballName}>Superbola</Text>
              <Text style={styles.ballCount}>x{pokeballs.greatball || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.ballButton, (pokeballs.ultraball || 0) === 0 && styles.disabledButton]}
              onPress={() => usePokeball('ultraball')}
              disabled={(pokeballs.ultraball || 0) === 0}
            >
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' }} style={styles.ballImage} />
              <Text style={styles.ballName}>Ultrabola</Text>
              <Text style={styles.ballCount}>x{pokeballs.ultraball || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.ballButton, (pokeballs.masterball || 0) === 0 && styles.disabledButton]}
              onPress={() => usePokeball('masterball')}
              disabled={(pokeballs.masterball || 0) === 0}
            >
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png' }} style={styles.ballImage} />
              <Text style={styles.ballName}>Masterball</Text>
              <Text style={styles.ballCount}>x{pokeballs.masterball || 0}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>

        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          buttons={alert.buttons}
          pokemon={alert.pokemon}
        />
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 10 : 20,
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: isSmallScreen ? 20 : 30,
    width: isSmallScreen ? '95%' : '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    marginBottom: 20,
  },
  ballsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  ballButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#DC0A2D',
  },
  disabledButton: {
    opacity: 0.4,
    borderColor: '#CCC',
  },
  ballImage: {
    width: isSmallScreen ? 35 : 40,
    height: isSmallScreen ? 35 : 40,
    marginRight: 15,
  },
  ballName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ballCount: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#CCC',
    paddingVertical: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 25 : 30,
    borderRadius: 10,
    width: '100%',
  },
  closeButtonText: {
    color: '#333',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  congratsText: {
    fontSize: isSmallScreen ? 18 : 22,
    fontWeight: 'bold',
    color: '#FFCB05',
    marginBottom: 20,
    textAlign: 'center',
  },
  pokemonImage: {
    width: isSmallScreen ? 120 : 150,
    height: isSmallScreen ? 120 : 150,
    marginBottom: 15,
  },
  pokemonName: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: 5,
  },
  pokemonLevel: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#666',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#DC0A2D',
    paddingVertical: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 35 : 40,
    borderRadius: 10,
    width: '100%',
  },
  okButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
