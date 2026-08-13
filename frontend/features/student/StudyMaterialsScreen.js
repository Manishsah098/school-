import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';

export default function StudyMaterialsScreen({ token, onBack }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get('/api/student/study-materials', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }));
        setMaterials(res.data || []);
      } catch (err) {
        console.error('Error fetching study materials', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Study Materials</Text>
          <Text style={styles.headerSub}>Notes, Handouts & Lecture PDFs</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#042940" style={{ marginTop: 40 }} />
      ) : materials.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>No study materials uploaded for your class yet.</Text>
        </View>
      ) : (
        materials.map((mat, idx) => (
          <View key={mat.id || idx} style={styles.materialCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.subjectBadge}>{mat.subject}</Text>
              <Text style={styles.dateText}>{mat.createdAt}</Text>
            </View>

            <Text style={styles.titleText}>{mat.title}</Text>
            <Text style={styles.descText}>{mat.description}</Text>
            <Text style={styles.uploaderText}>Uploaded by: {mat.uploadedBy}</Text>

            <TouchableOpacity 
              style={styles.downloadBtn} 
              onPress={() => Linking.openURL(mat.fileUrl || '#').catch(() => {})}
            >
              <Text style={styles.downloadText}>📥 Open PDF / Download</Text>
            </TouchableOpacity>
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
  materialCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 14, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subjectBadge: { backgroundColor: '#EBF3FA', color: '#042940', fontSize: 12, fontWeight: '800', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  dateText: { fontSize: 11, color: '#94A3B8' },
  titleText: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  descText: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 10 },
  uploaderText: { fontSize: 11, color: '#64748B', fontStyle: 'italic', marginBottom: 12 },
  downloadBtn: { backgroundColor: '#042940', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  downloadText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 30, alignItems: 'center', marginTop: 20 },
  emptyIcon: { fontSize: 32, marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
});
