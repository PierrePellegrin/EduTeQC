-- Migration: Ajout des sections hiérarchiques aux cours
-- Description: Transforme la structure des cours pour supporter des sections/sous-sections illimitées

-- 1. Créer la table des sections de cours
CREATE TABLE "course_sections" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "parentId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_sections_pkey" PRIMARY KEY ("id")
);

-- 2. Créer la table de progression de cours
CREATE TABLE "course_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lastSectionId" TEXT,
    "completionPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_progress_pkey" PRIMARY KEY ("id")
);

-- 3. Créer la table de progression par section
CREATE TABLE "section_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "visitedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_progress_pkey" PRIMARY KEY ("id")
);

-- 4. Ajouter la colonne sectionId et order à la table tests
ALTER TABLE "tests" ADD COLUMN "sectionId" TEXT;
ALTER TABLE "tests" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- 5. Créer les index
CREATE INDEX "course_sections_courseId_idx" ON "course_sections"("courseId");
CREATE INDEX "course_sections_parentId_idx" ON "course_sections"("parentId");
CREATE INDEX "course_progress_userId_idx" ON "course_progress"("userId");
CREATE INDEX "course_progress_courseId_idx" ON "course_progress"("courseId");
CREATE INDEX "section_progress_userId_idx" ON "section_progress"("userId");
CREATE INDEX "section_progress_sectionId_idx" ON "section_progress"("sectionId");
CREATE INDEX "tests_sectionId_idx" ON "tests"("sectionId");

-- 6. Créer les contraintes uniques
CREATE UNIQUE INDEX "course_progress_userId_courseId_key" ON "course_progress"("userId", "courseId");
CREATE UNIQUE INDEX "section_progress_userId_sectionId_key" ON "section_progress"("userId", "sectionId");

-- 7. Ajouter les clés étrangères
ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "course_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "section_progress" ADD CONSTRAINT "section_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "section_progress" ADD CONSTRAINT "section_progress_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "course_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tests" ADD CONSTRAINT "tests_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "course_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 8. Migrer les données existantes : créer une section par défaut pour chaque cours
-- Cette section contiendra le contenu actuel du cours
INSERT INTO "course_sections" ("id", "courseId", "parentId", "title", "content", "order", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    "id" as "courseId",
    NULL as "parentId",
    'Contenu principal' as "title",
    "content",
    0 as "order",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
FROM "courses"
WHERE "content" IS NOT NULL AND "content" != '';

-- 9. Supprimer la colonne content de la table courses (après migration)
-- ⚠️ À faire après vérification que la migration s'est bien passée
-- ALTER TABLE "courses" DROP COLUMN "content";
