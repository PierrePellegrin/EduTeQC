(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/packages');
    const data = await response.json();
    
    console.log(`\n📦 FORFAITS DISPONIBLES (${data.packages.length}) :\n`);
    
    data.packages.forEach(pkg => {
      console.log(`🎯 ${pkg.name}`);
      console.log(`   💰 Prix: ${pkg.price}€`);
      console.log(`   📚 Cours: ${pkg._count.courses}`);
      console.log(`   📝 Description: ${pkg.description.substring(0, 100)}...`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
})();