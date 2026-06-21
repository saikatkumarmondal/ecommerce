"use client";

import { useState } from "react";
import { Edit2, Trash2, ImageOff } from "lucide-react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/services/productApi";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

interface ProductTableProps {
  onEdit: (product: any) => void;
  page: number;
  onPageChange: (page: number) => void;
}

export function ProductTable({
  onEdit,
  page,
  onPageChange,
}: ProductTableProps) {
  const { data, isLoading } = useGetProductsQuery({
    page,
    limit: 10,
  } as any);

  const [deleteProduct] = useDeleteProductMutation();

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [deleting, setDeleting] = useState(false);

  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteProduct(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border rounded-2xl p-8 text-center text-sm text-gray-400">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-white border rounded-2xl p-12 text-center">
        <p className="text-gray-400 text-sm">
          No products yet. Create your first one.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0">
        {/* Desktop / Tablet */}
        <div className="hidden md:block w-full min-w-0 bg-white border rounded-2xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm min-w-[900px] lg:min-w-full">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium w-[80px]">Image</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">SKU</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.map((p: any) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      {p.images?.[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageOff className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3.5 font-medium max-w-[180px] lg:max-w-[260px] truncate">
                      {p.name}
                    </td>

                    <td className="px-5 py-3.5 text-gray-500">
                      {p.sku || "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="font-semibold">
                        ${p.discountPrice ?? p.price}
                      </span>

                      {p.discountPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">
                          ${p.price}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.stock} available
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-gray-500">
                      {p.category?.name ?? "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(p)}
                          className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: p.id,
                              name: p.name,
                            })
                          }
                          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          {products.map((p: any) => (
            <div
              key={p.id}
              className="bg-white border rounded-2xl p-3 sm:p-4 flex items-start gap-3 shadow-sm w-full"
            >
              {p.images?.[0]?.url ? (
                <img
                  src={p.images[0].url}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <ImageOff className="w-5 h-5 text-gray-300" />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 break-words line-clamp-2 text-sm sm:text-base">
                    {p.name}
                  </p>

                  <div className="flex flex-shrink-0 gap-0.5">
                    <button
                      onClick={() => onEdit(p)}
                      className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        setDeleteTarget({
                          id: p.id,
                          name: p.name,
                        })
                      }
                      className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 font-mono">
                  {p.sku || "No SKU"}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-gray-900">
                      ${p.discountPrice ?? p.price}
                    </span>

                    {p.discountPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${p.price}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {p.category?.name ?? "General"}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.stock > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      Stock: {p.stock}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 px-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 sm:px-4 py-2 rounded-xl border bg-white text-sm font-medium text-gray-700 shadow-sm disabled:opacity-40 disabled:bg-gray-50"
            >
              Prev
            </button>

            <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= meta.totalPages}
              className="px-3 sm:px-4 py-2 rounded-xl border bg-white text-sm font-medium text-gray-700 shadow-sm disabled:opacity-40 disabled:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}