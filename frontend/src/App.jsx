import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import axios from 'axios';
import { APP_CONFIG } from '../config/AppConfig';

axios.defaults.baseURL = APP_CONFIG.apiBaseUrl;

// Auth & Role
import LoginScreen from '../features/auth/LoginScreen';
import RoleSelectionScreen from '../features/role/RoleSelectionScreen';

// Admin Screens
import AdminDashboard from '../features/admin/AdminDashboard';
import StudentManagement from '../features/admin/StudentManagement';
import TeacherManagement from '../features/admin/TeacherManagement';
import FeesScreen from '../features/admin/FeesScreen';
import AdminNoticeScreen from '../features/admin/AdminNoticeScreen';

// Teacher Screens
import TeacherDashboard from '../features/teacher/TeacherDashboard';
import AttendanceScreen from '../features/teacher/AttendanceScreen';
import HomeworkUpload from '../features/teacher/HomeworkUpload';
import TeacherNoticeScreen from '../features/teacher/TeacherNoticeScreen';

// Student Screens
import StudentDashboard from '../features/student/StudentDashboard';
import AttendanceView from '../features/student/AttendanceView';
import HomeworkView from '../features/student/HomeworkView';
import NoticeScreen from '../features/student/NoticeScreen';
import StudentFeesScreen from '../features/student/StudentFeesScreen';
import TimetableScreen from '../features/student/TimetableScreen';
import ExamResultsScreen from '../features/student/ExamResultsScreen';
import StudyMaterialsScreen from '../features/student/StudyMaterialsScreen';
import LeaveRequestScreen from '../features/student/LeaveRequestScreen';
import DigitalIdCardScreen from '../features/student/DigitalIdCardScreen';
import LibraryScreen from '../features/student/LibraryScreen';

export default function App() {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isLoggedIn: false,
  });
  const [currentScreen, setCurrentScreen] = useState('Login');

  const handleLoginSuccess = (token, id, name, email, role) => {
    const user = { id, name, email, role };
    setAuthState({ token, user, isLoggedIn: true });
    
    if (role === 'admin') {
      setCurrentScreen('AdminDashboard');
    } else if (role === 'teacher') {
      setCurrentScreen('TeacherDashboard');
    } else {
      setCurrentScreen('StudentDashboard');
    }
  };

  const handleLogout = () => {
    setAuthState({ token: null, user: null, isLoggedIn: false });
    setCurrentScreen('Login');
  };

  const navigate = (screen) => setCurrentScreen(screen);
  const goBack = () => {
    const role = authState.user?.role;
    if (role === 'admin') setCurrentScreen('AdminDashboard');
    else if (role === 'teacher') setCurrentScreen('TeacherDashboard');
    else setCurrentScreen('StudentDashboard');
  };

  const token = authState.token;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

      // ===== Admin Screens =====
      case 'AdminDashboard':
        return <AdminDashboard token={token} onNavigate={navigate} onLogout={handleLogout} />;
      case 'StudentManagement':
        return <StudentManagement token={token} onBack={goBack} />;
      case 'TeacherManagement':
        return <TeacherManagement token={token} onBack={goBack} />;
      case 'FeesScreen':
        return <FeesScreen token={token} onBack={goBack} />;
      case 'AdminNoticeScreen':
        return <AdminNoticeScreen token={token} onBack={goBack} />;

      // ===== Teacher Screens =====
      case 'TeacherDashboard':
        return <TeacherDashboard token={token} onNavigate={navigate} onLogout={handleLogout} />;
      case 'AttendanceScreen':
        return <AttendanceScreen token={token} onBack={goBack} />;
      case 'HomeworkUpload':
        return <HomeworkUpload token={token} onBack={goBack} />;
      case 'TeacherNoticeScreen':
        return <TeacherNoticeScreen token={token} onBack={goBack} />;

      // ===== Student Screens =====
      case 'StudentDashboard':
        return <StudentDashboard token={token} onNavigate={navigate} onLogout={handleLogout} />;
      case 'AttendanceView':
        return <AttendanceView token={token} onBack={goBack} />;
      case 'HomeworkView':
        return <HomeworkView token={token} onBack={goBack} />;
      case 'NoticeScreen':
        return <NoticeScreen token={token} onBack={goBack} />;
      case 'StudentFeesScreen':
        return <StudentFeesScreen token={token} onBack={goBack} />;
      case 'TimetableScreen':
        return <TimetableScreen token={token} onBack={goBack} />;
      case 'ExamResultsScreen':
        return <ExamResultsScreen token={token} onBack={goBack} />;
      case 'StudyMaterialsScreen':
        return <StudyMaterialsScreen token={token} onBack={goBack} />;
      case 'LeaveRequestScreen':
        return <LeaveRequestScreen token={token} onBack={goBack} />;
      case 'DigitalIdCardScreen':
        return <DigitalIdCardScreen token={token} onBack={goBack} />;
      case 'LibraryScreen':
        return <LibraryScreen token={token} onBack={goBack} />;

      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  const isDarkScreen = currentScreen === 'Login';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkScreen ? '#042940' : '#f5f8fc' }]}>
      <StatusBar barStyle={isDarkScreen ? 'light-content' : 'dark-content'} backgroundColor={isDarkScreen ? '#042940' : '#f5f8fc'} />
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 }
});
