# 🔒 Tests de Non-Régression EduTeQC

## 📋 Vue d'ensemble

Ce système de tests de non-régression garantit la stabilité et la qualité du code EduTeQC en détectant automatiquement les régressions avant qu'elles n'atteignent la production.

## 🎯 Types de Tests

### 🔧 Tests Backend
- **API Regression Tests** : Validation des endpoints critiques
- **Database Integrity Tests** : Vérification de l'intégrité des données
- **Performance Tests** : Surveillance des temps de réponse
- **Security Tests** : Audit de sécurité des dépendances

### 📱 Tests Frontend
- **React Components Tests** : Validation des composants critiques
- **Hooks Validation** : Respect des Rules of Hooks
- **Navigation Tests** : Fonctionnement de la navigation
- **Performance Tests** : Temps de rendu des composants

### 🔄 Tests End-to-End
- **API Integration** : Tests d'intégration complète
- **Data Flow** : Flux de données bout en bout
- **Error Handling** : Gestion d'erreurs robuste
- **User Scenarios** : Scénarios utilisateur critiques

## 🚀 Exécution des Tests

### Exécution Locale

```powershell
# Tous les tests
.\run-regression-tests.ps1

# Tests backend uniquement
.\run-regression-tests.ps1 -BackendOnly

# Tests frontend uniquement
.\run-regression-tests.ps1 -FrontendOnly

# Tests E2E uniquement
.\run-regression-tests.ps1 -E2EOnly
```

### Tests Backend Spécifiques

```bash
cd backend

# Tous les tests
npm test

# Tests de régression uniquement
npm run test:regression

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Tests Frontend Spécifiques

```bash
cd mobile

# Tous les tests
npm test

# Tests de régression uniquement
npm run test:regression

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Tests E2E

```bash
# Assurer que le backend est démarré
cd backend && npm run dev

# Dans un autre terminal
node tests/e2e-tests.js
```

## 🔄 Intégration Continue

Les tests s'exécutent automatiquement via GitHub Actions :

- **Push sur `main`** : Tests complets
- **Pull Request** : Tests de validation
- **Release** : Tests de production

### Workflow GitHub Actions

Le fichier `.github/workflows/regression-tests.yml` configure :

1. **Backend Tests** : Tests API et base de données
2. **Frontend Tests** : Tests composants React
3. **E2E Tests** : Tests d'intégration
4. **Performance Tests** : Tests de charge
5. **Security Tests** : Audit de sécurité
6. **Build Validation** : Validation des builds

## 📊 Couverture de Code

### Objectifs de Couverture

- **Backend** : > 80%
- **Frontend** : > 70%
- **Critical Paths** : > 95%

### Rapports de Couverture

Les rapports sont générés dans :
- `backend/coverage/`
- `mobile/coverage/`

## 🛡️ Tests de Sécurité

### Vulnérabilités

```bash
# Audit backend
cd backend && npm audit

# Audit frontend
cd mobile && npm audit --legacy-peer-deps
```

### Tests de Sécurité Automatisés

- Audit des dépendances
- Détection de vulnérabilités connues
- Validation des configurations

## ⚡ Tests de Performance

### Métriques Surveillées

- **API Response Time** : < 2s
- **Component Render Time** : < 100ms
- **Database Query Time** : < 500ms
- **Bundle Size** : Surveillé pour éviter la régression

### Outils de Performance

- Jest pour les tests unitaires
- Autocannon pour les tests de charge
- React DevTools pour le profiling

## 🐛 Gestion des Échecs

### Échec de Tests Locaux

1. **Identifier** le test qui échoue
2. **Analyser** les logs d'erreur
3. **Corriger** le problème
4. **Re-exécuter** les tests
5. **Valider** la correction

### Échec de Tests CI/CD

1. **Vérifier** les logs GitHub Actions
2. **Reproduire** localement
3. **Corriger** et pusher
4. **Valider** que les tests passent

## 📝 Ajout de Nouveaux Tests

### Tests Backend

```typescript
// backend/tests/my-feature.regression.test.ts
import request from 'supertest';
import { createTestApp } from './testApp';

describe('🔒 My Feature Regression Tests', () => {
  test('should maintain existing behavior', async () => {
    // Test implementation
  });
});
```

### Tests Frontend

```typescript
// mobile/tests/MyComponent.regression.test.tsx
import { render } from '@testing-library/react-native';
import MyComponent from '../src/components/MyComponent';

describe('🔒 MyComponent Regression Tests', () => {
  test('should render without crashing', () => {
    // Test implementation
  });
});
```

### Tests E2E

```javascript
// tests/my-feature-e2e.js
await this.test('My Feature E2E', async () => {
  // E2E test implementation
});
```

## 🔧 Configuration

### Variables d'Environnement

```env
# Backend Tests
DATABASE_URL=postgresql://...
NODE_ENV=test

# E2E Tests
API_BASE_URL=http://localhost:3000/api
```

### Configuration Jest

- **Backend** : `backend/jest.config.js`
- **Frontend** : `mobile/jest.config.json`

## 📚 Bonnes Pratiques

### Tests Efficaces

1. **Isolation** : Chaque test doit être indépendant
2. **Nommage** : Noms descriptifs et clairs
3. **Couverture** : Couvrir les cas critiques
4. **Performance** : Tests rapides (<10s)
5. **Maintenance** : Tests faciles à maintenir

### Anti-Patterns à Éviter

- ❌ Tests dépendants entre eux
- ❌ Tests flaky (instables)
- ❌ Tests trop lents
- ❌ Tests sur des détails d'implémentation
- ❌ Tests sans assertions claires

## 🚨 Alertes et Monitoring

### Notifications

- **Échecs de tests** : Alertes automatiques
- **Dégradation de performance** : Monitoring continu
- **Vulnérabilités** : Scanning régulier

### Métriques Clés

- Taux de réussite des tests
- Temps d'exécution
- Couverture de code
- Nombre de vulnérabilités

## 🎯 Objectifs de Non-Régression

### Fonctionnalités Protégées

1. **Authentification** : Système de connexion
2. **Navigation** : Routes et navigation
3. **API** : Endpoints critiques
4. **Data Flow** : Flux de données
5. **Performance** : Temps de réponse
6. **Security** : Sécurité et vulnérabilités

### Critères de Succès

- ✅ 100% des tests critiques passent
- ✅ Couverture > 80% sur les parties critiques
- ✅ Performance maintenue
- ✅ Aucune vulnérabilité haute
- ✅ Build successful

---

## 🆘 Support

En cas de problème avec les tests :

1. Consulter les logs détaillés
2. Vérifier la configuration
3. Tester en local
4. Consulter la documentation
5. Demander de l'aide à l'équipe

**Objectif** : Maintenir la qualité et la stabilité d'EduTeQC ! 🎯