
"use client";

import {
  BookOpen,
  DollarSign,
  Truck,
  Users,
  Plus,
  ArrowUpRight,
  Clock,
} from "lucide-react";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const stats = [
  {
    title: "Total Books",
    value: "24",
    change: "+12%",
    icon: BookOpen,
  },
  {
    title: "Total Earnings",
    value: "₹12,450",
    change: "+18%",
    icon: DollarSign,
  },
  {
    title: "Pending Requests",
    value: "08",
    change: "+4%",
    icon: Clock,
  },
  {
    title: "Completed Deliveries",
    value: "36",
    change: "+24%",
    icon: Truck,
  },
];

const deliveries = [
  {
    book: "The Great Gatsby",
    customer: "Rahim Ahmed",
    date: "Sep 28, 2026",
    status: "Pending",
  },
  {
    book: "Atomic Habits",
    customer: "Nusrat Jahan",
    date: "Sep 27, 2026",
    status: "Dispatched",
  },
  {
    book: "Clean Code",
    customer: "Sakib Hasan",
    date: "Sep 26, 2026",
    status: "Delivered",
  },
  {
    book: "Rich Dad Poor Dad",
    customer: "Tanvir Hossain",
    date: "Sep 25, 2026",
    status: "Delivered",
  },
];

const popularBooks = [
  {
    title: "Atomic Habits",
    category: "Self Development",
    requests: 18,
  },
  {
    title: "Clean Code",
    category: "Programming",
    requests: 14,
  },
  {
    title: "The Great Gatsby",
    category: "Fiction",
    requests: 11,
  },
];

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Dispatched: "bg-blue-50 text-blue-700 border-blue-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

