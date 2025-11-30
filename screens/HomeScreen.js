import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Platform, Image, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskCard from '../components/TaskCard';
import CatchPokemonModal from '../components/CatchPokemonModal';
import CustomAlert from '../components/CustomAlert';
import { loadTasks, saveTasks, loadTrainerProgress, saveTrainerProgress, loadPokeballs, savePokeballs, loadActivePokemon, saveActivePokemon, loadPokemonCollection, savePokemonCollection } from '../utils/storage';
import { evolvePokemon } from '../data/gen1Pokemon';
import * as Notifications from 'expo-notifications';

// Pantalla principal con lista de tareas
export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [catchModalVisible, setCatchModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', xp: 10, date: '' });
  const [progress, setProgress] = useState({ xp: 0, level: 1, completedTasks: 0, starter: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pokeballs, setPokeballs] = useState({ pokeball: 0, greatball: 0, ultraball: 0, masterball: 0 });
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', buttons: [], pokemon: null });

  useEffect(() => {
    loadData();
    
    // Recargar datos cada 2 segundos para reflejar cambios de reset
    const interval = setInterval(() => {
      loadData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const savedTasks = await loadTasks();
    const savedProgress = await loadTrainerProgress();
    const savedPokeballs = await loadPokeballs();
    setTasks(savedTasks);
    setProgress(savedProgress);
    // Forzar actualización creando un nuevo objeto
    setPokeballs({ ...savedPokeballs });
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      date: newTask.date || new Date().toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask({ title: '', description: '', xp: 10, date: '' });
    setModalVisible(false);
  };

  const toggleComplete = async (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.completed;
        
        if (isCompleting) {
          // Cargar el progreso más reciente para no perder el starter
          loadTrainerProgress().then(async currentProgress => {
            const newXp = currentProgress.xp + task.xp;
            const newLevel = Math.floor(newXp / 100) + 1;
            const oldLevel = currentProgress.level;
            const newCompletedTasks = currentProgress.completedTasks + 1;
            
            const updatedProgress = { 
              xp: newXp, 
              level: newLevel, 
              completedTasks: newCompletedTasks,
              starter: currentProgress.starter  // Preservar el starter actual
            };
            
            setProgress(updatedProgress);
            saveTrainerProgress(updatedProgress);

            // Verificar si alcanzó un nivel múltiplo de 50 para dar masterball
            const oldMultiple = Math.floor(oldLevel / 50);
            const newMultiple = Math.floor(newLevel / 50);
            if (newMultiple > oldMultiple) {
              const currentBallsForMaster = await loadPokeballs();
              currentBallsForMaster.masterball += 1;
              await savePokeballs(currentBallsForMaster);
              setPokeballs(currentBallsForMaster);
              
              setAlert({
                visible: true,
                title: '¡Nivel 50 alcanzado!',
                message: '¡Has recibido una Masterball! Úsala para capturar Pokémon legendarios.',
                buttons: [{
                  text: 'Genial!',
                  onPress: () => setAlert({ ...alert, visible: false })
                }]
              });
            }
            
            // Dar XP al Pokémon activo
            const activePokemon = await loadActivePokemon();
            if (activePokemon) {
              const collection = await loadPokemonCollection();
              const updatedCollection = collection.map(p => {
                if (p.uniqueId === activePokemon.uniqueId) {
                  const newPokemonXP = (p.xp || 0) + task.xp;
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
                        pokemon: { sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolved.id}.png` }
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
              const updatedActive = updatedCollection.find(p => p.uniqueId === activePokemon.uniqueId);
              await saveActivePokemon(updatedActive);
            }
            
            // Otorgar Pokébola según XP de la tarea
            const currentBalls = await loadPokeballs();
            let ballType = '';
            if (task.xp === 10) {
              currentBalls.pokeball += 1;
              ballType = 'Pokébola';
            } else if (task.xp === 25) {
              currentBalls.greatball += 1;
              ballType = 'Superbola';
            } else if (task.xp === 50) {
              currentBalls.ultraball += 1;
              ballType = 'Ultrabola';
            }
            
            setPokeballs(currentBalls);
            savePokeballs(currentBalls);

            Notifications.scheduleNotificationAsync({
              content: {
                title: '¡Misión Completada! 🎉',
                body: `Has ganado ${task.xp} XP y una ${ballType}!`,
              },
              trigger: null,
            });
          });
        }
        
        return { ...task, completed: isCompleting };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Misiones</Text>
        <Text style={styles.stats}>Nivel {progress.level} | {progress.completedTasks} completadas</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Nueva Misión</Text>
      </TouchableOpacity>

      <FlatList
        data={pendingTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay misiones pendientes. ¡Crea una nueva!</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {completedTasks.length > 0 && (
        <View style={styles.completedSection}>
          <Text style={styles.sectionTitle}>Completadas ({completedTasks.length})</Text>
          <ScrollView style={styles.completedScroll}>
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Modal para agregar tarea */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Misión</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título de la misión"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción (opcional)"
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              multiline
              numberOfLines={3}
            />

            <View style={styles.xpSelector}>
              <Text style={styles.label}>Recompensa XP:</Text>
              <View style={styles.xpButtons}>
                {[10, 25, 50].map(xp => (
                  <TouchableOpacity
                    key={xp}
                    style={[styles.xpButton, newTask.xp === xp && styles.xpButtonActive]}
                    onPress={() => setNewTask({ ...newTask, xp })}
                  >
                    <Text style={[styles.xpButtonText, newTask.xp === xp && styles.xpButtonTextActive]}>
                      {xp} XP
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.dateSection}>
              <Text style={styles.label}>Fecha programada:</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {newTask.date || 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (date) {
                      setSelectedDate(date);
                      setNewTask({ ...newTask, date: date.toISOString().split('T')[0] });
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addTask}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de captura de Pokémon */}
      <CatchPokemonModal 
        visible={catchModalVisible}
        onClose={() => setCatchModalVisible(false)}
        onPokemonCaught={(pokemon) => {
          loadData(); // Recargar datos después de capturar
        }}
      />

      {/* Botón flotante para capturar Pokémon */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setCatchModalVisible(true)}
      >
        <Image 
          source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
          style={styles.floatingButtonImage}
        />
        <Text style={styles.floatingButtonLabel}>
          {(pokeballs.pokeball || 0) + (pokeballs.greatball || 0) + (pokeballs.ultraball || 0) + (pokeballs.masterball || 0)}
        </Text>
      </TouchableOpacity>

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
  stats: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#FFF',
  },
  addButton: {
    backgroundColor: '#FFCB05',
    margin: isSmallScreen ? 10 : 15,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  addButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: isSmallScreen ? 10 : 15,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
  completedSection: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderTopWidth: 2,
    borderTopColor: '#DDD',
    maxHeight: 250,
  },
  completedScroll: {
    maxHeight: 200,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 10 : 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: isSmallScreen ? 18 : 25,
    width: isSmallScreen ? '95%' : '85%',
    borderWidth: 3,
    borderColor: '#DC0A2D',
  },
  modalTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: isSmallScreen ? 15 : 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: isSmallScreen ? 10 : 12,
    fontSize: isSmallScreen ? 14 : 16,
    marginBottom: 15,
  },
  textArea: {
    height: isSmallScreen ? 70 : 80,
    textAlignVertical: 'top',
  },
  xpSelector: {
    marginBottom: isSmallScreen ? 15 : 20,
  },
  label: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isSmallScreen ? 8 : 10,
  },
  xpButtons: {
    flexDirection: 'row',
    gap: isSmallScreen ? 8 : 10,
  },
  xpButton: {
    flex: 1,
    padding: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  xpButtonActive: {
    backgroundColor: '#FFCB05',
    borderColor: '#333',
  },
  xpButtonText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: 'bold',
    color: '#999',
  },
  xpButtonTextActive: {
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: isSmallScreen ? 8 : 10,
  },
  button: {
    flex: 1,
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderColor: '#999',
  },
  saveButton: {
    backgroundColor: '#DC0A2D',
    borderColor: '#333',
  },
  buttonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#999',
  },
  saveButtonText: {
    color: '#FFF',
  },
  dateSection: {
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: '#F5F5F5',
    padding: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 5,
  },
  dateButtonText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#333',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#DC0A2D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonImage: {
    width: 40,
    height: 40,
  },
  floatingButtonLabel: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFCB05',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
});
