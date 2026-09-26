# PokéPlanner

A cross-platform mobile task manager that combines productivity with Pokémon-inspired gamification.

PokéPlanner was built with **React Native** and **Expo** and tested on both Android and iOS. Users can organize tasks, track them through a calendar, earn experience and rewards for completing them, collect Pokémon, unlock badges, and maintain their progress between sessions.

## Features

### Task Management
- Create tasks with a title, description, and due date
- View scheduled tasks in a calendar
- Track pending and completed tasks
- Earn experience by completing tasks

### Progression System
- XP-based trainer levels
- Starter Pokémon selection
- Poké Ball rewards tied to task completion and progression
- Persistent trainer statistics and progress

### Pokémon Collection
- Collect Pokémon from the original 151
- Multiple Poké Ball types with different capture behavior
- Pokémon rarity system
- Interactive Pokédex showing collected and undiscovered Pokémon
- Select an active Pokémon companion

### Evolution and Badges
- Pokémon progression and evolution mechanics
- Eight achievement badges with unlock requirements
- Notifications when progression milestones are reached

## Tech Stack

- **React Native** — cross-platform mobile UI
- **Expo SDK 54** — development and mobile runtime
- **React Navigation** — stack and tab navigation
- **AsyncStorage** — local persistent storage
- **Expo Notifications** — local notifications
- **Dimensions API** — adaptive layouts for different screen sizes
- **PokéAPI assets** — Pokémon sprites

## Application Structure

The application is organized around four primary areas:

- **Home** — pending tasks, active Pokémon, progression, and rewards
- **Calendar** — tasks organized by date
- **Pokédex** — Pokémon collection and discovery progress
- **Profile** — trainer information, badges, collection, and settings

Navigation is implemented with React Navigation using both stack and bottom-tab navigators.

## Local Persistence

Application data is stored locally with AsyncStorage, including:

- Tasks and completion state
- Trainer level and XP
- Pokémon collection
- Active Pokémon
- Poké Ball inventory
- Unlocked badges
- Starter selection

This allows user progress to persist between application sessions without requiring a remote backend.

## Responsive Design

PokéPlanner adapts its interface to different screen dimensions using React Native's Dimensions API. The UI was designed to remain usable across different phone and larger-screen sizes.

## Running the Project

### Requirements

- Node.js
- npm
- Expo Go or an Android/iOS development environment

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/saw-cdt/PIA-AppsMoviles.git
cd PIA-AppsMoviles
npm install
```

Start the Expo development server:

```bash
npx expo start
```

From the Expo development server, run the application on a supported Android or iOS device.

## Development Utilities

The profile screen contains development controls for quickly testing progression mechanics such as XP gains and Poké Ball rewards. These controls are intended for development and demonstration purposes.

## About the Project

PokéPlanner was developed as a mobile application project focused on applying core mobile engineering concepts including multi-screen navigation, state management, local persistence, reusable components, notifications, and adaptive interface design.
