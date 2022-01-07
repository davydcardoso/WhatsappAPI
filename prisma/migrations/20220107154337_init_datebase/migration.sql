-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "actived" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(180) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "password" TEXT NOT NULL,
    "document" VARCHAR(20),
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
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
CREATE TABLE "_AccountsToSessions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_document_key" ON "accounts"("document");

-- CreateIndex
CREATE UNIQUE INDEX "_AccountsToSessions_AB_unique" ON "_AccountsToSessions"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountsToSessions_B_index" ON "_AccountsToSessions"("B");

-- AddForeignKey
ALTER TABLE "_AccountsToSessions" ADD FOREIGN KEY ("A") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountsToSessions" ADD FOREIGN KEY ("B") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
