-- CreateEnum
CREATE TYPE "TypeAmbient" AS ENUM ('SANDBOX', 'DEVELOPMENT', 'PRODUCTION');

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
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "actived" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(180) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "password" TEXT NOT NULL,
    "document" VARCHAR(20),
    "phone" VARCHAR(20) NOT NULL,
    "webhook" VARCHAR(255) NOT NULL,
    "webhook_token" VARCHAR(155),
    "ambient" "TypeAmbient" NOT NULL DEFAULT E'DEVELOPMENT',
    "avatar" VARCHAR(255),
    "company_id" TEXT,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "status" VARCHAR(80) NOT NULL,
    "wa_browser_id" TEXT NOT NULL,
    "wa_secret_bundle" TEXT NOT NULL,
    "wa_token1" TEXT NOT NULL,
    "wa_token2" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts_groups" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "contacts_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "photo" TEXT NOT NULL,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "group_id" TEXT NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContactsToContactsGroups" (
    "A" TEXT NOT NULL,
    "B" VARCHAR NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "companys_token_key" ON "companys"("token");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_phone_key" ON "accounts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_webhook_key" ON "accounts"("webhook");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_webhook_token_key" ON "accounts"("webhook_token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_account_id_key" ON "sessions"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactsToContactsGroups_AB_unique" ON "_ContactsToContactsGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactsToContactsGroups_B_index" ON "_ContactsToContactsGroups"("B");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactsToContactsGroups" ADD FOREIGN KEY ("A") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactsToContactsGroups" ADD FOREIGN KEY ("B") REFERENCES "contacts_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
