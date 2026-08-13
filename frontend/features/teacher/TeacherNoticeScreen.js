import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function TeacherNoticeScreen({ token, onBack }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleBroadcast = async () => {
    if (!title || !message) {
      setError('Please fill in both Title and Message fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/teacher/notices', {
        title,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Class notice posted successfully!');
      setTitle('');
      setMessage('');
    } catch (err) {
      setError('Failed to post class notice. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>&lt; Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Send Class Notice</Text>
        <View style={{width: 50}} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Notice Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Science Lab Class Schedule"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Notice Message *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter details of notice for your students..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <TouchableOpacity style={[styles.submitBtn, submitting && {opacity:0.7}]} onPress={handleBroadcast} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.submitText}>Send Notice</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  form: {
    padding: 20,
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
  success: {
    color: 'var(--color-green)',
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
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});
