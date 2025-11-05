import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Nice, broadly suitable math image (free Unsplash CDN)
const NEW_IMAGE_URL = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop';

async function main() {
  console.log('🔧 Mise à jour de l\'image du package "Pack Maths"...');

  // Try exact names first, then fallback to any package containing 'math'
  let pack = await prisma.package.findFirst({
    where: { name: { equals: 'Pack Maths', mode: 'insensitive' } },
  });

  if (!pack) {
    pack = await prisma.package.findFirst({
      where: { name: { equals: 'Pack Math', mode: 'insensitive' } },
    });
  }

  if (!pack) {
    pack = await prisma.package.findFirst({
      where: { name: { contains: 'math', mode: 'insensitive' } },
      orderBy: { createdAt: 'asc' },
    });
  }

  if (!pack) {
    console.log('❌ Aucun package correspondant ("Pack Maths"/"Pack Math"/contient "math") introuvable.');
    return;
  }

  await prisma.package.update({
    where: { id: pack.id },
    data: { imageUrl: NEW_IMAGE_URL },
  });

  console.log('✔️  Image mise à jour pour', pack.name);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
