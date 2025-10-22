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
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInputs = z.infer<typeof loginSchema>;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
interface LoginFormProps {
  /** optional callback fired after successful login */
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
    } catch (err) {
      console.error("❌ Login failed:", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Login"}
        </Button>
      </div>
    </form>
  );
}