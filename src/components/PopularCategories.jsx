
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Fiction",
    description: "Discover stories that spark your imagination.",
    icon: "📖",
    books: "Stories & Novels",
    color: "bg-orange-100",
    textColor: "text-orange-600",
    hoverColor: "group-hover:bg-orange-500",
  },
  {
    id: 2,
    name: "Sci-Fi",
    description: "Explore futuristic worlds and endless possibilities.",
    icon: "🚀",
    books: "Science Fiction",
    color: "bg-violet-100",
    textColor: "text-violet-600",
    hoverColor: "group-hover:bg-violet-500",
  },
  {
    id: 3,
    name: "Academic",
    description: "Find resources to support your learning journey.",
    icon: "🎓",
    books: "Study Materials",
    color: "bg-blue-100",
    textColor: "text-blue-600",
    hoverColor: "group-hover:bg-blue-500",
  },
  {
    id: 4,
    name: "Science",
    description: "Understand the world through discovery and knowledge.",
    icon: "🔬",
    books: "Scientific Knowledge",
    color: "bg-emerald-100",
    textColor: "text-emerald-600",
    hoverColor: "group-hover:bg-emerald-500",
  },
  {
    id: 5,
    name: "Technology",
    description: "Explore innovation, coding, and the digital future.",
    icon: "💻",
    books: "Tech & Programming",
    color: "bg-cyan-100",
    textColor: "text-cyan-600",
    hoverColor: "group-hover:bg-cyan-500",
  },
  {
    id: 6,
    name: "Self Development",
    description: "Build better habits and become your best self.",
    icon: "🌱",
    books: "Personal Growth",
    color: "bg-rose-100",
    textColor: "text-rose-600",
    hoverColor: "group-hover:bg-rose-500",
  },
];

const PopularCategories = () => {
  return (
    <section className="w-full bg-[#FFFCF7] px-5 py-16 sm:px-8 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Explore Collections
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Popular Categories
              <span className="text-orange-500">.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Whatever your interests, find the right books to inspire your
              imagination, grow your knowledge, and explore new ideas.
            </p>
          </div>

          <Link
            href="/browse-books"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Browse All Books <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/browse-books?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition duration-300 group-hover:scale-110 ${category.color}`}
                >
                  {category.icon}
                </div>

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-lg text-slate-500 transition duration-300 group-hover:text-white ${category.hoverColor}`}
                >
                  ↗
                </span>
              </div>

              <h3 className="mt-6 text-xl font-extrabold text-slate-900 transition group-hover:text-orange-600">
                {category.name}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {category.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${category.textColor}`}
                >
                  {category.books}
                </span>

                <span className="text-sm font-semibold text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600">
                  Explore →
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 px-6 py-8 text-center sm:px-10 sm:py-10">
          <p className="text-sm font-medium text-orange-300">
            Your next favorite book is waiting
          </p>

          <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            A world of knowledge, one page at a time.
          </h3>

          <Link
            href="/browse-books"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
          >
            Discover Books <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;

