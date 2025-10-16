import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pkgs = await prisma.package.findMany({ select: { id: true, name: true, imageUrl: true } });
  if (!pkgs.length) {
    console.log('Aucun package trouvé.');
    return;
  }
  console.log('Packages existants:');
  for (const p of pkgs) {
    console.log(`- ${p.name} (id: ${p.id}) imageUrl: ${p.imageUrl ?? 'NULL'}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
