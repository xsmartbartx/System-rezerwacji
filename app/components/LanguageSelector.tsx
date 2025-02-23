import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Modal, List, Divider } from 'react-native-paper';

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

interface LanguageSelectorProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (language: Language) => void;
  currentLanguage: string;
}

const LanguageSelector = ({
  visible,
  onDismiss,
  onSelect,
  currentLanguage,
}: LanguageSelectorProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <List.Subheader>Select Language</List.Subheader>
        {LANGUAGES.map((language, index) => (
          <React.Fragment key={language.code}>
            <List.Item
              title={language.name}
              onPress={() => {
                onSelect(language);
                onDismiss();
              }}
              right={props => 
                language.code === currentLanguage ? (
                  <List.Icon {...props} icon="check" />
                ) : null
              }
            />
            {index < LANGUAGES.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
  },
});

export default LanguageSelector; 