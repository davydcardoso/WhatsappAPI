/*
  Warnings:

  - Made the column `webhook` on table `accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "webhook" SET NOT NULL;
