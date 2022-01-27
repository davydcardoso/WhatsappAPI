/*
  Warnings:

  - You are about to drop the column `ambient` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `webhook` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `webhook_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `account_id` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[webhook]` on the table `companys` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[webhook_token]` on the table `companys` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companys_id]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `webhook` to the `companys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companys_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('DEVELOPER', 'ADMINISTRATOR', 'ATTENDANTS');

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_account_id_fkey";

-- DropIndex
DROP INDEX "accounts_webhook_key";

-- DropIndex
DROP INDEX "accounts_webhook_token_key";

-- DropIndex
DROP INDEX "sessions_account_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "ambient",
DROP COLUMN "webhook",
DROP COLUMN "webhook_token",
ADD COLUMN     "access_level" "AccessLevel" NOT NULL DEFAULT E'ATTENDANTS';

-- AlterTable
ALTER TABLE "companys" ADD COLUMN     "ambient" "TypeAmbient" NOT NULL DEFAULT E'DEVELOPMENT',
ADD COLUMN     "webhook" VARCHAR(255) NOT NULL,
ADD COLUMN     "webhook_token" VARCHAR(155);

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "account_id",
ADD COLUMN     "companys_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companys_webhook_key" ON "companys"("webhook");

-- CreateIndex
CREATE UNIQUE INDEX "companys_webhook_token_key" ON "companys"("webhook_token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_companys_id_key" ON "sessions"("companys_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_companys_id_fkey" FOREIGN KEY ("companys_id") REFERENCES "companys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
