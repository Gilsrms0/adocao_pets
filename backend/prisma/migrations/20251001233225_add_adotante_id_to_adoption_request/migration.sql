-- AlterTable
ALTER TABLE "public"."AdoptionRequest" ADD COLUMN     "adotanteId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."AdoptionRequest" ADD CONSTRAINT "AdoptionRequest_adotanteId_fkey" FOREIGN KEY ("adotanteId") REFERENCES "public"."Adotante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
