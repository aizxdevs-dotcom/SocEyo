"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { login, LoginData } from "@/services/auth";

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex, {
      message:
        "Password must include uppercase, lowercase, number and symbol",
    }),
});

type LoginInputs = z.infer<typeof loginSchema>;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
interface LoginFormProps {
  /** optional callback fired after successful login */
  onSuccess?: () => void;
  /** optional callback when server reports email not verified; parent can show a dialog and handle redirect */
  onEmailNotVerified?: (email: string) => void;
}

export default function LoginForm({ onSuccess, onEmailNotVerified }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInputs) => {
    try {
      await login(values as LoginData);
      onSuccess?.();                     // 👈 notify parent for animation
      router.push("/feed");
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      setNotFound(null);
      
      // Check if error is due to unverified email
      // Check if error is due to user not found
      if (err.response?.status === 404) {
        setNotFound("User not found. Please register first.");
        return;
      }

      if (err.response?.status === 403 && err.response?.data?.detail?.includes("not verified")) {
        // Prefer parent-controlled flow if provided (so parent can show a nice dialog)
        if (onEmailNotVerified) {
          onEmailNotVerified(values.email);
        } else {
          alert("Email not verified. Redirecting to verification page...");
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
          }, 1000);
        }
        return;
      }
      // Show generic invalid credentials for 401, or other errors
      if (err.response?.status === 401) {
        setNotFound("Invalid credentials. Please try again.");
        return;
      }

      alert(err.response?.data?.detail || "Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {notFound && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {notFound}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••"
          className="pr-10"
          {...register("password")}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label="Toggle password visibility"
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Login"}
        </Button>
      </div>
    </form>
  );
}