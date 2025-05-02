/*
  Warnings:

  - You are about to drop the column `taskIds` on the `TaskRelation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TaskRelation_taskIds_key";

-- AlterTable
ALTER TABLE "TaskRelation" DROP COLUMN "taskIds";
