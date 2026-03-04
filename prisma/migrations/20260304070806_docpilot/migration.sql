/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "pdfUrl",
ADD COLUMN     "pdfPath" TEXT;
