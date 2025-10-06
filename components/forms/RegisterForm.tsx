"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// ----- Validation schema -----
const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ----- TS type for form data -----
type RegisterInputs = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  // ----- Submit handler -----
  const onSubmit = async (values: RegisterInputs) => {
    try {
      await api.post("/register", {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      alert("Registered successfully! Please log in.");
      reset();
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Username */}
      <Input
        label="Username"
        placeholder="Your username"
        {...register("username")}
        error={errors.username?.message}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      {/* Password */}
<div className="relative">
  <Input
    label="Password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••"
    className="pr-10" // makes room for the icon
    {...register("password")}
    error={errors.password?.message}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? "Hide password" : "Show password"}
    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
  >
    {showPassword ? (
      <EyeSlashIcon className="h-5 w-5" />
    ) : (
      <EyeIcon className="h-5 w-5" />
    )}
  </button>
</div>

{/* Confirm Password */}
<div className="relative">
  <Input
    label="Confirm Password"
    type={showConfirmPassword ? "text" : "password"}
    placeholder="••••••"
    className="pr-10" // consistent spacing for the icon
    {...register("confirmPassword")}
    error={errors.confirmPassword?.message}
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
  >
    {showConfirmPassword ? (
      <EyeSlashIcon className="h-4 w-5" />
    ) : (
      <EyeIcon className="h-4 w-5" />
    )}
  </button>
</div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {isSubmitting ? "Creating Account…" : "Register"}
        </Button>
      </div>
    </form>
  );
}