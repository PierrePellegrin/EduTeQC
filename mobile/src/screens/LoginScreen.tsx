import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { styles } from './loginScreen.styles';

export const LoginScreen = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, firstName, lastName });
      }
    } catch (error: any) {
      alert(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface} elevation={2}>
          <Text variant="headlineLarge" style={styles.title}>
            EduTeQC
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Plateforme d'apprentissage
          </Text>

          <SegmentedButtons
            value={mode}
            onValueChange={(value) => setMode(value as 'login' | 'register')}
            buttons={[
              { value: 'login', label: 'Connexion' },
              { value: 'register', label: 'Inscription' },
            ]}
            style={styles.segmented}
          />

          {mode === 'register' && (
            <>
              <TextInput
                label="Prénom"
                value={firstName}
                onChangeText={setFirstName}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Nom"
                value={lastName}
                onChangeText={setLastName}
                mode="outlined"
                style={styles.input}
              />
            </>
          )}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
