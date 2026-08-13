import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function StudentFeesScreen({ token, onBack }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await axios.get('/api/student/fees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFees(res.data);
      } catch (err) {
        console.error('Error fetching student fees', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  const totalPaid = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Fees Status</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderTopColor: '#2ecc71' }]}>
          <Text style={styles.summaryIcon}>✅</Text>
          <Text style={[styles.summaryAmt, { color: '#2ecc71' }]}>Rs. {totalPaid.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Paid</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: '#ff4757' }]}>
          <Text style={styles.summaryIcon}>⏳</Text>
          <Text style={[styles.summaryAmt, { color: '#ff4757' }]}>Rs. {totalPending.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {totalPending > 0 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            ⚠️ You have Rs. {totalPending.toLocaleString()} in unpaid fees. Please contact the school office to clear your dues.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Payment History</Text>

      <FlatList
        data={fees.slice().reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isPaid = item.status === 'paid';
          return (
            <View style={styles.feeRow}>
              <View style={[styles.feeIconCircle, { backgroundColor: isPaid ? 'rgba(46,204,113,0.1)' : 'rgba(255,71,87,0.1)' }]}>
                <Text style={{ fontSize: 18 }}>{isPaid ? '✅' : '🔴'}</Text>
              </View>
              <View style={styles.feeInfo}>
                <Text style={styles.feeDate}>Billing: {item.date}</Text>
                <Text style={styles.feeAmt}>Rs. {item.amount.toLocaleString()}</Text>
              </View>
              <View style={[styles.feeBadge, { backgroundColor: isPaid ? 'rgba(46,204,113,0.1)' : 'rgba(255,71,87,0.1)' }]}>
                <Text style={[styles.feeBadgeText, { color: isPaid ? '#2ecc71' : '#ff4757' }]}>
                  {isPaid ? 'PAID' : 'PENDING'}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No fee records found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'var(--bg-app)' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-app)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: 13, color: 'var(--color-accent)', fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', color: 'var(--text-main)' },
  summaryRow: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 0 },
  summaryCard: { flex: 1, backgroundColor: 'var(--bg-card)', borderRadius: 14, padding: 16, alignItems: 'center', borderTopWidth: 3, borderWidth: 1, borderColor: 'var(--border-color)' },
  summaryIcon: { fontSize: 24, marginBottom: 6 },
  summaryAmt: { fontSize: 16, fontWeight: '700', fontFamily: 'var(--font-accent)' },
  summaryLabel: { fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontWeight: '600' },
  alertBox: { margin: 20, marginBottom: 0, backgroundColor: 'rgba(255,71,87,0.08)', borderWidth: 1, borderColor: 'rgba(255,71,87,0.2)', borderRadius: 12, padding: 14 },
  alertText: { fontSize: 12, color: '#ff4757', fontWeight: '500', lineHeight: 18 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: 'var(--text-main)', paddingHorizontal: 20, paddingTop: 20, marginBottom: 4 },
  list: { padding: 20, paddingBottom: 40 },
  feeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'var(--border-color)' },
  feeIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  feeInfo: { flex: 1 },
  feeDate: { fontSize: 12, color: 'var(--text-muted)' },
  feeAmt: { fontSize: 15, fontWeight: '700', color: 'var(--text-main)', marginTop: 2 },
  feeBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  feeBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: 'var(--text-muted)', fontSize: 13 },
});
