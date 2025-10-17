const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    // Check all courses and their categories
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        _count: {
          select: {
            tests: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
    
    console.log('\n=== COURSES WITH CATEGORIES ===');
    console.log(`Total courses: ${courses.length}`);
    
    const coursesWithoutCategory = courses.filter(c => !c.category || c.category.trim() === '');
    console.log(`Courses without category: ${coursesWithoutCategory.length}`);
    
    console.log('\n=== ALL COURSES ===');
    courses.forEach(c => {
      console.log(`${c.title}: "${c.category || 'EMPTY'}" (${c._count.tests} tests)`);
    });
    
    // Check all tests
    const tests = await prisma.test.findMany({
      select: {
        id: true,
        title: true,
        courseId: true,
        course: {
          select: {
            title: true,
            category: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
    
    console.log('\n=== TESTS WITH COURSE CATEGORIES ===');
    console.log(`Total tests: ${tests.length}`);
    
    const testsWithoutCategory = tests.filter(t => !t.course?.category);
    console.log(`Tests without category: ${testsWithoutCategory.length}`);
    
    if (testsWithoutCategory.length > 0) {
      console.log('\nTests without category:');
      testsWithoutCategory.forEach(t => {
        console.log(`  - ${t.title}: course="${t.course?.title || 'NO COURSE'}", category="${t.course?.category || 'EMPTY'}"`);
      });
    }
    
    // Group by category
    const groupedByCategory = {};
    tests.forEach(t => {
      const cat = t.course?.category || 'Sans matière';
      if (!groupedByCategory[cat]) {
        groupedByCategory[cat] = [];
      }
      groupedByCategory[cat].push(t.title);
    });
    
    console.log('\n=== TESTS GROUPED BY CATEGORY ===');
    Object.entries(groupedByCategory).forEach(([cat, testsList]) => {
      console.log(`\n${cat} (${testsList.length} tests):`);
      testsList.forEach(title => console.log(`  - ${title}`));
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
