-- DropForeignKey
ALTER TABLE `Accounts` DROP FOREIGN KEY `Accounts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Meetings` DROP FOREIGN KEY `Meetings_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Sessions` DROP FOREIGN KEY `Sessions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserTimeSlots` DROP FOREIGN KEY `UserTimeSlots_user_id_fkey`;

-- RenameIndex
ALTER TABLE `Accounts` RENAME INDEX `Accounts_user_id_fkey` TO `Accounts_user_id_idx`;

-- RenameIndex
ALTER TABLE `Meetings` RENAME INDEX `Meetings_user_id_fkey` TO `Meetings_user_id_idx`;

-- RenameIndex
ALTER TABLE `Sessions` RENAME INDEX `Sessions_user_id_fkey` TO `Sessions_user_id_idx`;

-- RenameIndex
ALTER TABLE `UserTimeSlots` RENAME INDEX `UserTimeSlots_user_id_fkey` TO `UserTimeSlots_user_id_idx`;
