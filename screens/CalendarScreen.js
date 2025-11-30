import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { loadTasks } from '../utils/storage';

// Pantalla de calendario
export default function CalendarScreen() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    loadCalendarData();
    
    // Recargar datos cada 2 segundos para reflejar nuevas tareas
    const interval = setInterval(() => {
      loadCalendarData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const loadCalendarData = async () => {
    const savedTasks = await loadTasks();
    setTasks(savedTasks);

    const marked = {};
    savedTasks.forEach(task => {
      if (task.date) {
        marked[task.date] = { marked: true, dotColor: '#DC0A2D' };
      }
    });
    setMarkedDates(marked);
  };

  const tasksForSelectedDate = selectedDate
    ? tasks.filter(task => task.date === selectedDate)
    : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendario de Misiones</Text>
      </View>

      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#FFF',
          selectedDayBackgroundColor: '#DC0A2D',
          selectedDayTextColor: '#FFF',
          todayTextColor: '#FFCB05',
          dayTextColor: '#333',
          textDisabledColor: '#DDD',
          dotColor: '#DC0A2D',
          selectedDotColor: '#FFF',
          arrowColor: '#DC0A2D',
          monthTextColor: '#DC0A2D',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
        }}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: markedDates[selectedDate]?.marked },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      {selectedDate && (
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>
            Misiones para {selectedDate}
          </Text>
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskXP}>{task.xp} XP</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay misiones para este día</Text>
          )}
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Consejo</Text>
        <Text style={styles.infoText}>
          Programa tus misiones con fechas específicas para mantener tu racha activa.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#3B4CCA',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  calendar: {
    margin: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#3B4CCA',
    elevation: 4,
  },
  tasksSection: {
    margin: 15,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC0A2D',
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  taskXP: {
    fontSize: 14,
    color: '#FFCB05',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  infoCard: {
    margin: 15,
    padding: 15,
    backgroundColor: '#FFCB05',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
});
