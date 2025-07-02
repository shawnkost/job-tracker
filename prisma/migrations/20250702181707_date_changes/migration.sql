/*
  Warnings:

  - You are about to drop the column `date` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "date",
ADD COLUMN     "appliedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstInterviewDate" TIMESTAMP(3),
ADD COLUMN     "offerDate" TIMESTAMP(3),
ADD COLUMN     "rejectionDate" TIMESTAMP(3),
ADD COLUMN     "responseDate" TIMESTAMP(3);
