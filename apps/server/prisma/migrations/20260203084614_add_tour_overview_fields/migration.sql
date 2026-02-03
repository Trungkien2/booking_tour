-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING');

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "difficulty" "Difficulty" DEFAULT 'EASY',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "review_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "tours_location_idx" ON "tours"("location");

-- CreateIndex
CREATE INDEX "tours_price_adult_idx" ON "tours"("price_adult");

-- CreateIndex
CREATE INDEX "tours_rating_average_idx" ON "tours"("rating_average");

-- CreateIndex
CREATE INDEX "tours_featured_idx" ON "tours"("featured");

-- CreateIndex
CREATE INDEX "tours_created_at_idx" ON "tours"("created_at");

-- CreateIndex
CREATE INDEX "tours_difficulty_idx" ON "tours"("difficulty");
