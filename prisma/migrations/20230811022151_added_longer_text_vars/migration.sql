-- AlterTable
ALTER TABLE `Accounts` MODIFY `refresh_token` TEXT NULL,
    MODIFY `access_token` TEXT NULL,
    MODIFY `id_token` TEXT NULL;

-- AlterTable
ALTER TABLE `Users` MODIFY `bio` TEXT NULL;