export default function LibrarianDashboard() {


  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const user = session?.user;


  const userName = user?.name || "Librarian";
  const userEmail = user?.email || "";
  const userRole = user?.role || "librarian";

  // First letter for avatar
  const userInitial =
    userName?.charAt(0)?.toUpperCase() || "L";

  return (
    <div className="min-h-screen bg-[#f7f8f5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">


        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#6b7280]">
              Librarian Dashboard
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#17211b] sm:text-3xl">
              {isPending
                ? "Good evening 👋"
                : `Good evening, ${userName} 👋`}
            </h1>

            <p className="mt-2 text-sm text-[#6b7280]">
              Here&apos;s what&apos;s happening with your books today.
            </p>

            {/* Logged User Info */}
            {!isPending && user && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#7b817c]">
                <span>{userEmail}</span>

                <span className="rounded-full bg-[#eaf1e9] px-2.5 py-1 font-medium capitalize text-[#355b3e]">
                  {userRole}
                </span>
              </div>
            )}
          </div>

          <Link
            href="/dashboard/librarian/books/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#243b2b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b2e21]"
          >
            <Plus size={18} />
            Add New Book
          </Link>
        </div>


        {!isPending && user && (
          <div className="mb-6 rounded-2xl border border-[#e5e8e2] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              
              {/* Avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf1e9] text-xl font-bold text-[#355b3e]">
                {userInitial}
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-[#17211b]">
                  {userName}
                </p>

                <p className="mt-1 text-sm text-[#7b817c]">
                  {userEmail}
                </p>

                <p className="mt-1 text-xs capitalize text-[#9aa19b]">
                  Account role: {userRole}
                </p>
              </div>

              <Link
                href="/dashboard/librarian/profile"
                className="rounded-xl border border-[#dfe5dd] px-4 py-2.5 text-sm font-semibold text-[#355b3e] transition hover:bg-[#f3f6f1]"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}


        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#e5e8e2] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#737a74]">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#17211b]">
                      {stat.value}
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ed] text-[#355b3e]">
                    <Icon size={21} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <ArrowUpRight size={14} />

                  {stat.change}

                  <span className="ml-1 text-[#8a908b]">
                    from last month
                  </span>
                </div>
              </div>
            );
          })}
        </div>


        <div className="mt-6 grid gap-6 lg:grid-cols-3">


          <div className="rounded-2xl border border-[#e5e8e2] bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#17211b]">
                  Delivery Overview
                </h2>

                <p className="mt-1 text-sm text-[#7b817c]">
                  Your delivery activity over the last 7 days
                </p>
              </div>

              <select className="rounded-lg border border-[#e1e4df] bg-white px-3 py-2 text-sm text-[#4b534d] outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>


            <div className="mt-8 flex h-64 items-end gap-3 border-b border-[#edf0eb] px-2 pb-0">
              {[35, 55, 42, 72, 50, 85, 65, 92, 70, 78, 58, 88].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full rounded-t-lg bg-[#355b3e] opacity-80 transition group-hover:opacity-100"
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-3 flex justify-between text-xs text-[#8a908b]">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>


          <div className="rounded-2xl border border-[#e5e8e2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#17211b]">
                  Popular Books
                </h2>

                <p className="mt-1 text-sm text-[#7b817c]">
                  Most requested books
                </p>
              </div>

              <BookOpen
                size={20}
                className="text-[#58725e]"
              />
            </div>

            <div className="mt-6 space-y-4">
              {popularBooks.map((book, index) => (
                <div
                  key={book.title}
                  className="flex items-center gap-4 rounded-xl border border-[#edf0eb] p-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eef4ed] text-sm font-bold text-[#355b3e]">
                    0{index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-[#202721]">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#858b86]">
                      {book.category}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#355b3e]">
                    {book.requests}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="mt-6 rounded-2xl border border-[#e5e8e2] bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-[#edf0eb] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#17211b]">
                Recent Delivery Requests
              </h2>

              <p className="mt-1 text-sm text-[#7b817c]">
                Manage your latest customer requests.
              </p>
            </div>

            <Link
              href="/dashboard/librarian/deliveries"
              className="text-sm font-semibold text-[#355b3e] hover:underline"
            >
              View all
            </Link>
          </div>


          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#edf0eb] text-left text-xs uppercase tracking-wider text-[#8a908b]">
                  <th className="px-6 py-4 font-medium">
                    Book
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Customer
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {deliveries.map((delivery) => (
                  <tr
                    key={`${delivery.book}-${delivery.customer}`}
                    className="border-b border-[#f0f2ef] last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef4ed]">
                          <BookOpen
                            size={18}
                            className="text-[#355b3e]"
                          />
                        </div>

                        <span className="text-sm font-semibold text-[#202721]">
                          {delivery.book}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#59615b]">
                      {delivery.customer}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#59615b]">
                      {delivery.date}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={delivery.status}
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/dashboard/librarian/deliveries"
                        className="text-sm font-semibold text-[#355b3e] hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="space-y-3 p-4 md:hidden">
            {deliveries.map((delivery) => (
              <div
                key={`${delivery.book}-${delivery.customer}-mobile`}
                className="rounded-xl border border-[#edf0eb] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#202721]">
                      {delivery.book}
                    </h3>

                    <p className="mt-1 text-xs text-[#7d847e]">
                      {delivery.customer}
                    </p>
                  </div>

                  <StatusBadge
                    status={delivery.status}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#858b86]">
                    {delivery.date}
                  </span>

                  <Link
                    href="/dashboard/librarian/deliveries"
                    className="text-xs font-semibold text-[#355b3e]"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <Link
            href="/dashboard/librarian/books/add"
            className="group rounded-2xl border border-[#dfe5dd] bg-[#eef4ed] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <Plus
              size={21}
              className="text-[#355b3e]"
            />

            <h3 className="mt-4 font-semibold text-[#203024]">
              Add New Book
            </h3>

            <p className="mt-1 text-sm text-[#687269]">
              Add a new book to your inventory.
            </p>
          </Link>

          <Link
            href="/dashboard/librarian/deliveries"
            className="group rounded-2xl border border-[#e5e8e2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <Truck
              size={21}
              className="text-[#355b3e]"
            />

            <h3 className="mt-4 font-semibold text-[#203024]">
              Manage Deliveries
            </h3>

            <p className="mt-1 text-sm text-[#687269]">
              Update pending delivery requests.
            </p>
          </Link>

          <Link
            href="/dashboard/librarian/customers"
            className="group rounded-2xl border border-[#e5e8e2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <Users
              size={21}
              className="text-[#355b3e]"
            />

            <h3 className="mt-4 font-semibold text-[#203024]">
              View Customers
            </h3>

            <p className="mt-1 text-sm text-[#687269]">
              Review your recent customers.
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}

