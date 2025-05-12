-- CreateEnum
CREATE TYPE "TaskActivityType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TaskActivity" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "TaskActivityType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskActivity" ADD CONSTRAINT "TaskActivity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskActivity" ADD CONSTRAINT "TaskActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
