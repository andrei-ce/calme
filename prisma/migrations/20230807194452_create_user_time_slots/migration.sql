-- CreateTable
CREATE TABLE "UserTimeSlots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time_start_in_min" INTEGER NOT NULL,
    "time_end_in_min" INTEGER NOT NULL,
    "week_day" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "UserTimeSlots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
