/*
  Warnings:

  - You are about to drop the column `appliedDate` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "appliedDate",
ADD COLUMN     "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
