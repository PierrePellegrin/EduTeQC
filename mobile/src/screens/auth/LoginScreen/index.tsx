import React, { useState, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { styles } from './styles';

export const LoginScreen = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nouvelle protection
  const { login, register } = useAuth();

  const handleSubmit = useCallback(async () => {
    // Protection contre les double-clics
    if (loading || isSubmitting) {
      console.log('Soumission déjà en cours, ignorer...');
      return;
    }

    // Validation des champs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (mode === 'register' && (!firstName.trim() || !lastName.trim())) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        console.log('Tentative de connexion pour:', email);
        await login(email.trim(), password);
        console.log('Connexion réussie');
      } else {
        console.log('Tentative d\'inscription pour:', email);
        await register({ 
          email: email.trim(), 
          password, 
          firstName: firstName.trim(), 
          lastName: lastName.trim() 
        });
        console.log('Inscription réussie');
      }
    } catch (error: any) {
      console.error('Erreur d\'authentification:', error);
      
      // Gestion d'erreur améliorée
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Une erreur est survenue lors de la connexion';
      
      Alert.alert(
        'Erreur de connexion',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
      // Petit délai pour éviter les double-clics rapides
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  }, [mode, email, password, firstName, lastName, login, register, loading, isSubmitting]);

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
            disabled={loading || isSubmitting}
            style={styles.button}
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
