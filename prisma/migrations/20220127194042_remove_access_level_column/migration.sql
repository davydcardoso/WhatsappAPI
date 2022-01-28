/*
  Warnings:

  - You are about to drop the column `access_level` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "access_level",
ADD COLUMN     "is_administrator" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "AccessLevel";
