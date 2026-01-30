"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TourForm } from "@/components/admin/tours/tour-form";
import { createTour } from "@/lib/api/admin/tours";
import { TourFormData } from "@/lib/validations/tour";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // TODO: Get real token
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const handleSubmit = async (data: TourFormData) => {
    if (!token) return;
    setLoading(true);
    try {
      await createTour(data as any, token);
      router.push("/admin/tours");
    } catch (error) {
      console.error("Failed to create tour", error);
      alert("Failed to create tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/admin/tours"
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Tours
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Tour</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <TourForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
