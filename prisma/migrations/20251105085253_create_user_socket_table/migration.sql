-- CreateTable
CREATE TABLE "UserSocket" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSocket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSocket" ADD CONSTRAINT "UserSocket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
