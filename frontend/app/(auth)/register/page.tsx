'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Sparkles, User, Building, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      company_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const passwordValue = watch('password', '');

  // Password Requirements Checkers
  const pwdLength = passwordValue.length >= 8;
  const pwdUpper = /[A-Z]/.test(passwordValue);
  const pwdLower = /[a-z]/.test(passwordValue);
  const pwdDigit = /\d/.test(passwordValue);
  const pwdSpecial = /[^a-zA-Z0-9]/.test(passwordValue);

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    const res = await registerAuth({
      full_name: data.full_name,
      company_name: data.company_name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
    });

    if (res.success) {
      showToast('success', 'Account Registered!', 'Welcome to AI Resume Platform.');
      router.push('/dashboard');
    } else {
      const msg = res.error || 'Registration failed.';
      setAuthError(msg);
      showToast('error', 'Registration Error', msg);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Top Glow Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Recruiter Registration
          </h2>
          <p className="text-sm text-slate-400">
            Create an enterprise recruiter account to post requisitions and process candidate resumes with AI.
          </p>
        </div>

        {/* General Error Alert */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form with React Hook Form + Zod */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                {...register('full_name')}
                placeholder="Sarah Vance"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.full_name
                    ? 'border-rose-500/60 focus:ring-rose-500/50'
                    : 'border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.full_name && (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.full_name.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Company / Organization Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                {...register('company_name')}
                placeholder="TechTalent Inc."
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.company_name
                    ? 'border-rose-500/60 focus:ring-rose-500/50'
                    : 'border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.company_name && (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.company_name.message}</p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Work Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="sarah@techtalent.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-500/60 focus:ring-rose-500/50'
                    : 'border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-rose-500/60 focus:ring-rose-500/50'
                    : 'border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Rules Indicator */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px]">
              <span className={pwdLength ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                ✓ 8+ Characters
              </span>
              <span className={pwdUpper ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                ✓ Uppercase (A-Z)
              </span>
              <span className={pwdLower ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                ✓ Lowercase (a-z)
              </span>
              <span className={pwdDigit ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                ✓ Number (0-9)
              </span>
              <span className={pwdSpecial ? 'text-emerald-400 font-semibold col-span-2' : 'text-slate-500 col-span-2'}>
                ✓ Special Character (!@#$%^&*)
              </span>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirm_password')}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirm_password
                    ? 'border-rose-500/60 focus:ring-rose-500/50'
                    : 'border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Create Recruiter Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-cyan-400 hover:underline">
            Sign in to existing account
          </Link>
        </div>
      </div>
    </div>
  );
}
