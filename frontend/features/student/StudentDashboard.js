import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput 
} from 'react-native';
import axios from 'axios';

export default function StudentDashboard({ token, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [homework, setHomework] = useState([]);
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, attRes, hwRes, noticeRes] = await Promise.all([
        axios.get('/api/student/profile', { headers }).catch(() => ({ data: null })),
        axios.get('/api/student/attendance', { headers }).catch(() => ({ data: null })),
        axios.get('/api/student/homework', { headers }).catch(() => ({ data: [] })),
        axios.get('/api/student/notices', { headers }).catch(() => ({ data: [] })),
      ]);
      setProfile(profileRes.data);
      setAttendance(attRes.data);
      setHomework(hwRes.data || []);
      setNotices(noticeRes.data || []);
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
        <ActivityIndicator size="large" color="#042940" />
      </View>
    );
  }

  const pct = attendance?.percentage ? Math.round(attendance.percentage) : 100;
  const pendingHw = homework.filter(h => new Date(h.date) >= new Date()).length;

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* ===== 1. DARK NAVY HEADER CONTAINER ===== */}
      <View style={styles.darkHeader}>
        <View style={styles.userRow}>
          <View style={styles.userLeft}>
            <TouchableOpacity style={styles.avatarBorder} onPress={() => onNavigate('DigitalIdCardScreen')}>
              <Text style={styles.avatarInitials}>
                {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'KS'}
              </Text>
            </TouchableOpacity>
            <View style={styles.userTextCol}>
              <Text style={styles.userName}>
                {profile?.name ? profile.name.toUpperCase() : 'KRISH KUMAR SAH'}
              </Text>
              <Text style={styles.userCode}>
                {profile?.studentCode || 'S.3183'} • {profile?.classId || 'Grade 10 - A'}
              </Text>
            </View>
          </View>

          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.bellBtn} onPress={() => onNavigate('NoticeScreen')}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{notices.length || 3}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top 4 Quick Nav Grid */}
        <View style={styles.quickNavRow}>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('StudentDashboard')}>
            <View style={styles.navIconBoxActive}>
              <Text style={styles.navIcon}>📊</Text>
            </View>
            <Text style={styles.navLabel}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('DigitalIdCardScreen')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>🎴</Text>
            </View>
            <Text style={styles.navLabel}>Digital ID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('ExamResultsScreen')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>🏆</Text>
            </View>
            <Text style={styles.navLabel}>Grades</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('StudentFeesScreen')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>💳</Text>
            </View>
            <Text style={styles.navLabel}>Fees</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== 2. FLOATING SEARCH BAR ===== */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search student modules..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* ===== 3. DASHBOARD MODULE SECTIONS ===== */}
      <View style={styles.bodyContent}>
        {/* Quick Stats Summary */}
        <View style={styles.summaryBarRow}>
          <TouchableOpacity style={styles.summaryPill} onPress={() => onNavigate('AttendanceView')}>
            <Text style={styles.summaryIcon}>📈</Text>
            <View>
              <Text style={styles.summaryVal}>{pct}%</Text>
              <Text style={styles.summarySub}>Attendance</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryPill} onPress={() => onNavigate('HomeworkView')}>
            <Text style={styles.summaryIcon}>📝</Text>
            <View>
              <Text style={styles.summaryVal}>{pendingHw}</Text>
              <Text style={styles.summarySub}>Due Homeworks</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Academic Modules */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <View style={styles.blueBarAccent} />
            <Text style={styles.sectionTitle}>Academic & Learning</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('HomeworkView')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📝</Text>
                </View>
                <Text style={styles.gridLabel}>Homework</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('TimetableScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📅</Text>
                </View>
                <Text style={styles.gridLabel}>Timetable</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('ExamResultsScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📊</Text>
                </View>
                <Text style={styles.gridLabel}>Exam Results</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.gridRow, { marginTop: 18 }]}>
              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('StudyMaterialsScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📚</Text>
                </View>
                <Text style={styles.gridLabel}>Study Materials</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('AttendanceView')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📈</Text>
                </View>
                <Text style={styles.gridLabel}>Attendance Log</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('StudentFeesScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>💳</Text>
                </View>
                <Text style={styles.gridLabel}>Fee Payments</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section: Services & Digital Pass */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <View style={styles.blueBarAccent} />
            <Text style={styles.sectionTitle}>Services & Applications</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('DigitalIdCardScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>🎴</Text>
                </View>
                <Text style={styles.gridLabel}>Digital ID Card</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('LeaveRequestScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📜</Text>
                </View>
                <Text style={styles.gridLabel}>Leave Requests</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('NoticeScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📢</Text>
                </View>
                <Text style={styles.gridLabel}>Notices</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },
  darkHeader: { backgroundColor: '#042940', paddingTop: 36, paddingHorizontal: 20, paddingBottom: 44 },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  userLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBorder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0076a8', borderWidth: 2, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  userTextCol: { justifyContent: 'center' },
  userName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  userCode: { fontSize: 12, fontWeight: '700', color: '#10B981', marginTop: 2 },
  topRightActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellBtn: { position: 'relative', padding: 6 },
  bellIcon: { fontSize: 24 },
  badgeCount: { position: 'absolute', top: 0, right: -2, backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1 },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  logoutText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  quickNavRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  navIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  navIconBoxActive: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 6, borderWidth: 1, borderColor: '#FFFFFF' },
  navIcon: { fontSize: 20 },
  navLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  searchWrapper: { paddingHorizontal: 20, marginTop: -22, zIndex: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 16, height: 48, elevation: 4 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
  bodyContent: { paddingHorizontal: 20, paddingTop: 16 },
  summaryBarRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryPill: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2 },
  summaryIcon: { fontSize: 24 },
  summaryVal: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  summarySub: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  sectionWrapper: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBF3FA', paddingVertical: 10, paddingHorizontal: 14, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  blueBarAccent: { width: 4, height: 16, backgroundColor: '#042940', borderRadius: 2, marginRight: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#042940' },
  gridCard: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 20, elevation: 2 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gridItem: { flex: 1, alignItems: 'center' },
  gridIconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridIcon: { fontSize: 22 },
  gridLabel: { fontSize: 11, fontWeight: '700', color: '#334155', textAlign: 'center' },
});
