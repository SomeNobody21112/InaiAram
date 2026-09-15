/**
 * AUTH SCREENS — Signup and Login.
 * Prototype authentication: simulated locally, honest about it.
 */
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Emblem } from '../../ui/Emblem';
import { Button } from '../../ui/Button';
import { useApp } from '../../../store/app';

function AuthLayout({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-bg flex flex-col" id="main-content">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Emblem size={44} className="text-terracotta mx-auto mb-4" />
            <h1 className="display-m text-ink">{title}</h1>
            <p className="body text-ink-2 mt-2">{sub}</p>
          </div>
          {children}
        </div>
      </div>
      <footer className="px-4 pb-6 text-center">
        <p className="text-[0.625rem] font-mono text-ink-3">Prototype — accounts are simulated. Nothing leaves this device.</p>
      </footer>
    </main>
  );
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-ink placeholder:text-ink-3 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors';

export function SignupScreen() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address.';
    if (phone && !/^[\d\s+()-]{6,15}$/.test(phone)) errs.phone = 'Please enter a valid phone number.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setFailed(false);
    // Simulated processing — no network call is made.
    setTimeout(() => {
      setSubmitting(false);
      dispatch({ type: 'SIGNUP', name: name.trim(), email: email.trim(), phone: phone.trim() });
      navigate('/onboarding');
    }, 700);
  };

  return (
    <AuthLayout title="Create your account" sub="Three details. That is all we collect to begin.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="su-name" className="label-mono block mb-1.5">NAME</label>
          <input id="su-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'su-name-err' : undefined} className={inputCls} placeholder="Your full name" />
          {errors.name && <p id="su-name-err" className="text-xs text-terracotta-deep mt-1.5" role="alert">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="su-email" className="label-mono block mb-1.5">EMAIL</label>
          <input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'su-email-err' : undefined} className={inputCls} placeholder="you@example.com" />
          {errors.email && <p id="su-email-err" className="text-xs text-terracotta-deep mt-1.5" role="alert">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="su-phone" className="label-mono block mb-1.5">PHONE <span className="normal-case tracking-normal text-ink-3">(optional)</span></label>
          <input id="su-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'su-phone-err' : undefined} className={inputCls} placeholder="+91" />
          {errors.phone && <p id="su-phone-err" className="text-xs text-terracotta-deep mt-1.5" role="alert">{errors.phone}</p>}
        </div>

        <p className="text-xs text-ink-3 leading-relaxed">
          We collect the minimum needed to open your workspace. Verification data is governed by consent — you will authorise every category before anything is checked.
        </p>

        {failed && <ErrorBar message="Something interrupted this step. Please try again." />}
        {submitting && <p className="text-xs text-ink-3" role="status">Creating your workspace…</p>}

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Creating…' : 'Continue to onboarding'}
        </Button>
        <p className="text-center text-sm text-ink-2">
          Already have an account? <Link to="/login" className="text-terracotta hover:text-terracotta-deep font-medium">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function ErrorBar({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-terracotta/20 bg-terracotta/5 px-3.5 py-2.5" role="alert">
      <p className="text-xs text-terracotta-deep">{message}</p>
    </div>
  );
}

export function LoginScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setError('Please enter your password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    // Simulated check. Any well-formed credentials open the demo workspace.
    // L-1 fix: returning users skip onboarding and land directly in the workspace.
    const returning = state.user && state.user.email.toLowerCase() === email.trim().toLowerCase() && state.user.onboarded;
    setTimeout(() => {
      setSubmitting(false);
      dispatch({ type: 'LOGIN', email: email.trim() });
      navigate(returning ? '/app' : '/onboarding');
    }, 700);
  };

  return (
    <AuthLayout title="Welcome back" sub="Log in to your private verification workspace.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="li-email" className="label-mono block mb-1.5">EMAIL</label>
          <input id="li-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="li-pass" className="label-mono block mb-1.5">PASSWORD</label>
          <input id="li-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
        </div>

        {error && <ErrorBar message={error} />}
        {submitting && <p className="text-xs text-ink-3" role="status">Signing you in…</p>}

        <Button type="submit" fullWidth disabled={submitting}>{submitting ? 'Signing in…' : 'Log in'}</Button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setError('Account recovery is not configured in this prototype. In production this would begin a verified recovery flow.')}
            className="text-ink-2 hover:text-ink underline underline-offset-2"
          >
            Forgot access?
          </button>
          <Link to="/signup" className="text-terracotta hover:text-terracotta-deep font-medium">Create an account</Link>
        </div>

        <p className="text-[0.625rem] text-ink-3 leading-relaxed border-t border-line pt-3">
          Prototype note: authentication is simulated. Any well-formed email and password opens the demonstration workspace. No production credentials exist.
        </p>
      </form>
    </AuthLayout>
  );
}
