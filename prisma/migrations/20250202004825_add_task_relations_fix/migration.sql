/*
  Warnings:

  - You are about to drop the `_TaskRelations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TaskRelations" DROP CONSTRAINT "_TaskRelations_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskRelations" DROP CONSTRAINT "_TaskRelations_B_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "taskRelationId" INTEGER;

-- DropTable
DROP TABLE "_TaskRelations";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskRelationId_fkey" FOREIGN KEY ("taskRelationId") REFERENCES "TaskRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
