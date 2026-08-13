import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import ListTileWidget from '../../components/ListTileWidget';

export default function TeacherManagement({ token, onBack }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [subject, setSubject] = useState('');
  const [classId, setClassId] = useState('Grade 10 - A');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(response.data);
    } catch (err) {
      console.error('Error fetching teachers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async () => {
    if (!name || !email || !password || !teacherCode || !subject) {
      setError('Please fill required fields (Name, Email, Password, Code, Subject)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
        role: 'teacher',
        teacherCode,
        subject,
        classId
      });
      
      setShowAddForm(false);
      setName('');
      setEmail('');
      setPassword('');
      setTeacherCode('');
      setSubject('');
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account. Check constraints.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <Text style={styles.title}>Teachers</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddForm(!showAddForm)}>
          <Text style={styles.addText}>{showAddForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.formTitle}>New Teacher Registration</Text>
          
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} placeholder="John Doe" value={name} onChangeText={setName} />
          
          <Text style={styles.label}>Email Address *</Text>
          <TextInput style={styles.input} placeholder="john.teacher@school.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          
          <Text style={styles.label}>Password *</Text>
          <TextInput style={styles.input} placeholder="Minimum 6 characters" value={password} onChangeText={setPassword} secureTextEntry />
          
          <Text style={styles.label}>Teacher Code *</Text>
          <TextInput style={styles.input} placeholder="T.1234" value={teacherCode} onChangeText={setTeacherCode} />

          <Text style={styles.label}>Primary Subject *</Text>
          <TextInput style={styles.input} placeholder="Physics, Mathematics, etc." value={subject} onChangeText={setSubject} />

          <Text style={styles.label}>Assigned Class</Text>
          <TextInput style={styles.input} placeholder="Grade 10 - A" value={classId} onChangeText={setClassId} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={[styles.submitBtn, submitting && {opacity:0.7}]} onPress={handleAddTeacher} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.submitText}>Register Teacher</Text>}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListTileWidget
              title={item.name}
              subtitle={`${item.teacherCode} | Subject: ${item.subject} | Class: ${item.classId || 'N/A'}`}
              leading={<Text style={{fontSize: 20}}>👨‍🏫</Text>}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No teachers registered yet.</Text>
            </View>
          }
        />
      )}
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
  addBtn: {
    paddingVertical: 4,
  },
  addText: {
    fontSize: 13,
    color: 'var(--color-accent)',
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
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
  error: {
    color: 'var(--color-danger)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: 'var(--color-accent)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
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
