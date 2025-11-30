import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { getPokemonSprite } from '../data/gen1Pokemon';
import { getPokemonNameById } from '../data/badges';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

export default function BadgeModal({ visible, badge, onClose, progress, collection }) {
  if (!badge) return null;

  const collectedIds = collection.map(p => p.id);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Image source={badge.image} style={styles.badgeImage} />
            <Text style={styles.title}>{badge.name}</Text>
            <Text style={styles.leader}>Líder: {badge.leader}</Text>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Pokémon Requeridos</Text>
            <Text style={styles.progressText}>
              {progress.collected}/{progress.total} capturados
            </Text>

            <ScrollView style={styles.pokemonList}>
              {badge.requiredPokemon.map(pokemonId => {
                const isCollected = collectedIds.includes(pokemonId);
                return (
                  <View key={pokemonId} style={styles.pokemonItem}>
                    <Image 
                      source={{ uri: getPokemonSprite(pokemonId) }}
                      style={[styles.pokemonImage, !isCollected && styles.pokemonImageLocked]}
                    />
                    <Text style={[styles.pokemonName, !isCollected && styles.pokemonNameLocked]}>
                      {getPokemonNameById(pokemonId)}
                    </Text>
                    <Text style={styles.checkmark}>
                      {isCollected ? '✓' : '✗'}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 10 : 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: isSmallScreen ? '95%' : '85%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 4,
    borderColor: '#DC0A2D',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#DC0A2D',
    padding: isSmallScreen ? 15 : 20,
    alignItems: 'center',
  },
  badgeImage: {
    width: isSmallScreen ? 50 : 60,
    height: isSmallScreen ? 50 : 60,
    marginBottom: 10,
  },
  title: {
    fontSize: isSmallScreen ? 18 : 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 3,
  },
  leader: {
    fontSize: isSmallScreen ? 13 : 15,
    color: '#FFF',
    fontWeight: '600',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: isSmallScreen ? 15 : 20,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  progressText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
    marginBottom: 15,
  },
  pokemonList: {
    maxHeight: isSmallScreen ? 200 : 250,
  },
  pokemonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isSmallScreen ? 8 : 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 8,
  },
  pokemonImage: {
    width: isSmallScreen ? 35 : 40,
    height: isSmallScreen ? 35 : 40,
    marginRight: 10,
  },
  pokemonImageLocked: {
    opacity: 0.3,
  },
  pokemonName: {
    flex: 1,
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: '#333',
  },
  pokemonNameLocked: {
    color: '#999',
  },
  checkmark: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#FFCB05',
    padding: isSmallScreen ? 12 : 15,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#DDD',
  },
  closeButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
