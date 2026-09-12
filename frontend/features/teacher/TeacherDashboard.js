import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput,
  RefreshControl,
  Animated,
  Easing,
  Alert
} from 'react-native';
import axios from 'axios';
import { useLanguage } from '../../src/context/LanguageContext';
import LanguageButton from '../../components/LanguageButton';

export default function TeacherDashboard({ token, onNavigate, onLogout }) {
  const { t, openLanguageModal } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignedClass, setAssignedClass] = useState('10 - A');
  const [homeworkList, setHomeworkList] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Real-time states
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date());
  const [serverLatency, setServerLatency] = useState(18);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, [pulseAnim]);

  const fetchTeacherStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const startTime = Date.now();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [classRes, homeworkRes, noticeRes] = await Promise.all([
        axios.get('/api/teacher/classes', { headers }).catch(() => ({ data: ['10 - A'] })),
        axios.get('/api/teacher/homework', { headers }).catch(() => ({ data: [] })),
        axios.get('/api/teacher/notices', { headers }).catch(() => ({ data: [] })),
      ]);

      setServerLatency(Math.max(10, Date.now() - startTime));
      if (classRes.data && classRes.data.length > 0) {
        setAssignedClass(classRes.data[0]);
      }
      setHomeworkList(homeworkRes.data || []);
      setRecentNotices(noticeRes.data || []);
      setLastSyncedTime(new Date());
    } catch (err) {
      console.error('Error fetching teacher stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTeacherStats();
    const interval = setInterval(() => fetchTeacherStats(true), 15000);
    return () => clearInterval(interval);
  }, [fetchTeacherStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeacherStats(false);
  };

  const formatClock = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const modulesList = [
    {
      id: 'attendance',
      category: 'academic',
      title: t('attendance'),
      desc: 'Mark roll call & period logs',
      icon: '👤',
      screen: 'AttendanceScreen',
      badge: 'Grade ' + assignedClass,
      accent: '#3B82F6',
    },
    {
      id: 'homework',
      category: 'academic',
      title: t('homework'),
      desc: 'Publish tasks & assignments',
      icon: '📤',
      screen: 'HomeworkUpload',
      badge: `${homeworkList.length} Tasks`,
      accent: '#10B981',
    },
    {
      id: 'notices',
      category: 'academic',
      title: t('noticeBoard'),
      desc: 'Post classroom broadcasts',
      icon: '📢',
      screen: 'TeacherNoticeScreen',
      badge: `${recentNotices.length} Live`,
      accent: '#EF4444',
    },
    {
      id: 'curriculum',
      category: 'academic',
      title: t('academicsProgram'),
      desc: 'Syllabus & lesson planner',
      icon: '🎓',
      screen: 'HomeworkUpload',
      badge: 'Physics Dept',
      accent: '#8B5CF6',
    },
    {
      id: 'facilities',
      category: 'campus',
      title: t('availableFacilities'),
      desc: 'Labs, Smart Boards & Audio/Visual',
      icon: '🏢',
      action: () => Alert.alert('Facilities', 'Lab 3 & Projector Hall Reserved for Grade 10-A'),
      badge: 'Active',
      accent: '#0EA5E9',
    },
    {
      id: 'staff_directory',
      category: 'campus',
      title: t('employeeDirectory'),
      desc: 'Faculty contact roster & HODs',
      icon: '📇',
      screen: 'TeacherNoticeScreen',
      badge: 'Directory',
      accent: '#6366F1',
    },
    {
      id: 'settings',
      category: 'setup',
      title: t('settings'),
      desc: 'Class configuration & notifications',
      icon: '⚙️',
      action: () => Alert.alert('Teacher Settings', 'Classroom preferences & notification frequency configured.'),
      badge: 'Config',
      accent: '#64748B',
    },
    {
      id: 'language',
      category: 'setup',
      title: t('language'),
      desc: 'Change portal language',
      icon: '🌐',
      action: openLanguageModal,
      badge: 'Multi-lingual',
      accent: '#0284C7',
    },
  ];

  const filteredModules = modulesList.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0076a8" />
        <Text style={styles.loadingText}>Loading Teacher Portal...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      bounces={true}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#FFFFFF"
          colors={['#0076a8', '#042940']}
        />
      }
    >
      {/* ===== 1. DARK NAVY COMMAND HEADER ===== */}
      <View style={styles.darkHeader}>
        {/* Real-time Ticker */}
        <View style={styles.liveTickerRow}>
          <View style={styles.liveIndicatorPill}>
            <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
            <Text style={styles.liveText}>TEACHER LIVE STREAM</Text>
          </View>

          <View style={styles.clockPill}>
            <Text style={styles.clockIcon}>🕒</Text>
            <Text style={styles.clockText}>{formatClock(currentTime)}</Text>
          </View>

          <TouchableOpacity style={styles.syncStatusPill} onPress={() => fetchTeacherStats(false)}>
            <Text style={styles.syncStatusText}>⚡ {serverLatency}ms</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Bar */}
        <View style={styles.userRow}>
          <View style={styles.userLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Text style={styles.avatarInitials}>DK</Text>
              </View>
              <View style={styles.avatarStatusBadge} />
            </View>
            <View style={styles.userTextCol}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.userName}>DAVID KUMAR</Text>
              <View style={styles.roleTag}>
                <Text style={styles.roleTagText}>FACULTY • PHYSICS • T.8821</Text>
              </View>
            </View>
          </View>

          {/* Top Right Action Icons */}
          <View style={styles.topRightActions}>
            <LanguageButton />

            <TouchableOpacity 
              style={styles.bellBtn} 
              onPress={() => onNavigate('TeacherNoticeScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{recentNotices.length || '3'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutBtn} 
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>{t('exit')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top 4 Quick Nav Grid */}
        <View style={styles.quickNavRow}>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('TeacherDashboard')}>
            <View style={styles.navIconBoxActive}>
              <Text style={styles.navIcon}>📊</Text>
            </View>
            <Text style={styles.navLabelActive}>{t('dashboard')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('AttendanceScreen')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>👤</Text>
            </View>
            <Text style={styles.navLabel}>{t('attendance')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('HomeworkUpload')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>📤</Text>
            </View>
            <Text style={styles.navLabel}>{t('homework')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('TeacherNoticeScreen')}>
            <View style={styles.navIconBox}>
              <Text style={styles.navIcon}>📢</Text>
            </View>
            <Text style={styles.navLabel}>{t('notices')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== 2. FLOATING SEARCH BAR & CATEGORIES ===== */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchModules')}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryPillsContainer}
        >
          {[
            { key: 'all', label: 'All Modules' },
            { key: 'academic', label: 'Classroom & Academic' },
            { key: 'campus', label: 'Campus & Facilities' },
            { key: 'setup', label: 'System Setup' },
          ].map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryChip,
                activeCategory === cat.key && styles.categoryChipActive
              ]}
              onPress={() => setActiveCategory(cat.key)}
            >
              <Text style={[
                styles.categoryChipText,
                activeCategory === cat.key && styles.categoryChipTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== 3. DASHBOARD MAIN CONTENT ===== */}
      <View style={styles.bodyContent}>
        {/* Quick Classroom Status Cards */}
        <View style={styles.kpiGrid}>
          <TouchableOpacity 
            style={[styles.kpiCard, { borderLeftColor: '#3B82F6' }]}
            onPress={() => onNavigate('AttendanceScreen')}
            activeOpacity={0.85}
          >
            <View style={styles.kpiTopRow}>
              <View style={[styles.kpiIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.kpiIcon}>🏫</Text>
              </View>
              <View style={styles.kpiTrendBadge}>
                <Text style={styles.kpiTrendText}>Class Lead</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>Grade {assignedClass}</Text>
            <Text style={styles.kpiLabel}>{t('assignedClassroom')}</Text>
            <View style={styles.kpiFooter}>
              <Text style={styles.kpiSubText}>● 38 Students Enrolled</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.kpiCard, { borderLeftColor: '#10B981' }]}
            onPress={() => onNavigate('HomeworkUpload')}
            activeOpacity={0.85}
          >
            <View style={styles.kpiTopRow}>
              <View style={[styles.kpiIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.kpiIcon}>📚</Text>
              </View>
              <View style={[styles.kpiTrendBadge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.kpiTrendText, { color: '#059669' }]}>Active</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>{homeworkList.length} Tasks</Text>
            <Text style={styles.kpiLabel}>{t('postedAssignments')}</Text>
            <View style={styles.kpiFooter}>
              <Text style={styles.kpiSubText}>● Submissions Open</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Action Shortcuts Banner */}
        <View style={styles.quickActionBanner}>
          <Text style={styles.quickActionTitle}>⚡ Fast Classroom Actions</Text>
          <View style={styles.quickActionRow}>
            <TouchableOpacity 
              style={styles.actionPill} 
              onPress={() => onNavigate('AttendanceScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionPillIcon}>📝</Text>
              <Text style={styles.actionPillText}>Take Roll Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionPill} 
              onPress={() => onNavigate('HomeworkUpload')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionPillIcon}>📤</Text>
              <Text style={styles.actionPillText}>Post Assignment</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionPill} 
              onPress={() => onNavigate('TeacherNoticeScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionPillIcon}>📢</Text>
              <Text style={styles.actionPillText}>Broadcast Notice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modules Grid */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.blueBarAccent} />
              <Text style={styles.sectionTitle}>Teacher Services & Portals</Text>
            </View>
            <Text style={styles.moduleCountBadge}>{filteredModules.length} Modules</Text>
          </View>

          <View style={styles.moduleGrid}>
            {filteredModules.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.moduleCard}
                onPress={() => item.screen ? onNavigate(item.screen) : item.action?.()}
                activeOpacity={0.8}
              >
                <View style={styles.moduleTopRow}>
                  <View style={[styles.moduleIconBox, { backgroundColor: `${item.accent}15` }]}>
                    <Text style={styles.moduleIcon}>{item.icon}</Text>
                  </View>
                  <View style={[styles.moduleBadge, { backgroundColor: `${item.accent}15` }]}>
                    <Text style={[styles.moduleBadgeText, { color: item.accent }]}>
                      {item.badge}
                    </Text>
                  </View>
                </View>

                <Text style={styles.moduleTitle}>{item.title}</Text>
                <Text style={styles.moduleDesc} numberOfLines={2}>{item.desc}</Text>
                
                <View style={styles.moduleCardFooter}>
                  <Text style={[styles.moduleActionText, { color: item.accent }]}>Access</Text>
                  <Text style={[styles.moduleActionArrow, { color: item.accent }]}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Telemetry Footer */}
        <View style={styles.telemetryCard}>
          <View style={styles.telemetryRow}>
            <View style={styles.telemetryLeft}>
              <View style={styles.greenPulseDot} />
              <Text style={styles.telemetryStatus}>Teacher Session Active • Node 10-A</Text>
            </View>
            <Text style={styles.telemetryUptime}>Latency: {serverLatency}ms</Text>
          </View>
          <Text style={styles.telemetryDetails}>
            Last updated at {formatClock(lastSyncedTime)} • Auto-sync active
          </Text>
        </View>
      </View>
      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#042940' },
  loadingText: { color: '#94A3B8', marginTop: 14, fontSize: 13, fontWeight: '600' },
  darkHeader: { backgroundColor: '#042940', paddingTop: 18, paddingHorizontal: 20, paddingBottom: 48, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  liveTickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)' },
  liveIndicatorPill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  liveText: { color: '#10B981', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  clockPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clockIcon: { fontSize: 11 },
  clockText: { color: '#F8FAFC', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  syncStatusPill: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  syncStatusText: { color: '#34D399', fontSize: 10, fontWeight: '700' },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  userLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarContainer: { position: 'relative' },
  avatarBorder: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0076a8', borderWidth: 2.5, borderColor: '#38BDF8', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  avatarInitials: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
  avatarStatusBadge: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#042940' },
  userTextCol: { justifyContent: 'center' },
  greetingText: { fontSize: 11, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  userName: { fontSize: 17, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.3, marginVertical: 1 },
  roleTag: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginTop: 2 },
  roleTagText: { fontSize: 10, fontWeight: '800', color: '#34D399', letterSpacing: 0.5 },
  topRightActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: { position: 'relative', backgroundColor: 'rgba(255,255,255,0.1)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  bellIcon: { fontSize: 18 },
  badgeCount: { position: 'absolute', top: -2, right: -2, backgroundColor: '#EF4444', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: '#042940' },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  logoutBtn: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.4)', paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20 },
  logoutText: { color: '#FCA5A5', fontSize: 11, fontWeight: '800' },
  quickNavRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  navItem: { alignItems: 'center', flex: 1 },
  navIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  navIconBoxActive: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#0284C7', justifyContent: 'center', alignItems: 'center', marginBottom: 6, elevation: 4 },
  navIcon: { fontSize: 18 },
  navLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  navLabelActive: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  searchWrapper: { paddingHorizontal: 20, marginTop: -26, zIndex: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, height: 52, elevation: 6, shadowColor: '#0F172A', shadowOpacity: 0.08, shadowRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A', fontWeight: '600' },
  clearSearchBtn: { padding: 4 },
  clearSearchText: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
  categoryPillsContainer: { paddingVertical: 12, gap: 8 },
  categoryChip: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  categoryChipActive: { backgroundColor: '#042940', borderColor: '#042940' },
  categoryChipText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  categoryChipTextActive: { color: '#FFFFFF' },
  bodyContent: { paddingHorizontal: 20, paddingTop: 8 },
  kpiGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  kpiCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, elevation: 3, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4 },
  kpiTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  kpiIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  kpiIcon: { fontSize: 20 },
  kpiTrendBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  kpiTrendText: { fontSize: 10, fontWeight: '800', color: '#2563EB' },
  kpiValue: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  kpiLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginTop: 2 },
  kpiFooter: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  kpiSubText: { fontSize: 10, color: '#10B981', fontWeight: '700' },
  quickActionBanner: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 3 },
  quickActionTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  quickActionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  actionPill: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  actionPillIcon: { fontSize: 18, marginBottom: 4 },
  actionPillText: { fontSize: 10, fontWeight: '700', color: '#334155', textAlign: 'center' },
  sectionWrapper: { marginBottom: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  blueBarAccent: { width: 4, height: 18, backgroundColor: '#0284C7', borderRadius: 2, marginRight: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A', letterSpacing: -0.2 },
  moduleCountBadge: { fontSize: 11, color: '#64748B', fontWeight: '700' },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moduleCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, elevation: 2, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'space-between' },
  moduleTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  moduleIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  moduleIcon: { fontSize: 20 },
  moduleBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  moduleBadgeText: { fontSize: 9, fontWeight: '800' },
  moduleTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  moduleDesc: { fontSize: 11, color: '#64748B', fontWeight: '500', lineHeight: 15, minHeight: 30 },
  moduleCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  moduleActionText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  moduleActionArrow: { fontSize: 12, fontWeight: '900' },
  telemetryCard: { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, marginTop: 8 },
  telemetryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  telemetryLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greenPulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  telemetryStatus: { color: '#E2E8F0', fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  telemetryUptime: { color: '#10B981', fontSize: 11, fontWeight: '800' },
  telemetryDetails: { color: '#64748B', fontSize: 10, fontWeight: '500' },
});
