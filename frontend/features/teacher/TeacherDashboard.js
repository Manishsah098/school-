import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomCard from '../../components/CustomCard';

export default function TeacherDashboard({ token, onNavigate, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [assignedClass, setAssignedClass] = useState('N/A');
  const [homeworkCount, setHomeworkCount] = useState(0);

  const fetchTeacherStats = async () => {
    try {
      const classRes = await axios.get('/api/teacher/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (classRes.data && classRes.data.length > 0) {
        setAssignedClass(classRes.data[0]);
      }

      const homeworkRes = await axios.get('/api/teacher/homework', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHomeworkCount(homeworkRes.data?.length || 0);
    } catch (err) {
      console.error('Error fetching teacher stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome Teacher</Text>
          <Text style={styles.name}>David Kumar</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <CustomCard>
        <Text style={styles.cardTitle}>Assigned Classroom</Text>
        <Text style={styles.classText}>{assignedClass}</Text>
        <Text style={styles.classSub}>All students registered under this class are synced automatically.</Text>
      </CustomCard>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🎒</Text>
          <Text style={styles.statNum}>{assignedClass !== 'N/A' ? '25' : '0'}</Text>
          <Text style={styles.statLabel}>Today Class Roll</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>📝</Text>
          <Text style={styles.statNum}>{homeworkCount}</Text>
          <Text style={styles.statLabel}>Homeworks Posted</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Teaching Operations</Text>
      <View style={styles.operationsGrid}>
        <TouchableOpacity style={styles.opBtn} onPress={() => onNavigate('AttendanceScreen')}>
          <Text style={styles.opIcon}>📊</Text>
          <Text style={styles.opLabel}>Mark Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opBtn} onPress={() => onNavigate('HomeworkUpload')}>
          <Text style={styles.opIcon}>📤</Text>
          <Text style={styles.opLabel}>Upload Homework</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opBtn} onPress={() => onNavigate('TeacherNoticeScreen')}>
          <Text style={styles.opIcon}>📢</Text>
          <Text style={styles.opLabel}>Send Notice</Text>
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
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  classText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'var(--color-accent)',
    fontFamily: 'var(--font-accent)',
  },
  classSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'var(--bg-card)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'var(--border-color)',
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: 16,
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
