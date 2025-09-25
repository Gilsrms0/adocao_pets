-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADOTANTE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Adotante" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Adotante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disponivel',

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Adocao" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "adotanteId" INTEGER NOT NULL,
    "dataAdocao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Adocao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Adotante_email_key" ON "public"."Adotante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Adocao_petId_key" ON "public"."Adocao"("petId");

-- AddForeignKey
ALTER TABLE "public"."Adocao" ADD CONSTRAINT "Adocao_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Adocao" ADD CONSTRAINT "Adocao_adotanteId_fkey" FOREIGN KEY ("adotanteId") REFERENCES "public"."Adotante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
