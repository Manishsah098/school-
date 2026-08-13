import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function AttendanceScreen({ token, onBack }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({}); // studentId: 'present'/'absent'
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/teacher/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      
      // Initialize all as present
      const initial = {};
      response.data.forEach(s => {
        initial[s.id] = 'present';
      });
      setAttendance(initial);
    } catch (err) {
      console.error('Error fetching teacher students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSuccess('');
    
    const payload = Object.keys(attendance).map(studentId => ({
      studentId,
      date: today,
      status: attendance[studentId]
    }));

    try {
      await axios.post('/api/teacher/attendance', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Attendance roster recorded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Attendance submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>&lt; Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mark Attendance</Text>
        <View style={{width: 50}} />
      </View>

      <View style={styles.dateBar}>
        <Text style={styles.dateLabel}>Active Date: </Text>
        <Text style={styles.dateVal}>{today}</Text>
      </View>

      {success ? <Text style={styles.success}>{success}</Text> : null}

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isPresent = attendance[item.id] === 'present';
          return (
            <View style={styles.row}>
              <View>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentCode}>{item.studentCode}</Text>
              </View>
              
              <View style={styles.toggleRow}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, isPresent ? styles.btnPresent : styles.btnInactive]} 
                  onPress={() => toggleAttendance(item.id)}
                >
                  <Text style={[styles.toggleBtnText, isPresent && {color: '#fff'}]}>P</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleBtn, !isPresent ? styles.btnAbsent : styles.btnInactive]} 
                  onPress={() => toggleAttendance(item.id)}
                >
                  <Text style={[styles.toggleBtnText, !isPresent && {color: '#fff'}]}>A</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No students in this class.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submitBtn, submitting && {opacity:0.7}]} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.submitText}>Submit Today's Attendance</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-color)',
    backgroundColor: 'var(--bg-card)',
  },
  backBtn: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 13,
    color: 'var(--color-accent)',
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  dateBar: {
    flexDirection: 'row',
    backgroundColor: 'var(--bg-card)',
    padding: 12,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--border-color)',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  dateVal: {
    fontSize: 13,
    fontWeight: '700',
    color: 'var(--color-accent)',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-color)',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  studentCode: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnPresent: {
    backgroundColor: 'var(--color-green)',
    borderColor: 'var(--color-green)',
  },
  btnAbsent: {
    backgroundColor: 'var(--color-danger)',
    borderColor: 'var(--color-danger)',
  },
  btnInactive: {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-muted)',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--bg-card)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-color)',
  },
  submitBtn: {
    backgroundColor: 'var(--color-accent)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  success: {
    color: 'var(--color-green)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: 13,
  },
});
