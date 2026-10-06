/*
  Moves the alias onto Link and retires LinkAlias.

  - The oldest link on each shared alias keeps that alias, so existing short links keep working.
  - Any other link that shared an alias gets a new random one.
  - Aliases with no remaining links are dropped with the LinkAlias table.
*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN "alias" TEXT;

-- Backfill: the oldest link on each alias keeps it
UPDATE "Link" AS l
SET "alias" = la."alias"
FROM "LinkAlias" AS la
WHERE l."linkAliasId" = la."id"
  AND l."id" = (
    SELECT l2."id"
    FROM "Link" AS l2
    WHERE l2."linkAliasId" = la."id"
    ORDER BY l2."createdAt" ASC, l2."id" ASC
    LIMIT 1
  );

-- Backfill: links that shared an alias get their own
UPDATE "Link"
SET "alias" = substr(md5(random()::text || "id"), 1, 7)
WHERE "alias" IS NULL;

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "alias" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Link_alias_key" ON "Link"("alias");

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_linkAliasId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "linkAliasId";

-- DropTable
DROP TABLE "LinkAlias";
