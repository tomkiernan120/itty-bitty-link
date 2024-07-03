/*
  Warnings:

  - Added the required column `linkAliasId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "linkAliasId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LinkAlias" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkAlias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkAlias_alias_key" ON "LinkAlias"("alias");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_linkAliasId_fkey" FOREIGN KEY ("linkAliasId") REFERENCES "LinkAlias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
