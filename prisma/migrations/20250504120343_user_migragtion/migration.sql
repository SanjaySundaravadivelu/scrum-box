/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Sprint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan_end` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_start` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "plan_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "plan_type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_name_key" ON "Sprint"("name");
