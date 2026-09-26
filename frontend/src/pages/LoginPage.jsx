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
    <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="relative bg-indigo-600 p-6 text-center text-white">
          {step > 1 && <button onClick={() => { setStep(step - 1); setError(''); }} className="absolute left-4 top-6 text-white hover:text-indigo-200" aria-label="Back"><ArrowLeft /></button>}
          <h1 className="text-3xl font-bold">Welcome to ScholarSetu</h1>
          <p className="mt-2 text-indigo-100">{step === 1 ? 'Choose how you want to continue' : step === 2 ? 'Choose your student account type' : role === 'admin' ? 'Administrator sign in' : studentAction === 'register' ? 'Create your student account' : 'Sign in to your student account'}</p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-4">
              <button onClick={() => { setRole('student'); setStep(2); }} className="flex w-full items-center rounded-xl border-2 border-gray-200 p-5 text-left transition hover:border-indigo-600 hover:bg-indigo-50">
                <span className="mr-4 rounded-full bg-indigo-100 p-3 text-indigo-600"><User /></span>
                <span><strong className="block text-gray-900">Student</strong><small className="text-gray-500">Find and manage scholarship applications</small></span>
              </button>
              <button onClick={() => goToAccountStep('admin', 'login')} className="flex w-full items-center rounded-xl border-2 border-gray-200 p-5 text-left transition hover:border-indigo-600 hover:bg-indigo-50">
                <span className="mr-4 rounded-full bg-slate-100 p-3 text-slate-700"><ShieldCheck /></span>
                <span><strong className="block text-gray-900">Administrator</strong><small className="text-gray-500">Review submitted applications and documents</small></span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <button onClick={() => goToAccountStep('student', 'register')} className="flex w-full items-center rounded-xl border-2 border-gray-200 p-5 text-left transition hover:border-indigo-600 hover:bg-indigo-50">
                <span className="mr-4 rounded-full bg-indigo-100 p-3 text-indigo-600"><UserPlus /></span>
                <span><strong className="block text-gray-900">Create an account</strong><small className="text-gray-500">Start a new scholarship profile</small></span>
              </button>
              <button onClick={() => goToAccountStep('student', 'login')} className="flex w-full items-center rounded-xl border-2 border-gray-200 p-5 text-left transition hover:border-indigo-600 hover:bg-indigo-50">
                <span className="mr-4 rounded-full bg-green-100 p-3 text-green-600"><LogIn /></span>
                <span><strong className="block text-gray-900">Sign in</strong><small className="text-gray-500">Track your saved applications</small></span>
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {role === 'student' && studentAction === 'register' ? (
                <>
                  <label className="block text-sm font-medium text-gray-700">Email address<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
                  <label className="block text-sm font-medium text-gray-700">Password<input type="password" required minLength="12" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
                  <label className="block text-sm font-medium text-gray-700">Confirm password<input type="password" required minLength="12" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700">{role === 'admin' ? 'Administrator email' : 'Email address or PAN'}<input type="text" required autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 uppercase" placeholder={role === 'admin' ? 'admin@example.gov.in' : 'name@example.com or ABCDE1234F'} /></label>
                  <label className="block text-sm font-medium text-gray-700">Password<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
                </>
              )}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{loading ? 'Please wait…' : studentAction === 'register' ? 'Create account' : 'Sign in'}</button>
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
