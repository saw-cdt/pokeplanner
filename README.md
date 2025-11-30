# PokéPlanner - Aplicación de Gestión de Tareas con Temática Pokémon

## Proyecto Integrador de Aprendizaje
**Materia:** Aplicaciones Móviles  
**Tecnología:** React Native con Expo

---

## Descripción del Proyecto

PokéPlanner es una aplicación móvil que combina la gestión de tareas con elementos de gamificación inspirados en el universo Pokémon. La aplicación permite a los usuarios organizar sus actividades diarias mientras coleccionan Pokémon, suben de nivel y desbloquean medallas, creando una experiencia motivadora para completar objetivos.

---

## Funcionalidades Principales

### 1. Sistema de Tareas
- Creación de tareas con título, descripción y fecha límite
- Calendario visual que muestra las tareas programadas por día
- Marcado de tareas como completadas
- Vista de tareas pendientes organizadas por fecha
- Al completar tareas se obtiene experiencia (XP) para el entrenador

### 2. Sistema de Progresión del Entrenador
- Sistema de niveles basado en experiencia acumulada
- Cada tarea completada otorga de 10 a 50 XP
- Se requieren 100 XP por nivel (Nivel 1: 0-99 XP, Nivel 2: 100-199 XP, etc.)
- Perfil del entrenador que muestra nivel actual, experiencia y estadísticas
- Selección de Pokémon inicial (Bulbasaur, Charmander o Squirtle) al iniciar

### 3. Colección de Pokémon
- Al completar tareas se obtienen Pokébolas para capturar Pokémon
- Sistema de captura con tres tipos de Pokébolas:
  - Pokébola normal: Mayor probabilidad de Pokémon comunes
  - Super Ball: Mejor probabilidad de Pokémon raros
  - Ultra Ball: Mayor posibilidad de Pokémon muy raros
  - Master Ball: Garantiza un Pokémon de rareza 5 (legendarios/starters)
- 151 Pokémon de la primera generación disponibles para capturar
- Sistema de rareza (1 a 5 estrellas)
- Los Pokémon capturados se añaden a la colección del usuario

### 4. Sistema de Evolución
- Los Pokémon pueden evolucionar al alcanzar cierto nivel
- El nivel del Pokémon aumenta conforme el entrenador completa tareas
- Alertas visuales cuando un Pokémon está listo para evolucionar
- Evolución manual desde la pantalla de colección

### 5. Pokédex Interactiva
- Visualización de los 151 Pokémon en orden numérico
- Pokémon capturados se muestran a color con su nombre
- Pokémon no capturados aparecen oscurecidos con "???" como nombre
- Contador de Pokémon capturados vs total (X/151)
- Diseño responsivo que se adapta a diferentes tamaños de pantalla

### 6. Sistema de Medallas
- 8 medallas inspiradas en los líderes de gimnasio de Kanto
- Cada medalla requiere capturar ciertos Pokémon específicos
- Notificaciones al obtener una nueva medalla
- Vista de medallas en el perfil del entrenador
- Detalle de requisitos para cada medalla

### 7. Recompensas Especiales
- Master Ball otorgada cada 50 niveles (niveles 50, 100, 150, etc.)
- Master Ball garantiza captura de Pokémon de rareza 5
- Sistema anti-duplicados: la Master Ball no dará Pokémon legendarios repetidos hasta tener todos

### 8. Pokémon Compañero
- Selección de un Pokémon activo como compañero
- El compañero aparece en la pantalla principal
- Se puede cambiar el compañero desde la colección
- El Pokémon activo puede evolucionar

---

## Estructura de la Aplicación

La aplicación está dividida en cuatro pantallas principales accesibles desde la navegación inferior:

1. **Inicio**: Vista de tareas pendientes, Pokémon compañero y contador de Pokébolas
2. **Calendario**: Organización visual de tareas por fecha
3. **Pokédex**: Colección completa de los 151 Pokémon
4. **Perfil**: Información del entrenador, medallas, colección y configuración

---

## Tecnologías Utilizadas

- React Native
- Expo SDK 54
- React Navigation (Tab y Stack Navigation)
- AsyncStorage para persistencia de datos
- Dimensions API para diseño responsivo
- PokeAPI para sprites de Pokémon

---

## Persistencia de Datos

Toda la información se guarda localmente en el dispositivo usando AsyncStorage:
- Progreso del entrenador (nivel, XP, tareas completadas)
- Lista de tareas con sus estados
- Colección de Pokémon capturados
- Pokémon activo como compañero
- Cantidad de Pokébolas de cada tipo
- Medallas obtenidas
- Pokémon inicial seleccionado

---

## Botones de Prueba

**NOTA IMPORTANTE:** La aplicación incluye botones de prueba en la pantalla de perfil para facilitar la demostración y evaluación del proyecto:

- **+50 XP**: Añade experiencia instantánea para probar el sistema de niveles
- **Añadir Pokébolas**: Otorga Pokébolas de prueba para capturar Pokémon

Estos botones son únicamente para propósitos de desarrollo y prueba. En una versión final de la aplicación destinada a usuarios, estos controles serían removidos y todo el progreso se obtendría exclusivamente completando tareas.

---

## Instalación y Ejecución

1. Clonar el repositorio
2. Navegar a la carpeta del proyecto
3. Instalar dependencias:
   ```
   npm install
   ```
4. Iniciar el servidor de desarrollo:
   ```
   npx expo start
   ```
5. Escanear el código QR con la aplicación Expo Go (Android/iOS) o presionar 'w' para abrir en navegador web

---

## Diseño Responsive

La aplicación está optimizada para diferentes tamaños de pantalla:
- Smartphones pequeños (menos de 360px)
- Smartphones medianos (360-600px)
- Tablets (600-800px)
- Pantallas grandes y web (más de 800px)

Los elementos se ajustan automáticamente en tamaño y distribución según el dispositivo.

---


## Conclusión

Este proyecto demuestra la aplicación de conceptos fundamentales de desarrollo móvil como navegación entre pantallas, manejo de estado, persistencia de datos, componentes reutilizables, y diseño adaptativo. La integración de mecánicas de gamificación busca motivar a los usuarios a mantener buenos hábitos de organización de manera entretenida.

