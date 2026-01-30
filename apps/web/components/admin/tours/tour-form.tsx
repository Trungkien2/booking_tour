"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tourSchema, TourFormData } from "@/lib/validations/tour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tour } from "@/lib/api/admin/tours";

interface TourFormProps {
  initialData?: Tour | null;
  onSubmit: (data: TourFormData) => void;
  loading?: boolean;
}

export function TourForm({ initialData, onSubmit, loading }: TourFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
          priceAdult: Number(initialData.priceAdult),
          priceChild: Number(initialData.priceChild),
          coverImage: initialData.coverImage || "",
        }
      : {
          name: "",
          durationDays: 1,
          priceAdult: 0,
          priceChild: 0,
          status: "DRAFT",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tour Name
        </label>
        <Input {...register("name")} placeholder="e.g. Majestic Norway" />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <Input {...register("location")} placeholder="e.g. Bergen, Norway" />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
        )}
      </div>

      {/* Duration & Prices */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Days)
          </label>
          <Input type="number" {...register("durationDays")} />
          {errors.durationDays && (
            <p className="text-red-500 text-xs mt-1">
              {errors.durationDays.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adult Price
          </label>
          <Input type="number" step="0.01" {...register("priceAdult")} />
          {errors.priceAdult && (
            <p className="text-red-500 text-xs mt-1">
              {errors.priceAdult.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Child Price
          </label>
          <Input type="number" step="0.01" {...register("priceChild")} />
          {errors.priceChild && (
            <p className="text-red-500 text-xs mt-1">
              {errors.priceChild.message}
            </p>
          )}
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Image URL
        </label>
        <Input
          {...register("coverImage")}
          placeholder="https://example.com/image.jpg"
        />
        {errors.coverImage && (
          <p className="text-red-500 text-xs mt-1">
            {errors.coverImage.message}
          </p>
        )}
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Summary
        </label>
        <textarea
          {...register("summary")}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={3}
          placeholder="Brief description of the tour..."
        />
        {errors.summary && (
          <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Markdown)
        </label>
        <textarea
          {...register("description")}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={5}
          placeholder="Full details about the tour..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          {...register("status")}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Saving..." : initialData ? "Update Tour" : "Create Tour"}
        </Button>
      </div>
    </form>
  );
}
