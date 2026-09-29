
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ImagePlus,
  Upload,
  X,
  Save,
} from "lucide-react";

export default function AddBookPage() {
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    deliveryFee: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("You can upload maximum 5 images.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];

      URL.revokeObjectURL(updated[index].preview);

      updated.splice(index, 1);

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Book Data:", {
      ...formData,
      images,
    });

   
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <Link
            href="/dashboard/librarian"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#687269] transition hover:text-[#355b3e]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17211b] sm:text-3xl">
              Add New Book
            </h1>

            <p className="mt-2 text-sm text-[#6f7771]">
              Add a new book to your library inventory.
            </p>
          </div>
        </div>


        <form onSubmit={handleSubmit}>


          <div className="rounded-2xl border border-[#e5e8e2] bg-white shadow-sm">

            <div className="border-b border-[#edf0eb] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ed] text-[#355b3e]">
                  <BookOpen size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#17211b]">
                    Book Information
                  </h2>

                  <p className="mt-1 text-xs text-[#858b86]">
                    Enter the basic information about your book.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">

              {/* Title */}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-[#303831]"
                >
                  Book Title
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                  className="w-full rounded-xl border border-[#dfe4dd] bg-white px-4 py-3 text-sm text-[#202721] outline-none transition placeholder:text-[#a0a6a1] focus:border-[#355b3e] focus:ring-2 focus:ring-[#355b3e]/10"
                />
              </div>

              {/* Author */}

              <div>
                <label
                  htmlFor="author"
                  className="mb-2 block text-sm font-medium text-[#303831]"
                >
                  Author
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                  className="w-full rounded-xl border border-[#dfe4dd] bg-white px-4 py-3 text-sm text-[#202721] outline-none transition placeholder:text-[#a0a6a1] focus:border-[#355b3e] focus:ring-2 focus:ring-[#355b3e]/10"
                />
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-[#303831]"
                >
                  Category
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#dfe4dd] bg-white px-4 py-3 text-sm text-[#202721] outline-none transition focus:border-[#355b3e] focus:ring-2 focus:ring-[#355b3e]/10"
                >
                  <option value="">Select category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Programming">Programming</option>
                  <option value="Self Development">
                    Self Development
                  </option>
                  <option value="Academic">Academic</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Biography">Biography</option>
                  <option value="Science">Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Delivery Fee */}

              <div>
                <label
                  htmlFor="deliveryFee"
                  className="mb-2 block text-sm font-medium text-[#303831]"
                >
                  Delivery Fee
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#687269]">
                    ₹
                  </span>

                  <input
                    id="deliveryFee"
                    name="deliveryFee"
                    type="number"
                    min="0"
                    value={formData.deliveryFee}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="w-full rounded-xl border border-[#dfe4dd] bg-white py-3 pl-9 pr-4 text-sm text-[#202721] outline-none transition placeholder:text-[#a0a6a1] focus:border-[#355b3e] focus:ring-2 focus:ring-[#355b3e]/10"
                  />
                </div>
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-[#303831]"
                >
                  Description
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description about this book..."
                  required
                  className="w-full resize-none rounded-xl border border-[#dfe4dd] bg-white px-4 py-3 text-sm text-[#202721] outline-none transition placeholder:text-[#a0a6a1] focus:border-[#355b3e] focus:ring-2 focus:ring-[#355b3e]/10"
                />

                <p className="mt-2 text-xs text-[#929993]">
                  Give readers a short overview of the book.
                </p>
              </div>
            </div>
          </div>


          <div className="mt-6 rounded-2xl border border-[#e5e8e2] bg-white shadow-sm">

            <div className="border-b border-[#edf0eb] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ed] text-[#355b3e]">
                  <ImagePlus size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#17211b]">
                    Book Images
                  </h2>

                  <p className="mt-1 text-xs text-[#858b86]">
                    Upload up to 5 images of the book.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* Upload Box */}

              {images.length < 5 && (
                <label
                  htmlFor="book-images"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8ded6] bg-[#fafbf9] px-6 py-10 text-center transition hover:border-[#355b3e] hover:bg-[#f4f7f3]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4ed] text-[#355b3e]">
                    <Upload size={24} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-[#303831]">
                    Upload book images
                  </h3>

                  <p className="mt-1 text-xs text-[#858b86]">
                    PNG, JPG or JPEG — maximum 5 images
                  </p>

                  <span className="mt-4 rounded-lg bg-[#355b3e] px-4 py-2 text-xs font-semibold text-white">
                    Choose Images
                  </span>

                  <input
                    id="book-images"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Image Preview */}

              {images.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {images.map((image, index) => (
                    <div
                      key={image.preview}
                      className="group relative overflow-hidden rounded-xl border border-[#e1e5df] bg-[#f7f8f5]"
                    >
                      <img
                        src={image.preview}
                        alt={`Book preview ${index + 1}`}
                        className="aspect-[3/4] w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X size={15} />
                      </button>

                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-md bg-[#355b3e] px-2 py-1 text-[10px] font-semibold text-white">
                          Main Image
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-xl bg-[#f7f9f6] p-4">
                <p className="text-xs leading-5 text-[#6f7771]">
                  <strong className="text-[#355b3e]">
                    Note:
                  </strong>{" "}
                  Your book will be submitted for approval after
                  publishing. A librarian cannot directly publish a
                  newly added book.
                </p>
              </div>
            </div>
          </div>


          <div className="mt-6 rounded-2xl border border-[#e5e8e2] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-sm font-semibold text-[#303831]">
                  Book Status
                </h2>

                <p className="mt-1 text-xs text-[#858b86]">
                  New books automatically start as Pending Approval.
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                Pending Approval
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/dashboard/librarian"
              className="inline-flex items-center justify-center rounded-xl border border-[#dfe4dd] bg-white px-5 py-3 text-sm font-semibold text-[#59615b] transition hover:bg-[#f5f7f4]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#243b2b] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b2e21]"
            >
              <Save size={17} />
              Add Book
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

