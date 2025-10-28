-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Loja" DROP CONSTRAINT "Loja_donoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Produto" DROP CONSTRAINT "Produto_lojaId_fkey";

-- AddForeignKey
ALTER TABLE "Loja" ADD CONSTRAINT "Loja_donoId_fkey" FOREIGN KEY ("donoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
