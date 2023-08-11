-- CreateTable
CREATE TABLE "Meetings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Meetings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
