import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

// Tarjeta de tarea estilo Pokédex
export default function TaskCard({ task, onToggleComplete, onDelete }) {
  return (
    <View style={[styles.container, task.completed && styles.completed]}>
      {task.completed ? (
        // Solo botón de eliminar a la izquierda para tareas completadas
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      ) : (
        // Checkbox a la izquierda para tareas pendientes
        <TouchableOpacity 
          style={styles.checkbox}
          onPress={() => onToggleComplete(task.id)}
        >
          <View style={styles.checkboxInner} />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
        {task.date && (
          <Text style={styles.date}>📅 {task.date}</Text>
        )}
        <Text style={styles.xp}>⭐ +{task.xp} XP</Text>
      </View>

      {!task.completed && (
        // Botón de eliminar a la derecha solo para tareas pendientes
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: isSmallScreen ? 12 : 15,
    marginVertical: isSmallScreen ? 6 : 8,
    borderWidth: 3,
    borderColor: '#DC0A2D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completed: {
    backgroundColor: '#F0F0F0',
    borderColor: '#999',
  },
  checkbox: {
    width: isSmallScreen ? 28 : 32,
    height: isSmallScreen ? 28 : 32,
    borderRadius: isSmallScreen ? 14 : 16,
    borderWidth: 3,
    borderColor: '#DC0A2D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFF',
  },
  checkboxInner: {
    width: isSmallScreen ? 12 : 14,
    height: isSmallScreen ? 12 : 14,
    borderRadius: isSmallScreen ? 6 : 7,
    backgroundColor: '#DC0A2D',
  },
  checkboxText: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#DC0A2D',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: isSmallScreen ? 11 : 12,
    color: '#3B4CCA',
    marginBottom: 4,
  },
  xp: {
    fontSize: isSmallScreen ? 11 : 12,
    color: '#FFCB05',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: isSmallScreen ? 6 : 8,
  },
  deleteText: {
    fontSize: isSmallScreen ? 18 : 20,
  },
});
