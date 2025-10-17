# Règles des Hooks React - Guide de Référence

## Date: 17 Octobre 2025

## Les Deux Règles Fondamentales des Hooks

### 1️⃣ Toujours Appeler les Hooks au Niveau Supérieur

❌ **NE JAMAIS** appeler les Hooks :
- À l'intérieur de boucles
- À l'intérieur de conditions
- À l'intérieur de fonctions imbriquées
- **APRÈS un return conditionnel**

✅ **TOUJOURS** appeler les Hooks :
- Au niveau supérieur du composant
- Dans le même ordre à chaque render
- **AVANT tout return conditionnel**

### 2️⃣ Uniquement dans les Composants React ou Hooks Personnalisés

❌ **NE PAS** appeler les Hooks dans :
- Fonctions JavaScript normales
- Event handlers
- Fonctions utilitaires

✅ **APPELER** les Hooks dans :
- Composants fonctionnels React
- Hooks personnalisés (préfixés avec `use`)

## Problème Rencontré dans EduTeQC

### ❌ Code Incorrect (causait l'erreur)

```tsx
export const AdminCoursesScreen = ({ navigation }: Props) => {
  // ... autres hooks ...
  const groupedCourses = useMemo(() => { ... }, [filteredCourses, groupBy]);

  // ❌ RETURN CONDITIONNEL ICI
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // ❌ HOOKS APRÈS LE RETURN CONDITIONNEL
  const toggleGroup = useCallback((groupKey: string) => { ... }, []);
  const handleCancelForm = useCallback(() => { ... }, [resetForm]);
  const renderCoursesList = useCallback(() => { ... }, [...]);
  const renderAccordionGroup = useCallback(() => { ... }, [...]);

  return (...);
};
```

**Problème:**
- Lors du premier render (isLoading=true), React appelle 47 hooks puis return
- Lors du second render (isLoading=false), React appelle 47 hooks + 4 nouveaux = 51 hooks
- React détecte un changement d'ordre des hooks → Erreur!

### ✅ Code Correct (solution)

```tsx
export const AdminCoursesScreen = ({ navigation }: Props) => {
  // ... autres hooks ...
  const groupedCourses = useMemo(() => { ... }, [filteredCourses, groupBy]);

  // ✅ TOUS LES HOOKS AVANT LE RETURN CONDITIONNEL
  const toggleGroup = useCallback((groupKey: string) => { ... }, []);
  const handleCancelForm = useCallback(() => { ... }, [resetForm]);
  const renderCoursesList = useCallback(() => { ... }, [...]);
  const renderAccordionGroup = useCallback(() => { ... }, [...]);

  // ✅ RETURN CONDITIONNEL APRÈS TOUS LES HOOKS
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (...);
};
```

**Solution:**
- Lors du premier render (isLoading=true), React appelle 51 hooks puis return
- Lors du second render (isLoading=false), React appelle 51 hooks puis continue
- Même nombre de hooks dans le même ordre → Pas d'erreur!

## Pourquoi Cette Règle Existe?

React utilise l'**ordre d'appel** des hooks pour maintenir l'état entre les renders:

```tsx
function Component() {
  const [name, setName] = useState('Alice');    // Hook #1
  const [age, setAge] = useState(25);           // Hook #2
  const memoValue = useMemo(() => {...}, []);   // Hook #3
  const callback = useCallback(() => {...}, []); // Hook #4
}
```

React stocke ces hooks dans un tableau interne:
```
[
  { hook: 'useState', value: 'Alice' },  // Index 0
  { hook: 'useState', value: 25 },       // Index 1
  { hook: 'useMemo', value: ... },       // Index 2
  { hook: 'useCallback', value: ... }    // Index 3
]
```

Si l'ordre change entre renders, React ne peut plus associer correctement les valeurs!

## Exemples Pratiques

### ❌ Hook dans une Condition

```tsx
function MyComponent({ shouldShow }) {
  // ❌ ERREUR: Hook conditionnel
  if (shouldShow) {
    const [count, setCount] = useState(0);
  }
  return <div>...</div>;
}
```

### ✅ Condition Après le Hook

```tsx
function MyComponent({ shouldShow }) {
  // ✅ CORRECT: Hook toujours appelé
  const [count, setCount] = useState(0);
  
  if (!shouldShow) {
    return null;
  }
  
  return <div>{count}</div>;
}
```

### ❌ Hook dans une Boucle

```tsx
function MyComponent({ items }) {
  // ❌ ERREUR: Hook dans une boucle
  items.forEach(item => {
    const [selected, setSelected] = useState(false);
  });
  return <div>...</div>;
}
```

### ✅ État Unique pour Tous les Items

