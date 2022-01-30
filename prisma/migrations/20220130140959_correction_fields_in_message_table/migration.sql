/*
  Warnings:

  - You are about to drop the column `account_id` on the `messages` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_account_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "account_id",
ADD COLUMN     "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;
