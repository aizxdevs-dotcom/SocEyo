"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Heroicons is ideal for Tailwind projects

// ----- Validation schema -----
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInputs) => {
    try {
      const res = await api.post("/login", values);
      localStorage.setItem("access_token", res.data.access_token);
      router.push("/feed");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      {/* Password field with show/hide toggle */}
<div className="relative">
  <Input
    label="Password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••"
    className="pr-10" // ensures space for icon inside
    {...register("password")}
    error={errors.password?.message}
  />

  {/* Icon inside field */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? "Hide password" : "Show password"}
    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
  >
    {showPassword ? (
      <EyeSlashIcon className="h-6 w-5" />
    ) : (
      <EyeIcon className="h-6 w-5" />
    )}
  </button>
</div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {isSubmitting ? "Signing in …" : "Login"}
        </Button>
      </div>
    </form>
  );
}