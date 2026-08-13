import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  ScrollView,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { AuthConfig } from '../../config/AuthConfig';

const { width } = Dimensions.get('window');

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (inputEmail, inputPassword) => {
    setLoading(true);
    setError('');
    
    const targetEmail = inputEmail || email;
    const targetPassword = inputPassword || password;

    try {
      const response = await axios.post('/api/auth/login', {
        email: targetEmail,
        password: targetPassword
      });
      
      const { token, id, name, role } = response.data;
      onLoginSuccess(token, id, name, targetEmail, role);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid username or password. Check credentials.');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} bounces={false}>
      {/* ===== Hero Header Banner Section ===== */}
      <View style={styles.heroSection}>
        <Image 
          source={require('../../assets/banner.jpg')} 
          style={styles.heroBannerImage}
          resizeMode="cover"
        />
        
        {/* Floating Badges (Top Right) */}
        <View style={styles.topRightBadges}>
          <View style={styles.yellowBadge}>
            <Text style={styles.yellowBadgeText}>🎓</Text>
          </View>
          <View style={styles.bookBadge}>
            <Text style={styles.bookBadgeText}>📘</Text>
          </View>
        </View>

        {/* Floating Analytics Pill */}
        <View style={styles.analyticsBadge}>
          <Text style={styles.analyticsBadgeText}>📊</Text>
        </View>

        {/* Banner Overlay Headlines */}
        <View style={styles.heroTextOverlay}>
          <Text style={styles.welcomeSub}>Welcome Back!</Text>
          <Text style={styles.heroTitle}>
            Let's continue{'\n'}your <Text style={styles.blueHighlight}>learning</Text>{'\n'}journey
          </Text>
          <Text style={styles.heroSubtitle}>
            Sign in to access your classes, assignments and more.
          </Text>
        </View>
      </View>

      {/* ===== White Card Sheet Container ===== */}
      <View style={styles.formSheet}>
        {/* Username Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Username</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPassBtn}>
          <Text style={styles.forgotPassText}>Forgot Password?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Main Sign In Button */}
        <TouchableOpacity 
          style={[styles.signInBtn, loading && styles.signInBtnDisabled]} 
          onPress={() => handleLogin()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.btnRow}>
              <Text style={styles.signInBtnText}>Sign In </Text>
              <Text style={styles.arrowText}>→</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Continue with Google */}
        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
          <Text style={styles.googleIcon}>🌐</Text>
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Footer Contact Admin */}
        <View style={styles.footerRow}>
          <Text style={styles.footerIcon}>🛡️</Text>
          <Text style={styles.footerMuted}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Contact Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Autofill Section */}
        <View style={styles.quickLoginSection}>
          <Text style={styles.quickTitle}>Quick Demo Login</Text>
          <View style={styles.quickButtonsRow}>
            <TouchableOpacity style={[styles.quickBtn, { borderColor: '#EF4444' }]} onPress={() => autofill('admin')}>
              <Text style={[styles.quickBtnText, { color: '#EF4444' }]}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickBtn, { borderColor: '#2563EB' }]} onPress={() => autofill('teacher')}>
              <Text style={[styles.quickBtnText, { color: '#2563EB' }]}>Teacher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickBtn, { borderColor: '#10B981' }]} onPress={() => autofill('student')}>
              <Text style={[styles.quickBtnText, { color: '#10B981' }]}>Student</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF2FA',
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* Hero Section */
  heroSection: {
    height: 320,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  topRightBadges: {
    position: 'absolute',
    top: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  yellowBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  yellowBadgeText: {
    fontSize: 22,
  },
  bookBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  bookBadgeText: {
    fontSize: 22,
  },
  analyticsBadge: {
    position: 'absolute',
    top: 100,
    left: '52%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  analyticsBadgeText: {
    fontSize: 20,
  },

  heroTextOverlay: {
    zIndex: 2,
    maxWidth: '70%',
  },
  welcomeSub: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 32,
  },
  blueHighlight: {
    color: '#2563EB',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    lineHeight: 16,
  },

  /* Form Sheet Container */
  formSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    flex: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 6,
  },
  eyeIcon: {
    fontSize: 18,
  },

  forgotPassBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotPassText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '600',
  },

  /* Primary Button */
  signInBtn: {
    backgroundColor: '#738BAE',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#738BAE',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signInBtnDisabled: {
    opacity: 0.7,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    paddingHorizontal: 12,
  },

  /* Google Button */
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 52,
    borderRadius: 14,
    marginBottom: 24,
  },
  googleIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  /* Footer Contact */
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  footerMuted: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 13,
    color: '#1E3A8A',
    fontWeight: '700',
  },

  /* Demo Autofill Section */
  quickLoginSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    alignItems: 'center',
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  quickBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
