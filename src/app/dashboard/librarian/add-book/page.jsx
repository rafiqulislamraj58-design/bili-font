
"use client";

import { useForm } from "react-hook-form";
import {
  BookOpen,
  User,
  DollarSign,
  Tag,
  ImagePlus,
  Upload,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function AddBook() {
  const router = useRouter();

  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      image: null,
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");

      event.target.value = "";

      return;
    }

    setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    setValue("image", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      if (!IMGBB_API_KEY) {
        throw new Error(
          "ImgBB API key is missing. Check your .env.local file."
        );
      }

      if (!data.image) {
        throw new Error("Please select a book cover");
      }

      const imageFormData = new FormData();

      imageFormData.append("image", data.image);

      const imageUploadUrl =
        "https://api.imgbb.com/1/upload?key=" +
        IMGBB_API_KEY;

      const imageResponse = await fetch(imageUploadUrl, {
        method: "POST",
        body: imageFormData,
      });

      const imageResult = await imageResponse.json();

      if (!imageResponse.ok || !imageResult.success) {
        console.error("ImgBB error:", imageResult);

        throw new Error(
          imageResult?.error?.message ||
            "Failed to upload book cover"
        );
      }

      const imageUrl = imageResult.data.url;

      console.log("ImgBB upload successful:", imageUrl);

      const bookData = {
        title: data.title.trim(),
        author: data.author.trim(),
        description: data.description.trim(),
        deliveryFee: Number(data.deliveryFee),
        category: data.category,
        image: imageUrl,
      };

      const booksApiUrl = API_URL + "/books";

      const response = await fetch(booksApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const contentType =
        response.headers.get("content-type");

      let result;

      if (contentType?.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          "Server returned " +
            response.status +
            ". " +
            text.slice(0, 150)
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to save book"
        );
      }

      alert("Book saved successfully!");

      router.push("/dashboard/books");
    } catch (error) {
      console.error("Add book error:", error);

      alert(
        error?.message ||
          "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Librarian Dashboard</span>
              <span>/</span>
              <span className="text-blue-600">
                Add Book
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Add New Book
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add a new book to your library inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Book Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the basic information about your book.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Book Title
                    </label>

                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Enter book title"
                        {...register("title", {
                          required:
                            "Book title is required",
                          minLength: {
                            value: 2,
                            message:
                              "Title must be at least 2 characters",
                          },
                        })}
                        className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.title
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                    </div>

                    {errors.title && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Author
                      </label>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          placeholder="Author name"
                          {...register("author", {
                            required:
                              "Author name is required",
                          })}
                          className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                            errors.author
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />
                      </div>

                      {errors.author && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.author.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Category
                      </label>

                      <div className="relative">
                        <Tag className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <select
                          {...register("category", {
                            required:
                              "Please select a category",
                          })}
                          className={`w-full appearance-none rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                            errors.category
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        >
                          <option value="">
                            Select category
                          </option>

                          {categories.map(
                            (category) => (
                              <option
                                key={category}
                                value={category}
                              >
                                {category}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {errors.category && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Delivery Fee
                    </label>

                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register("deliveryFee", {
                          required:
                            "Delivery fee is required",
                          min: {
                            value: 0,
                            message:
                              "Delivery fee cannot be negative",
                          },
                        })}
                        className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.deliveryFee
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                    </div>

                    {errors.deliveryFee && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.deliveryFee.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Description
                    </label>

                    <textarea
                      rows={6}
                      placeholder="Write a short description about this book..."
                      {...register("description", {
                        required:
                          "Book description is required",
                        minLength: {
                          value: 20,
                          message:
                            "Description must be at least 20 characters",
                        },
                      })}
                      className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.description
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />

                    {errors.description && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Book Cover
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload a high-quality image of the book cover.
                  </p>
                </div>

                {!preview ? (
                  <label className="group flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 transition hover:border-blue-400 hover:bg-blue-50/50">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:scale-105">
                      <ImagePlus className="h-7 w-7" />
                    </div>

                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload book cover
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PNG, JPG or JPEG up to 5MB
                    </p>

                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm">
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img
                      src={preview}
                      alt="Book cover preview"
                      className="mx-auto h-[300px] w-full object-contain p-4"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="border-t border-slate-200 bg-white px-4 py-3">
                      <p className="text-xs font-semibold text-green-600">
                        Image selected successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Submission
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your book will be reviewed by an admin before it becomes
                  publicly available.
                </p>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />

                    <div>
                      <p className="text-sm font-bold text-amber-800">
                        Pending Approval
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        After submission, an admin will review your book.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading & Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Submit Book
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900">
                  Required Information
                </h3>

                <div className="mt-4 space-y-3">
                  {[
                    "Book title",
                    "Author name",
                    "Category",
                    "Delivery fee",
                    "Description",
                    "Book cover",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                        ✓
                      </div>

                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
