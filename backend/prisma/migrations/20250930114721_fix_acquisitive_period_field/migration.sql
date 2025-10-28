/*
  Warnings:

  - You are about to drop the column `aquisitivePeriodEnd` on the `vacations` table. All the data in the column will be lost.
  - You are about to drop the column `aquisitivePeriodStart` on the `vacations` table. All the data in the column will be lost.
  - Added the required column `acquisitivePeriodEnd` to the `vacations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acquisitivePeriodStart` to the `vacations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."vacations" DROP COLUMN "aquisitivePeriodEnd",
DROP COLUMN "aquisitivePeriodStart",
ADD COLUMN     "acquisitivePeriodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "acquisitivePeriodStart" TIMESTAMP(3) NOT NULL;
