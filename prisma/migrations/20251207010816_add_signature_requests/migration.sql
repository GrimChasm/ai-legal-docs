-- CreateTable
CREATE TABLE "SignatureRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "draftId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'docusign',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "externalId" TEXT,
    "signers" TEXT NOT NULL,
    "message" TEXT,
    "subject" TEXT,
    "expiresAt" DATETIME,
    "completedAt" DATETIME,
    "signedDocumentUrl" TEXT,
    "errorMessage" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SignatureRequest_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SignatureRequest_draftId_idx" ON "SignatureRequest"("draftId");

-- CreateIndex
CREATE INDEX "SignatureRequest_createdBy_idx" ON "SignatureRequest"("createdBy");

-- CreateIndex
CREATE INDEX "SignatureRequest_externalId_idx" ON "SignatureRequest"("externalId");

-- CreateIndex
CREATE INDEX "SignatureRequest_status_idx" ON "SignatureRequest"("status");
