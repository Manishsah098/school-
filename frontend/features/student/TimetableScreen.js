import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function TimetableScreen({ token, onBack }) {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get('/api/student/timetable', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }));
        setTimetable(res.data || []);
      } catch (err) {
        console.error('Error fetching timetable', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [token]);

  const daySchedule = timetable.filter(t => t.dayOfWeek.toLowerCase() === selectedDay.toLowerCase());

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Class Timetable</Text>
          <Text style={styles.headerSub}>Weekly Class Routine</Text>
        </View>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelectorRow}>
        {days.map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayTab, selectedDay === day && styles.dayTabActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayTabText, selectedDay === day && styles.dayTabTextActive]}>
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#042940" style={{ marginTop: 40 }} />
      ) : daySchedule.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
        </View>
      ) : (
        daySchedule.map((slot, index) => (
          <View key={slot.id || index} style={styles.periodCard}>
            <View style={styles.periodBadge}>
              <Text style={styles.periodNum}>P{slot.periodNumber}</Text>
            </View>
            <View style={styles.periodInfo}>
              <Text style={styles.subjectTitle}>{slot.subject}</Text>
              <Text style={styles.teacherName}>👨‍🏫 {slot.teacherName}</Text>
              <Text style={styles.timeRange}>⏰ {slot.startTime} - {slot.endTime}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 16 },
  backBtn: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1' },
  backText: { fontSize: 13, fontWeight: '700', color: '#042940' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 12, color: '#64748B' },
  daySelectorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dayTab: { backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, elevation: 1 },
  dayTabActive: { backgroundColor: '#042940' },
  dayTabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  dayTabTextActive: { color: '#FFFFFF' },
  periodCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 2 },
  periodBadge: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#EBF3FA', justifyContent: 'center', alignItems: 'center' },
  periodNum: { fontSize: 16, fontWeight: '800', color: '#042940' },
  periodInfo: { flex: 1 },
  subjectTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  teacherName: { fontSize: 12, color: '#475569', marginTop: 2 },
  timeRange: { fontSize: 11, color: '#10B981', fontWeight: '700', marginTop: 4 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 30, alignItems: 'center', marginTop: 20 },
  emptyIcon: { fontSize: 32, marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
});
