CREATE UNIQUE INDEX User_email_unique
ON "User" (email)
WHERE "deletedAt" IS NULL;