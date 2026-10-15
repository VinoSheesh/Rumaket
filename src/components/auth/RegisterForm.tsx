'use client'

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={signUp} className="space-y-4">
      <div>
        <Label htmlFor="full_name" className="text-slate-700 font-medium text-sm">
          Nama Lengkap
        </Label>
        <Input 
          id="full_name" 
          name="full_name" 
          type="text" 
          placeholder="Nama Lengkap Anda" 
          required 
          className="mt-1.5 w-full rounded-xl px-4 py-3 text-slate-900 border border-gray-200 focus:ring-2 focus:ring-gray-400 outline-none transition-all" 
        />
      </div>

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
            placeholder="Minimal 6 karakter"
            minLength={6}
            required
            className="w-full rounded-xl border-slate-300 px-4 py-3 pr-12 text-slate-900 border border-gray-200 focus:ring-2 focus:ring-gray-400 outline-none transition-all"
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

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full rounded-xl py-3 font-medium shadow-md shadow-blue-600/10 transition-all hover:shadow-lg" 
          size="lg"
        >
          Daftar
        </Button>
      </div>
    </form>
  );
}