import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomCard from '../../components/CustomCard';

export default function AdminDashboard({ token, onNavigate, onLogout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  const paidAmount = stats?.paidFees || 0;
  const pendingAmount = stats?.pendingFees || 0;
  const totalAmount = paidAmount + pendingAmount;
  const collectionRate = totalAmount === 0 ? 100 : Math.round((paidAmount / totalAmount) * 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Control Panel</Text>
          <Text style={styles.name}>Admin Portal</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>👨‍🎓</Text>
          <Text style={styles.statNum}>{stats?.totalStudents || 0}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>👩‍🏫</Text>
          <Text style={styles.statNum}>{stats?.totalTeachers || 0}</Text>
          <Text style={styles.statLabel}>Teachers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>✍️</Text>
          <Text style={styles.statNum}>{stats?.activeHomework || 0}</Text>
          <Text style={styles.statLabel}>Homeworks</Text>
        </View>
      </View>

      <CustomCard>
        <Text style={styles.cardTitle}>Fees Overview</Text>
        <View style={styles.feesRow}>
          <View>
            <Text style={styles.feeVal}>Rs. {paidAmount.toLocaleString()}</Text>
            <Text style={styles.feeLabel}>Total Collected</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={[styles.feeVal, {color: 'var(--color-danger)'}]}>Rs. {pendingAmount.toLocaleString()}</Text>
            <Text style={styles.feeLabel}>Total Pending</Text>
          </View>
        </View>
        
        {/* Simple Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {width: `${collectionRate}%`}]} />
          </View>
          <Text style={styles.progressText}>{collectionRate}% collection rate completed</Text>
        </View>
      </CustomCard>

      <Text style={styles.sectionTitle}>Quick Operations</Text>
      <View style={styles.operationsGrid}>
        <TouchableOpacity style={styles.opBtn} onPress={() => onNavigate('StudentManagement')}>
          <Text style={styles.opIcon}>🎒</Text>
          <Text style={styles.opLabel}>Students Manager</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.opBtn} onPress={() => onNavigate('TeacherManagement')}>
          <Text style={styles.opIcon}>📝</Text>
          <Text style={styles.opLabel}>Teachers Roster</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opBtn} onPress={() => onNavigate('FeesScreen')}>
          <Text style={styles.opIcon}>💳</Text>
          <Text style={styles.opLabel}>Fee Payments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opBtn} onPress={() => onNavigate('AdminNoticeScreen')}>
          <Text style={styles.opIcon}>🔔</Text>
          <Text style={styles.opLabel}>Broadcast Notice</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'var(--bg-app)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--bg-app)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcome: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-accent)',
  },
  logoutBtn: {
    backgroundColor: 'var(--bg-icon)',
    borderWidth: 1,
    borderColor: 'var(--border-color)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  logoutBtnText: {
    fontSize: 11,
    color: 'var(--color-danger)',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'var(--border-color)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  statLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: 16,
  },
  feesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  feeVal: {
    fontSize: 16,
    fontWeight: '700',
    color: 'var(--color-green)',
    textAlign: 'center',
  },
  feeLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'var(--border-color)',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'var(--bg-icon)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--color-accent)',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: 16,
    marginTop: 8,
  },
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  opBtn: {
    width: '47%',
    backgroundColor: 'var(--bg-card)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'var(--border-color)',
  },
  opIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  opLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--text-main)',
  },
});
