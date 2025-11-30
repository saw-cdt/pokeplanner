import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar tareas
export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.log('Error guardando tareas:', error);
  }
};

// Cargar tareas
export const loadTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.log('Error cargando tareas:', error);
    return [];
  }
};

// Guardar progreso del entrenador
export const saveTrainerProgress = async (progress) => {
  try {
    const data = {
      xp: progress.xp || 0,
      level: progress.level || 1,
      completedTasks: progress.completedTasks || 0,
      starter: progress.starter || null,
    };
    await AsyncStorage.setItem('trainerProgress', JSON.stringify(data));
  } catch (error) {
    console.log('Error guardando progreso:', error);
  }
};

// Cargar progreso del entrenador
export const loadTrainerProgress = async () => {
  try {
    const data = await AsyncStorage.getItem('trainerProgress');
    if (data) {
      return JSON.parse(data);
    }
    return { xp: 0, level: 1, completedTasks: 0, starter: null };
  } catch (error) {
    console.log('Error cargando progreso:', error);
    return { xp: 0, level: 1, completedTasks: 0, starter: null };
  }
};

// Guardar medallas desbloqueadas
export const saveUnlockedBadges = async (badges) => {
  try {
    await AsyncStorage.setItem('badges', JSON.stringify(badges));
  } catch (error) {
    console.log('Error guardando medallas:', error);
  }
};

// Cargar medallas desbloqueadas
export const loadUnlockedBadges = async () => {
  try {
    const badges = await AsyncStorage.getItem('badges');
    return badges ? JSON.parse(badges) : [];
  } catch (error) {
    console.log('Error cargando medallas:', error);
    return [];
  }
};

// Gestión de Pokébolas
export const savePokeballs = async (pokeballs) => {
  try {
    await AsyncStorage.setItem('pokeballs', JSON.stringify(pokeballs));
  } catch (error) {
    console.log('Error guardando pokebolas:', error);
  }
};

export const loadPokeballs = async () => {
  try {
    const data = await AsyncStorage.getItem('pokeballs');
    const balls = data ? JSON.parse(data) : { pokeball: 0, greatball: 0, ultraball: 0, masterball: 0 };
    // Asegurar que masterball siempre exista
    return {
      pokeball: balls.pokeball || 0,
      greatball: balls.greatball || 0,
      ultraball: balls.ultraball || 0,
      masterball: balls.masterball || 0
    };
  } catch (error) {
    console.log('Error cargando pokebolas:', error);
    return { pokeball: 0, greatball: 0, ultraball: 0, masterball: 0 };
  }
};

// Gestión de Pokémon legendarios capturados con masterball
export const saveCaughtLegendaries = async (legendaries) => {
  try {
    await AsyncStorage.setItem('caughtLegendaries', JSON.stringify(legendaries));
  } catch (error) {
    console.log('Error guardando legendarios:', error);
  }
};

export const loadCaughtLegendaries = async () => {
  try {
    const data = await AsyncStorage.getItem('caughtLegendaries');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Error cargando legendarios:', error);
    return [];
  }
};

// Gestión de Pokémon capturados
export const savePokemonCollection = async (collection) => {
  try {
    await AsyncStorage.setItem('pokemonCollection', JSON.stringify(collection));
  } catch (error) {
    console.log('Error guardando coleccion pokemon:', error);
  }
};

export const loadPokemonCollection = async () => {
  try {
    const data = await AsyncStorage.getItem('pokemonCollection');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Error cargando coleccion pokemon:', error);
    return [];
  }
};

// Pokémon activo en el perfil (adicional al starter)
export const saveActivePokemon = async (pokemon) => {
  try {
    await AsyncStorage.setItem('activePokemon', JSON.stringify(pokemon));
  } catch (error) {
    console.log('Error guardando pokemon activo:', error);
  }
};

export const loadActivePokemon = async () => {
  try {
    const data = await AsyncStorage.getItem('activePokemon');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log('Error cargando pokemon activo:', error);
    return null;
  }
};
