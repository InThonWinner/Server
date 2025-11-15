/*
  Warnings:

  - You are about to drop the column `affiliationPublic` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `contactPublic` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "affiliationPublic",
DROP COLUMN "contactPublic",
ADD COLUMN     "affiliation" TEXT,
ADD COLUMN     "contact" JSONB,
ADD COLUMN     "showAffiliation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showContact" BOOLEAN NOT NULL DEFAULT false;
