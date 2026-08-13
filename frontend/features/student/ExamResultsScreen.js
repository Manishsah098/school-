import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function ExamResultsScreen({ token, onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('/api/student/exam-results', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }));
        setResults(res.data || []);
      } catch (err) {
        console.error('Error fetching exam results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Exam & Grade Sheet</Text>
          <Text style={styles.headerSub}>Academic Performance Reports</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#042940" style={{ marginTop: 40 }} />
      ) : results.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No exam results published yet.</Text>
        </View>
      ) : (
        results.map((res, idx) => (
          <View key={res.id || idx} style={styles.resultCard}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.examName}>{res.examName}</Text>
                <Text style={styles.subjectText}>{res.subject}</Text>
              </View>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>{res.grade}</Text>
              </View>
            </View>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Score Obtained:</Text>
              <Text style={styles.scoreVal}>{res.marksObtained} / {res.totalMarks}</Text>
            </View>

            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${(res.marksObtained / res.totalMarks) * 100}%` }]} />
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
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 14, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  examName: { fontSize: 16, fontWeight: '800', color: '#042940' },
  subjectText: { fontSize: 13, color: '#64748B', marginTop: 2 },
  gradeBadge: { backgroundColor: '#10B981', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  gradeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scoreLabel: { fontSize: 13, color: '#64748B' },
  scoreVal: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  progressBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#042940', borderRadius: 3 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 30, alignItems: 'center', marginTop: 20 },
  emptyIcon: { fontSize: 32, marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
});
