"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-100">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-slate-500">
          Your payment was cancelled. You can try again anytime.
        </p>

        <Link
          href="/browse-books"
          className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Books
        </Link>
      </div>
    </main>
  );
}