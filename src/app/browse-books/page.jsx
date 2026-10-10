"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Page = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://backedn-bsaf.onrender.com/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch (error) {
        console.error("Books fetch error:", error);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
          <p className="text-sm text-slate-500">
            Loading books...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-center">
          <h2 className="font-semibold text-red-700">
            Something went wrong
          </h2>

          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Explore Books
          </p>

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Browse Books
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Discover your next favorite book from our growing collection.
          </p>

          <div className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
            {books.length} Books Available
          </div>
        </div>

        {books.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
              No books available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are no books in the collection yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {books.map((book) => (
              <div
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="relative h-72 overflow-hidden bg-slate-100">
                  <img
                    src={book.image}
                    alt={book.title || "Book"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {book.category || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="p-5">

                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    {book.category || "Unknown Category"}
                  </p>

                  <h2 className="mt-2 line-clamp-1 text-lg font-bold text-slate-900">
                    {book.title || "Untitled Book"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    By {book.authorName || "Unknown Author"}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {book.description || "No description available."}
                  </p>

                  <div className="mt-5 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-slate-400">
                        Book Price
                      </p>

                      <p className="text-xl font-bold text-slate-900">
                        ৳{book.price || 0}
                      </p>
                    </div>

                    <Link
                      href={`/browse-books/${book._id}`}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      View Details
                    </Link>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
};

export default Page;