"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getTours,
  updateTour,
  deleteTour,
  Tour,
  TourListResponse,
  TourQueryParams,
} from "@/lib/api/admin/tours";
import { TourStatisticsSection } from "@/components/admin/tours/tour-statistics";
import { TourFilters } from "@/components/admin/tours/tour-filters";
import { TourTable } from "@/components/admin/tours/tour-table";
import { TourEditPanel } from "@/components/admin/tours/tour-edit-panel";
import { TourDeleteDialog } from "@/components/admin/tours/tour-delete-dialog";
import { TourFormData } from "@/lib/validations/tour";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [meta, setMeta] = useState<TourListResponse["meta"]>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState<TourQueryParams>({
    page: 1,
    limit: 10,
  });

  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // TODO: Get real token
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchTours = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getTours(queryParams, token);
      setTours(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error("Failed to fetch tours", error);
    } finally {
      setLoading(false);
    }
  }, [queryParams, token]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleSearchChange = (search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setQueryParams((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (tour: Tour) => {
    setSelectedTour(tour);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: TourFormData) => {
    if (!selectedTour || !token) return;
    setActionLoading(true);
    try {
      await updateTour(selectedTour.id, data, token);
      setIsEditOpen(false);
      fetchTours();
    } catch (error) {
      console.error("Failed to update tour", error);
      alert("Failed to update tour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTour || !token) return;
    setActionLoading(true);
    try {
      await deleteTour(selectedTour.id, token);
      setIsDeleteOpen(false);
      fetchTours();
    } catch (error) {
      console.error("Failed to delete tour", error);
      alert("Failed to delete tour. Check if there are active bookings.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Management</h1>
          <p className="text-gray-500 mt-1">
            Manage listings, inventory, and pricing details.
          </p>
        </div>
        <Link href="/admin/tours/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New Tour
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <TourStatisticsSection />

      {/* Filters */}
      <TourFilters
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      {/* Table */}
      <TourTable
        tours={tours}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Pagination (Simple implementation) */}
      <div className="flex justify-between items-center bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div className="text-sm text-gray-700">
          Page {meta.page} of {meta.totalPages || 1} ({meta.total} items)
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() =>
              setQueryParams((prev) => ({
                ...prev,
                page: (prev.page || 1) - 1,
              }))
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() =>
              setQueryParams((prev) => ({
                ...prev,
                page: (prev.page || 1) + 1,
              }))
            }
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <TourEditPanel
        tour={selectedTour}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        loading={actionLoading}
      />

      <TourDeleteDialog
        tour={selectedTour}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </div>
  );
}
