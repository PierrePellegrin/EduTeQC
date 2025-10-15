# API Backend - Exemples de Requêtes

## 🔐 Authentification

### Inscription Client
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "client@test.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

### Inscription Admin
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}
```

### Connexion
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Utilisateur Actuel
```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_TOKEN
```

## 📚 Cours (Public)

### Liste des Cours
```bash
GET http://localhost:3000/api/courses
```

### Détails d'un Cours
```bash
GET http://localhost:3000/api/courses/:courseId
```

### Cours par Catégorie
```bash
GET http://localhost:3000/api/courses/category/Mathématiques
```

## ✅ Tests (Authentifié)

### Détails d'un Test
```bash
GET http://localhost:3000/api/tests/:testId
Authorization: Bearer YOUR_TOKEN
```

### Soumettre un Test
```bash
POST http://localhost:3000/api/tests/:testId/submit
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "answers": {
    "question_id_1": ["option_id_a"],
    "question_id_2": ["option_id_b", "option_id_c"]
  }
}
```

### Résultats d'un Test
```bash
GET http://localhost:3000/api/tests/:testId/results
Authorization: Bearer YOUR_TOKEN
```

## 🔧 Administration (Admin uniquement)

### Créer un Cours
```bash
POST http://localhost:3000/api/admin/courses
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Mathématiques Niveau 1",
  "description": "Introduction aux mathématiques",
  "category": "Mathématiques",
  "content": "Contenu détaillé du cours...",
  "imageUrl": "https://example.com/image.jpg",
  "order": 1,
  "isPublished": true
}
```

### Modifier un Cours
```bash
PUT http://localhost:3000/api/admin/courses/:courseId
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Mathématiques Niveau 1 - Mis à jour",
  "isPublished": false
}
```

### Supprimer un Cours
```bash
DELETE http://localhost:3000/api/admin/courses/:courseId
Authorization: Bearer ADMIN_TOKEN
```

### Créer un Test
```bash
POST http://localhost:3000/api/admin/tests
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Test de Mathématiques",
  "description": "Évaluez vos connaissances",
  "courseId": "course_id_here",
  "duration": 30,
  "passingScore": 70,
  "isPublished": true
}
```

### Créer une Question avec Options
```bash
POST http://localhost:3000/api/admin/questions
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "testId": "test_id_here",
  "question": "Combien font 2 + 2 ?",
  "type": "SINGLE_CHOICE",
  "points": 1,
  "order": 1,
  "options": [
    {
      "text": "3",
      "isCorrect": false,
      "order": 1
    },
    {
      "text": "4",
      "isCorrect": true,
      "order": 2
    },
    {
      "text": "5",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```

### Statistiques
```bash
GET http://localhost:3000/api/admin/stats
Authorization: Bearer ADMIN_TOKEN
```

## 📋 Exemples Complets

### Workflow Complet: Créer un Cours avec Test

```powershell
# 1. Se connecter en tant qu'admin
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@test.com","password":"admin123"}'
$token = $loginResponse.token

# 2. Créer un cours
$courseResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/courses" -Method POST -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body '{
  "title":"JavaScript Débutant",
  "description":"Apprenez JavaScript de zéro",
  "category":"Programmation",
  "content":"JavaScript est un langage de programmation polyvalent...",
  "isPublished":true
}'
$courseId = $courseResponse.course.id

# 3. Créer un test
$testResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/tests" -Method POST -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body "{
  `"title`":`"Quiz JavaScript - Bases`",
  `"description`":`"Testez vos connaissances`",
  `"courseId`":`"$courseId`",
  `"duration`":15,
  `"passingScore`":60,
  `"isPublished`":true
}"
$testId = $testResponse.test.id

# 4. Créer une question
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/questions" -Method POST -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body "{
  `"testId`":`"$testId`",
  `"question`":`"Quel est le type de 'Hello' en JavaScript?`",
  `"type`":`"SINGLE_CHOICE`",
  `"points`":1,
  `"options`":[
    {`"text`":`"number`",`"isCorrect`":false},
    {`"text`":`"string`",`"isCorrect`":true},
    {`"text`":`"boolean`",`"isCorrect`":false}
  ]
}"
```

## 🧪 Tester avec cURL (Alternative)

### Windows PowerShell
```powershell
# Login
$body = @{
    email = "admin@test.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.token
```

### Linux/Mac
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```
