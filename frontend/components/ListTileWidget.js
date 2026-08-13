import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListTileWidget({ title, subtitle, leading, trailing, onPress }) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container style={styles.container} onPress={onPress}>
      {leading && <View style={styles.leading}>{leading}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'var(--bg-icon)',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'var(--border-color)',
  },
  leading: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  subtitle: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  trailing: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
