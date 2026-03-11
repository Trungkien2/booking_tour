"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { deleteMyAccount } from "@/lib/api/users";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteMyAccount(password);
      clearAuth();
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete account",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete Account
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          This action cannot be undone. Your account will be deactivated and you
          will lose access to all your bookings and data. Please enter your
          password to confirm.
        </p>

        <div className="mb-4">
          <label
            htmlFor="delete-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Current Password
          </label>
          <input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || !password.trim()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
