/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `companys` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document]` on the table `companys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `companys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companys" ADD COLUMN     "email" VARCHAR(180) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companys_email_key" ON "companys"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companys_document_key" ON "companys"("document");
