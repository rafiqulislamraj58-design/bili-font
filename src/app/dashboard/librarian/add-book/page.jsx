
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  BookOpen,
  User,
  DollarSign,
  Tag,
  ImagePlus,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileImage,
  ShieldCheck,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://backedn-bsaf.onrender.com"
).replace(/\/+$/, "");

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const categories = [
  "Fiction",
  "Non-Fiction",
  "Academic",
  "Science",
  "Technology",
  "Programming",
  "Biography",
  "History",
  "Self-Help",
  "Children",
  "Romance",
  "Mystery",
  "Sci-Fi",
  "Other",
];

export default function AddBook() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const librarianEmail =
    session?.user?.email?.trim().toLowerCase() || "";

  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState({
    type: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      description: "",
      deliveryFee: "",
      category: "",
    },
  });

  useEffect(() => {
    if (!preview) return;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice({
        type: "error",
        message: "Please select a JPG, PNG, or WebP image.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice({
        type: "error",
        message: "Image size must be less than 5MB.",
      });
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setValue("image", file);
    setNotice({ type: "", message: "" });
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview("");
    setValue("image", null);

    const input = document.getElementById("book-cover-input");
    if (input) input.value = "";
  };

  const onSubmit = async (data) => {
    setNotice({ type: "", message: "" });

    try {
      if (isPending) {
        throw new Error("Please wait while checking your login session.");
      }

      if (!librarianEmail) {
        throw new Error("Please sign in again before adding a book.");
      }

      if (!IMGBB_API_KEY) {
        throw new Error("ImgBB API key is missing from .env.local.");
      }

      if (!selectedFile) {
        throw new Error("Please select a book cover image.");
      }

      setIsSubmitting(true);

      const sessionResponse = await authClient.getSession();
      const currentEmail =
        sessionResponse?.data?.user?.email?.trim().toLowerCase();

      if (!currentEmail) {
        throw new Error("Your login session has expired. Please sign in again.");
      }

      const jwtResponse = await fetch(`${API_URL}/jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: currentEmail }),
      });

      const jwtResult = await jwtResponse.json().catch(() => ({}));

      if (!jwtResponse.ok || jwtResult.success === false) {
        throw new Error(jwtResult.message || "Could not refresh login token.");
      }

      const imageFormData = new FormData();
      imageFormData.append("image", selectedFile);

      const imageResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(IMGBB_API_KEY)}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const imageResult = await imageResponse.json().catch(() => ({}));

      if (!imageResponse.ok || !imageResult.success) {
        throw new Error(
          imageResult?.error?.message || "Unable to upload the book cover."
        );
      }

      const bookData = {
        title: data.title.trim(),
        author: data.author.trim(),
        description: data.description.trim(),
        category: data.category,
        deliveryFee: Number(data.deliveryFee),
        image: imageResult.data.url,
        librarianEmail: currentEmail,
      };

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to save this book.");
      }

      setNotice({
        type: "success",
        message: "Book submitted successfully! It is pending approval.",
      });

      setTimeout(() => {
        router.push("/dashboard/books");
        router.refresh();
      }, 900);
    } catch (error) {
      console.error("Add book error:", error);

      setNotice({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Librarian Dashboard</span>
              <span>/</span>
              <span className="text-blue-600">Add Book</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Add a new book
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add your book details and submit it for admin approval.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft size={17} />
            Go back
          </button>
        </header>

        {isPending ? (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <Loader2 size={18} className="animate-spin" />
            Checking your login session...
          </div>
        ) : librarianEmail ? (
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 size={19} />
            <span>
              Logged in as <strong>{librarianEmail}</strong>
            </span>
          </div>
        ) : (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Login session not found</p>
              <p className="mt-1">
                Please sign in before adding a book.
              </p>
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="mt-3 rounded-lg bg-amber-900 px-4 py-2 font-semibold text-white"
              >
                Sign in
              </button>
            </div>
          </div>
        )}

        {notice.message && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {notice.type === "success" ? (
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
            )}
            <p>{notice.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Book information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Provide accurate details about your book.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass} htmlFor="book-title">
                      Book title *
                    </label>
                    <div className="relative">
                      <BookOpen
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="book-title"
                        {...register("title", {
                          required: "Book title is required.",
                          minLength: {
                            value: 2,
                            message: "Title must contain at least 2 characters.",
                          },
                        })}
                        placeholder="e.g. Clean Code"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                    {errors.title && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="book-author">
                        Author *
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="book-author"
                          {...register("author", {
                            required: "Author name is required.",
                          })}
                          placeholder="Author name"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                      {errors.author && (
                        <p className="mt-1.5 text-xs text-red-600">
                          {errors.author.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="book-category">
                        Category *
                      </label>
                      <div className="relative">
                        <Tag
                          size={18}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <select
                          id="book-category"
                          {...register("category", {
                            required: "Please select a category.",
                          })}
                          className={`${inputClass} pl-11`}
                        >
                          <option value="">Choose a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.category && (
                        <p className="mt-1.5 text-xs text-red-600">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="delivery-fee">
                      Delivery fee *
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="delivery-fee"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register("deliveryFee", {
                          required: "Delivery fee is required.",
                          valueAsNumber: true,
                          min: {
                            value: 0,
                            message: "Delivery fee cannot be negative.",
                          },
                          validate: (value) =>
                            Number.isFinite(value) ||
                            "Enter a valid delivery fee.",
                        })}
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                    {errors.deliveryFee && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.deliveryFee.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="book-description">
                      Description *
                    </label>
                    <textarea
                      id="book-description"
                      rows={6}
                      placeholder="What is this book about?"
                      {...register("description", {
                        required: "Description is required.",
                        minLength: {
                          value: 20,
                          message: "Please write at least 20 characters.",
                        },
                      })}
                      className={`${inputClass} resize-y`}
                    />
                    {errors.description && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Book cover
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    JPG, PNG or WebP. Maximum 5MB.
                  </p>
                </div>

                {!preview ? (
                  <label
                    htmlFor="book-cover-input"
                    className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <ImagePlus size={34} className="mb-4 text-blue-600" />
                    <p className="text-sm font-bold text-slate-800">
                      Click to upload your cover
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Select an image from your device.
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
                      <Upload size={16} />
                      Choose image
                    </span>
                    <input
                      id="book-cover-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="relative flex min-h-[300px] items-center justify-center bg-slate-100 p-5">
                      <img
                        src={preview}
                        alt="Selected book cover"
                        className="max-h-[340px] max-w-full rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        aria-label="Remove selected image"
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-md"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 border-t border-slate-200 bg-white p-4">
                      <FileImage size={22} className="text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {selectedFile?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {selectedFile
                            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                            : ""}
                        </p>
                      </div>
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Submission details
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your book will be reviewed by an admin before publication.
                </p>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-bold text-amber-900">
                    Pending approval
                  </p>
                  <p className="mt-2 text-xs leading-5 text-amber-800">
                    The book will be saved with pending status.
                  </p>
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ShieldCheck size={17} className="text-emerald-600" />
                    Review before publication
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={17} className="text-emerald-600" />
                    Saved to your inventory
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isPending || !librarianEmail}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Uploading book...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Submit book
                    </>
                  )}
                </button>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}