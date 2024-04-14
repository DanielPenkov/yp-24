/*
  Warnings:

  - You are about to drop the column `targer` on the `goals` table. All the data in the column will be lost.
  - Added the required column `target` to the `goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `goals` DROP COLUMN `targer`,
    ADD COLUMN `target` DECIMAL(15, 2) NOT NULL;
