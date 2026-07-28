-- AlterTable
ALTER TABLE `activities` ADD COLUMN `dueDate` DATE NULL;

-- CreateIndex
CREATE INDEX `activities_employeeId_dueDate_idx` ON `activities`(`employeeId`, `dueDate`);
