/*
  Warnings:

  - Added the required column `fantasy_name` to the `companys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companys" ADD COLUMN     "fantasy_name" VARCHAR(180) NOT NULL;
