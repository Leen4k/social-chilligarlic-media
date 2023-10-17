/*
  Warnings:

  - The `url` column on the `Photo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "url",
ADD COLUMN     "url" TEXT[];
