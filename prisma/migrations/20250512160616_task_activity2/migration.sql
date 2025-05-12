/*
  Warnings:

  - Made the column `taskId` on table `TaskActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TaskActivity" DROP CONSTRAINT "TaskActivity_taskId_fkey";

-- AlterTable
ALTER TABLE "TaskActivity" ALTER COLUMN "taskId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskActivity" ADD CONSTRAINT "TaskActivity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
