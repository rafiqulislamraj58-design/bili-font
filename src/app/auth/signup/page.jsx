
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const { data: result, error } =
        await authClient.signUp.email({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        });

      if (error) {
        console.error("Better Auth error:", error);

        setServerError(
          error.message || "Registration failed"
        );

        return;
      }

      console.log("Registered user:", result);

      router.push("/auth/signin");
    } catch (error) {
      console.error("Registration error:", error);

      setServerError(
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
              <span className="text-xl font-bold">
                B
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join us and get started today
            </p>

          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message:
                      "Name must be at least 2 characters",
                  },
                })}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                  errors.name
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100"
                }`}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      "Enter a valid email address",
                  },
                })}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                  errors.email
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100"
                }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters",
                  },
                })}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                  errors.password
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100"
                }`}
              />

              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Account Type
              </label>

              <select
                id="role"
                {...register("role", {
                  required: "Please select a role",
                })}
                className={`w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:bg-white ${
                  errors.role
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100"
                }`}
              >
                <option value="user">
                  User
                </option>

                <option value="librarian">
                  Librarian
                </option>
              </select>

              {errors.role && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Sign In */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}

            <Link
              href="/auth/signin"
              className="font-semibold text-black hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>

        {/* Terms */}
        <p className="mt-5 text-center text-xs text-gray-400">
          By creating an account, you agree to our
          terms and privacy policy.
        </p>

      </div>
    </main>
  );
}

