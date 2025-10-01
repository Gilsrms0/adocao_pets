/*
  Warnings:

  - Added the required column `city` to the `AdoptionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `AdoptionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `AdoptionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `AdoptionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AdoptionRequest" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
