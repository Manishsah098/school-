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

export default function AdminDashboard({ token, onNavigate, onLogout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: null }));
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#042940" />
      </View>
    );
  }

  const paidAmount = stats?.feesPaid || 0;
  const pendingAmount = stats?.feesPending || 0;

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* ===== 1. DARK NAVY HEADER CONTAINER ===== */}
      <View style={styles.darkHeader}>
        {/* User Info Bar */}
        <View style={styles.userRow}>
          <View style={styles.userLeft}>
            <View style={styles.avatarBorder}>
              <Text style={styles.avatarInitials}>AD</Text>
            </View>
            <View style={styles.userTextCol}>
              <Text style={styles.userName}>PRINCIPAL STAFF</Text>
              <Text style={styles.userCode}>Administrator • ADM.001</Text>
            </View>
          </View>

          {/* Right Action Icons */}
          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.bellBtn} onPress={() => onNavigate('AdminNoticeScreen')}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>99+</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top 4 Quick Nav Grid */}
        <View style={styles.quickNavRow}>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('AdminDashboard')}>
            <View style={styles.navIconBoxActive}>
              <Text style={styles.navIcon}>📊</Text>
            </View>
            <Text style={styles.navLabel}>Overview</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('StudentManagement')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>👨‍🎓</Text>
            </View>
            <Text style={styles.navLabel}>Students</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('TeacherManagement')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>👩‍🏫</Text>
            </View>
            <Text style={styles.navLabel}>Teachers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('FeesScreen')}>
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
            placeholder="Search modules..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* ===== 3. DASHBOARD MODULE SECTIONS ===== */}
      <View style={styles.bodyContent}>
        {/* Admin Overview Summary Bar */}
        <View style={styles.summaryBarRow}>
          <TouchableOpacity style={styles.summaryPill} onPress={() => onNavigate('StudentManagement')}>
            <Text style={styles.summaryIcon}>🎒</Text>
            <View>
              <Text style={styles.summaryVal}>{stats?.totalStudents || 10}</Text>
              <Text style={styles.summarySub}>Total Students</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryPill} onPress={() => onNavigate('TeacherManagement')}>
            <Text style={styles.summaryIcon}>📝</Text>
            <View>
              <Text style={styles.summaryVal}>{stats?.totalTeachers || 1}</Text>
              <Text style={styles.summarySub}>Total Teachers</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: School Administration */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <View style={styles.blueBarAccent} />
            <Text style={styles.sectionTitle}>School Administration</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('StudentManagement')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>👨‍🎓</Text>
                </View>
                <Text style={styles.gridLabel}>Student Roster</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('TeacherManagement')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>👩‍🏫</Text>
                </View>
                <Text style={styles.gridLabel}>Teacher Roster</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('FeesScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>💳</Text>
                </View>
                <Text style={styles.gridLabel}>Fee Collection</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.gridRow, { marginTop: 18 }]}>
              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('AdminNoticeScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📢</Text>
                </View>
                <Text style={styles.gridLabel}>Notice Board</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('AdminNoticeScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📇</Text>
                </View>
                <Text style={styles.gridLabel}>Staff Directory</Text>
              </TouchableOpacity>

              <View style={styles.gridItem} />
            </View>
          </View>
        </View>

        {/* Section: Services & Facilities */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <View style={styles.blueBarAccent} />
            <Text style={styles.sectionTitle}>Services & Facilities</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('StudentManagement')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>🎓</Text>
                </View>
                <Text style={styles.gridLabel}>Academics Program</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('FeesScreen')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>🏢</Text>
                </View>
                <Text style={styles.gridLabel}>Available Facilities</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('StudentManagement')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>👤✓</Text>
                </View>
                <Text style={styles.gridLabel}>Admission Procedure</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section: Setup */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <View style={styles.blueBarAccent} />
            <Text style={styles.sectionTitle}>Setup</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('AdminDashboard')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>⚙️</Text>
                </View>
                <Text style={styles.gridLabel}>Setting</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('AdminDashboard')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>📅</Text>
                </View>
                <Text style={styles.gridLabel}>Date Format</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('AdminDashboard')}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>🔄🔒</Text>
                </View>
                <Text style={styles.gridLabel}>Change Password</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },

  /* Dark Header */
  darkHeader: {
    backgroundColor: '#042940',
    paddingTop: 36,
    paddingHorizontal: 20,
    paddingBottom: 44,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0076a8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  userTextCol: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  userCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    position: 'relative',
    padding: 6,
  },
  bellIcon: {
    fontSize: 24,
  },
  badgeCount: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Quick Nav Row */
  quickNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  navIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  navIconBoxActive: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  /* Floating Search Bar */
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: -22,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },

  /* Dashboard Body Content */
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  summaryBarRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  summaryIcon: {
    fontSize: 24,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  summarySub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  /* Section Wrapper */
  sectionWrapper: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF3FA',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  blueBarAccent: {
    width: 4,
    height: 16,
    backgroundColor: '#042940',
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#042940',
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridIcon: {
    fontSize: 22,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
});
