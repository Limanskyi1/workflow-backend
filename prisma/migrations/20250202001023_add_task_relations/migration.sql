-- CreateTable
CREATE TABLE "TaskRelation" (
    "id" SERIAL NOT NULL,
    "taskIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaskRelations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TaskRelations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskRelation_taskIds_key" ON "TaskRelation"("taskIds");

-- CreateIndex
CREATE INDEX "_TaskRelations_B_index" ON "_TaskRelations"("B");

-- AddForeignKey
ALTER TABLE "_TaskRelations" ADD CONSTRAINT "_TaskRelations_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskRelations" ADD CONSTRAINT "_TaskRelations_B_fkey" FOREIGN KEY ("B") REFERENCES "TaskRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
