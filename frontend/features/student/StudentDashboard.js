import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomCard from '../../components/CustomCard';

export default function StudentDashboard({ token, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [homework, setHomework] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, attRes, hwRes, noticeRes] = await Promise.all([
        axios.get('/api/student/profile', { headers }),
        axios.get('/api/student/attendance', { headers }),
        axios.get('/api/student/homework', { headers }),
        axios.get('/api/student/notices', { headers }),
      ]);
      setProfile(profileRes.data);
      setAttendance(attRes.data);
      setHomework(hwRes.data);
      setNotices(noticeRes.data);
    } catch (err) {
      console.error('Error fetching student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  const pct = attendance?.percentage ? Math.round(attendance.percentage) : 100;
  const pendingHw = homework.filter(h => new Date(h.date) >= new Date()).length;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{profile?.name?.[0] || 'S'}</Text>
          </View>
          <View>
            <Text style={styles.welcome}>Student Dashboard</Text>
            <Text style={styles.name}>{profile?.name || 'Student'}</Text>
            <Text style={styles.code}>{profile?.studentCode || ''}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance Card */}
      <CustomCard>
        <Text style={styles.cardTitle}>📊 Attendance Summary</Text>
        <View style={styles.attRow}>
          <View style={styles.attCircle}>
            <Text style={[styles.attPct, { color: pct >= 75 ? '#2ecc71' : '#ff4757' }]}>{pct}%</Text>
            <Text style={styles.attLabel}>Present</Text>
          </View>
          <View style={styles.attStats}>
            <View style={styles.attStatRow}>
              <Text style={styles.attStatLabel}>Present Days:</Text>
              <Text style={[styles.attStatVal, { color: '#2ecc71' }]}>{attendance?.presentCount || 0}</Text>
            </View>
            <View style={styles.attStatRow}>
              <Text style={styles.attStatLabel}>Total Days:</Text>
              <Text style={styles.attStatVal}>{attendance?.totalDays || 0}</Text>
            </View>
            <View style={styles.attStatRow}>
              <Text style={styles.attStatLabel}>Status:</Text>
              <Text style={[styles.attStatVal, { color: pct >= 75 ? '#2ecc71' : '#ff4757' }]}>
                {pct >= 75 ? '✅ Good' : '⚠️ Low'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: pct >= 75 ? '#2ecc71' : '#ff4757' }]} />
        </View>
        <TouchableOpacity onPress={() => onNavigate('AttendanceView')}>
          <Text style={styles.viewAll}>View Full Attendance →</Text>
        </TouchableOpacity>
      </CustomCard>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('HomeworkView')}>
          <Text style={styles.statIcon}>📝</Text>
          <Text style={styles.statNum}>{pendingHw}</Text>
          <Text style={styles.statLabel}>Due Homeworks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('NoticeScreen')}>
          <Text style={styles.statIcon}>🔔</Text>
          <Text style={styles.statNum}>{notices.length}</Text>
          <Text style={styles.statLabel}>Notices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('StudentFeesScreen')}>
          <Text style={styles.statIcon}>💳</Text>
          <Text style={styles.statNum}>View</Text>
          <Text style={styles.statLabel}>Fees Status</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Homework Preview */}
      <Text style={styles.sectionTitle}>📋 Pending Homework</Text>
      {homework.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>🎉 No pending homework right now!</Text>
        </View>
      ) : (
        homework.slice(0, 3).map((hw) => (
          <View key={hw.id} style={styles.hwCard}>
            <View style={styles.hwLeft}>
              <Text style={styles.hwTitle}>{hw.title}</Text>
              <Text style={styles.hwDue}>Due: {hw.date}</Text>
            </View>
            <Text style={styles.hwBadge}>{hw.classId}</Text>
          </View>
        ))
      )}
      {homework.length > 3 && (
        <TouchableOpacity onPress={() => onNavigate('HomeworkView')}>
          <Text style={styles.viewAll}>View All {homework.length} Homeworks →</Text>
        </TouchableOpacity>
      )}

      {/* Recent Notices */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>📢 Recent Notices</Text>
      {notices.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No notices at the moment.</Text>
        </View>
      ) : (
        notices.slice(0, 2).map((n) => (
          <View key={n.id} style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{n.title}</Text>
            <Text style={styles.noticeSub} numberOfLines={2}>{n.message}</Text>
            <Text style={styles.noticeDate}>{n.createdAt}</Text>
          </View>
        ))
      )}
      {notices.length > 2 && (
        <TouchableOpacity onPress={() => onNavigate('NoticeScreen')}>
          <Text style={[styles.viewAll, { marginBottom: 40 }]}>View All Notices →</Text>
        </TouchableOpacity>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'var(--bg-app)' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-app)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0076a8', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  welcome: { fontSize: 11, color: 'var(--text-muted)', fontWeight: '500' },
  name: { fontSize: 16, fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-accent)' },
  code: { fontSize: 11, color: '#2ecc71', fontWeight: '600' },
  logoutBtn: { backgroundColor: 'var(--bg-icon)', borderWidth: 1, borderColor: 'var(--border-color)', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  logoutText: { fontSize: 11, color: 'var(--color-danger)', fontWeight: '600' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: 'var(--text-main)', marginBottom: 16 },
  attRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 },
  attCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'var(--bg-icon)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'var(--border-color)' },
  attPct: { fontSize: 20, fontWeight: '700' },
  attLabel: { fontSize: 9, color: 'var(--text-muted)', fontWeight: '600' },
  attStats: { flex: 1, gap: 6 },
  attStatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  attStatLabel: { fontSize: 12, color: 'var(--text-muted)' },
  attStatVal: { fontSize: 12, fontWeight: '700', color: 'var(--text-main)' },
  progressBg: { height: 6, backgroundColor: 'var(--bg-icon)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  viewAll: { fontSize: 12, color: 'var(--color-accent)', fontWeight: '600', textAlign: 'center', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: 'var(--bg-card)', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'var(--border-color)' },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statNum: { fontSize: 16, fontWeight: '700', color: 'var(--text-main)' },
  statLabel: { fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', marginTop: 2, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: 'var(--text-main)', marginBottom: 12 },
  hwCard: { backgroundColor: 'var(--bg-card)', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'var(--border-color)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hwLeft: { flex: 1 },
  hwTitle: { fontSize: 13, fontWeight: '600', color: 'var(--text-main)' },
  hwDue: { fontSize: 11, color: 'var(--text-muted)', marginTop: 2 },
  hwBadge: { fontSize: 10, backgroundColor: 'rgba(0,118,168,0.1)', color: 'var(--color-accent)', paddingVertical: 3, paddingHorizontal: 6, borderRadius: 8, fontWeight: '600' },
  noticeCard: { backgroundColor: 'var(--bg-card)', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'var(--border-color)', borderLeftWidth: 3, borderLeftColor: 'var(--color-accent)' },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: 'var(--text-main)', marginBottom: 4 },
  noticeSub: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 16 },
  noticeDate: { fontSize: 10, color: 'var(--text-muted)', marginTop: 6, opacity: 0.7 },
  emptyCard: { backgroundColor: 'var(--bg-card)', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'var(--border-color)' },
  emptyText: { fontSize: 13, color: 'var(--text-muted)' },
});
