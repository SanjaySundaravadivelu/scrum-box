/*
  Warnings:

  - Added the required column `epic` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "epic" TEXT NOT NULL,
ADD COLUMN     "points" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Epic" (
    "id" TEXT NOT NULL,
    "labels" TEXT[],
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Epic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Epic_projectId_key" ON "Epic"("projectId");

-- AddForeignKey
ALTER TABLE "Epic" ADD CONSTRAINT "Epic_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
