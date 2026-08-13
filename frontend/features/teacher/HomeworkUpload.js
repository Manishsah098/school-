import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import ListTileWidget from '../../components/ListTileWidget';

export default function HomeworkUpload({ token, onBack }) {
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form input states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-07-22');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchHomework = async () => {
    try {
      const response = await axios.get('/api/teacher/homework', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHomeworkList(response.data);
    } catch (err) {
      console.error('Error fetching homework', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const handleUpload = async () => {
    if (!title || !description) {
      setError('Please enter both Title and Description.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/teacher/homework', {
        title,
        description,
        date: dueDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Homework uploaded successfully!');
      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchHomework();
    } catch (err) {
      setError('Failed to upload homework. Try again.');
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
        <Text style={styles.title}>Homework Manager</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addText}>{showForm ? 'Cancel' : '+ Upload'}</Text>
        </TouchableOpacity>
      </View>

      {showForm ? (
        <ScrollView style={styles.form}>
          <Text style={styles.formTitle}>Post New Homework Assignment</Text>
          
          <Text style={styles.label}>Homework Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chapter 6 Lab Report"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description & Guidelines *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe homework tasks and steps..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Due Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChangeText={setDueDate}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={[styles.submitBtn, submitting && {opacity:0.7}]} onPress={handleUpload} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.submitText}>Publish Homework</Text>}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={homeworkList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListTileWidget
              title={item.title}
              subtitle={`Due: ${item.date}`}
              leading={<Text style={{fontSize: 20}}>✍️</Text>}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No homework assignments uploaded yet.</Text>
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
  form: {
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
