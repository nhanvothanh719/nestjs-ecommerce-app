/*
  Warnings:

  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SKUToVariantOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `variants` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Variant" DROP CONSTRAINT "Variant_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Variant" DROP CONSTRAINT "Variant_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariantOption" DROP CONSTRAINT "VariantOption_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariantOption" DROP CONSTRAINT "VariantOption_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariantOption" DROP CONSTRAINT "VariantOption_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SKUToVariantOption" DROP CONSTRAINT "_SKUToVariantOption_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SKUToVariantOption" DROP CONSTRAINT "_SKUToVariantOption_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "variants" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."Variant";

-- DropTable
DROP TABLE "public"."VariantOption";

-- DropTable
DROP TABLE "public"."_SKUToVariantOption";
