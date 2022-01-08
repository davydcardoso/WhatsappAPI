/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "phone" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_phone_key" ON "accounts"("phone");
