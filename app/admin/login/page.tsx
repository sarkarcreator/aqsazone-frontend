'use client';

import { apiUrl } from '@/lib/api-client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, KeyRound, Loader2, ArrowRight, Sparkles, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import Link from 'next/link';

type Mode = 'checking' | 'setup' | 'login';

export default function AdminLoginPage() {
  const [mode, setMode] = useState<Mode>('checking');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch(apiUrl('/api/admin/setup'), { credentials: 'include', cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to check admin setup.');
        if (active) setMode(data.setupRequired ? 'setup' : 'login');
      })
      .catch((err: unknown) => {
        if (active) {
          setMode('login');
          setError(err instanceof Error ? err.message : 'Backend connection failed. Please try again.');
        }
      });
    return () => { active = false; };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const endpoint = mode === 'setup' ? '/api/admin/setup' : '/api/admin/login';
      const payload = mode === 'setup' ? { name, email, password } : { email, password };
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed.');
      setNotice(mode === 'setup' ? 'Secure admin account created. Opening your control center…' : 'Access verified. Welcome back…');
      router.replace('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080910] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#10111b]/95 shadow-2xl shadow-black/50 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-violet-950/80 via-[#151324] to-[#11121a] p-10 lg:flex">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-sm font-black tracking-widest text-amber-200">AZ</div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/80">Private workspace</p>
            <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight">Your work. Your vision. Your control.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">A dedicated command center for managing the Aqsa Zone portfolio, projects, services and client relationships.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3 text-amber-200"><LockKeyhole className="h-5 w-5" /><span className="text-sm font-medium">Protected admin access</span></div>
            <p className="mt-2 text-xs leading-6 text-slate-400">No public registration. Your first account is created once, then setup locks automatically.</p>
          </div>
          <div className="absolute -right-14 top-1/3 h-56 w-56 rounded-full border border-amber-200/10" />
          <div className="absolute -right-5 top-[38%] h-40 w-40 rounded-full border border-violet-300/10" />
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-sm font-black text-amber-200">AZ</div>
            <div><p className="font-semibold">Aqsa Zone</p><p className="text-xs text-slate-400">Private admin portal</p></div>
          </div>
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs text-violet-200"><Sparkles className="h-3.5 w-3.5" /> {mode === 'setup' ? 'First-time secure setup' : 'Restricted access'}</div>
            <h2 className="text-3xl font-semibold tracking-tight">{mode === 'checking' ? 'Checking access…' : mode === 'setup' ? 'Create your admin' : 'Welcome back'}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{mode === 'setup' ? 'Create the only admin account. Public signup will be locked after this step.' : 'Sign in with your administrator credentials to continue.'}</p>
          </div>

          {error && <div role="alert" className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
          {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</div>}

          {mode === 'checking' ? (
            <div className="flex items-center gap-3 py-10 text-sm text-slate-400"><Loader2 className="h-5 w-5 animate-spin" /> Checking secure setup status…</div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {mode === 'setup' && <div><label htmlFor="admin-name" className="mb-2 block text-xs font-medium text-slate-300">Admin name</label><div className="relative"><UserRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><input id="admin-name" autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-amber-200/50 focus:ring-2 focus:ring-amber-200/10" /></div></div>}
              <div><label htmlFor="admin-email" className="mb-2 block text-xs font-medium text-slate-300">Admin email</label><div className="relative"><Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><input id="admin-email" type="email" autoComplete="username" required maxLength={320} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-amber-200/50 focus:ring-2 focus:ring-amber-200/10" /></div></div>
              <div><label htmlFor="admin-password" className="mb-2 block text-xs font-medium text-slate-300">{mode === 'setup' ? 'Create password' : 'Password'}</label><div className="relative"><KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} required minLength={mode === 'setup' ? 12 : 1} maxLength={1024} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'setup' ? 'At least 12 characters' : 'Enter your password'} className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-amber-200/50 focus:ring-2 focus:ring-amber-200/10" /><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-2.5 rounded-lg p-1.5 text-slate-400 hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{mode === 'setup' && <p className="mt-2 text-[11px] leading-5 text-slate-500">Use 12+ characters with uppercase, lowercase and a number. Save it securely; password reset by email is not configured yet.</p>}</div>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-200 to-amber-400 px-4 py-3.5 text-sm font-bold text-[#17120a] shadow-lg shadow-amber-500/10 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShieldCheck className="h-4 w-4" />{mode === 'setup' ? 'Create secure admin account' : 'Unlock admin workspace'}<ArrowRight className="h-4 w-4" /></>}</button>
            </form>
          )}
          <div className="mt-8 border-t border-white/10 pt-5 text-center"><Link href="/" className="text-xs text-slate-500 transition hover:text-white">← Return to public website</Link></div>
        </section>
      </div>
    </main>
  );
}
