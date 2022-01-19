/*
  Warnings:

  - Added the required column `company_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeAmbient" AS ENUM ('SANDBOX', 'DEVELOPMENT', 'PRODUCTION');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "ambient" "TypeAmbient" NOT NULL DEFAULT E'DEVELOPMENT',
ADD COLUMN     "avatar" VARCHAR(255),
ADD COLUMN     "company_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "companys" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "document" VARCHAR(20),
    "actived" BOOLEAN NOT NULL DEFAULT false,
    "max_sessions" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "companys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companys_token_key" ON "companys"("token");
