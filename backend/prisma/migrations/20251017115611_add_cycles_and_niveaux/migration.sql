/*
  Warnings:

  - Added the required column `niveauId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/

-- Supprimer toutes les données existantes (en respectant l'ordre des dépendances)
DELETE FROM "test_results";
DELETE FROM "options";
DELETE FROM "questions";
DELETE FROM "tests";
DELETE FROM "package_courses";
DELETE FROM "user_packages";
DELETE FROM "packages";
DELETE FROM "courses";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "niveauId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "cycles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveaux" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "niveaux_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cycles_name_key" ON "cycles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "niveaux_name_key" ON "niveaux"("name");

-- AddForeignKey
ALTER TABLE "niveaux" ADD CONSTRAINT "niveaux_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "niveaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;
