-- DropForeignKey
ALTER TABLE "TaskActivity" DROP CONSTRAINT "TaskActivity_taskId_fkey";

-- AlterTable
ALTER TABLE "TaskActivity" ALTER COLUMN "taskId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskActivity" ADD CONSTRAINT "TaskActivity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
