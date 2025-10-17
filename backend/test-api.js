const fetch = require('node-fetch');

async function testAPI() {
  try {
    // First login to get token
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@eduteqc.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('Token obtained:', token ? 'YES' : 'NO');
    
    // Get tests
    console.log('\nFetching tests from API...');
    const testsResponse = await fetch('http://localhost:3000/api/admin/tests', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const testsData = await testsResponse.json();
    console.log(`\nAPI returned ${testsData.tests?.length || 0} tests`);
    
    if (testsData.tests && testsData.tests.length > 0) {
      console.log('\n=== FIRST TEST FROM API ===');
      console.log(JSON.stringify(testsData.tests[0], null, 2));
      
      console.log('\n=== CHECKING ALL TESTS FOR CATEGORY ===');
      const withCategory = testsData.tests.filter(t => t.course?.category);
      const withoutCategory = testsData.tests.filter(t => !t.course?.category);
      
      console.log(`Tests WITH category: ${withCategory.length}`);
      console.log(`Tests WITHOUT category: ${withoutCategory.length}`);
      
      if (withoutCategory.length > 0) {
        console.log('\nTests without category:');
        withoutCategory.slice(0, 5).forEach(t => {
          console.log(`  - ${t.title}`);
          console.log(`    course: ${JSON.stringify(t.course)}`);
        });
      }
      
      // Group by category
      const grouped = {};
      testsData.tests.forEach(t => {
        const cat = t.course?.category || 'Sans matière';
        if (!grouped[cat]) grouped[cat] = 0;
        grouped[cat]++;
      });
      
      console.log('\n=== GROUPING BY CATEGORY ===');
      Object.entries(grouped).forEach(([cat, count]) => {
        console.log(`${cat}: ${count} tests`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
