import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ArrowLeft, LogIn, ShieldCheck, User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import api from '../api';


function readableError(error) {
  return error.response?.data?.detail || 'We could not complete that request. Please try again.';
}


const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('student');
  const [studentAction, setStudentAction] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const goToAccountStep = (nextRole = role, action = studentAction) => {
    setRole(nextRole);
    setStudentAction(action);
    setError('');
    setStep(3);
  };

  const finishLogin = (user, destination) => {
    signIn(user);
    navigate(destination, { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'admin') {
        const user = await api.login(identifier, password);
        if (user.role !== 'admin') throw new Error('This account does not have administrator access.');
        finishLogin(user, '/admin');
        return;
      }

      if (studentAction === 'register') {
        if (password.length < 12) throw new Error('Use a password with at least 12 characters.');
        if (password !== confirmPassword) throw new Error('The two passwords do not match.');
        const user = await api.register(email, password);
        finishLogin(user, '/chat');
        return;
      }

      const user = await api.login(identifier, password);
      if (user.role !== 'student') throw new Error('Use an administrator account to access the admin portal.');
      finishLogin(user, '/track');
    } catch (requestError) {
      setError(requestError.response ? readableError(requestError) : requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async ({ credential }) => {
    setError('');
    setLoading(true);
    try {
      const user = await api.googleLogin(credential);
      finishLogin(user, studentAction === 'register' ? '/chat' : '/track');
    } catch (requestError) {
      setError(readableError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f7f5ef] p-4 sm:p-8">
      <div className="pointer-events-none absolute -left-32 top-8 h-80 w-80 rounded-full bg-[#8a7dff]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-[#28b7ad]/15 blur-3xl" />
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-[#fffdfa] shadow-[0_24px_70px_rgba(24,35,56,0.14)]">
        <div className="relative bg-[#19263a] px-7 py-8 text-center text-white sm:px-9">
          {step > 1 && <button onClick={() => { setStep(step - 1); setError(''); }} className="absolute left-5 top-7 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white" aria-label="Back"><ArrowLeft size={19} /></button>}
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#f7c85b]">ScholarSetu access</p>
          <h1 className="font-display text-3xl leading-tight">Welcome to ScholarSetu</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{step === 1 ? 'Choose how you want to continue' : step === 2 ? 'Choose your student account type' : role === 'admin' ? 'Administrator sign in' : studentAction === 'register' ? 'Create your student account' : 'Sign in to your student account'}</p>
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <button onClick={() => { setRole('student'); setStep(2); }} className="group flex w-full items-center rounded-2xl border border-[#e6e3dc] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#6858e8] hover:shadow-lg hover:shadow-[#6858e8]/10">
                <span className="mr-4 rounded-xl bg-[#eeeaff] p-3 text-[#5d4ee4]"><User /></span>
                <span><strong className="block text-[#19263a]">Student</strong><small className="text-slate-500">Find and manage scholarship applications</small></span>
              </button>
              <button onClick={() => goToAccountStep('admin', 'login')} className="group flex w-full items-center rounded-2xl border border-[#e6e3dc] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#6858e8] hover:shadow-lg hover:shadow-[#6858e8]/10">
                <span className="mr-4 rounded-xl bg-[#e4f6f2] p-3 text-[#0f857b]"><ShieldCheck /></span>
                <span><strong className="block text-[#19263a]">Administrator</strong><small className="text-slate-500">Review submitted applications and documents</small></span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <button onClick={() => goToAccountStep('student', 'register')} className="flex w-full items-center rounded-2xl border border-[#e6e3dc] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#6858e8] hover:shadow-lg hover:shadow-[#6858e8]/10">
                <span className="mr-4 rounded-xl bg-[#eeeaff] p-3 text-[#5d4ee4]"><UserPlus /></span>
                <span><strong className="block text-[#19263a]">Create an account</strong><small className="text-slate-500">Start a new scholarship profile</small></span>
              </button>
              <button onClick={() => goToAccountStep('student', 'login')} className="flex w-full items-center rounded-2xl border border-[#e6e3dc] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#6858e8] hover:shadow-lg hover:shadow-[#6858e8]/10">
                <span className="mr-4 rounded-xl bg-[#fff0cf] p-3 text-[#bd7400]"><LogIn /></span>
                <span><strong className="block text-[#19263a]">Sign in</strong><small className="text-slate-500">Track your saved applications</small></span>
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {role === 'student' && studentAction === 'register' ? (
                <>
                  <label className="block text-sm font-bold text-[#344158]">Email address<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dcd9d1] bg-[#fffefa] px-4 py-3 text-[#19263a] outline-none transition placeholder:text-slate-400 focus:border-[#6858e8] focus:ring-4 focus:ring-[#6858e8]/10" /></label>
                  <label className="block text-sm font-bold text-[#344158]">Password<input type="password" required minLength="12" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dcd9d1] bg-[#fffefa] px-4 py-3 text-[#19263a] outline-none transition placeholder:text-slate-400 focus:border-[#6858e8] focus:ring-4 focus:ring-[#6858e8]/10" /></label>
                  <label className="block text-sm font-bold text-[#344158]">Confirm password<input type="password" required minLength="12" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dcd9d1] bg-[#fffefa] px-4 py-3 text-[#19263a] outline-none transition placeholder:text-slate-400 focus:border-[#6858e8] focus:ring-4 focus:ring-[#6858e8]/10" /></label>
                </>
              ) : (
                <>
                  <label className="block text-sm font-bold text-[#344158]">{role === 'admin' ? 'Administrator email' : 'Email address or PAN'}<input type="text" required autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dcd9d1] bg-[#fffefa] px-4 py-3 text-[#19263a] outline-none transition placeholder:text-slate-400 focus:border-[#6858e8] focus:ring-4 focus:ring-[#6858e8]/10 uppercase" placeholder={role === 'admin' ? 'admin@example.gov.in' : 'name@example.com or ABCDE1234F'} /></label>
                  <label className="block text-sm font-bold text-[#344158]">Password<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dcd9d1] bg-[#fffefa] px-4 py-3 text-[#19263a] outline-none transition placeholder:text-slate-400 focus:border-[#6858e8] focus:ring-4 focus:ring-[#6858e8]/10" /></label>
                </>
              )}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#5d4ee4] px-4 py-3.5 font-bold text-white shadow-lg shadow-[#5d4ee4]/20 transition hover:-translate-y-0.5 hover:bg-[#4d3ed2] disabled:opacity-60">{loading ? 'Please wait…' : studentAction === 'register' ? 'Create account' : 'Sign in'}</button>
              {role === 'student' && googleEnabled && (
                <>
                  <div className="flex items-center gap-3 py-2"><span className="h-px flex-1 bg-gray-200" /><span className="text-xs text-gray-500">OR</span><span className="h-px flex-1 bg-gray-200" /></div>
                  <div className="flex justify-center"><GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was cancelled or failed.')} text="continue_with" width="360" /></div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
