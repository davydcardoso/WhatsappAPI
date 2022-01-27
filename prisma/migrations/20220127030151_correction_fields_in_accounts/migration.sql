/*
  Warnings:

  - You are about to drop the column `document` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `accounts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "accounts_phone_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "document",
DROP COLUMN "phone";
