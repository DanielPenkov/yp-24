-- AddForeignKey
ALTER TABLE `goals` ADD CONSTRAINT `goals_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
