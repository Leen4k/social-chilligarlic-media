/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Heart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Heart_userId_key" ON "Heart"("userId");
