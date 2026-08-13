import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

export default function LeaveRequestScreen({ token, onBack }) {
  const [requests, setRequests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/student/leave-requests', {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: [] }));
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching leave requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      alert('Please fill out all leave details');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/student/leave-requests', { startDate, endDate, reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Leave application submitted successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchRequests();
    } catch (err) {
      alert('Failed to submit leave application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Leave Applications</Text>
          <Text style={styles.headerSub}>Submit & Track Absence Requests</Text>
        </View>
      </View>

      {/* Leave Application Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>📝 Apply for Leave</Text>

        <View style={styles.dateRow}>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Start Date</Text>
            <TextInput 
              style={styles.input} 
              placeholder="YYYY-MM-DD" 
              value={startDate} 
              onChangeText={setStartDate} 
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>End Date</Text>
            <TextInput 
              style={styles.input} 
              placeholder="YYYY-MM-DD" 
              value={endDate} 
              onChangeText={setEndDate} 
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Reason for Leave</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]} 
          placeholder="State medical or family emergency reason..." 
          multiline 
          value={reason} 
          onChangeText={setReason} 
        />

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Submit Leave Application</Text>}
        </TouchableOpacity>
      </View>

      {/* Existing Applications History */}
      <Text style={styles.historyTitle}>📋 Application History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#042940" style={{ marginTop: 20 }} />
      ) : requests.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No prior leave applications found.</Text>
        </View>
      ) : (
        requests.map((req, idx) => (
          <View key={req.id || idx} style={styles.reqCard}>
            <View style={styles.reqHeader}>
              <Text style={styles.reqDates}>{req.startDate} to {req.endDate}</Text>
              <View style={[
                styles.statusBadge, 
                req.status === 'APPROVED' ? styles.bgSuccess : req.status === 'REJECTED' ? styles.bgDanger : styles.bgWarning
              ]}>
                <Text style={styles.statusText}>{req.status}</Text>
              </View>
            </View>
            <Text style={styles.reqReason}>{req.reason}</Text>
            <Text style={styles.reqAppliedAt}>Applied on: {req.appliedAt}</Text>
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
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: '800', color: '#042940', marginBottom: 14 },
  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputCol: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 13, color: '#0F172A', marginBottom: 12 },
  submitBtn: { backgroundColor: '#042940', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  historyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  reqCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reqDates: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  bgSuccess: { backgroundColor: '#D1FAE5' },
  bgDanger: { backgroundColor: '#FEE2E2' },
  bgWarning: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 11, fontWeight: '800', color: '#0F172A' },
  reqReason: { fontSize: 13, color: '#475569', marginBottom: 8 },
  reqAppliedAt: { fontSize: 11, color: '#94A3B8' },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#64748B' },
});
