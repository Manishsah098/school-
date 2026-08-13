import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthConfig } from '../../config/AuthConfig';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (inputEmail, inputPassword) => {
    setLoading(true);
    setError('');
    
    const targetEmail = inputEmail || email;
    const targetPassword = inputPassword || password;

    try {
      // Direct call to login endpoint
      const response = await axios.post('/api/auth/login', {
        email: targetEmail,
        password: targetPassword
      });
      
      const { token, id, name, role } = response.data;
      onLoginSuccess(token, id, name, targetEmail, role);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid username or password. Check database connection.');
    } finally {
      setLoading(false);
    }
  };

  const autofill = (role) => {
    if (role === 'admin') {
      setEmail(AuthConfig.defaultAdminEmail);
      setPassword(AuthConfig.defaultAdminPassword);
      handleLogin(AuthConfig.defaultAdminEmail, AuthConfig.defaultAdminPassword);
    } else if (role === 'teacher') {
      setEmail(AuthConfig.defaultTeacherEmail);
      setPassword(AuthConfig.defaultTeacherPassword);
      handleLogin(AuthConfig.defaultTeacherEmail, AuthConfig.defaultTeacherPassword);
    } else if (role === 'student') {
      setEmail(AuthConfig.defaultStudentEmail);
      setPassword(AuthConfig.defaultStudentPassword);
      handleLogin(AuthConfig.defaultStudentEmail, AuthConfig.defaultStudentPassword);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🏫</Text>
        </View>
        <Text style={styles.title}>Veda Portal</Text>
        <Text style={styles.subtitle}>Smart School Operations Management</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={() => handleLogin()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.quickLogin}>
        <Text style={styles.quickTitle}>Quick Demo Logins</Text>
        <View style={styles.quickButtons}>
          <TouchableOpacity style={[styles.quickBtn, {borderColor:'#e74c3c'}]} onPress={() => autofill('admin')}>
            <Text style={[styles.quickBtnText, {color:'#e74c3c'}]}>Admin Panel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, {borderColor:'#0076a8'}]} onPress={() => autofill('teacher')}>
            <Text style={[styles.quickBtnText, {color:'#0076a8'}]}>Teacher Panel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, {borderColor:'#2ecc71'}]} onPress={() => autofill('student')}>
            <Text style={[styles.quickBtnText, {color:'#2ecc71'}]}>Student Panel</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 118, 168, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'var(--font-accent)',
    color: 'var(--text-main)',
  },
  subtitle: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 4,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'var(--bg-card)',
    borderWidth: 1,
    borderColor: 'var(--border-color)',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: 'var(--text-main)',
    marginBottom: 16,
  },
  errorText: {
    color: 'var(--color-danger)',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  btn: {
    backgroundColor: 'var(--color-accent)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  quickLogin: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'var(--border-color)',
    paddingTop: 24,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'var(--bg-card)',
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
