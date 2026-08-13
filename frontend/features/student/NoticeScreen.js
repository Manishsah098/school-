import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function NoticeScreen({ token, onBack }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get('/api/student/notices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotices(res.data);
      } catch (err) {
        console.error('Error fetching notices', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

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
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>School Notices</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={notices.slice().reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isExpanded = expanded === item.id;
          const isAll = item.classId === 'all';
          return (
            <TouchableOpacity
              style={[styles.noticeCard, isExpanded && styles.noticeCardExpanded]}
              onPress={() => setExpanded(isExpanded ? null : item.id)}
            >
              <View style={styles.noticeTop}>
                <View style={[styles.noticeDot, { backgroundColor: isAll ? '#0076a8' : '#2ecc71' }]} />
                <View style={styles.noticeContent}>
                  <Text style={styles.noticeTitle}>{item.title}</Text>
                  <View style={styles.noticeMeta}>
                    <Text style={styles.noticeDate}>{item.createdAt}</Text>
                    <View style={[styles.audienceBadge, { backgroundColor: isAll ? 'rgba(0,118,168,0.1)' : 'rgba(46,204,113,0.1)' }]}>
                      <Text style={[styles.audienceText, { color: isAll ? '#0076a8' : '#2ecc71' }]}>
                        {isAll ? '🌍 All Classes' : `📚 ${item.classId}`}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
              </View>
              {isExpanded && (
                <View style={styles.noticeBody}>
                  <View style={styles.divider} />
                  <Text style={styles.noticeMessage}>{item.message}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No notices have been posted yet.</Text>
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
  list: { padding: 20, paddingBottom: 40 },
  noticeCard: { backgroundColor: 'var(--bg-card)', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: 'var(--border-color)' },
  noticeCardExpanded: { borderColor: 'var(--color-accent)' },
  noticeTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  noticeDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: 'var(--text-main)', marginBottom: 4 },
  noticeMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noticeDate: { fontSize: 10, color: 'var(--text-muted)' },
  audienceBadge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6 },
  audienceText: { fontSize: 9, fontWeight: '700' },
  arrow: { fontSize: 10, color: 'var(--text-muted)' },
  noticeBody: { marginTop: 10 },
  divider: { height: 1, backgroundColor: 'var(--border-color)', marginBottom: 10 },
  noticeMessage: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 20 },
  empty: { padding: 40, alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyText: { color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' },
});
