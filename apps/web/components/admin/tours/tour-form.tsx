"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tourSchema, TourFormData } from "@/lib/validations/tour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tour } from "@/lib/api/admin/tours";
import { Plus, Trash2 } from "lucide-react";

interface TourFormProps {
  initialData?: Tour | null;
  onSubmit: (data: TourFormData) => void;
  loading?: boolean;
}

export function TourForm({ initialData, onSubmit, loading }: TourFormProps) {
  // Separate booked vs editable schedules for initial form state
  const bookedScheduleIndices = new Set<number>();
  const allSchedules = initialData?.schedules?.map((s, i) => {
    if (s.currentCapacity > 0) bookedScheduleIndices.add(i);
    return {
      startDate: s.startDate.split("T")[0],
      maxCapacity: s.maxCapacity,
    };
  }) || [];

  const handleFormSubmit = (data: TourFormData) => {
    // Filter out booked schedules before sending to backend
    // Backend preserves booked schedules, so we only send editable ones
    if (initialData?.schedules && data.schedules) {
      const editableSchedules = data.schedules.filter(
        (_, i) => !bookedScheduleIndices.has(i),
      );
      onSubmit({ ...data, schedules: editableSchedules });
    } else {
      onSubmit(data);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TourFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(tourSchema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
          priceAdult: Number(initialData.priceAdult),
          priceChild: Number(initialData.priceChild),
          coverImage: initialData.coverImage || "",
          schedules: allSchedules,
        }
      : {
          name: "",
          durationDays: 1,
          priceAdult: 0,
          priceChild: 0,
          status: "DRAFT",
          schedules: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });
  console.log("🚀 ~ TourForm ~ fields:", fields)

  const isScheduleReadOnly = (index: number) => bookedScheduleIndices.has(index);

  const getOriginalSchedule = (index: number) => {
    if (!initialData?.schedules) return null;
    return initialData.schedules[index] || null;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

      {/* Tour Schedules */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Tour Schedules
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ startDate: "", maxCapacity: 20 })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Schedule
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No schedules added. Click &quot;Add Schedule&quot; to add departure dates.
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const readOnly = isScheduleReadOnly(index);
            const original = getOriginalSchedule(index);

            return (
              <div
                key={field.id}
                className={`flex items-start gap-3 p-3 border rounded-md ${
                  readOnly ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                }`}
              >
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    {...register(`schedules.${index}.startDate`)}
                    disabled={readOnly}
                  />
                  {errors.schedules?.[index]?.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.schedules[index].startDate?.message}
                    </p>
                  )}
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Max Capacity
                  </label>
                  <Input
                    type="number"
                    {...register(`schedules.${index}.maxCapacity`)}
                    disabled={readOnly}
                  />
                  {errors.schedules?.[index]?.maxCapacity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.schedules[index].maxCapacity?.message}
                    </p>
                  )}
                </div>
                {readOnly ? (
                  <div className="pt-6">
                    <span className="text-xs text-gray-500">
                      {original?.currentCapacity}/{original?.maxCapacity} booked
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="pt-6 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
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