```tsx
function MyComponent({ items }) {
  // ✅ CORRECT: Un hook pour tous les items
  const [selectedItems, setSelectedItems] = useState({});
  
  return (
    <div>
      {items.map(item => (
        <Item 
          key={item.id}
          selected={selectedItems[item.id]}
          onSelect={() => setSelectedItems({...selectedItems, [item.id]: true})}
        />
      ))}
    </div>
  );
}
```

### ❌ Hook Après Return Précoce

```tsx
function MyComponent({ data }) {
  // ❌ ERREUR: Hook après return conditionnel
  if (!data) {
    return <div>Loading...</div>;
  }
  
  const processedData = useMemo(() => process(data), [data]);
  return <div>{processedData}</div>;
}
```

### ✅ Hook Avant Return Précoce

```tsx
function MyComponent({ data }) {
  // ✅ CORRECT: Hook avant return conditionnel
  const processedData = useMemo(() => process(data || []), [data]);
  
  if (!data) {
    return <div>Loading...</div>;
  }
  
  return <div>{processedData}</div>;
}
```

## Hooks Communs et Leurs Dépendances

### useState
```tsx
const [value, setValue] = useState(initialValue);
```
- Pas de dépendances
- Toujours stable

### useEffect
```tsx
useEffect(() => {
  // effet
  return () => { /* cleanup */ };
}, [dep1, dep2]); // Dépendances
```
- Inclure toutes les valeurs utilisées dans l'effet
- Omettre les dépendances = exécution à chaque render

### useMemo
```tsx
const memoizedValue = useMemo(() => {
  return expensiveComputation(a, b);
}, [a, b]); // Recalcule si a ou b changent
```
- Pour optimiser les calculs coûteux
- Inclure toutes les valeurs utilisées

### useCallback
```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]); // Nouvelle fonction si a ou b changent
```
- Pour stabiliser les références de fonctions
- Inclure toutes les valeurs utilisées
- Essentiel avec React.memo

## Outils de Détection

### ESLint Plugin
```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### React DevTools
- Profiler pour voir les renders
- "Highlight updates" pour visualiser les re-renders

## Checklist de Débogage

Quand vous voyez "Rendered more hooks than during the previous render":

1. ✅ Vérifier qu'aucun hook n'est après un `return` conditionnel
2. ✅ Vérifier qu'aucun hook n'est dans un `if/else`
3. ✅ Vérifier qu'aucun hook n'est dans une boucle (`map`, `forEach`, `for`)
4. ✅ Vérifier qu'aucun hook n'est dans une fonction imbriquée
5. ✅ Compter manuellement les hooks dans chaque branche du code

## Bonnes Pratiques

### 1. Toujours Wrapper les Fonctions Utilisées comme Dépendances

```tsx
// ✅ CORRECT
const resetForm = useCallback(() => {
  setFormData({ ... });
}, []);

const handleCancel = useCallback(() => {
  resetForm(); // resetForm est stable
}, [resetForm]);
```

### 2. Utiliser useMemo pour les Calculs Coûteux

```tsx
// ✅ CORRECT
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);
```

### 3. Utiliser useCallback pour les Props de Composants Mémorisés

```tsx
// ✅ CORRECT
const MemoizedChild = memo(Child);

function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <MemoizedChild onClick={handleClick} />;
}
```

### 4. Early Return Uniquement Après Tous les Hooks

```tsx
// ✅ CORRECT
function Component({ data, isLoading }) {
  // Tous les hooks d'abord
  const [state, setState] = useState(null);
  const memoValue = useMemo(() => {...}, [data]);
  const callback = useCallback(() => {...}, []);
  
  // Puis les returns conditionnels
  if (isLoading) return <Loading />;
  if (!data) return <Empty />;
  
  // Puis le render principal
  return <div>...</div>;
}
```

## Ressources

- [Rules of Hooks - React Documentation](https://react.dev/link/rules-of-hooks)
- [Hooks API Reference](https://react.dev/reference/react)
- [ESLint Plugin React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

## Résumé des Fixes Appliqués dans EduTeQC

### AdminCoursesScreen
- ✅ Déplacé `toggleGroup` avant le `if (isLoading)`
- ✅ Déplacé `handleCancelForm` avant le `if (isLoading)`
- ✅ Déplacé `renderCoursesList` avant le `if (isLoading)`
- ✅ Déplacé `renderAccordionGroup` avant le `if (isLoading)`
- ✅ Wrapped `resetForm` dans `useCallback`

### AdminTestsScreen & AdminPackagesScreen
- ✅ Même pattern appliqué
- ✅ Tous les hooks avant les returns conditionnels

## Conclusion

**Règle d'or:** Tous les hooks doivent être appelés dans le même ordre à chaque render, peu importe les conditions. Placez toujours tous vos hooks au début du composant, avant tout return conditionnel.
