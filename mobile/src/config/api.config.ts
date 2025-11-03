// Configuration de l'environnement
export const config = {
  // URL de l'API selon l'environnement
  api: {
    // URL de production - Railway déployé
    production: 'https://eduteqc-production.up.railway.app/api',
    
    // URLs de développement
    development: {
      // Android emulator
      android: 'http://10.0.2.2:3000/api',
      // iOS simulator 
      ios: 'http://127.0.0.1:3000/api',
      // Réseau local (remplacez par l'IP de votre machine)
      local: 'http://192.168.1.100:3000/api'
    }
  },
  
  // Autres configurations
  app: {
    name: 'EduTeQC',
    version: '1.0.0',
    timeout: 10000, // 10 secondes
  }
};

// Fonction pour obtenir l'URL de l'API selon l'environnement
export const getApiUrl = () => {
  // En production, utilisez l'URL de production
  if (__DEV__ === false) {
    return config.api.production;
  }
  
  // En développement, utilisez l'URL depuis les variables d'environnement ou le fallback
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback selon la plateforme
  const { Platform } = require('react-native');
  return Platform.OS === 'android' 
    ? config.api.development.android 
    : config.api.development.ios;
};