"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://backedn-bsaf.onrender.com/books"
        );

        const data = await response.json();

        const allBooks = Array.isArray(data)
          ? data
          : data.books || [];

        setBooks(allBooks.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-8 text-3xl font-bold text-white-900">
        Featured Books
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            <img
              src={book.image || "/book-placeholder.png"}
              alt={book.title || "Book"}
              className="h-56 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="line-clamp-2 font-bold text-slate-900">
                {book.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                By {book.authorName || book.author || "Unknown Author"}
              </p>

              <p className="mt-3 font-semibold text-orange-600">
                ৳{book.deliveryFee ?? 0} Delivery Fee
              </p>

              <Link
                href={`/browse-books/${book._id}`}
                className="mt-4 block rounded-lg bg-slate-900 px-3 py-2 text-center text-sm text-white hover:bg-orange-600"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBooks;

