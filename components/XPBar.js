import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;
const XP_PER_LEVEL = 100;

// Barra de experiencia del entrenador
export default function XPBar({ xp, level }) {
  const currentLevelXP = xp % XP_PER_LEVEL;
  const progress = (currentLevelXP / XP_PER_LEVEL) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelText}>Nivel {level}</Text>
        <Text style={styles.xpText}>{currentLevelXP}/{XP_PER_LEVEL} XP</Text>
      </View>
      
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#DC0A2D',
  },
  xpText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
  },
  barContainer: {
    width: '100%',
    height: isSmallScreen ? 10 : 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FFCB05',
  },
});
