import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, LogOut } from 'lucide-react';
import { SupabaseService } from '../../services/supabase.service';

export default function MunicipalityLogin({ onBack, onLogin, user, onLogout }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const citizenEmail = 'debjyotibarikgdg@gmail.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pre-check if they are typing the citizen email
    if (email.trim().toLowerCase() === citizenEmail) {
      setError('Same email as citizen! A new/different email for the municipality page must be used.');
      setLoading(false);
      return;
    }

    try {
      const loggedInUser = await SupabaseService.signIn(email, password);
      
      // Post-check just in case
      if (loggedInUser.email.toLowerCase() === citizenEmail) {
        setError('Same email as citizen! A new/different email for the municipality page must be used.');
        await SupabaseService.signOut();
      } else {
        onLogin(loggedInUser);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await SupabaseService.signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google Authentication failed.');
      setLoading(false);
    }
  };

  // If already logged in but with citizen email (e.g. from session)
  if (user && user.email.toLowerCase() === citizenEmail) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2rem] border border-slate-200 shadow-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Access Denied</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Same email as citizen (<span className="text-red-600 font-bold">{user.email}</span>) detected. 
              A new/different email for the municipality page must be used.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onLogout}
              className="w-full py-4 text-sm font-black text-white bg-red-600 hover:bg-red-500 rounded-2xl transition shadow-lg shadow-red-600/10 flex justify-center items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Account</span>
            </button>
            
            <button
              onClick={onBack}
              className="w-full py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition flex justify-center items-center gap-2 cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Citizen Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 relative">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-sm transition flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portal
      </button>

      <div className="bg-white w-full max-w-md rounded-[2rem] border border-slate-200 shadow-2xl p-8 relative">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#f1f5f9] text-[#15803D] rounded-full flex items-center justify-center shadow-[4px_4px_8px_#cbd5e1,inset_-2px_-2px_5px_#ffffff] border border-slate-200">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-black text-slate-900">Municipality Access</h2>
          <p className="text-sm text-slate-500 font-semibold">
            Sign in to access environmental alerts and resolve reports.
          </p>
        </div>

        {/* Feedback Alert Box */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs font-bold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">
              Municipality Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-[#15803D] rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                placeholder="officer@aerion.gov" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ml-1">
              Secret Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-slate-200 focus:border-[#15803D] rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none transition shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-6 py-4 text-sm font-black text-white bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] rounded-2xl transition shadow-lg shadow-emerald-800/20 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'Authorizing...' : 'Authorize & Enter'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-slate-200/60"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-slate-200/60"></div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full px-6 py-4 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] rounded-2xl transition shadow-[4px_4px_8px_#cbd5e1] disabled:opacity-70 flex justify-center items-center gap-3 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
