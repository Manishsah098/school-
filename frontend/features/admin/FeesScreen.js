import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import ListTileWidget from '../../components/ListTileWidget';

export default function FeesScreen({ token, onBack }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'pending'

  const fetchFees = async () => {
    try {
      const response = await axios.get('/api/admin/fees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFees(response.data);
    } catch (err) {
      console.error('Error fetching fees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleMarkPaid = async (id) => {
    try {
      await axios.post(`/api/admin/fees/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFees();
    } catch (err) {
      console.error('Mark paid failed', err);
    }
  };

  const filteredFees = fees.filter(f => {
    if (filter === 'paid') return f.status === 'paid';
    if (filter === 'pending') return f.status === 'pending';
    return true;
  });

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
        <Text style={styles.title}>Fees Roster</Text>
        <View style={{width: 50}} /> {/* Spacer to center title */}
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity style={[styles.filterTab, filter === 'all' && styles.filterTabActive]} onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterTab, filter === 'paid' && styles.filterTabActive]} onPress={() => setFilter('paid')}>
          <Text style={[styles.filterText, filter === 'paid' && styles.filterTextActive]}>Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterTab, filter === 'pending' && styles.filterTabActive]} onPress={() => setFilter('pending')}>
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>Pending</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isPaid = item.status === 'paid';
          return (
            <ListTileWidget
              title={`Billing Date: ${item.date}`}
              subtitle={`Amount: Rs. ${item.amount.toLocaleString()}`}
              leading={<Text style={{fontSize: 20}}>{isPaid ? '🟢' : '🔴'}</Text>}
              trailing={
                isPaid ? (
                  <Text style={styles.paidBadge}>PAID</Text>
                ) : (
                  <TouchableOpacity style={styles.payBtn} onPress={() => handleMarkPaid(item.id)}>
                    <Text style={styles.payBtnText}>Mark Paid</Text>
                  </TouchableOpacity>
                )
              }
            />
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
  filterBar: {
    flexDirection: 'row',
    backgroundColor: 'var(--bg-card)',
    padding: 4,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'var(--border-color)',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: 'var(--color-accent)',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  payBtn: {
    backgroundColor: 'var(--color-accent)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  payBtnText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  paidBadge: {
    fontSize: 11,
    color: 'var(--color-green)',
    fontWeight: '700',
    letterSpacing: 0.5,
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
