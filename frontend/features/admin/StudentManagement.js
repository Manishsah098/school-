import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import ListTileWidget from '../../components/ListTileWidget';

export default function StudentManagement({ token, onBack }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [parentName, setParentName] = useState('');
  const [classId, setClassId] = useState('Grade 10 - A');
  const [dob, setDob] = useState('2010-05-12');
  const [bloodGroup, setBloodGroup] = useState('O+ve');
  const [phone, setPhone] = useState('+977 9801234567');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (!name || !email || !password || !studentCode) {
      setError('Please fill required fields (Name, Email, Password, Code)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
        role: 'student',
        studentCode,
        parentName,
        classId,
        dob,
        bloodGroup,
        phone
      });
      
      // Reset form & list refresh
      setShowAddForm(false);
      setName('');
      setEmail('');
      setPassword('');
      setStudentCode('');
      setParentName('');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account. Check constraints.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      console.error('Delete failed', err);
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
        <Text style={styles.title}>Students</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddForm(!showAddForm)}>
          <Text style={styles.addText}>{showAddForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.formTitle}>New Student Registration</Text>
          
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} placeholder="John Doe" value={name} onChangeText={setName} />
          
          <Text style={styles.label}>Email Address *</Text>
          <TextInput style={styles.input} placeholder="john@school.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          
          <Text style={styles.label}>Password *</Text>
          <TextInput style={styles.input} placeholder="Minimum 6 characters" value={password} onChangeText={setPassword} secureTextEntry />
          
          <Text style={styles.label}>Student Code *</Text>
          <TextInput style={styles.input} placeholder="S.1234" value={studentCode} onChangeText={setStudentCode} />

          <Text style={styles.label}>Parent/Guardian Name</Text>
          <TextInput style={styles.input} placeholder="Guardian Full Name" value={parentName} onChangeText={setParentName} />

          <Text style={styles.label}>Assigned Class</Text>
          <TextInput style={styles.input} placeholder="Grade 10 - A" value={classId} onChangeText={setClassId} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={[styles.submitBtn, submitting && {opacity:0.7}]} onPress={handleAddStudent} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.submitText}>Register Student</Text>}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListTileWidget
              title={item.name}
              subtitle={`${item.studentCode} | Class: ${item.classId || 'N/A'}`}
              leading={<Text style={{fontSize: 20}}>🎓</Text>}
              trailing={
                <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.delText}>Delete</Text>
                </TouchableOpacity>
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No students registered yet.</Text>
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
  delBtn: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  delText: {
    fontSize: 10,
    color: 'var(--color-danger)',
    fontWeight: '700',
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
