import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { useLanguage } from '../src/context/LanguageContext';

export default function LanguageSelectorModal() {
  const {
    language,
    setLanguage,
    languages,
    isLanguageModalOpen,
    closeLanguageModal,
    t
  } = useLanguage();

  return (
    <Modal
      visible={isLanguageModalOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={closeLanguageModal}
    >
      <TouchableWithoutFeedback onPress={closeLanguageModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Modal Header */}
              <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                  <Text style={styles.globeIcon}>🌐</Text>
                  <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={closeLanguageModal}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                {t('choosePreferredLanguage')}
              </Text>

              {/* Language List */}
              <View style={styles.langList}>
                {languages.map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <TouchableOpacity
                      key={item.code}
                      style={[styles.langItem, isSelected && styles.langItemSelected]}
                      onPress={() => setLanguage(item.code)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.langLeft}>
                        <Text style={styles.flagIcon}>{item.flag}</Text>
                        <View>
                          <Text style={[styles.langNativeName, isSelected && styles.langTextSelected]}>
                            {item.nativeName}
                          </Text>
                          <Text style={styles.langEnglishName}>{item.name}</Text>
                        </View>
                      </View>

                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Done Button */}
              <TouchableOpacity style={styles.doneButton} onPress={closeLanguageModal}>
                <Text style={styles.doneButtonText}>{t('done')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 41, 64, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  globeIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#042940',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 18,
    lineHeight: 18,
  },
  langList: {
    gap: 10,
    marginBottom: 20,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  langItemSelected: {
    backgroundColor: '#EBF3FA',
    borderColor: '#042940',
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagIcon: {
    fontSize: 24,
  },
  langNativeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  langTextSelected: {
    color: '#042940',
    fontWeight: '800',
  },
  langEnglishName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#042940',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#042940',
  },
  doneButton: {
    backgroundColor: '#042940',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
