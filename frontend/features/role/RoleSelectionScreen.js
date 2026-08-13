import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getDashboardRoute } from '../../shared/RoleRouter';

export default function RoleSelectionScreen({ user, onSelectRoute }) {
  const handleRoleSelection = (role) => {
    const route = getDashboardRoute(role);
    onSelectRoute(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.subtitle}>Select the portal access below to proceed</Text>

      <View style={styles.grid}>
        {user.role === 'admin' ? (
          <TouchableOpacity style={[styles.card, {borderColor: '#e74c3c'}]} onPress={() => handleRoleSelection('admin')}>
            <Text style={styles.cardIcon}>👑</Text>
            <Text style={styles.cardTitle}>Admin Panel</Text>
            <Text style={styles.cardDesc}>Complete school control, users & fees management</Text>
          </TouchableOpacity>
        ) : null}

        {user.role === 'admin' || user.role === 'teacher' ? (
          <TouchableOpacity style={[styles.card, {borderColor: '#0076a8'}]} onPress={() => handleRoleSelection('teacher')}>
            <Text style={styles.cardIcon}>👨‍🏫</Text>
            <Text style={styles.cardTitle}>Teacher Panel</Text>
            <Text style={styles.cardDesc}>Attendance rosters, homework posting & notices</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={[styles.card, {borderColor: '#2ecc71'}]} onPress={() => handleRoleSelection('student')}>
          <Text style={styles.cardIcon}>🎓</Text>
          <Text style={styles.cardTitle}>Student / Parent Panel</Text>
          <Text style={styles.cardDesc}>Check homework tasks, notices, and pending fees</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'var(--bg-app)',
  },
  title: {
    fontSize: 16,
    color: 'var(--text-muted)',
    textAlign: 'center',
    fontWeight: '500',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: 'var(--text-main)',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'var(--font-accent)',
  },
  subtitle: {
    fontSize: 12,
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
});
