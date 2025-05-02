/*
  Warnings:

  - You are about to drop the column `taskRelationId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `TaskRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_taskRelationId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "taskRelationId";

-- DropTable
DROP TABLE "TaskRelation";
