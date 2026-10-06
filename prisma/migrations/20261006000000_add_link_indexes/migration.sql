-- CreateIndex
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- CreateIndex
CREATE INDEX "Link_linkAliasId_idx" ON "Link"("linkAliasId");

-- CreateIndex
CREATE INDEX "LinkAlias_url_idx" ON "LinkAlias"("url");
