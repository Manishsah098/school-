import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function HomeworkView({ token, onBack }) {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const res = await axios.get('/api/student/homework', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHomework(res.data);
      } catch (err) {
        console.error('Error fetching homework', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomework();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  const today = new Date();
  const filtered = homework.filter(hw => {
    const dueDate = new Date(hw.date);
    if (filter === 'upcoming') return dueDate >= today;
    if (filter === 'past') return dueDate < today;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Homework</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.filterBar}>
        {['all', 'upcoming', 'past'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isPast = new Date(item.date) < today;
          return (
            <View style={[styles.hwCard, isPast && styles.hwCardPast]}>
              <View style={styles.hwHeader}>
                <Text style={styles.hwTitle}>{item.title}</Text>
                <View style={[styles.hwBadge, { backgroundColor: isPast ? 'rgba(255,71,87,0.1)' : 'rgba(0,118,168,0.1)' }]}>
                  <Text style={[styles.hwBadgeText, { color: isPast ? '#ff4757' : '#0076a8' }]}>
                    {isPast ? 'Overdue' : 'Pending'}
                  </Text>
                </View>
              </View>
              <Text style={styles.hwDesc} numberOfLines={3}>{item.description}</Text>
              <View style={styles.hwFooter}>
                <Text style={styles.hwClass}>📚 {item.classId}</Text>
                <Text style={[styles.hwDue, { color: isPast ? '#ff4757' : 'var(--text-muted)' }]}>
                  📅 Due: {item.date}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>No homework found in this category.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'var(--bg-app)' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-app)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: 13, color: 'var(--color-accent)', fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', color: 'var(--text-main)' },
  filterBar: { flexDirection: 'row', backgroundColor: 'var(--bg-card)', padding: 4, margin: 20, borderRadius: 10, borderWidth: 1, borderColor: 'var(--border-color)' },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  filterTabActive: { backgroundColor: 'var(--color-accent)' },
  filterText: { fontSize: 12, fontWeight: '600', color: 'var(--text-muted)' },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  hwCard: { backgroundColor: 'var(--bg-card)', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'var(--border-color)', borderLeftWidth: 4, borderLeftColor: 'var(--color-accent)' },
  hwCardPast: { borderLeftColor: '#ff4757', opacity: 0.8 },
  hwHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  hwTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: 'var(--text-main)', marginRight: 8 },
  hwBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8 },
  hwBadgeText: { fontSize: 10, fontWeight: '700' },
  hwDesc: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 18, marginBottom: 10 },
  hwFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  hwClass: { fontSize: 11, color: 'var(--text-muted)', fontWeight: '500' },
  hwDue: { fontSize: 11, fontWeight: '600' },
  empty: { padding: 40, alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyText: { color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' },
});
