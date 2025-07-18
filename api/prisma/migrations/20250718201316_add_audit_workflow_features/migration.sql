-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TRANSLATOR', 'REVIEWER');

-- AlterTable
ALTER TABLE "TranslationKey" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "screenshots" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'TRANSLATOR';

-- CreateTable
CREATE TABLE "TranslationHistory" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "oldStatus" "TranslationStatus",
    "newStatus" "TranslationStatus",
    "translationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranslationHistory_translationId_idx" ON "TranslationHistory"("translationId");

-- CreateIndex
CREATE INDEX "TranslationHistory_userId_idx" ON "TranslationHistory"("userId");

-- CreateIndex
CREATE INDEX "TranslationHistory_createdAt_idx" ON "TranslationHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "TranslationHistory" ADD CONSTRAINT "TranslationHistory_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationHistory" ADD CONSTRAINT "TranslationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
