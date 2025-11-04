/*
  Warnings:

  - Made the column `createdByUserId` on table `SKU` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."SKU" DROP CONSTRAINT "SKU_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "SKU" ALTER COLUMN "createdByUserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
