
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Pencil,
  Trash2,
  EyeOff,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";

const Page = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://backedn-bsaf.onrender.com/books", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      const booksData = Array.isArray(data)
        ? data
        : Array.isArray(data.books)
          ? data.books
          : [];

      setBooks(booksData);
    } catch (error) {
      console.error("Fetch books error:", error);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(bookId);

      const response = await fetch(
        `https://backedn-bsaf.onrender.com/books/${bookId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== bookId)
      );

      alert("Book deleted successfully");
    } catch (error) {
      console.error("Delete book error:", error);
      alert(error.message || "Failed to delete book");
    } finally {
      setActionLoading("");
    }
  };

  const handleUnpublish = async (bookId) => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(bookId);

      const response = await fetch(
        `https://backedn-bsaf.onrender.com/books/${bookId}/unpublish`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to unpublish book"
        );
      }

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book._id === bookId
            ? {
                ...book,
                status: "unpublished",
              }
            : book
        )
      );

      alert("Book unpublished successfully");
    } catch (error) {
      console.error("Unpublish book error:", error);
      alert(error.message || "Failed to unpublish book");
    } finally {
      setActionLoading("");
    }
  };

  const getStatus = (status) => {
    const normalizedStatus = String(status || "")
      .toLowerCase()
      .replaceAll("_", " ");

    if (
      normalizedStatus === "pending" ||
      normalizedStatus === "pending approval"
    ) {
      return {
        label: "Pending Approval",
        className:
          "border border-amber-200 bg-amber-50 text-amber-700",
      };
    }

    if (
      normalizedStatus === "published" ||
      normalizedStatus === "approved"
    ) {
      return {
        label: "Published",
        className:
          "border border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    }

    if (normalizedStatus === "unpublished") {
      return {
        label: "Unpublished",
        className:
          "border border-slate-200 bg-slate-100 text-slate-600",
      };
    }

    return {
      label: status || "Unknown",
      className:
        "border border-red-200 bg-red-50 text-red-600",
    };
  };

  const totalBooks = books.length;

  const publishedBooks = books.filter((book) => {
    const status = String(book.status || "").toLowerCase();

    return status === "published" || status === "approved";
  }).length;

  const pendingBooks = books.filter((book) => {
    const status = String(book.status || "").toLowerCase();

    return (
      status === "pending" ||
      status === "pending approval"
    );
  }).length;

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="text-sm text-slate-500">
            Loading your inventory...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-red-700">
            Failed to Load Inventory
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchBooks}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Manage Inventory
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your books and inventory status
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add New Book
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Books
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalBooks}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {publishedBooks}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Approval
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {pendingBooks}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Your Books
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage books added to your inventory.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Book
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Author
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Delivery Fee
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {books.length > 0 ? (
                  books.map((book) => {
                    const statusInfo = getStatus(book.status);

                    const normalizedStatus = String(
                      book.status || ""
                    )
                      .toLowerCase()
                      .replaceAll("_", " ");

                    const isPublished =
                      normalizedStatus === "published" ||
                      normalizedStatus === "approved";

                    return (
                      <tr
                        key={book._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                book.image ||
                                "https://placehold.co/80x110?text=Book"
                              }
                              alt={
                                book.title || "Book cover"
                              }
                              className="h-16 w-12 rounded-lg border border-slate-200 object-cover"
                              onError={(event) => {
                                event.currentTarget.src =
                                  "https://placehold.co/80x110?text=Book";
                              }}
                            />

                            <div className="max-w-[260px]">
                              <p className="line-clamp-2 font-semibold text-slate-900">
                                {book.title ||
                                  "Untitled Book"}
                              </p>

                              <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                {book.publisherName ||
                                  "BiblioDrop"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {book.author ||
                              book.authorName ||
                              "Unknown Author"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {book.category || "N/A"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-900">
                            ৳
                            {book.deliveryFee ??
                              book.price ??
                              0}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/dashboard/librarian/edit-book/${book._id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>

                            {isPublished && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUnpublish(
                                    book._id
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  book._id
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {actionLoading ===
                                book._id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <EyeOff className="h-3.5 w-3.5" />
                                )}

                                Unpublish
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  book._id
                                )
                              }
                              disabled={
                                actionLoading ===
                                book._id
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionLoading ===
                              book._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}

                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                          <BookOpen className="h-7 w-7 text-slate-400" />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                          No books found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          You have not added any books
                          to your inventory yet.
                        </p>

                        <Link
                          href="/dashboard/librarian/add-book"
                          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Your First Book
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

