
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  User,
  Tag,
  Truck,
  Loader2,
  AlertCircle,
  Building2,
  DollarSign,
} from "lucide-react";

const API_URL = "https://backedn-bsaf.onrender.com/books";

export default function BookDetailsPage() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const getBookDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch book details"
          );
        }

        const bookData = data.book || data.data || data;

        if (
          !bookData ||
          typeof bookData !== "object" ||
          Array.isArray(bookData) ||
          !bookData._id
        ) {
          throw new Error("Book not found or invalid API response");
        }

        setBook(bookData);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Book details error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getBookDetails();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading book details...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

          <h1 className="mb-2 text-xl font-bold text-slate-900">
            Failed to Load Book
          </h1>

          <p className="mb-6 text-slate-600">{error}</p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
            >
              Try Again
            </button>

            <Link
              href="/browse-books"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-800 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Books
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            Book Not Found
          </h1>

          <Link
            href="/browse-books"
            className="text-blue-600 hover:underline"
          >
            Back to Browse Books
          </Link>
        </div>
      </main>
    );
  }

  const bookTitle = book.title || "Untitled Book";
  const authorName = book.authorName || "Unknown Author";
  const publisherName = book.publisherName || "Unknown Publisher";
  const bookPrice = book.price ?? 0;
  const category = book.category || "Unknown Category";
  const status = book.status || "Unknown";
  const description = book.description || "No description available.";

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/browse-books"
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Browse Books
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex min-h-[400px] items-center justify-center bg-slate-100 p-8 lg:min-h-[500px]">
              {book.image ? (
                <img
                  src={book.image}
                  alt={bookTitle}
                  className="max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-md"
                />
              ) : (
                <div className="text-center text-slate-500">
                  <BookOpen className="mx-auto mb-3 h-16 w-16" />
                  <p>No book image available</p>
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                  <Tag className="h-4 w-4" />
                  {category}
                </span>

                <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium capitalize text-amber-700">
                  {status}
                </span>
              </div>

              <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
                {bookTitle}
              </h1>

              <div className="mb-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <User className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Author</p>
                    <p className="font-medium text-slate-900">
                      {authorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Building2 className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Publisher</p>
                    <p className="font-medium text-slate-900">
                      {publisherName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <DollarSign className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Book Price</p>
                    <p className="font-semibold text-slate-900">
                      ৳{bookPrice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Truck className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Delivery</p>
                    <p className="font-medium text-slate-900">
                      Available
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-7">
                <div className="mb-4 flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-slate-700" />

                  <h2 className="text-lg font-bold text-slate-900">
                    About This Book
                  </h2>
                </div>

                <p className="leading-7 text-slate-600">
                  {description}
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href={`/payment?bookId=${book._id}`}
                  className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700"
                >
                  Order This Book
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}