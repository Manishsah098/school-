import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';

export default function DigitalIdCardScreen({ token, onBack }) {
  const [idCard, setIdCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdCard = async () => {
      try {
        const res = await axios.get('/api/student/id-card', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: null }));
        setIdCard(res.data);
      } catch (err) {
        console.error('Error fetching digital ID card', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdCard();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Digital Student ID</Text>
          <Text style={styles.headerSub}>Official Identity Pass</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#042940" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.idCardContainer}>
          {/* Card Top Branding Header */}
          <View style={styles.idCardHeader}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
            <View style={styles.headerTextCol}>
              <Text style={styles.schoolTitle}>{idCard?.schoolName || 'SmartSchool International Portal'}</Text>
              <Text style={styles.passType}>STUDENT IDENTITY PASS</Text>
            </View>
          </View>

          {/* Student Photo & Profile Row */}
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{idCard?.studentName ? idCard.studentName[0] : 'S'}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.studentName}>{idCard?.studentName || 'Krish Kumar Sah'}</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.studentCodeBadge}>{idCard?.studentCode || 'S.3183'}</Text>
                <Text style={styles.classBadge}>{idCard?.classId || 'Grade 10 - A'}</Text>
              </View>
            </View>
          </View>

          {/* Details Table Grid */}
          <View style={styles.gridDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Roll Number</Text>
              <Text style={styles.detailVal}>{idCard?.rollNumber || '101'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Valid Thru</Text>
              <Text style={styles.detailVal}>{idCard?.validUntil || '2026-12-31'}</Text>
            </View>

            <View style={[styles.detailItem, { marginTop: 12 }]}>
              <Text style={styles.detailLabel}>Emergency Contact</Text>
              <Text style={styles.detailVal}>{idCard?.emergencyContact || '+1 (555) 019-2831'}</Text>
            </View>
          </View>

          {/* Barcode Graphic Footer */}
          <View style={styles.barcodeWrapper}>
            <Text style={styles.barcodeLines}>||| | |||| | |||||| ||| |||| | |||</Text>
            <Text style={styles.barcodeNum}>{idCard?.studentCode || 'S.3183'}-2026-PASS</Text>
          </View>
        </View>
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
  idCardContainer: { backgroundColor: '#042940', borderRadius: 24, padding: 24, elevation: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  idCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)', paddingBottom: 16, marginBottom: 20 },
  logoImage: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#FFFFFF' },
  headerTextCol: { flex: 1 },
  schoolTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  passType: { fontSize: 10, color: '#10B981', fontWeight: '800', tracking: 1, marginTop: 2 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0076a8', borderWidth: 2, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  detailsCol: { flex: 1 },
  studentName: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  studentCodeBadge: { backgroundColor: '#10B981', color: '#FFFFFF', fontSize: 11, fontWeight: '800', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  classBadge: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: 11, fontWeight: '700', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  gridDetails: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, marginBottom: 20 },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },
  detailVal: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  barcodeWrapper: { alignItems: 'center', paddingTop: 8 },
  barcodeLines: { fontSize: 20, color: '#FFFFFF', letterSpacing: 4, opacity: 0.8 },
  barcodeNum: { fontSize: 11, color: '#94A3B8', marginTop: 4, letterSpacing: 2 },
});
