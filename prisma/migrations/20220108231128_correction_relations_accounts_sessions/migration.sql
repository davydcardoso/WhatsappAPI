/*
  Warnings:

  - You are about to drop the `_AccountsToSessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AccountsToSessions" DROP CONSTRAINT "_AccountsToSessions_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountsToSessions" DROP CONSTRAINT "_AccountsToSessions_B_fkey";

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "account_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AccountsToSessions";

-- CreateIndex
CREATE UNIQUE INDEX "sessions_account_id_key" ON "sessions"("account_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
