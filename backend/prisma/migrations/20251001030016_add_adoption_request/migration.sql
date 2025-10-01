-- CreateTable
CREATE TABLE "public"."AdoptionRequest" (
    "id" SERIAL NOT NULL,
    "adopterName" TEXT NOT NULL,
    "adopterEmail" TEXT NOT NULL,
    "adopterPhone" TEXT NOT NULL,
    "adopterAddress" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petId" INTEGER NOT NULL,

    CONSTRAINT "AdoptionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdoptionRequest_adopterEmail_key" ON "public"."AdoptionRequest"("adopterEmail");

-- AddForeignKey
ALTER TABLE "public"."AdoptionRequest" ADD CONSTRAINT "AdoptionRequest_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
