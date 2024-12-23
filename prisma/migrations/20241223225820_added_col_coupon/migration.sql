/*
  Warnings:

  - Added the required column `discountPercentage` to the `CouponCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CouponCode" ADD COLUMN     "discountPercentage" INTEGER NOT NULL;
