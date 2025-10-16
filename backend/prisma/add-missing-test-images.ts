import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FALLBACKS = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
  'https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=800',
];

async function main() {
  console.log('🔧 Ajout d\'images manquantes pour les tests...');
  const tests = await (prisma.test as any).findMany({
    where: { OR: [{ imageUrl: null }, { imageUrl: '' }] },
    orderBy: { createdAt: 'asc' },
  });

  if (!tests.length) {
    console.log('✅ Aucune image manquante.');
    return;
  }

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const url = FALLBACKS[i % FALLBACKS.length];
    await (prisma.test as any).update({
      where: { id: test.id },
      data: { imageUrl: url },
    });
    console.log(`✔️  Test ${test.title} mis à jour avec image: ${url}`);
  }

  console.log('🎉 Mise à jour terminée.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
