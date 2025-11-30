import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import TrainerScreen from './screens/TrainerScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import PokemonCollectionScreen from './screens/PokemonCollectionScreen';
import { loadTrainerProgress, saveTrainerProgress, loadPokemonCollection, savePokemonCollection, saveActivePokemon } from './utils/storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Pokémon iniciales
const STARTER_POKEMON = [
  {
    id: 1,
    name: 'Bulbasaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
  },
  {
    id: 4,
    name: 'Charmander',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
  },
  {
    id: 7,
    name: 'Squirtle',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'
  },
];

// Stack Navigator para Perfil
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={TrainerScreen} />
      <Stack.Screen name="Collection" component={PokemonCollectionScreen} />
    </Stack.Navigator>
  );
}

// App principal de PokéPlanner
export default function App() {
  const [hasStarter, setHasStarter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    checkStarter();
    
    // Verificar cada segundo si el starter cambió (cuando se resetea)
    const interval = setInterval(() => {
      checkStarter();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkStarter = async () => {
    const data = await loadTrainerProgress();
    setProgress(data);
    setHasStarter(!!data.starter);
    setLoading(false);
  };

  const selectStarter = async (pokemon) => {
    const updatedProgress = {
      ...progress,
      starter: pokemon
    };
    await saveTrainerProgress(updatedProgress);
    
    // Agregar el starter a la colección de Pokémon
    const collection = await loadPokemonCollection();
    const starterPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      level: 1,
      xp: 0,
      caughtAt: new Date().toISOString(),
      uniqueId: Date.now().toString() + Math.random(),
      canEvolve: true,
    };
    collection.push(starterPokemon);
    await savePokemonCollection(collection);
    
    // Establecer como Pokémon activo
    await saveActivePokemon(starterPokemon);
    
    setProgress(updatedProgress);
    setHasStarter(true);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC0A2D" />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!hasStarter) {
    return (
      <SafeAreaProvider>
        <View style={styles.starterContainer}>
          <Text style={styles.starterTitle}>¡Bienvenido a PokéPlanner!</Text>
          <Text style={styles.starterSubtitle}>Elige tu Pokémon inicial:</Text>
          
          <View style={styles.startersGrid}>
            {STARTER_POKEMON.map((pokemon) => (
              <TouchableOpacity
                key={pokemon.id}
                style={styles.starterCard}
                onPress={() => selectStarter(pokemon)}
              >
                <Image source={{ uri: pokemon.sprite }} style={styles.starterImage} />
                <Text style={styles.starterName}>{pokemon.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#FFF',
              borderTopWidth: 3,
              borderTopColor: '#DC0A2D',
            },
            tabBarActiveTintColor: '#DC0A2D',
            tabBarInactiveTintColor: '#999',
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: 'bold',
            },
          }}
        >
        <Tab.Screen 
          name="Inicio" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⌂</Text>,
          }}
        />
        <Tab.Screen 
          name="Calendario" 
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>▦</Text>,
          }}
        />
        <Tab.Screen 
          name="Perfil" 
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
          }}
          listeners={({ navigation }) => ({
            tabPress: () => {
              navigation.navigate('Perfil', {
                screen: 'ProfileMain',
              });
            },
          })}
        />
        <Tab.Screen 
          name="Pokédex" 
          component={AchievementsScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>★</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  starterContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  starterTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: 10,
    textAlign: 'center',
  },
  starterSubtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  startersGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  starterCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: 140,
    minHeight: 160,
    borderWidth: 3,
    borderColor: '#DC0A2D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  starterImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  starterName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#DC0A2D',
    textAlign: 'center',
    numberOfLines: 2,
  },
});
