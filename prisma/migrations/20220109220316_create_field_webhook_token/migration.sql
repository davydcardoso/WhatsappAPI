/*
  Warnings:

  - A unique constraint covering the columns `[webhook]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[webhook_token]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "webhook_token" VARCHAR(155);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_webhook_key" ON "accounts"("webhook");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_webhook_token_key" ON "accounts"("webhook_token");
