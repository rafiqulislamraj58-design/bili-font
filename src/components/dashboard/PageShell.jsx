import React from "react";


export default function PageShell({ title, subtitle, children }) {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}

export function Badge({ value }) {
  const getBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "librarian":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getBadgeStyle(
        value
      )}`}
    >
      {value || "user"}
    </span>
  );
}

export function TableSkeleton({ cols = 5 }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((row) => (
        <tr key={row} className="border-t border-slate-100 animate-pulse">
          {Array.from({ length: cols }).map((_, col) => (
            <td key={col} className="p-4">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}