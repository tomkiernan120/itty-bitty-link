/*
  Warnings:

  - Added the required column `url` to the `LinkAlias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LinkAlias" ADD COLUMN     "url" TEXT NOT NULL;
