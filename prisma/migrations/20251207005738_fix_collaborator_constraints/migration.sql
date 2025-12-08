-- DropIndex
DROP INDEX "Collaborator_draftId_userId_email_key";

-- CreateIndex
CREATE INDEX "Collaborator_draftId_userId_idx" ON "Collaborator"("draftId", "userId");

-- CreateIndex
CREATE INDEX "Collaborator_draftId_email_idx" ON "Collaborator"("draftId", "email");
