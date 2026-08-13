import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function AttendanceView({ token, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('/api/student/attendance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching attendance', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  const pct = data?.percentage ? Math.round(data.percentage) : 0;
  const logs = data?.logs || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Attendance</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.circleWrapper}>
          <View style={[styles.bigCircle, { borderColor: pct >= 75 ? '#2ecc71' : '#ff4757' }]}>
            <Text style={[styles.bigPct, { color: pct >= 75 ? '#2ecc71' : '#ff4757' }]}>{pct}%</Text>
            <Text style={styles.bigLabel}>Attendance</Text>
          </View>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.summaryRow}>
            <View style={[styles.dot, { backgroundColor: '#2ecc71' }]} />
            <Text style={styles.summaryLabel}>Present: <Text style={styles.summaryVal}>{data?.presentCount || 0} days</Text></Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.dot, { backgroundColor: '#ff4757' }]} />
            <Text style={styles.summaryLabel}>Absent: <Text style={styles.summaryVal}>{(data?.totalDays || 0) - (data?.presentCount || 0)} days</Text></Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.dot, { backgroundColor: '#0076a8' }]} />
            <Text style={styles.summaryLabel}>Total: <Text style={styles.summaryVal}>{data?.totalDays || 0} days</Text></Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: pct >= 75 ? '#2ecc71' : '#ff4757' }]}>
              {pct >= 75 ? '✅ Attendance Good' : '⚠️ Below Minimum (75%)'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Attendance Log History</Text>

      <FlatList
        data={logs.slice().reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isPresent = item.status === 'present';
          return (
            <View style={styles.logRow}>
              <View style={[styles.statusDot, { backgroundColor: isPresent ? '#2ecc71' : '#ff4757' }]} />
              <Text style={styles.logDate}>{item.date}</Text>
              <View style={[styles.logBadge, { backgroundColor: isPresent ? 'rgba(46,204,113,0.1)' : 'rgba(255,71,87,0.1)' }]}>
                <Text style={[styles.logStatus, { color: isPresent ? '#2ecc71' : '#ff4757' }]}>
                  {isPresent ? 'PRESENT' : 'ABSENT'}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No attendance records found yet.</Text>
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
  summaryCard: { flexDirection: 'row', backgroundColor: 'var(--bg-card)', margin: 20, borderRadius: 16, padding: 20, gap: 20, borderWidth: 1, borderColor: 'var(--border-color)' },
  circleWrapper: { justifyContent: 'center', alignItems: 'center' },
  bigCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-icon)' },
  bigPct: { fontSize: 20, fontWeight: '700' },
  bigLabel: { fontSize: 8, color: 'var(--text-muted)', fontWeight: '600' },
  summaryStats: { flex: 1, justifyContent: 'center', gap: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  summaryLabel: { fontSize: 12, color: 'var(--text-muted)' },
  summaryVal: { fontWeight: '700', color: 'var(--text-main)' },
  statusBadge: { marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: 'var(--text-main)', paddingHorizontal: 20, marginBottom: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'var(--border-color)' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  logDate: { flex: 1, fontSize: 13, color: 'var(--text-main)', fontWeight: '500' },
  logBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8 },
  logStatus: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: 'var(--text-muted)', fontSize: 13 },
});
