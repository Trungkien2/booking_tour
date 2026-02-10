-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "helpful" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "cancellation_policy" TEXT,
ADD COLUMN     "coordinates" JSONB,
ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "included" JSONB,
ADD COLUMN     "itinerary" JSONB,
ADD COLUMN     "max_group_size" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "meeting_point" JSONB,
ADD COLUMN     "not_included" JSONB;

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_user_id_tour_id_key" ON "user_favorites"("user_id", "tour_id");

-- CreateIndex
CREATE INDEX "reviews_tour_id_idx" ON "reviews"("tour_id");

-- CreateIndex
CREATE INDEX "reviews_created_at_idx" ON "reviews"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
