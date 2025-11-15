-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "produtoId" INTEGER,
ALTER COLUMN "lojaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
