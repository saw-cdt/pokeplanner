import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PokemonAvatar from '../components/PokemonAvatar';
import XPBar from '../components/XPBar';
import CustomAlert from '../components/CustomAlert';
import BadgeModal from '../components/BadgeModal';
import { KANTO_BADGES, checkBadgeRequirements } from '../data/badges';
import { loadTrainerProgress, saveTrainerProgress, saveTasks, loadActivePokemon, loadPokemonCollection, saveActivePokemon, savePokemonCollection, loadPokeballs, savePokeballs, saveCaughtLegendaries } from '../utils/storage';
import { getPokemonForm } from '../data/pokemonData';
import { getPokemonSprite, evolvePokemon } from '../data/gen1Pokemon';

// Pokémon iniciales con sprites
const STARTER_POKEMON = [
  {
    id: 1,
    name: 'Bulbasaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
  {
    id: 4,
    name: 'Charmander',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  },
  {
    id: 7,
    name: 'Squirtle',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
  },
];

// Pantalla del perfil del entrenador
export default function TrainerScreen() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState({ xp: 0, level: 1, completedTasks: 0, starter: null });
  const [activePokemon, setActivePokemon] = useState(null);
  const [pokemonCount, setPokemonCount] = useState(0);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', buttons: [], pokemon: null });
  const [collection, setCollection] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [notifiedBadges, setNotifiedBadges] = useState([]);
  const notifiedBadgesRef = useRef([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);

  useEffect(() => {
    loadProgress();
    
    // Recargar progreso cuando la pantalla obtiene foco
    const interval = setInterval(() => {
      loadProgress();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadProgress = async () => {
    const data = await loadTrainerProgress();
    const collection = await loadPokemonCollection();
    
    setPokemonCount(collection.length);
    setCollection(collection);
    
    // Verificar medallas obtenidas
    checkEarnedBadges(collection);
    
    // Cargar el Pokémon activo directamente desde la colección para tener datos actualizados
    const active = await loadActivePokemon();
    if (active) {
      const currentActive = collection.find(p => p.uniqueId === active.uniqueId);
      setActivePokemon(currentActive || active);
    } else {
      setActivePokemon(null);
    }
    
    // Si tiene starter, verificar si debe evolucionar
    if (data.starter && data.starter.id) {
      // Obtener el ID base del starter (siempre usar el ID original de la línea evolutiva)
      const baseStarterId = [1, 2, 3].includes(data.starter.id) ? 1 :
                           [4, 5, 6].includes(data.starter.id) ? 4 :
                           [7, 8, 9].includes(data.starter.id) ? 7 : data.starter.id;
      
      const currentForm = getPokemonForm(baseStarterId, data.level);
      
      // Si la forma actual es diferente, el Pokémon evolucionó
      if (currentForm && currentForm.id !== data.starter.id) {
        const evolvedStarter = {
          id: currentForm.id,
          name: currentForm.name,
          sprite: currentForm.sprite,
        };
        
        // Guardar la evolución
        const updatedProgress = { ...data, starter: evolvedStarter };
        await saveTrainerProgress(updatedProgress);
        setProgress(updatedProgress);
        
        // Mostrar notificación de evolución
        setAlert({
          visible: true,
          title: '¡Evolución!',
          message: `¡${data.starter.name} ha evolucionado en ${currentForm.name}!`,
          buttons: [{
            text: 'Genial!',
            onPress: () => setAlert({ ...alert, visible: false })
          }],
          pokemon: { sprite: currentForm.sprite }
        });
      } else {
        setProgress(data);
      }
    } else {
      setProgress(data);
    }
  };

  const resetProfile = () => {
    setAlert({
      visible: true,
      title: 'Resetear Perfil',
      message: '¿Estás seguro de que quieres resetear tu progreso? Se perderán todos tus datos.',
      buttons: [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setAlert({ ...alert, visible: false })
        },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: async () => {
            setAlert({ ...alert, visible: false });
            const resetData = { xp: 0, level: 1, completedTasks: 0, starter: null };
            setProgress(resetData);
            await saveTrainerProgress(resetData);
            await saveTasks([]);
            await savePokemonCollection([]);
            await saveActivePokemon(null);
            await savePokeballs({ pokeball: 0, greatball: 0, ultraball: 0, masterball: 0 });
            await saveCaughtLegendaries([]);
            setActivePokemon(null);
            setPokemonCount(0);
            setCollection([]);
            setEarnedBadges([]);
            setNotifiedBadges([]);
            notifiedBadgesRef.current = [];
          },
        },
      ]
    });
  };

  const checkEarnedBadges = (pokemonCollection) => {
    const newEarnedBadges = [];
    
    KANTO_BADGES.forEach(badge => {
      const result = checkBadgeRequirements(badge.id, pokemonCollection);
      if (result.earned && !earnedBadges.includes(badge.id)) {
        newEarnedBadges.push(badge.id);
      }
    });

    if (newEarnedBadges.length > 0) {
      setEarnedBadges([...earnedBadges, ...newEarnedBadges]);
      
      // Mostrar solo la primera medalla no notificada usando ref para verificación inmediata
      const firstNewBadge = KANTO_BADGES.find(b => newEarnedBadges.includes(b.id) && !notifiedBadgesRef.current.includes(b.id));
      if (firstNewBadge && !alert.visible) {
        // Marcar como notificada inmediatamente en el ref
        notifiedBadgesRef.current = [...notifiedBadgesRef.current, firstNewBadge.id];
        
        setAlert({
          visible: true,
          title: '¡Medalla Obtenida!',
          message: `¡Has conseguido la ${firstNewBadge.name} del líder ${firstNewBadge.leader}!`,
          buttons: [{
            text: '¡Genial!',
            onPress: () => {
              setAlert({ visible: false, title: '', message: '', buttons: [], pokemon: null });
              setNotifiedBadges([...notifiedBadges, firstNewBadge.id]);
            }
          }],
          pokemon: { sprite: firstNewBadge.image }
        });
      }
    }
  };

  const handleBadgePress = (badge) => {
    const result = checkBadgeRequirements(badge.id, collection);
    setSelectedBadge({ ...badge, progress: result });
    setBadgeModalVisible(true);
  };

  const addTestXP = async () => {
    const currentProgress = await loadTrainerProgress();
    const newXp = currentProgress.xp + 50;
    const newLevel = Math.floor(newXp / 100) + 1;
    
    const updatedProgress = {
      ...currentProgress,
      xp: newXp,
      level: newLevel,
    };
    
    await saveTrainerProgress(updatedProgress);
    setProgress(updatedProgress);

    // Dar XP al Pokémon activo
    const active = await loadActivePokemon();
    if (active) {
      const collection = await loadPokemonCollection();
      const updatedCollection = collection.map(p => {
        if (p.uniqueId === active.uniqueId) {
          const newPokemonXP = (p.xp || 0) + 50;
          const newPokemonLevel = Math.floor(newPokemonXP / 100) + 1;
          let updatedPokemon = { ...p, xp: newPokemonXP, level: newPokemonLevel };
          
          // Verificar si debe evolucionar
          if (updatedPokemon.canEvolve) {
            const evolved = evolvePokemon(updatedPokemon);
            if (evolved) {
              setAlert({
                visible: true,
                title: '¡Evolución!',
                message: `¡${updatedPokemon.name} ha evolucionado en ${evolved.name}!`,
                buttons: [{
                  text: 'Genial!',
                  onPress: () => setAlert({ ...alert, visible: false })
                }],
                pokemon: { sprite: getPokemonSprite(evolved.id) }
              });
              updatedPokemon = evolved;
            }
          }
          
          return updatedPokemon;
        }
        return p;
      });
      
      await savePokemonCollection(updatedCollection);
      
      // Actualizar el Pokémon activo
      const updatedActive = updatedCollection.find(p => p.uniqueId === active.uniqueId);
      await saveActivePokemon(updatedActive);
      setActivePokemon(updatedActive);
    }
  };

  const addTestPokeballs = async () => {
    const currentBalls = await loadPokeballs();
    const newBalls = {
      pokeball: (currentBalls.pokeball || 0) + 1,
      greatball: (currentBalls.greatball || 0) + 1,
      ultraball: (currentBalls.ultraball || 0) + 1,
      masterball: (currentBalls.masterball || 0) + 1,
    };
    
    await savePokeballs(newBalls);
  };

  const levelUpActivePokemon = async () => {
    if (!activePokemon) {
      setAlert({
        visible: true,
        title: 'Sin Pokémon Activo',
        message: 'Selecciona un Pokémon activo en tu colección primero.',
        buttons: [{
          text: 'OK',
          onPress: () => setAlert({ ...alert, visible: false })
        }]
      });
      return;
    }

    const collection = await loadPokemonCollection();
    const updatedCollection = collection.map(p => {
      if (p.uniqueId === activePokemon.uniqueId) {
        const newLevel = p.level + 1;
        let updatedPokemon = { ...p, level: newLevel };
        
        // Verificar si debe evolucionar
        if (updatedPokemon.canEvolve) {
          const evolved = evolvePokemon(updatedPokemon);
          if (evolved) {
            setAlert({
              visible: true,
              title: '¡Evolución!',
              message: `¡${updatedPokemon.name} ha evolucionado en ${evolved.name}!`,
              buttons: [{
                text: 'Genial!',
                onPress: () => setAlert({ ...alert, visible: false })
              }],
              pokemon: { sprite: getPokemonSprite(evolved.id) }
            });
            updatedPokemon = evolved;
          }
        }
        
        return updatedPokemon;
      }
      return p;
    });

    await savePokemonCollection(updatedCollection);
    
    const updatedActive = updatedCollection.find(p => p.uniqueId === activePokemon.uniqueId);
    await saveActivePokemon(updatedActive);
    
    setActivePokemon(updatedActive);
    
    setAlert({
      visible: true,
      title: '¡Nivel Subido!',
      message: `${updatedActive.name} ahora está en nivel ${updatedActive.level}!`,
      buttons: [{
        text: 'OK',
        onPress: () => setAlert({ ...alert, visible: false })
      }],
      pokemon: { sprite: getPokemonSprite(updatedActive.id) }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.trainerName}>Pokémon Activo</Text>
        {activePokemon ? (
          <View style={styles.starterDisplay}>
            <Image
              source={{ uri: getPokemonSprite(activePokemon.id) }}
              style={styles.currentSprite}
              resizeMode="contain"
            />
            <Text style={styles.currentName}>{activePokemon.name}</Text>
            <Text style={styles.currentLevel}>Nivel {activePokemon.level}</Text>
          </View>
        ) : progress.starter && (
          <View style={styles.starterDisplay}>
            <Image
              source={{ uri: progress.starter.sprite }}
              style={styles.currentSprite}
              resizeMode="contain"
            />
            <Text style={styles.currentName}>{progress.starter.name}</Text>
            <Text style={styles.currentLevel}>Nivel 1</Text>
          </View>
        )}
        {activePokemon && <XPBar xp={activePokemon.xp || 0} level={activePokemon.level} />}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Estadísticas del Entrenador</Text>
        
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{progress.completedTasks}</Text>
            <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Misiones</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{progress.level}</Text>
            <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Nivel</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pokemonCount}</Text>
            <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Pokémon</Text>
          </View>
        </View>
        
        <XPBar xp={progress.xp} level={progress.level} />
      </View>

      <TouchableOpacity 
        style={styles.collectionButton} 
        onPress={() => navigation.navigate('Collection')}
      >
        <Text style={styles.collectionButtonText}>Ver Colección Pokémon</Text>
      </TouchableOpacity>

      <View style={styles.achievementsPreview}>
        <Text style={styles.sectionTitle}>Medallas</Text>
        
        <View style={styles.badgesContainer}>
          {KANTO_BADGES.map(badge => {
            const isEarned = earnedBadges.includes(badge.id);
            return (
              <TouchableOpacity 
                key={badge.id}
                style={styles.badgeItem}
                onPress={() => handleBadgePress(badge)}
              >
                <Image 
                  source={badge.image}
                  style={[styles.badgeImage, !isEarned && styles.badgeImageLocked]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.testButton} onPress={addTestXP}>
        <Text style={styles.testButtonText}>+50 XP Entrenador (Test)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={addTestPokeballs}>
        <Text style={styles.testButtonText}>+1 de cada Pokébola (Test)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetProfile}>
        <Text style={styles.resetButtonText}>Resetear Perfil</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        pokemon={alert.pokemon}
      />

      <BadgeModal
        visible={badgeModalVisible}
        badge={selectedBadge}
        onClose={() => setBadgeModalVisible(false)}
        progress={selectedBadge?.progress}
        collection={collection}
      />
    </ScrollView>
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
    backgroundColor: '#FFCB05',
    padding: isSmallScreen ? 15 : 20,
    paddingTop: isSmallScreen ? 40 : 50,
  },
  title: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    margin: isSmallScreen ? 10 : 15,
    padding: isSmallScreen ? 15 : 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#DC0A2D',
    alignItems: 'center',
  },
  trainerName: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsCard: {
    backgroundColor: '#FFF',
    margin: isSmallScreen ? 10 : 15,
    marginTop: 0,
    padding: isSmallScreen ? 15 : 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isSmallScreen ? 10 : 15,
  },
  statRow: {
    flexDirection: 'row',
    gap: isSmallScreen ? 4 : 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: isSmallScreen ? 8 : 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minHeight: isSmallScreen ? 65 : 75,
  },
  statValue: {
    fontSize: isSmallScreen ? 20 : 28,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: isSmallScreen ? 2 : 0,
  },
  statLabel: {
    fontSize: isSmallScreen ? 9 : 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  achievementsPreview: {
    backgroundColor: '#FFF',
    margin: isSmallScreen ? 10 : 15,
    marginTop: 0,
    padding: isSmallScreen ? 15 : 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isSmallScreen ? 6 : 10,
  },
  badgeItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: isSmallScreen ? 8 : 10,
    padding: isSmallScreen ? 5 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  badgeImage: {
    width: isSmallScreen ? 32 : 40,
    height: isSmallScreen ? 32 : 40,
    resizeMode: 'contain',
  },
  badgeImageLocked: {
    opacity: 0.3,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 10,
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  selectorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  selectorSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  starterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  starterCard: {
    backgroundColor: '#FFF',
    width: isSmallScreen ? 100 : 150,
    padding: isSmallScreen ? 10 : 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#DC0A2D',
    alignItems: 'center',
  },
  starterSprite: {
    width: isSmallScreen ? 70 : 100,
    height: isSmallScreen ? 70 : 100,
  },
  starterName: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  starterDisplay: {
    alignItems: 'center',
    marginBottom: 15,
  },
  currentSprite: {
    width: isSmallScreen ? 100 : 120,
    height: isSmallScreen ? 100 : 120,
  },
  currentName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginTop: 5,
  },
  currentLevel: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
    marginTop: 2,
  },
  resetButton: {
    backgroundColor: '#DC0A2D',
    margin: isSmallScreen ? 10 : 15,
    marginTop: 0,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#FFCB05',
    margin: isSmallScreen ? 10 : 15,
    marginTop: 0,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  testButtonText: {
    color: '#333',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
  },
  levelUpButton: {
    backgroundColor: '#3B4CCA',
    margin: isSmallScreen ? 10 : 15,
    marginTop: 0,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  levelUpButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
  },
  collectionButton: {
    backgroundColor: '#3B4CCA',
    margin: isSmallScreen ? 10 : 15,
    marginTop: 0,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  collectionButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
  },
});

