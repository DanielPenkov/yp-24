/*
  Warnings:

  - Made the column `goal_id` on table `results` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `results` MODIFY `goal_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `results_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
