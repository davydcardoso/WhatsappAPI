-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "webhook" VARCHAR(255);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
