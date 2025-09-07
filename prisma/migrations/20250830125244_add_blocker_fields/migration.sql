-- CreateTable
CREATE TABLE "Blocker" (
    "id" TEXT NOT NULL,
    "reporter" JSONB NOT NULL,
    "responsible" JSONB[],
    "reason" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "history" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blocker_pkey" PRIMARY KEY ("id")
);
