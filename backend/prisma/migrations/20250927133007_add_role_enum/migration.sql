/*
  Warnings:

  - The `status` column on the `Pet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'ADOTANTE');

-- CreateEnum
CREATE TYPE "public"."PetStatus" AS ENUM ('disponivel', 'adotado', 'reservado');

-- AlterTable
ALTER TABLE "public"."Pet" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PetStatus" NOT NULL DEFAULT 'disponivel';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'ADOTANTE';
