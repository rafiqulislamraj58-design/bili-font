
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setError("Book ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://backedn-bsaf.onrender.com/books/${bookId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch book");
        }

        setBook(data.book || data);
      } catch (error) {
        console.error("Payment page error:", error);
        setError(error.message || "Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleCheckout = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!bookId) {
      setError("Book ID is missing");
      return;
    }

    if (totalAmount <= 0) {
      setError("Payment amount is not available for this book");
      return;
    }

    try {
      setError("");
      setPaymentLoading(true);

      const response = await fetch(
        "https://backedn-bsaf.onrender.com/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId,
            customerEmail: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create payment session"
        );
      }

      if (!data.checkoutUrl) {
        throw new Error("Stripe checkout URL not found");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error.message || "Payment could not be started");
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading payment details...</span>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-3 text-slate-500">
            {error || "Book information could not be loaded."}
          </p>

          <Link
            href="/browse-books"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Link>
        </div>
      </main>
    );
  }

  const bookTitle = book.title || "Untitled Book";
  const authorName = book.author || "Unknown Author";
  const category = book.category || "Unknown Category";
  const image = book.image || "/placeholder-book.jpg";

  const bookPrice = Number(book.price || 0);
  const deliveryFee = Number(book.deliveryFee || 0);
  const totalAmount = bookPrice + deliveryFee;

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/browse-books/${book._id}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Book
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-2 text-slate-500">
            Review your order details and continue securely with Stripe.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <BookOpen className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Order Information
                </h2>

                <p className="text-sm text-slate-500">
                  Your selected book
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-5 rounded-2xl bg-slate-50 p-4">
              <img
                src={image}
                alt={bookTitle}
                className="h-32 w-24 rounded-xl object-cover shadow-sm"
              />

              <div className="flex-1">
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {category}
                </span>

                <h3 className="mt-3 text-xl font-bold text-slate-900">
                  {bookTitle}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  By {authorName}
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  ৳{bookPrice}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <p className="mt-2 text-xs text-slate-500">
                Your payment receipt will be associated with this email.
              </p>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-slate-700" />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Secure Payment
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Powered by Stripe
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-slate-700" />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Book Delivery
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Delivery included
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-600">
                  Book Price
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  ৳{bookPrice}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-600">
                  Delivery Fee
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  ৳{deliveryFee}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-slate-900">
                    ৳{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={paymentLoading || totalAmount <= 0}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting to Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay ৳{totalAmount}
                </>
              )}
            </button>

            {totalAmount <= 0 && (
              <p className="mt-3 text-center text-xs font-medium text-red-500">
                Payment amount is not available for this book.
              </p>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />

              <p className="text-xs leading-5 text-slate-500">
                You will be redirected to Stripe&apos;s secure checkout
                page to complete your payment.
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              Secure checkout powered by Stripe
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

