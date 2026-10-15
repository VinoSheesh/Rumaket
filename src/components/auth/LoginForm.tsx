'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/(auth)/actions";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setIsSubmitting(true);
    const result = await signIn(formData);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(result.redirectTo);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-rose-700">{error}</p>
        </div>
      )}

      <div>
        <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          required
          className="mt-1.5 w-full rounded-xl px-4 py-3 text-slate-900 border border-gray-200 focus:ring-2 focus:ring-gray-400 outline-none transition-all"
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
          Password
        </Label>
        <div className="relative mt-1.5">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            className="w-full rounded-xl px-4 py-3 pr-12 text-slate-900 border border-gray-200 focus:ring-2 focus:ring-gray-400 outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm py-1">
        <label className="flex items-center space-x-2.5 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            name="rememberMe"
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <span className="font-normal">Ingat saya</span>
        </label>
        <Link
          href="/forgot-password"
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Lupa password?
        </Link>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-3 font-medium shadow-md shadow-blue-600/10 transition-all hover:shadow-lg"
          size="lg"
        >
          Masuk
        </Button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-400">atau</span>
        </div>
      </div>

      <GoogleButton onError={setError} />
    </form>
  );
}
