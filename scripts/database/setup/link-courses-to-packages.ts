import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function linkCoursesToPackages() {
  try {
    console.log('🔗 Association des cours aux packages...\n');

    // Récupérer tous les packages et cours
    const packages = await prisma.package.findMany({
      include: {
        courses: true
      }
    });
    
    const courses = await prisma.course.findMany({
      include: {
        niveau: true
      }
    });

    console.log(`📦 ${packages.length} packages trouvés`);
    console.log(`📚 ${courses.length} cours trouvés\n`);

    let totalLinked = 0;

    for (const pkg of packages) {
      const packageName = pkg.name.toLowerCase();
      let linkedCourses = 0;
      
      console.log(`📦 Package: ${pkg.name}`);

      // FORFAITS PAR MATIÈRE ET NIVEAU (ex: "Français CP", "Mathématiques CE1")
      if (packageName.match(/^(français|mathématiques|histoire|géographie)\s+(cp|ce1|ce2|cm1|cm2|6ème|5ème|4ème|3ème|2nd|1ère|terminale)$/)) {
        const [subject, level] = packageName.split(' ');
        
        const matchingCourses = courses.filter(course => 
          course.category.toLowerCase() === subject &&
          course.niveau.name.toLowerCase() === level
        );

        for (const course of matchingCourses) {
          // Vérifier si la relation existe déjà
          const existingLink = await prisma.packageCourse.findUnique({
            where: {
              packageId_courseId: {
                packageId: pkg.id,
                courseId: course.id
              }
            }
          });

          if (!existingLink) {
            await prisma.packageCourse.create({
              data: {
                packageId: pkg.id,
                courseId: course.id
              }
            });
            linkedCourses++;
            console.log(`  ✅ ${course.title}`);
          }
        }
      }
      
      // FORFAITS PAR MATIÈRE ET CYCLE (ex: "Français Primaire", "Mathématiques Collège")
      else if (packageName.match(/^(français|mathématiques|histoire|géographie)\s+(primaire|collège|lycée)$/)) {
        const [subject, cycle] = packageName.split(' ');
        
        const cycleLevels = {
          'primaire': ['cp', 'ce1', 'ce2', 'cm1', 'cm2'],
          'collège': ['6ème', '5ème', '4ème', '3ème'],
          'lycée': ['2nd', '1ère', 'terminale']
        };

        const levels = (cycleLevels as any)[cycle] || [];
        
        const matchingCourses = courses.filter(course => 
          course.category.toLowerCase() === subject &&
          levels.includes(course.niveau.name.toLowerCase())
        );

        for (const course of matchingCourses) {
          const existingLink = await prisma.packageCourse.findUnique({
            where: {
              packageId_courseId: {
                packageId: pkg.id,
                courseId: course.id
              }
            }
          });

          if (!existingLink) {
            await prisma.packageCourse.create({
              data: {
                packageId: pkg.id,
                courseId: course.id
              }
            });
            linkedCourses++;
            console.log(`  ✅ ${course.title}`);
          }
        }
      }
      
      // FORFAITS COMPLETS PAR NIVEAU (ex: "Programme complet CP", "Programme complet CE1")
      else if (packageName.match(/^programme complet\s+(cp|ce1|ce2|cm1|cm2|6ème|5ème|4ème|3ème|2nd|1ère|terminale)$/)) {
        const level = packageName.replace('programme complet ', '');
        
        const matchingCourses = courses.filter(course => 
          course.niveau.name.toLowerCase() === level
        );

        for (const course of matchingCourses) {
          const existingLink = await prisma.packageCourse.findUnique({
            where: {
              packageId_courseId: {
                packageId: pkg.id,
                courseId: course.id
              }
            }
          });

          if (!existingLink) {
            await prisma.packageCourse.create({
              data: {
                packageId: pkg.id,
                courseId: course.id
              }
            });
            linkedCourses++;
            console.log(`  ✅ ${course.title}`);
          }
        }
      }
      
      // FORFAITS PREMIUM PAR CYCLE (ex: "Primaire Complet - Formule Premium")
      else if (packageName.match(/^(primaire|collège|lycée)\s+complet\s+-\s+formule premium$/)) {
        const cycle = packageName.split(' ')[0];
        
        const cycleLevels = {
          'primaire': ['cp', 'ce1', 'ce2', 'cm1', 'cm2'],
          'collège': ['6ème', '5ème', '4ème', '3ème'],
          'lycée': ['2nd', '1ère', 'terminale']
        };

        const levels = (cycleLevels as any)[cycle] || [];
        
        const matchingCourses = courses.filter(course => 
          levels.includes(course.niveau.name.toLowerCase())
        );

        for (const course of matchingCourses) {
          const existingLink = await prisma.packageCourse.findUnique({
            where: {
              packageId_courseId: {
                packageId: pkg.id,
                courseId: course.id
              }
            }
          });

          if (!existingLink) {
            await prisma.packageCourse.create({
              data: {
                packageId: pkg.id,
                courseId: course.id
              }
            });
            linkedCourses++;
            console.log(`  ✅ ${course.title}`);
          }
        }
      }

      console.log(`  📊 ${linkedCourses} cours liés à ce package\n`);
      totalLinked += linkedCourses;
    }

    console.log(`🎉 ASSOCIATION TERMINÉE !`);
    console.log(`📊 Total: ${totalLinked} nouvelles associations créées`);

    // Vérification finale
    console.log('\n🔍 VÉRIFICATION FINALE:');
    const packagesWithCounts = await prisma.package.findMany({
      include: {
        _count: {
          select: {
            courses: true
          }
        }
      }
    });

    packagesWithCounts.forEach(pkg => {
      console.log(`📦 ${pkg.name}: ${pkg._count.courses} cours`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkCoursesToPackages();