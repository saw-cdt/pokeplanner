import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

export default function CustomAlert({ visible, title, message, buttons, pokemon }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => buttons?.[0]?.onPress?.()}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Header con diseño Pokémon */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            {pokemon && (
              <Image 
                source={typeof pokemon.sprite === 'string' ? { uri: pokemon.sprite } : pokemon.sprite}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            {buttons?.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'destructive' && styles.destructiveButton,
                  button.style === 'cancel' && styles.cancelButton,
                ]}
                onPress={button.onPress}
              >
                <Text style={[
                  styles.buttonText,
                  button.style === 'destructive' && styles.destructiveButtonText,
                  button.style === 'cancel' && styles.cancelButtonText,
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  alertContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: isSmallScreen ? '95%' : '85%',
    maxWidth: 400,
    borderWidth: 4,
    borderColor: '#DC0A2D',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#DC0A2D',
    padding: isSmallScreen ? 12 : 15,
    alignItems: 'center',
  },
  title: {
    fontSize: isSmallScreen ? 18 : 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  content: {
    padding: isSmallScreen ? 15 : 20,
    alignItems: 'center',
  },
  pokemonImage: {
    width: isSmallScreen ? 100 : 120,
    height: isSmallScreen ? 100 : 120,
    marginBottom: 15,
  },
  message: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 20 : 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#DDD',
  },
  button: {
    flex: 1,
    padding: isSmallScreen ? 12 : 15,
    alignItems: 'center',
    backgroundColor: '#FFCB05',
  },
  destructiveButton: {
    backgroundColor: '#DC0A2D',
  },
  cancelButton: {
    backgroundColor: '#CCC',
    borderRightWidth: 1,
    borderRightColor: '#AAA',
  },
  buttonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#333',
  },
  destructiveButtonText: {
    color: '#FFF',
  },
  cancelButtonText: {
    color: '#666',
  },
});
