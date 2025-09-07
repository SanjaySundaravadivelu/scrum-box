/*
  Warnings:

  - The `history` column on the `Blocker` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Blocker" DROP COLUMN "history",
ADD COLUMN     "history" JSONB[];
