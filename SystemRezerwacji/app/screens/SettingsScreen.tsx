import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, Switch, Divider, Text } from 'react-native-paper';
import { useQuery, useMutation } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { queryClient } from '../providers/QueryClientProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import LanguageSelector from '../components/LanguageSelector';

interface Settings {
  notifications_enabled: boolean;
  email_notifications: boolean;
  dark_mode: boolean;
  language: string;
}

const SettingsScreen = () => {
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);

  const { data: settings, isLoading } = useQuery<Settings>(['settings'], async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  });

  const updateSetting = useMutation(async ({ key, value }: { key: keyof Settings; value: any }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_settings')
      .update({ [key]: value })
      .eq('user_id', user.id);

    if (error) throw error;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Notifications</List.Subheader>
        <List.Item
          title="Enable Notifications"
          right={() => (
            <Switch
              value={settings?.notifications_enabled}
              onValueChange={(value) =>
                updateSetting.mutate({ key: 'notifications_enabled', value })
              }
            />
          )}
        />
        <List.Item
          title="Email Notifications"
          right={() => (
            <Switch
              value={settings?.email_notifications}
              onValueChange={(value) =>
                updateSetting.mutate({ key: 'email_notifications', value })
              }
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          right={() => (
            <Switch
              value={settings?.dark_mode}
              onValueChange={(value) =>
                updateSetting.mutate({ key: 'dark_mode', value })
              }
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Language</List.Subheader>
        <List.Item
          title="App Language"
          description={settings?.language}
          onPress={() => setLanguageSelectorVisible(true)}
        />
      </List.Section>

      <View style={styles.versionContainer}>
        <Text variant="bodySmall" style={styles.version}>
          Version 1.0.0
        </Text>
      </View>

      <LanguageSelector
        visible={languageSelectorVisible}
        onDismiss={() => setLanguageSelectorVisible(false)}
        onSelect={(language) => {
          updateSetting.mutate({ key: 'language', value: language.code });
          setLanguageSelectorVisible(false);
        }}
        currentLanguage={settings?.language}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
  version: {
    color: '#666',
  },
});

export default SettingsScreen; 