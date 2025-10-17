# 🎨 Guide de Design - EduTeQC

## Material Design 3 (2025)

L'application EduTeQC suit les principes du Material Design 3 avec un focus sur l'accessibilité et l'expérience utilisateur moderne.

## 🎨 Palette de Couleurs

### Thème Clair
```
Primary: rgb(103, 80, 164) - Violet principal
On Primary: rgb(255, 255, 255) - Blanc
Primary Container: rgb(234, 221, 255) - Violet pâle
On Primary Container: rgb(33, 0, 93) - Violet foncé

Secondary: rgb(98, 91, 113) - Gris-violet
On Secondary: rgb(255, 255, 255) - Blanc
Secondary Container: rgb(232, 222, 248) - Gris-violet pâle

Background: rgb(255, 251, 255) - Blanc cassé
Surface: rgb(255, 251, 255) - Blanc cassé
```

### Thème Sombre
```
Primary: rgb(208, 188, 255) - Violet clair
On Primary: rgb(56, 30, 114) - Violet foncé
Primary Container: rgb(79, 55, 139) - Violet moyen

Background: rgb(29, 27, 32) - Presque noir
Surface: rgb(29, 27, 32) - Presque noir
```

## 📐 Typographie

L'application utilise la typographie Material Design 3:

### Hiérarchie
- **Display Large** (57sp) - Titres principaux rares
- **Headline Large** (32sp) - Titres de pages
- **Headline Medium** (28sp) - Sections importantes
- **Title Large** (22sp) - Titres de cartes
- **Title Medium** (16sp) - Sous-titres
- **Body Large** (16sp) - Corps de texte principal
- **Body Medium** (14sp) - Corps de texte secondaire
- **Label Large** (14sp) - Boutons

## 🎯 Composants

### Boutons

#### Contained Button (Principal)
```tsx
<Button mode="contained">
  Action Principale
</Button>
```
- Utilisé pour l'action primaire de l'écran
- Couleur: Primary
- Élévation: 1dp

#### Outlined Button (Secondaire)
```tsx
<Button mode="outlined">
  Action Secondaire
</Button>
```
- Actions moins importantes
- Bordure de couleur Primary

#### Text Button (Tertiaire)
```tsx
<Button mode="text">
  Annuler
</Button>
```
- Actions de faible priorité

### Cards (Cartes)

```tsx
<Card elevation={2}>
  <Card.Cover source={{ uri: imageUrl }} />
  <Card.Content>
    <Text variant="titleLarge">Titre</Text>
    <Text variant="bodyMedium">Description</Text>
  </Card.Content>
</Card>
```

**Élévations:**
- Niveau 0: Pas d'ombre (surface de base)
- Niveau 1: 1dp - Cartes au repos
- Niveau 2: 3dp - Cartes légèrement surélevées
- Niveau 3: 6dp - Menus, dialogues
- Niveau 4: 8dp - Navigation drawer
- Niveau 5: 12dp - FAB

### Inputs

```tsx
<TextInput
  label="Email"
  mode="outlined"
  value={email}
  onChangeText={setEmail}
/>
```

**Modes:**
- `outlined`: Recommandé pour les formulaires
- `flat`: Alternative pour les surfaces sombres

## 📱 Layout

### Espacement

Utiliser des multiples de 4dp ou 8dp:
- **4dp**: Espacement minimal
- **8dp**: Espacement standard entre éléments
- **16dp**: Padding des conteneurs
- **24dp**: Marges des écrans
- **32dp**: Grands espaces visuels

### Grille

- Mobile: Colonnes de 4dp
- Marges: 16dp
- Gouttières: 16dp

## 🎭 Animations

### Durées Standards
- **100ms**: Micro-interactions (checkboxes, switches)
- **200ms**: Transitions simples (fade, scale)
- **300ms**: Transitions complexes (navigation)
- **400ms**: Animations d'entrée/sortie

### Courbes d'Accélération
```typescript
// Standard
easing: 'ease-in-out'

// Emphasized (Material 3)
easing: 'cubic-bezier(0.2, 0, 0, 1)'

// Decelerate
easing: 'cubic-bezier(0, 0, 0.2, 1)'
```

## 🌓 Mode Sombre

### Principes
1. Utiliser des surfaces grises foncées (pas noir pur)
2. Augmenter légèrement l'élévation pour plus de contraste
3. Désaturer légèrement les couleurs
4. Assurer un contraste minimum de 4.5:1

### Implémentation
```tsx
const { isDark, toggleTheme } = useTheme();

// Le thème s'adapte automatiquement
```

## ♿ Accessibilité

### Contraste
- **Texte normal**: Minimum 4.5:1
- **Texte large (>18sp)**: Minimum 3:1
- **Éléments UI**: Minimum 3:1

### Zones de Touche
- **Minimum**: 48dp × 48dp
- **Recommandé**: 56dp × 56dp pour les actions importantes

### Labels
Tous les éléments interactifs doivent avoir des labels accessibles:
```tsx
<IconButton
  icon="delete"
  accessibilityLabel="Supprimer le cours"
  onPress={handleDelete}
/>
```

## 🎨 Personnalisation

### Changer la Couleur Principale

Dans `mobile/src/contexts/ThemeContext.tsx`:

```typescript
const customLightColors = {
  primary: 'rgb(VOTRE_COULEUR)',
  // Les autres couleurs se calculent automatiquement
  // ou peuvent être définies manuellement
};
```

### Générateur de Palette

Utilisez [Material Theme Builder](https://m3.material.io/theme-builder) pour générer une palette complète à partir d'une couleur.

## 📐 Icônes

Utilise **Material Community Icons**:

```tsx
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

<MaterialCommunityIcons name="book-open" size={24} color="#6200EE" />
```

[Liste complète des icônes](https://pictogrammers.com/library/mdi/)

## 🎯 Exemples de Composants Personnalisés

### Carte de Cours
```tsx
<Card style={{ marginBottom: 16 }} elevation={2}>
  <Card.Cover source={{ uri: course.imageUrl }} />
  <Card.Content>
    <Chip compact style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
      {course.category}
    </Chip>
    <Text variant="titleLarge" style={{ marginBottom: 8 }}>
      {course.title}
    </Text>
    <Text variant="bodyMedium" numberOfLines={2}>
      {course.description}
    </Text>
  </Card.Content>
</Card>
```

### En-tête avec Gradient
```tsx
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#6200EE', '#9D46FF']}
  style={{ padding: 24, borderRadius: 16 }}
>
  <Text variant="headlineLarge" style={{ color: 'white' }}>
    Titre
  </Text>
</LinearGradient>
```

## 🔄 États des Composants

### Bouton
- **Default**: État normal
- **Hover**: Overlay à 8% (desktop uniquement)
- **Pressed**: Overlay à 12%
- **Focused**: Bordure de focus
- **Disabled**: Opacité à 38%

### Carte
- **Default**: Élévation 1
- **Hover**: Élévation 2
- **Pressed**: Élévation 1
- **Dragged**: Élévation 4

## 📱 Responsive

### Breakpoints
- **Mobile**: < 600dp
- **Tablet**: 600dp - 1240dp
- **Desktop**: > 1240dp

### Adaptation
```tsx
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const isTablet = width >= 600;
```

---

**Ressources:**
- [Material Design 3](https://m3.material.io/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Material Theme Builder](https://m3.material.io/theme-builder)
