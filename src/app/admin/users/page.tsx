"use client";

import { useState } from "react";
import { Mail, ShieldCheck, ShieldOff, Calendar } from "lucide-react";
import { useGetUsersQuery } from "@/services/userApi";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetUsersQuery({ page, limit: 12 });

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Users</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All registered users
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white border rounded-2xl p-6 sm:p-8 text-center text-sm text-gray-400">
          Loading users...
        </div>
      ) : !users.length ? (
        <div className="bg-white border rounded-2xl p-8 sm:p-12 text-center">
          <p className="text-gray-400 text-sm">No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Table */}
          <div className="hidden sm:block bg-white border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 sm:px-5 py-3 font-medium">
                      Name
                    </th>
                    <th className="px-4 sm:px-5 py-3 font-medium">
                      Email
                    </th>
                    <th className="px-4 sm:px-5 py-3 font-medium">
                      Role
                    </th>
                    <th className="px-4 sm:px-5 py-3 font-medium">
                      Verified
                    </th>
                    <th className="px-4 sm:px-5 py-3 font-medium">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-3 font-medium">
                        {u.name}
                      </td>

                      <td className="px-4 sm:px-5 py-3 text-gray-500">
                        {u.email}
                      </td>

                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-4 sm:px-5 py-3">
                        {u.isEmailVerified ? (
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <ShieldOff className="w-4 h-4 text-gray-300" />
                        )}
                      </td>

                      <td className="px-4 sm:px-5 py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white border rounded-2xl p-4"
              >
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-3">
                  <p className="font-medium break-words">
                    {u.name}
                  </p>

                  <span
                    className={`w-fit px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>


                <div className="flex items-start gap-2 text-xs text-gray-500 mb-2 break-all">
                  <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{u.email}</span>
                </div>


                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>


          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>

              <span className="text-sm text-gray-500 whitespace-nowrap">
                Page {meta.page} of {meta.totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.totalPages}
                className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}