import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../src/context/LanguageContext';

export default function LanguageButton({ style, lightMode = false }) {
  const { currentLanguageObj, openLanguageModal } = useLanguage();

  return (
    <TouchableOpacity
      style={[
        styles.langBtn,
        lightMode ? styles.langBtnLight : styles.langBtnDark,
        style,
      ]}
      onPress={openLanguageModal}
      activeOpacity={0.75}
    >
      <Text style={styles.langIcon}>🌐</Text>
      <Text style={[styles.langText, lightMode ? styles.langTextLight : styles.langTextDark]}>
        {currentLanguageObj.shortCode || currentLanguageObj.code.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 14,
    gap: 4,
  },
  langBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  langBtnLight: {
    backgroundColor: '#EBF3FA',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  langIcon: {
    fontSize: 13,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
  },
  langTextDark: {
    color: '#FFFFFF',
  },
  langTextLight: {
    color: '#042940',
  },
});
