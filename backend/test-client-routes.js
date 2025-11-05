// Test des routes client avec données réelles

async function testClientRoutes() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Test des routes client avec données réelles\n');
    
    // Test de connexion d'abord pour obtenir un token
    console.log('🔐 Test de connexion Admin...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@eduteqc.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Erreur de connexion: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Connexion réussie');
    
    // Test 1: Statistiques client
    console.log('\n📊 Test 1: GET /api/client/stats');
    const statsResponse = await fetch(`${baseUrl}/api/client/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Statistiques récupérées:');
      console.log('   Réponse complète:', JSON.stringify(statsData, null, 2));
      console.log(`   📚 Cours dans forfaits: ${statsData.totalCourses}`);
      console.log(`   📖 Tous les cours (catalogue): ${statsData.allCoursesCount}`);
      console.log(`   ✅ Cours réussis: ${statsData.completedCourses}`);
      console.log(`   🎯 Cours actifs: ${statsData.inProgressCourses}`);
      console.log(`   � Cours disponibles (non commencés): ${statsData.availableCourses}`);
      console.log(`   ⏰ Temps d'étude: ${statsData.totalHours}h`);
      console.log(`   📈 Progrès semaine: ${statsData.weeklyProgress}%`);
      console.log(`   🌍 Progression globale: ${statsData.globalProgress}%`);
      console.log(`   📦 Forfaits: ${statsData.packagesCount}`);
      console.log(`   🔥 Série quotidienne: ${statsData.streak} jours`);
    } else {
      console.log(`❌ Erreur stats: ${statsResponse.status}`);
      const errorText = await statsResponse.text();
      console.log(`   Détails: ${errorText}`);
    }
    
    // Test 2: Activité récente
    console.log('\n📝 Test 2: GET /api/client/recent-activity');
    const activityResponse = await fetch(`${baseUrl}/api/client/recent-activity`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (activityResponse.ok) {
      const activityData = await activityResponse.json();
      console.log(`✅ Activité récente récupérée (${activityData.length} éléments):`);
      activityData.slice(0, 3).forEach((activity, index) => {
        console.log(`   ${index + 1}. ${activity.title} - ${activity.subtitle} (${activity.timestamp})`);
      });
    } else {
      console.log(`❌ Erreur activité: ${activityResponse.status}`);
      const errorText = await activityResponse.text();
      console.log(`   Détails: ${errorText}`);
    }
    
    console.log('\n✅ Tests terminés !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

testClientRoutes();