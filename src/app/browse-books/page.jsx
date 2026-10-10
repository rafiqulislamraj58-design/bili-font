
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = "https://backedn-bsaf.onrender.com/books";
const PAGE_SIZE = 8;

const Page = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        const bookList = Array.isArray(data)
          ? data
          : Array.isArray(data.books)
            ? data.books
            : [];

        setBooks(bookList);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Books fetch error:", err);
          setError("Failed to load books. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        books.map((book) => book.category?.trim()).filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = books.filter((book) => {
      const searchableFields = [
        book.title,
        book.authorName,
        book.description,
        book.category,
      ];

      const matchesSearch = searchableFields.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesCategory =
        category === "all" || book.category?.trim() === category;

      const price = Number(book.price) || 0;

      const matchesMinPrice =
        minPrice === "" || price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""))
      );
    }

    return result;
  }, [books, search, category, sortBy, minPrice, maxPrice]);

  const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredBooks.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredBooks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("default");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "all" ||
    sortBy !== "default" ||
    minPrice !== "" ||
    maxPrice !== "";

  const startItem =
    filteredBooks.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredBooks.length
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-700">
            Loading books...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-black">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-slate-700">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            Explore Books
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Browse Books
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
            Discover your next favorite book from our growing collection.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            {filteredBooks.length} of {books.length} books available
          </div>
        </header>

        {/* Search and Filters */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-black">
                Search & Filters
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Find books by title, author, category or price.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:self-auto"
              >
                Reset all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label
                htmlFor="book-search"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Search Books
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 shrink-0 text-slate-600"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  id="book-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title, author, description..."
                  className="min-w-0 w-full bg-transparent py-3.5 text-sm font-medium text-black outline-none placeholder:font-normal placeholder:text-slate-500"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="shrink-0 rounded-md px-2 py-1 text-lg text-slate-600 hover:bg-slate-100"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="book-category"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Category
              </label>

              <select
                id="book-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label
                htmlFor="book-sort"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Sort By
              </label>

              <select
                id="book-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title: A to Z</option>
              </select>
            </div>
          </div>

          {/* Price Filters */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="min-price"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Minimum Price (৳)
              </label>

              <input
                id="min-price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Enter minimum price"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition placeholder:font-normal placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="max-price"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Maximum Price (৳)
              </label>

              <input
                id="max-price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter maximum price"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition placeholder:font-normal placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <p className="text-sm text-slate-700">
              Showing{" "}
              <span className="font-bold text-black">
                {startItem}-{endItem}
              </span>{" "}
              of{" "}
              <span className="font-bold text-black">
                {filteredBooks.length}
              </span>{" "}
              books
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-100"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* Empty States */}
        {books.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
            <h2 className="text-xl font-bold text-black">
              No books available
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              There are no books in the collection yet.
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7 text-slate-600"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-black">
              No matching books found
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Try another keyword, category or price range.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Book Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedBooks.map((book) => (
                <article
                  key={book._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100 sm:h-72">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title || "Book"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500">
                        No image available
                      </div>
                    )}

                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-sm">
                        {book.category || "Unknown"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {book.category || "Unknown Category"}
                    </p>

                    <h2 className="mt-2 line-clamp-1 text-lg font-bold text-black">
                      {book.title || "Untitled Book"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      By {book.authorName || "Unknown Author"}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {book.description || "No description available."}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <div>
                        <p className="text-xs text-slate-500">
                          Book Price
                        </p>

                        <p className="text-xl font-extrabold text-black">
                          ৳{Number(book.price) || 0}
                        </p>
                      </div>

                      <Link
                        href={`/browse-books/${book._id}`}
                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Book pagination"
                className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:flex-row sm:px-6"
              >
                <p className="text-sm text-slate-700">
                  Page{" "}
                  <span className="font-bold text-black">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-black">
                    {totalPages}
                  </span>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={
                        currentPage === page ? "page" : undefined
                      }
                      className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition ${
                        currentPage === page
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-slate-300 bg-white text-black hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Page;
