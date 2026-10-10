
import Image from "next/image";

const librarians = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Library Provider",
    deliveries: 320,
    avatar: "https://i.pravatar.cc/300?img=47",
  },
  {
    id: 2,
    name: "Tanvir Ahmed",
    role: "Librarian",
    deliveries: 285,
    avatar: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Library Provider",
    deliveries: 240,
    avatar: "https://i.pravatar.cc/300?img=44",
  },
];

const TopLibrarians = () => {
  return (
    <section className="bg-white px-5 w-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            Our Trusted Providers
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Top Librarians
            <span className="text-orange-500">.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            Meet the dedicated library providers helping readers discover
            and receive their favorite books.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {librarians.map((librarian) => (
            <div
              key={librarian.id}
              className="group rounded-2xl border border-slate-100 bg-[#FFFCF7] p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl"
            >
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md ring-2 ring-orange-100 transition group-hover:ring-orange-400">
                <Image
                  src={librarian.avatar}
                  alt={librarian.name}
                  width={112}
                  height={112}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {librarian.name}
              </h3>

              <p className="mt-2 text-sm font-medium text-orange-600">
                {librarian.role}
              </p>

              <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-xl">
                  📚
                </span>

                <div className="text-left">
                  <p className="text-lg font-extrabold text-slate-900">
                    {librarian.deliveries}+
                  </p>

                  <p className="text-xs text-slate-500">
                    Completed Deliveries
                  </p>
                </div>
              </div>

              <div className="mt-6 h-1 w-12 rounded-full bg-orange-500 transition-all group-hover:w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopLibrarians;
