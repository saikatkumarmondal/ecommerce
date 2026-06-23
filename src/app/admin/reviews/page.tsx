"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Trash2, Star } from "lucide-react";
import {
  useGetAdminReviewsQuery,
  useToggleReviewApprovalMutation,
  useDeleteAdminReviewMutation,
} from "@/services/adminReviewApi";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<"pending" | "approved">("pending");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetAdminReviewsQuery({
    status,
    page,
  });

  const [toggleApproval] = useToggleReviewApprovalMutation();
  const [deleteReview] = useDeleteAdminReviewMutation();

  const [deleteTarget, setDeleteTarget] = useState<{ id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  const handleToggle = async (id: string) => {
    await toggleApproval(id).unwrap();
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteReview(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      refetch();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Approve or reject customer reviews
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(["pending", "approved"] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
              status === s
                ? "bg-black text-white shadow-md"
                : "bg-white border hover:bg-gray-50 hover:shadow-sm"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white border rounded-2xl p-8 text-center text-sm text-gray-400 animate-pulse">
          Loading reviews...
        </div>
      ) : !reviews.length ? (
        <div className="bg-white border rounded-2xl p-12 text-center animate-in fade-in duration-300">
          <p className="text-gray-400 text-sm">No {status} reviews.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold break-words">
                      {review.user?.name}
                    </p>

                    <span className="text-xs text-gray-400 break-all">
                      {review.user?.email}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2 break-words">
                    on{" "}
                    <span className="font-medium text-gray-700">
                      {review.product?.name}
                    </span>
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 transition-colors ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm font-medium mb-0.5 break-words">
                    {review.title}
                  </p>

                  <p className="text-sm text-gray-500 break-words">
                    {review.comment}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 lg:flex-col xl:flex-row flex-shrink-0">
                  <button
                    onClick={() => handleToggle(review.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                      review.isApproved
                        ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {review.isApproved ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Unapprove
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setDeleteTarget({
                        id: review.id,
                      })
                    }
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
          >
            Prev
          </button>

          <span className="text-sm text-gray-500 text-center">
            Page {meta.page} of {meta.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.totalPages}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Review"
        message="Are you sure you want to delete this review? This cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}