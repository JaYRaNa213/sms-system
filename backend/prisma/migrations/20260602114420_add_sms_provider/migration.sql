-- AlterTable
ALTER TABLE "SmsLog" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'mock',
ADD COLUMN     "providerMessageId" TEXT;
