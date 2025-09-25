-- AlterTable
ALTER TABLE "public"."Pet" ADD COLUMN     "ownerId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Pet" ADD CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
